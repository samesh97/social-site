const { Config } = require("../conf/config.model");
const { User, User_Role } = require("../user/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Router } = require("express");
const { Role } = require("../role/role.model");
const authRoute = Router();
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

const authentication = async (req, res, next) => {
  //bypass authentication
  const modifiedUrl = req.url.endsWith("/")
    ? req.url.substring(0, req.url.length - 1)
    : req.url;
  const config = await Config.findOne({
    where: { name: "REST_AUTH_BYPASS_URL" },
  });
  if (config?.value?.split(",").some((value) => value === modifiedUrl)) {
    return next();
  }

  //verify already generated jwt
  let authHeader = req.headers.authorization?.split(" ")[1];
  if (authHeader) {
    try {
      const userId = jwt.verify(authHeader, jwtSecret);
      if (userId) {
        req.body.userInfo = { userId: userId };
        return next();
      }
    } catch (error) {}
  }
  return res.status(401).json("Unauthorized");
};
const hasRole = (...roles) => {
  return async (req, res, next) => {
    const userId = req.body.userInfo?.userId;
    if (userId) {
      const userRoleIds = (
        await User_Role.findAll({ where: { UserId: userId } })
      ).map((userRole) => userRole.RoleId);
      const rls = (await Role.findAll({ where: { id: [...userRoleIds] } })).map(
        (role) => role.name
      );
      const hasRole = roles.some((role) => rls.includes(role));
      if (hasRole) {
        return next();
      }
    }
    res.status(403).json("Forbidden!");
  };
};

authRoute.post("/", async (req, res) => {
  //verify username, password
  let username = req.body?.username;
  let password = req.body?.password;
  if (!username || !password) {
    return res.status(401).json("Unauthorized");
  }

  //find user in database
  const user = await User.findOne({ where: { username: username } });
  if (!user) {
    return res.status(401).json("Unauthorized");
  }
  //verify hashPassword & plain password
  let isHashValid = bcrypt.compareSync(password, user.password);
  if (!isHashValid) {
    return res.status(401).json("Unauthorized");
  }
  //create a jwt token and sign with userId
  const jwtSign = jwt.sign(user.id, jwtSecret);
  return res.status(200).json({
    "access-token": jwtSign,
  });
});

module.exports = { authentication, hasRole, authRoute };

const { Router } = require("express");
const bcrypt = require("bcrypt");

const { User, User_Role } = require("../models/user.model");
const { Role, Roles } = require("../models/role.model");
const { sequelize } = require("../configurations/database.conf");
const { config } = require("../configurations/common.conf");

const userRoute = Router();

userRoute.post("/", async (req, res) => {
  const user = req.body;
  const validationError = await validateUserCreation(user);
  if (validationError) {
    return res.status(400).json(validationError);
  }

  const transaction = await sequelize.transaction();
  try {
    const hashedEmail = bcrypt.hashSync(
      user.email,
      10
    );
    const hashedPassword = bcrypt.hashSync(
      user.password,
      10
    );
    let userObj = await User.create(
      {
        id: hashedEmail,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: hashedPassword,
      },
      {
        transaction: transaction,
      }
    );

    const userRole = await Role.findOne({ where: { name: Roles.USER } });
    await User_Role.findOrCreate({
      where: {
        UserId: hashedEmail,
        RoleId: userRole.id,
      },
      transaction: transaction,
    });

    transaction.commit();
    return res.status(201).json("User created.");
  } catch (error) {
    transaction.rollback();
    console.log(error);
    return res.status(500).json(`Error while creating user.`);
  }
});

const validateUserCreation = async (user) => {
  if (!user | !user.email | !user.password | !user.firstName | !user.lastName) {
    return "Bad Request";
  }

  const dbUser = await User.findOne({ where: { email: user.email } });
  if (dbUser) {
    return "Email is already taken.";
  }
  return null;
};

module.exports = { userRoute };

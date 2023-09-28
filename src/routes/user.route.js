const { Router } = require('express');
const bcrypt = require("bcrypt");

const { User, User_Role } = require('../models/user.model');
const { Role } = require('../models/role.model');
const { sequelize } = require('../configurations/database.conf');
const { config } = require('../configurations/common.conf');

const userRoute = Router();

userRoute.post("/", async (req, res) => {
  const { user } = req.body;
  const validationError = await validateUserCreation(user);
  if (validationError) {
    return res.status(400).json(validationError);
  }

  const transaction = await sequelize.transaction();
  try {
    const hashPassword = bcrypt.hashSync(user.password, config.HASH_PASSWORD_SALT_ROUNDS );
    let userObj = await User.create(
      {
        firstName: user.firstName,
        username: user.username,
        password: hashPassword,
      },
      {
        transaction: transaction,
      }
    );

    for (const role of user.roles) {
      const dbrole = await Role.findByPk(role.id);
      await User_Role.findOrCreate({
        where: {
          UserId: userObj.id,
          RoleId: dbrole.id,
        },
        transaction: transaction,
      });
    }

    transaction.commit();
    return res.status(201).json("User created.");
  } catch (error) {
    transaction.rollback();
    console.log(error);
    return res.status(500).json(`Error while creating user.`);
  }
});

const validateUserCreation = async (user) => 
{
    if(!user | !user.username | !user.firstName | !user.password | !user.roles | user.roles.length == 0) 
    {
        return "Bad Request";
    }

    const dbUser = await User.findOne( { where: { username: user.username }});
    if( dbUser )
    {
        return "Username is already taken.";
    }
    return null;
}

module.exports = { userRoute };
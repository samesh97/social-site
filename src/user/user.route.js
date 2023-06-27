const { Router } = require('express');
const app = Router();
const { User, User_Role } = require('../user/user.model');
const bcrypt = require('bcrypt');
const { Role } = require('../role/role.model');
const { sequelize } = require('../conf/database');

const hashPasswordSaltRound = process.env.HASH_PASSWORD_SALT_ROUNDS;

app.post('/', async (req, res) => 
{
    const { user } = req.body;
    const validationError = await validateUserCreation(user);
    if( validationError )
    {
        return res.status(400).json(validationError);
    }

    const transaction = await sequelize.transaction();
    try 
    {
        const hashPassword = bcrypt.hashSync(user.password, hashPasswordSaltRound); 
        let userObj = await User.create({
            firstName: user.firstName,
            username: user.username,
            password: hashPassword
        }, 
        { 
            transaction: transaction 
        });

        for(const role of user.roles )
        {
            const dbrole = await Role.findByPk(role.id);
            await User_Role.findOrCreate(
               {
                where: {
                    UserId: userObj.id, 
                    RoleId: dbrole.id 
                },
                transaction: transaction
               }
            );
            
        };

        transaction.commit();
        return res.status(201).json("User created.");
    } 
    catch( error ) 
    {
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
        return "This username is already taken.";
    }
    return null;
}

module.exports = app;
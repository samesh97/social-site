const { Router } = require('express');
const app = Router();
const { User, User_Role } = require('../user/user.model');
const bcrypt = require('bcrypt');
const { Role } = require('../role/role.model');
const { sequelize } = require('../database');

app.post('/', async (req, res) => {
    const { user } = req.body;
    if(!user | !user.username | !user.firstName | !user.password | !user.roles | user.roles.length == 0) 
    {
        return res.status(400).json("Bad Request");
    }

    const dbUser = await User.findOne( { where: { username: user.username }});
    if(dbUser)
    {
        return res.status(409).json("This username is already taken.");
    }
    const transaction = await sequelize.transaction();
    try 
    {
        const hashPassword = bcrypt.hashSync(user.password, 2); 
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

        const savedUser = await User.findByPk(userObj.id, 
            { include: { model: Role, attributes: ["name"], through: { attributes: [] } }
        });
        return res.status(201).json(savedUser);
    } 
    catch( error ) 
    {
        transaction.rollback();
        console.log(error);
        return res.status(500).json(`Could not create user!`);
    }
});

module.exports = app;
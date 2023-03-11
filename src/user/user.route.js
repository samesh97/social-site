const { Router } = require('express');
const app = Router();
const { User, User_Role } = require('../user/user.model');
const bcrypt = require('bcrypt');

app.post('/', async (req, res) => {
    const { user } = req.body;
    if(!user | !user.username | !user.firstName | !user.password | !user.roles | user.roles.length == 0) {
        return res.status(400).json("Bad Request");
    }

    const dbUser = await User.findOne( { where: { username: user.username }});
    if(dbUser) {
        return res.status(409).json("This username is already taken. Please use something else");
    }
    try {
        const hashPassword = bcrypt.hashSync(user.password, 2); 
        const userObj = await User.create({
            firstName: user.firstName,
            username: user.username,
            password: hashPassword
        });

        const bulkRoles = user.roles.map( role => {
            return {
                UserId: userObj.id,
                RoleId: role.id
            }
        });
        await User_Role.bulkCreate(bulkRoles);
        return res.status(201).json("User has created!");
    } 
    catch( error ) {
        return res.status(500).json(`Could not create user!`);
    }
});

module.exports = app;
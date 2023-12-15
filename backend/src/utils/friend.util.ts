import { Friend } from '../models/friend.model';
import { Op } from 'sequelize';
import { isNullOrEmpty } from './common.util';
import { getLogger } from "../conf/logger.conf";


const changeScore = async (userId, score) =>
{
    const user = await Friend.findOne({
        where: {
            [Op.or]: [
                { requestedUser: userId },
                { acceptedUser: userId }
            ]
        }
    });

    if (isNullOrEmpty(user))
    {
        getLogger().warn("No user found to increase the score!");
        return;    
    }
    user.update({ score: user.score + score });
    getLogger().info("Score added!");
}

export { changeScore };
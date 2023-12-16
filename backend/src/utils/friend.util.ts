import { Friend } from '../models/friend.model';
import { Op } from 'sequelize';
import { isNullOrEmpty } from './common.util';
import { getLogger } from "../conf/logger.conf";


const changeScore = async (userId: string, score: number) =>
{
    const user = await Friend.findOne({
        where: {
            [Op.or]: [
                { requestedUserId: userId },
                { acceptedUserId: userId }
            ]
        }
    });

    if (isNullOrEmpty(user))
    {
        getLogger().warn("No user found to increase the score!");
        return;    
    }
    user?.update({ score: user.score + score });
    getLogger().info("Score added!");
}

export { changeScore };
const Users = require('../util/user');

exports.leaderboard = async (req, res, next) => {
    try {
        const leaders = await Users.findAll({
            attributes: ['id','name', 'totalExpense'],
            order: [['totalExpense', 'DESC']]
        });

        res.status(201).json(leaders);
    }
    catch (err) {
        console.log(err);
    }
};
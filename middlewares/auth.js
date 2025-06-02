const jwt=require('jsonwebtoken');
const { AppError } = require('../utils/appError');
const SECRET_KEY='afab7a6b4b778789b93333dfb8e25f7f6299ee7602e414a47f420b12d1470d09';
const User=require('../models').Users;
const authenticateUser=async (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError('User Unauthorized', 401);
    }

    try {
        const token = authHeader.split(' ')[1];
        const decode = jwt.verify(token, SECRET_KEY);
        const user = await User.findByPk(decode.userId);
        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Invalid Token', 403);
    }
}

module.exports=authenticateUser;
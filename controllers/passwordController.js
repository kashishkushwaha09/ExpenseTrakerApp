const path = require('path');
const { AppError } = require('../utils/appError');
const passwordService = require('../services/passwordService');
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const forgotPasswordRequest = await passwordService.forgotPassword(email);
        console.log("Forgot Password Request created in controller:", forgotPasswordRequest);
        if (!forgotPasswordRequest) {
            throw new AppError('User not exist Do sign up', 400);
        }
        return res.status(200).json({ message: 'Reset password link sent to your email', success: true });

    }
    catch (error) {
        console.log(error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message, 500);
    }
}
const checkResetPasswordLink = async (req, res) => {
    try {
        const { uuid } = req.params;
        const existedUuid = await passwordService.checkResetPasswordLink(uuid);
        if (existedUuid && existedUuid.isActive) {
            return res.status(200).sendFile(path.join(__dirname, '..', 'public', 'resetPassword.html'));
        } else {
            throw new AppError('Reset Link is incorrect or expired', 400);
        }
    } catch (error) {
        console.log(error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message, 500);
    }
}
const updatePassword = async (req, res) => {
    try {
        const { password, uuid } = req.body;
        const existedUuid = await passwordService.updatePassword(password, uuid);
        if (existedUuid) {
            return res.status(200).json({ message: 'Password updated successfully', success: true });
        } else {
            throw new AppError('Failed to update password', 400);
        }

    } catch (error) {
        console.log(error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message, 500);
    }
}
module.exports = {
    forgotPassword,
    checkResetPasswordLink,
    updatePassword
}
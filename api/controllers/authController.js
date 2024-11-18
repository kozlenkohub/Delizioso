import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

dotenv.config();

const signToken = (id) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

const setCookie = (res, token) => {
  res.cookie('jwt', token, {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 дней
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
};

const sendErrorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({ success: false, message });
};

const validateFields = (fields, res) => {
  for (const [field, value] of Object.entries(fields)) {
    if (!value) {
      sendErrorResponse(res, 400, `${field} is required`);
      return false;
    }
  }
  return true;
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!validateFields({ email }, res)) return;

    const user = await User.findOne({ email });
    if (!user) {
      return sendErrorResponse(res, 404, 'User not found');
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    const message = `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

    await sendEmail({ email: user.email, subject: 'Password Reset Request', message });

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, 'Failed to process password reset request');
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!validateFields({ password }, res)) return;

    if (password.length < 6) {
      return sendErrorResponse(res, 400, 'Password must be at least 6 characters');
    }

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return sendErrorResponse(res, 400, 'Invalid or expired token');
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, 'Failed to reset password');
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'strict' });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, 'Failed to log out');
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!validateFields({ email, password }, res)) return;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return sendErrorResponse(res, 401, 'Invalid email or password');
    }

    const token = signToken(user._id);
    setCookie(res, token);

    res.status(200).json({ success: true, message: 'Logged in successfully' });
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, 'Failed to log in');
  }
};

export const register = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    if (!validateFields({ name, email, password, phoneNumber }, res)) return;

    if (password.length < 6) {
      return sendErrorResponse(res, 400, 'Password must be at least 6 characters');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendErrorResponse(res, 400, 'Email already in use');
    }

    const newUser = await User.create({ name, email, password, phoneNumber });
    const token = signToken(newUser._id);
    setCookie(res, token);

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, 'Failed to register user');
  }
};

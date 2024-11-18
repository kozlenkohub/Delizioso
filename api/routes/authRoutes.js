import express from 'express';
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';

const router = express.Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.get('/reset-password/:token', (req, res) => {
  res.send(
    `<form method="POST" action="/api/auth/reset-password/${req.params.token}">
      <input type="password" name="password" placeholder="Введите новый пароль" required/>
      <button type="submit">Сбросить пароль</button>
    </form>`,
  );
});

router.post('/reset-password/:token', resetPassword);

export default router;

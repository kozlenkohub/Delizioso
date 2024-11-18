import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Создаём схему пользователя
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
      apartments: { type: String },
    },
    phoneNumber: { type: String, required: false },
    role: {
      type: String,
      enum: ['customer', 'admin'], // Допустимые роли
      default: 'customer', // Роль по умолчанию
    },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  {
    timestamps: true, // Добавляет поля createdAt и updatedAt автоматически
  },
);

userSchema.methods.getResetPasswordToken = function () {
  // Генерация токена
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Хэширование токена и сохранение в resetPasswordToken
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Установка времени истечения токена (10 минут)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Хук для хэширования пароля перед сохранением
userSchema.pre('save', async function (next) {
  // Если пароль не был изменён, пропускаем хэширование
  if (!this.isModified('password')) {
    return next();
  }

  // Хэшируем пароль
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Метод для проверки пароля
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Экспортируем модель
const User = mongoose.model('User', userSchema);

export default User;

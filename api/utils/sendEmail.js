import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Загрузка переменных окружения
dotenv.config();

const sendEmail = async ({ email, subject, message }) => {
  try {
    // Настройка SMTP-транспортера
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465', // true для 465, false для других портов
      auth: {
        user: process.env.SMTP_USER, // Ваша почта
        pass: process.env.SMTP_PASSWORD, // Пароль приложения
      },
    });

    // Параметры письма
    const mailOptions = {
      from: `"Delizioso Support" <${process.env.SMTP_USER}>`, // Отправитель
      to: email, // Получатель
      subject: subject, // Тема письма
      text: message, // Сообщение
    };

    // Отправка письма
    const info = await transporter.sendMail(mailOptions);

    // Логирование успеха
    console.log(`Email sent successfully to ${email}. Message ID: ${info.messageId}`);
  } catch (error) {
    // Логирование ошибки
    console.error(`Failed to send email to ${email}. Full Error:`, error);
    throw new Error(`Email not sent: ${error.message}`);
  }
};

export default sendEmail;

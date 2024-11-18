import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = React.useState('');
  const resetPassword = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPassword({ password, token });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="password">
          Пароль:
          <input
            id="password"
            type="password"
            placeholder="Введите новый пароль"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Сбросить пароль</button>
      </form>
    </div>
  );
};

export default ResetPassword;

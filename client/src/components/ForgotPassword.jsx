import React from 'react';
import { useAuthStore } from '../store/useAuthStore';

const ForgotPassword = () => {
  const { forgotPassword } = useAuthStore();

  const [email, setEmail] = React.useState('');
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          forgotPassword({ email });
          console.log('Send Reset Link');
        }}>
        <label htmlFor="email">
          Email:
          <input
            id="email"
            type="email"
            required
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;

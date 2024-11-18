import React from 'react';
import { useAuthStore } from '../store/useAuthStore';

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { login } = useAuthStore();

  const loading = false;
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login({ email, password });
        }}>
        <label htmlFor="email">
          Email:
          <input
            id="email"
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label htmlFor="password">
          Password:
          <input
            id="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button disabled={loading} type="submit">
          {loading ? 'Login...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;

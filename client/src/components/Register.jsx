import React from 'react';
import { useAuthStore } from '../store/useAuthStore';

const Register = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { register } = useAuthStore();

  const loading = false;
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          register({ name, email, password });
          console.log(name, email, password);
        }}>
        <label htmlFor="name">
          Name:
          <input
            id="name"
            type="text"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
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
          {loading ? 'Creating your profile...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;

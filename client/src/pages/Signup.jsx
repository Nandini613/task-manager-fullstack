import { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, 'member', '');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="app-wrapper">
      <div className="container" style={{ maxWidth: '400px' }}>
        <header className="app-header">
          <h1>Create Account</h1>
          <p className="subtitle">Join to manage projects</p>
        </header>

        {error && <div className="error-message" style={{ color: '#ef4444', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}

        <form className="input-section" onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
          <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="add-btn" style={{ width: '100%' }}>Sign Up</button>
          </div>
        </form>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

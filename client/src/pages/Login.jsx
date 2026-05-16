import { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [loginType, setLoginType] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, loginType);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const toggleLoginType = () => {
    setLoginType(prev => prev === 'admin' ? 'member' : 'admin');
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="app-wrapper">
      <div className="container" style={{ maxWidth: '400px' }}>
        <header className="app-header">
          <h1>{loginType === 'admin' ? 'Admin Login' : 'Member Login'}</h1>
          <p className="subtitle">
            {loginType === 'admin' 
              ? 'Log in to manage the system' 
              : 'Log in to view your projects'}
          </p>
        </header>

        {error && <div className="error-message" style={{ color: '#ef4444', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}

        <form className="input-section" onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
          <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
            <button type="submit" className="add-btn" style={{ width: '100%' }}>
              Log In as {loginType === 'admin' ? 'Admin' : 'Member'}
            </button>
          </div>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={toggleLoginType}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-primary)',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            {loginType === 'admin' ? 'Switch to Member Login' : 'Switch to Admin Login'}
          </button>
          
          <p style={{ color: 'var(--text-muted)' }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

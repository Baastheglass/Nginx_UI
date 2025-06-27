'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Built-in authentication function
  const authenticateUser = async (username, password) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - replace with your actual auth logic
    const validCredentials = {
      username: 'admin',
      password: 'nginx123'
    };
    
    return username === validCredentials.username && password === validCredentials.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const isValid = await authenticateUser(credentials.username, credentials.password);
      
      if (isValid) {
        // Store auth token/session
        localStorage.setItem('authToken', 'nginx-ui-token');
        // Redirect to main configuration page
        router.push('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Nginx UI</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
        
        <div className={styles.credentials}>
          <p><strong>Demo Credentials:</strong></p>
          <p>Username: admin</p>
          <p>Password: nginx123</p>
        </div>
      </div>
    </div>
  );
}

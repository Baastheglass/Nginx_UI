'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subdomain, setSubdomain] = useState("");
  const [port, setPort] = useState("");
  const [unavailablePorts, setUnavailablePorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      fetchUnavailablePorts();
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const fetchUnavailablePorts = async () => {
    try {
      const response = await fetch('http://localhost:5000/getPortsinUse')//fetch('https://nginxui.axonbuild.com/getPortsinUse');
      const result = await response.json();
      if (result.success) {
        console.log("Unavailable ports data:", result.data);
        setUnavailablePorts(result.data);
      }
    }
    catch (error) {
      console.error("Error fetching unavailable ports:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('subdomain', subdomain);
      formData.append('port', port);
      
      const response = await fetch('http://localhost:5000/addSubdomain', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log(result);

      if (result.success) {
        showMessage('success', 'Subdomain configuration added successfully!');
        setSubdomain('');
        setPort('');
        fetchUnavailablePorts(); // Refresh the ports list
      } else {
        showMessage('error', result.error || 'Failed to add subdomain configuration');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', 'An error occurred while adding the configuration');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Nginx Configuration Dashboard</h1>
      </header>
      
      <main className={styles.main}>
        <div className={styles.configSection}>
          <h2>Add Subdomain Configuration</h2>
          
          {message.text && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="subdomain">Subdomain:</label>
              <input
                type="text"
                id="subdomain"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                placeholder="Enter subdomain (e.g., api, app)"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="port">Port:</label>
              <input
                type="number"
                id="port"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="Enter port number"
                required
                className={styles.input}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Adding Configuration...' : 'Add Configuration'}
            </button>
          </form>
        </div>

        <div className={styles.portsSection}>
          <h3>Ports Currently in Use</h3>
          {unavailablePorts.length > 0 ? (
            <div className={styles.portsList}>
              {unavailablePorts.map((portInfo, index) => (
                <div key={index} className={styles.portItem}>
                  <span className={styles.portNumber}>Port {portInfo.port}</span>
                  <span className={styles.portSubdomain}>{portInfo.subdomain}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noPorts}>No ports currently in use</p>
          )}
        </div>
      </main>
    </div>
  );
}

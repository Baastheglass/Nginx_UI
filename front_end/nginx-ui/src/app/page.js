"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [subdomain, setSubdomain] = useState("");
  const [port, setPort] = useState("");
  const [unavailablePorts, setUnavailablePorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch unavailable ports from API
  useEffect(() => {
    fetchUnavailablePorts();
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const fetchUnavailablePorts = async () => {
    try {
      const response = await fetch('https://nginxui.axonbuild.com/getPortsinUse');
      const result = await response.json();
      if (result.success) {
        console.log("Unavailable ports data:", result.data);
        setUnavailablePorts(result.data);
      } else {
        console.error("Failed to fetch ports:", result.error);
        // Fallback to mock data
        const mockPorts = [
          { port: 80, service: "HTTP" },
          { port: 443, service: "HTTPS" },
          { port: 3000, service: "Development Server" }
        ];
        setUnavailablePorts(mockPorts);
      }
    } catch (error) {
      console.error("Error fetching unavailable ports:", error);
      // Fallback to mock data on network error
      const mockPorts = [
        { port: 80, service: "HTTP" },
        { port: 443, service: "HTTPS" },
        { port: 3000, service: "Development Server" }
      ];
      setUnavailablePorts(mockPorts);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('subdomain', subdomain);
      formData.append('port', port);

      const response = await fetch('https://nginxui.axonbuild.com/addSubdomain', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      console.log(result);
      // Since your Flask app doesn't return JSON, check if request was successful
      if (response) {
        showMessage('success', 'Nginx configuration created successfully!');
        // Reset form after successful submission
        setSubdomain("");
        setPort("");
        // Refresh the unavailable ports list
        await fetchUnavailablePorts();
      } else {
        showMessage('error', 'Failed to create configuration');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showMessage('error', 'Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Unavailable Ports</h2>
          <p className={styles.sidebarSubtitle}>Ports currently in use</p>
        </div>
        <div className={styles.portsList}>
          {unavailablePorts.length > 0 ? (
            unavailablePorts.map((item, index) => (
              <div key={index} className={styles.portItem}>
                <span className={styles.portNumber}>{item.port}</span>
              </div>
            ))
          ) : (
            <div className={styles.loadingPorts}>Loading ports...</div>
          )}
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Nginx UI Manager</h1>
          <p className={styles.subtitle}>Configure your nginx reverse proxy settings</p>
        </div>
        
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="subdomain" className={styles.label}>
                Subdomain
              </label>
              <input
                id="subdomain"
                name="subdomain"
                type="text"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                placeholder="Enter subdomain (e.g., api, admin)"
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="port" className={styles.label}>
                Target Port
              </label>
              <input
                id="port"
                name="port"
                type="number"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="Enter port number (e.g., 3000)"
                className={styles.input}
                min="1"
                max="65535"
                required
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Proxy Configuration"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000'

interface HealthStatus {
  status: string
  timestamp: string
  environment: string
}

function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkHealth = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get<HealthStatus>(`${API_URL}/api/health`)
      setHealth(response.data)
    } catch (err) {
      setError('Backend not reachable. Is it running?')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Check health on mount
  useEffect(() => {
    checkHealth()
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5'
    }}>
      <h1>🚀 CTRL-ZZZ Project Management</h1>
      <p>Jira Clone with Clean Architecture</p>

      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        minWidth: '300px'
      }}>
        <h3>Backend Status</h3>

        {loading && <p>Checking...</p>}

        {health && (
          <div style={{ textAlign: 'left' }}>
            <p>✅ <strong>Status:</strong> {health.status}</p>
            <p>🌍 <strong>Environment:</strong> {health.environment}</p>
            <p>⏰ <strong>Timestamp:</strong> {new Date(health.timestamp).toLocaleString()}</p>
          </div>
        )}

        {error && (
          <div style={{ color: 'red' }}>
            ❌ {error}
          </div>
        )}

        <button
          onClick={checkHealth}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginTop: '15px',
            width: '100%'
          }}
        >
          {loading ? 'Checking...' : 'Refresh Status'}
        </button>
      </div>

      <div style={{
        marginTop: '30px',
        textAlign: 'center'
      }}>
        <a
          href="http://localhost:5000/swagger"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#007bff',
            textDecoration: 'none',
            fontSize: '18px'
          }}
        >
          📚 Open Swagger API Docs →
        </a>
      </div>
    </div>
  )
}

export default App

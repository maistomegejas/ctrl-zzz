import { useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000'

function App() {
  const [roll, setRoll] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const rollDice = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${API_URL}/api/dice`)
      setRoll(response.data.roll)
    } catch (err) {
      setError('Failed to roll dice. Is the backend running?')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🎲 CTRL-ZZZ Dice Roll Test</h1>
      <p>Testing backend connection...</p>

      <button
        onClick={rollDice}
        disabled={loading}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          cursor: loading ? 'not-allowed' : 'pointer',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          marginTop: '20px'
        }}
      >
        {loading ? 'Rolling...' : 'Roll Dice'}
      </button>

      {roll !== null && (
        <div style={{
          marginTop: '30px',
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#333'
        }}>
          🎲 {roll}
        </div>
      )}

      {error && (
        <div style={{
          marginTop: '20px',
          color: 'red',
          fontSize: '16px'
        }}>
          ❌ {error}
        </div>
      )}
    </div>
  )
}

export default App

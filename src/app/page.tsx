'use client';

import { useState } from 'react';

export default function HomePage() {
  const [eventId, setEventId] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) {
      setError('Event ID is required.');
      return;
    }
    setLoading(true);
    setError('');
    setResponseData(null);
    setCopySuccess('');

    try {
      const response = await fetch(`/api/sportfengur?eventId=${encodeURIComponent(eventId)}`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResponseData(data);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (responseData) {
      navigator.clipboard.writeText(JSON.stringify(responseData, null, 2));
      setCopySuccess('JSON copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 3000);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Fetch FEIF IDs from Sportfengur</h1>
      <div
        style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="eventId" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Event ID (motsnumer):
            </label>
            <input
              id="eventId"
              type="text"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              placeholder="e.g. IS2022LM0191"
              style={{
                padding: '0.5rem',
                fontSize: '1rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#005bb5';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#0070f3';
            }}
          >
            {loading ? 'Loading...' : 'Fetch FEIF IDs'}
          </button>
        </form>

        {error && (
          <div style={{ backgroundColor: '#ffe6e6', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
            <p style={{ color: '#d8000c' }}>Error: {error}</p>
          </div>
        )}

        {responseData && (
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>JSON Response:</h2>
            <pre
              style={{
                background: '#f4f4f4',
                padding: '1rem',
                borderRadius: '4px',
                overflowX: 'auto',
                fontSize: '0.9rem',
              }}
            >
              {JSON.stringify(responseData, null, 2)}
            </pre>
            <button
              onClick={handleCopy}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Copy JSON
            </button>
            {copySuccess && <p style={{ color: '#28a745', marginTop: '0.5rem' }}>{copySuccess}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';

export default function Home() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetch('/api/incidents')  // Assuming your API endpoint returns an array of incidents
      .then((res) => res.json())
      .then((data) => setIncidents(data))
      .catch((error) => console.error('Error fetching incidents:', error));
  }, []);

  if (incidents.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.heroSection}>
        <h1 style={styles.heading}>Incident Dashboard</h1>
      </div>
      <div style={styles.grid}>
        {incidents.map((incident) => (
          <div key={incident.id} style={styles.card}>
            <h2 style={styles.cardTitle}>Incident #{incident.incident_number}</h2>
            <p style={styles.info}><strong>Summary:</strong> {incident.summary}</p>
            <p style={styles.info}><strong>Status:</strong> <span style={getStatusStyle(incident.status)}>{incident.status}</span></p>
            <p style={styles.info}><strong>Created At:</strong> {new Date(incident.created_at).toLocaleString()}</p>
            <p style={styles.info}><strong>Urgency:</strong> <span style={getUrgencyStyle(incident.urgency)}>{incident.urgency}</span></p>
            <p style={styles.info}><strong>Service:</strong> {incident.service.summary}</p>
            <p style={styles.info}><strong>Assigned To:</strong> {incident.assigned_to.map((assignee) => assignee.summary).join(', ')}</p>
            <p style={styles.info}><strong>Priority:</strong> {incident.priority.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
    position: 'relative',
  },
  heroSection: {
    backgroundColor: '#0070f3',
    padding: '50px 20px',
    borderRadius: '0 0 50% 50%',
    textAlign: 'center',
    color: '#fff',
    position: 'relative',
    marginBottom: '40px',
  },
  heading: {
    fontSize: '3rem',
    marginBottom: '20px',
    position: 'relative',
    zIndex: 2,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s',
    position: 'relative',
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: '1.5rem',
    marginBottom: '10px',
    color: '#0070f3',
  },
  info: {
    marginBottom: '10px',
    lineHeight: '1.6',
    color: '#555',
  },
};

// Function to return styles based on the status of the incident
const getStatusStyle = (status) => {
  let color;
  switch (status) {
    case 'triggered':
      color = '#e74c3c';
      break;
    case 'acknowledged':
      color = '#f39c12';
      break;
    case 'resolved':
      color = '#2ecc71';
      break;
    default:
      color = '#333';
  }
  return { color, fontWeight: 'bold' };
};

// Function to return styles based on the urgency of the incident
const getUrgencyStyle = (urgency) => {
  let color;
  switch (urgency) {
    case 'high':
      color = '#e74c3c';
      break;
    case 'medium':
      color = '#f39c12';
      break;
    case 'low':
      color = '#2ecc71';
      break;
    default:
      color = '#333';
  }
  return { color, fontWeight: 'bold' };
};

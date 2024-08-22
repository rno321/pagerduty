import { useEffect, useState } from 'react';

export default function Home() {
  const [incidents, setIncidents] = useState([]);
  const [userId, setUserId] = useState('');  // State for storing user ID
  const [filteredIncidents, setFilteredIncidents] = useState([]);  // State for storing filtered incidents

  useEffect(() => {
    fetch('/api/incidents')  // Assuming your API endpoint returns an array of incidents
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data);
        setFilteredIncidents(data);  // Initialize filtered incidents with all incidents
      })
      .catch((error) => console.error('Error fetching incidents:', error));
  }, []);

  // Filter incidents when the userId changes
  useEffect(() => {
    if (userId) {
      const filtered = incidents.filter((incident) =>
        incident.assigned_to.some((assignee) => assignee.id === userId)
      );
      setFilteredIncidents(filtered);
    } else {
      setFilteredIncidents(incidents);  // Show all incidents if no userId is entered
    }
  }, [userId, incidents]);

  if (incidents.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.heroSection}>
        <h1 style={styles.heading}>Incident Dashboard</h1>
        <p style={styles.subheading}>Monitor and manage your incidents with ease.</p>
      </div>
      <div style={styles.filterSection}>
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={styles.input}
        />
      </div>
      <div style={styles.grid}>
        {filteredIncidents.map((incident) => (
          <div key={incident.id} style={styles.card}>
            <h2 style={styles.cardTitle}>Incident #{incident.incident_number}</h2>
            <p style={styles.info}><strong>Summary:</strong> {incident.summary}</p>
            <p style={styles.info}><strong>Status:</strong> <span style={getStatusStyle(incident.status)}>{incident.status}</span></p>
            <p style={styles.info}><strong>Created At:</strong> {new Date(incident.created_at).toLocaleString()}</p>
            <p style={styles.info}><strong>Urgency:</strong> <span style={getUrgencyStyle(incident.urgency)}>{incident.urgency}</span></p>
            <p style={styles.info}><strong>Service:</strong> {incident.service.summary}</p>
            <p style={styles.info}><strong>Assigned To:</strong> {incident.assigned_to.map((assignee) => `${assignee.summary} (ID: ${assignee.id})`).join(', ')}</p>
            <p style={styles.info}><strong>Priority:</strong> {incident.priority.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    color: '#333',
    minHeight: '100vh',
  },
  heroSection: {
    background: 'linear-gradient(to right, #003b72, #00b36b)',
    padding: '60px 20px',
    textAlign: 'center',
    color: '#fff',
    marginBottom: '40px',
  },
  heading: {
    fontSize: '2.5rem',
    margin: '0 0 10px',
  },
  subheading: {
    fontSize: '1.2rem',
    margin: 0,
  },
  filterSection: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ddd',
    width: '300px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',  // Single column layout
    gap: '20px',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    border: '1px solid #ddd',
  },
  cardTitle: {
    fontSize: '1.4rem',
    marginBottom: '10px',
    color: '#003b72',
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

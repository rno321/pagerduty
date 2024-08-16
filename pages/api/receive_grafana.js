import { MongoClient } from 'mongodb';

// MongoDB connection string
const uri = process.env.MONGODB_URI; // Ensure you have this in your environment variables
let client;
let clientPromise;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve MongoClient across module reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Get data from the request body
      const grafanaLog = req.body;

      // Transform the Grafana log into a PagerDuty JSON format
      const pagerDutyEvent = {
        event_type: "trigger",
        description: `Grafana Alert: ${grafanaLog.alertName}`,
        client: "Grafana",
        client_url: grafanaLog.url,
        details: {
          alertName: grafanaLog.alertName,
          alertMessage: grafanaLog.message,
          alertSeverity: grafanaLog.severity,
          timestamp: new Date().toISOString(),
          ...grafanaLog // Include any other relevant details from the log
        }
      };

      // Connect to the MongoDB database
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB); // Ensure you have this in your environment variables

      // Insert the PagerDuty JSON into a MongoDB collection
      const collection = db.collection('pagerduty_events');
      const result = await collection.insertOne(pagerDutyEvent);

      // Respond with the inserted document ID
      res.status(200).json({ message: 'Event stored successfully', id: result.insertedId });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // If the method is not POST, return a 405 error
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

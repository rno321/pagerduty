import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);

        if (req.method === 'GET') {
            // Handle GET request - fetch incidents
            const incidents = await db.collection('incidents').find({}).toArray();

            res.status(200).json(incidents);
        } else if (req.method === 'POST') {
            // Handle POST request - add new incident
            const newIncident = req.body;

            // Basic validation (you can extend this as needed)
            if (!newIncident || !newIncident.id || !newIncident.summary) {
                res.status(400).json({ error: 'Invalid data' });
                return;
            }
            console.log(`paging user id: ${newIncident.assigned_to[0].id}`)
            console.log(`incident summary: ${newIncident.summary}`)

            const result = await db.collection('incidents').insertOne(newIncident);

            res.status(201).json({ message: 'Incident created', incidentId: result.insertedId });
        } else {
            // Handle unsupported methods
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Unable to process request' });
    }
}

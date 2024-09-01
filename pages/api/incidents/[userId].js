import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);

        const { userId } = req.query;

        if (req.method === 'GET') {
            // Handle GET request - fetch incidents by userId
            const incidents = await db.collection('incidents').find({ 'assigned_to.id': userId }).toArray();
            console.log("Sending incidents list.");

            res.status(200).json(incidents);
        } else {
            // Handle unsupported methods
            res.setHeader('Allow', ['GET']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Unable to process request' });
    }
}
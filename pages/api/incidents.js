// pages/api/incidents.js
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db('pagerduty');

        const incidents = await db.collection('incidents').find({}).toArray();

        res.status(200).json(incidents);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Unable to fetch incidents' });
    }
}

// pages/api/submit.js
export default function handler(req, res) {
    if (req.method === 'POST') {
      // Get data from the request body
      const { name, email } = req.body;
  
      // Handle the data (e.g., save it to a database)
      // Here we just send it back as a response
      res.status(200).json({ message: `Hello, ${name}! Your email is ${email}.` });
    } else {
      // If the method is not POST, return a 405 error
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  
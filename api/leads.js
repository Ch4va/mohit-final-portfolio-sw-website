const appKey = 'u49pd3f3';

module.exports = async (req, res) => {
    // Enable CORS for local development testing
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        if (req.method === 'GET') {
            const { action, key } = req.query;

            if (action === 'get_value' && key) {
                const response = await fetch(`https://keyvalue.immanuel.co/api/KeyVal/GetValue/${appKey}/${key}`);
                const data = await response.json();
                return res.status(200).json(data);
            }
            
            return res.status(400).json({ error: 'Invalid action or missing key' });
        }

        if (req.method === 'POST') {
            const { action, key, value } = req.body;

            if (action === 'update_value' && key) {
                const val = value || '';
                // Perform server-to-server POST (bypasses browser CORS)
                const response = await fetch(`https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/${appKey}/${key}/${val}`, {
                    method: 'POST',
                    headers: { 'Content-Length': '0' }
                });
                const success = await response.text();
                return res.status(200).json({ success: success === 'true' });
            }

            return res.status(400).json({ error: 'Invalid action or missing fields' });
        }

        res.status(405).json({ error: 'Method Not Allowed' });
    } catch (err) {
        console.error("API error:", err);
        res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
};

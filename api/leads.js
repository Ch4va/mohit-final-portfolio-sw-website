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
            const { action, key } = req.query || {};

            if (action === 'get_value' && key) {
                const response = await fetch(`https://keyvalue.immanuel.co/api/KeyVal/GetValue/${appKey}/${key}`);
                const text = await response.text();
                
                // keyvalue.immanuel.co returns JSON-encoded string (wrapped in double quotes).
                // We parse it safely to return the clean, unquoted value.
                let val = '';
                if (text && text.trim()) {
                    try {
                        val = JSON.parse(text);
                    } catch (e) {
                        val = text; // Fallback if it is not valid JSON
                    }
                }
                return res.status(200).json(val);
            }
            
            return res.status(400).json({ error: 'Invalid action or missing key' });
        }

        if (req.method === 'POST') {
            // Safely handle body parsing for different Vercel environments (raw string, buffer, or object)
            let body = req.body;
            if (body) {
                if (Buffer.isBuffer(body)) {
                    body = body.toString('utf8');
                }
                if (typeof body === 'string') {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {
                        console.error("Failed to parse body string:", body);
                    }
                }
            }

            const { action, key, value } = body || {};

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

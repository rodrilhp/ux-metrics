const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Path to results file
        // Use /tmp in Vercel Production/Preview (read-only FS)
        // Use project root in Local Dev (even if using vercel dev)
        const isVercelProd = process.env.VERCEL === '1' && process.env.VERCEL_ENV !== 'development';
        const fileName = 'assessment-results.json';
        const resultsPath = isVercelProd
            ? path.join('/tmp', fileName)
            : path.join(process.cwd(), fileName);

        // Check if file exists
        if (!fs.existsSync(resultsPath)) {
            return res.status(200).json({
                success: true,
                count: 0,
                results: []
            });
        }

        // Read results file
        const fileContent = fs.readFileSync(resultsPath, 'utf8');
        const results = JSON.parse(fileContent);

        // Return results
        res.setHeader('Cache-Control', 'no-store, max-age=0');
        return res.status(200).json({
            success: true,
            count: results.length,
            results: results
        });

    } catch (error) {
        console.error('Error reading results:', error);
        return res.status(500).json({
            error: 'Erro ao ler resultados',
            details: error.message
        });
    }
};

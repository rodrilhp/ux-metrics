const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Path to results file
        const resultsPath = path.join('/tmp', 'assessment-results.json');

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

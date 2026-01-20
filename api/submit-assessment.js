const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { answers, timestamp, userInfo } = req.body;

        // Validate required data
        if (!answers || typeof answers !== 'object') {
            return res.status(400).json({ error: 'Invalid data format' });
        }

        // Calculate results
        const levels = Object.values(answers).map(a => a.level);
        const averageLevel = (levels.reduce((a, b) => a + b, 0) / levels.length).toFixed(2);
        const totalQuestions = levels.length;

        // Create result object
        const result = {
            id: `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: timestamp || new Date().toISOString(),
            userInfo: userInfo || {},
            totalQuestions,
            averageLevel: parseFloat(averageLevel),
            answers: answers,
            completedAt: new Date().toISOString()
        };

        // Path to results file
        // Use /tmp in Vercel Production/Preview (read-only FS)
        // Use project root in Local Dev (even if using vercel dev)
        const isVercelProd = process.env.VERCEL === '1' && process.env.VERCEL_ENV !== 'development';
        const fileName = 'assessment-results.json';
        const resultsPath = isVercelProd
            ? path.join('/tmp', fileName)
            : path.join(process.cwd(), fileName);

        // Read existing results or create new array
        let results = [];
        try {
            if (fs.existsSync(resultsPath)) {
                const fileContent = fs.readFileSync(resultsPath, 'utf8');
                results = JSON.parse(fileContent);
            }
        } catch (error) {
            console.log('Creating new results file');
            results = [];
        }

        // Append new result
        results.push(result);

        // Write back to file
        fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Avaliação enviada com sucesso!',
            resultId: result.id
        });

    } catch (error) {
        console.error('Error saving assessment:', error);
        return res.status(500).json({
            error: 'Erro ao salvar avaliação',
            details: error.message
        });
    }
};

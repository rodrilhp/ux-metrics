const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Path to results file
const resultsPath = path.join(__dirname, 'assessment-results.json');

// API: Submit assessment
app.post('/api/submit-assessment', (req, res) => {
    try {
        const { answers, timestamp, userInfo } = req.body;

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

        // Read existing results or create new array
        let results = [];
        if (fs.existsSync(resultsPath)) {
            const fileContent = fs.readFileSync(resultsPath, 'utf8');
            results = JSON.parse(fileContent);
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
});

// API: Get all results
app.get('/api/get-results', (req, res) => {
    try {
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
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📊 Admin dashboard: http://localhost:${PORT}/admin.html`);
});

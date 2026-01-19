// ===================================
// UX Designer Career Evaluation App
// ===================================

// Questions Data - loaded from external JSON file
let questions = [];

// Load questions from JSON file
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        const data = await response.json();
        questions = data.questions;
        console.log('Questões carregadas com sucesso:', questions.length);

        // Update stats dynamically
        updateStats();
    } catch (error) {
        console.error('Erro ao carregar questões:', error);
        // Fallback: show error to user
        alert('Erro ao carregar as questões. Por favor, recarregue a página.');
    }
}

// Update stats based on loaded questions
function updateStats() {
    const totalQuestionsEl = document.getElementById('total-questions');
    const estimatedMinutesEl = document.getElementById('estimated-minutes');

    if (totalQuestionsEl) {
        totalQuestionsEl.textContent = questions.length;
    }

    if (estimatedMinutesEl) {
        // Estimate ~20-25 seconds per question
        const estimatedMinutes = Math.ceil((questions.length * 22) / 60);
        estimatedMinutesEl.textContent = estimatedMinutes;
    }
}

// App State
let currentQuestionIndex = 0;
let answers = {};

// DOM Elements
const welcomePage = document.getElementById('welcome-page');
const questionPage = document.getElementById('question-page');
const resultsPage = document.getElementById('results-page');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const progressFill = document.getElementById('progress-fill');
const questionNumber = document.getElementById('question-number');
const questionTitle = document.getElementById('question-title');
const questionDescription = document.getElementById('question-description');
const optionsGrid = document.getElementById('options-grid');
const resultsGrid = document.getElementById('results-grid');

// ===================================
// Navigation Functions
// ===================================

function showPage(pageToShow) {
    const pages = [welcomePage, questionPage, resultsPage];
    pages.forEach(page => {
        if (page === pageToShow) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });
}

function startAssessment() {
    // Check if questions are loaded
    if (questions.length === 0) {
        alert('As questões ainda estão sendo carregadas. Por favor, aguarde.');
        return;
    }

    currentQuestionIndex = 0;
    answers = {};
    showPage(questionPage);
    renderQuestion();
}

function nextQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOption = document.querySelector('.option-card.selected');

    if (selectedOption) {
        const level = parseInt(selectedOption.dataset.level);
        answers[currentQuestion.id] = {
            question: currentQuestion.title,
            level: level
        };

        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            renderQuestion();
        } else {
            showResults();
        }
    }
}

function restartAssessment() {
    startAssessment();
}

// ===================================
// Render Functions
// ===================================

function renderQuestion() {
    const question = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    // Update progress bar
    progressFill.style.width = `${progress}%`;

    // Update question header
    questionNumber.textContent = `Questão ${currentQuestionIndex + 1} de ${questions.length}`;
    questionTitle.textContent = question.title;
    questionDescription.textContent = question.description;

    // Shuffle options to randomize order
    const shuffledLevels = [...question.levels].sort(() => Math.random() - 0.5);

    // Render options
    optionsGrid.innerHTML = '';
    shuffledLevels.forEach((option, index) => {
        const optionCard = document.createElement('div');
        optionCard.className = 'option-card';
        optionCard.dataset.level = option.level;
        optionCard.style.animationDelay = `${index * 0.05}s`;

        optionCard.innerHTML = `
            <div class="option-content">
                <div class="option-text">
                    <div class="option-description">${option.description}</div>
                </div>
            </div>
        `;

        optionCard.addEventListener('click', () => selectOption(optionCard));
        optionsGrid.appendChild(optionCard);
    });

    // Reset next button
    nextBtn.disabled = true;

    // Check if there's a previous answer
    if (answers[question.id]) {
        const previousLevel = answers[question.id].level;
        const previousOption = optionsGrid.querySelector(`[data-level="${previousLevel}"]`);
        if (previousOption) {
            selectOption(previousOption);
        }
    }
}

function selectOption(optionCard) {
    // Remove selection from all options
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Add selection to clicked option
    optionCard.classList.add('selected');

    // Enable next button
    nextBtn.disabled = false;
}

async function showResults() {
    // Show loading state
    showPage(resultsPage);
    resultsGrid.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--color-text-secondary);">Enviando avaliação...</div>';

    // Prepare data to send
    const assessmentData = {
        timestamp: new Date().toISOString(),
        answers: answers,
        userInfo: {
            // Add any user info you want to collect here
            // For now, we'll keep it anonymous
        }
    };

    try {
        // Send results to backend
        const response = await fetch('/api/submit-assessment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(assessmentData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Show success message
            resultsGrid.innerHTML = `
                <div style="text-align: center; padding: 3rem 1rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                    <h2 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--color-text-primary);">
                        Avaliação Enviada com Sucesso!
                    </h2>
                    <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">
                        Obrigado por completar a avaliação.
                    </p>
                </div>
            `;
        } else {
            throw new Error(result.error || 'Erro ao enviar avaliação');
        }
    } catch (error) {
        console.error('Error submitting assessment:', error);

        // Show error message
        resultsGrid.innerHTML = `
            <div style="text-align: center; padding: 3rem 1rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <h2 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--color-text-primary);">
                    Erro ao Enviar Avaliação
                </h2>
                <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">
                    Ocorreu um erro ao salvar sua avaliação. Por favor, tente novamente.
                </p>
                <button onclick="location.reload()" style="
                    padding: 0.75rem 1.5rem;
                    background: var(--color-accent);
                    color: white;
                    border: none;
                    border-radius: var(--radius);
                    cursor: pointer;
                    font-size: 0.9375rem;
                ">
                    Tentar Novamente
                </button>
            </div>
        `;
    }
}

// ===================================
// Event Listeners
// ===================================

startBtn.addEventListener('click', startAssessment);
nextBtn.addEventListener('click', nextQuestion);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (questionPage.classList.contains('active')) {
        if (e.key === 'Enter' && !nextBtn.disabled) {
            nextQuestion();
        } else if (e.key >= '1' && e.key <= '5') {
            const level = parseInt(e.key);
            const optionCard = optionsGrid.querySelector(`[data-level="${level}"]`);
            if (optionCard) {
                selectOption(optionCard);
            }
        }
    }
});

// ===================================
// Initialize
// ===================================

// Load questions when page loads
loadQuestions().then(() => {
    console.log('Aplicativo de Avaliação de Competências inicializado');
}).catch(error => {
    console.error('Erro na inicialização:', error);
});

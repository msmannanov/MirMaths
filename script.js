let allQuestions = [];
let quizQuestions = [];
let currentQuestionIndex = 0;
let correctAnswersCount = 0;

// 1. Саволларни файлдан юклаш
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        allQuestions = data;
        setupQuiz();
    })
    .catch(error => {
        console.error("Хатолик юз берди:", error);
        document.getElementById('question-text').innerText = "Тестларни юклашда хатолик!";
    });

// 2. Тестни созлаш (20 тасини танлаб олиш)
function setupQuiz() {
    // Саволларни тасодифий тартибда аралаштириш
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    
    // Аралашган саволлардан дастлабки 20 тасини ажратиб олиш
    quizQuestions = shuffled.slice(0, 20);
    
    currentQuestionIndex = 0;
    correctAnswersCount = 0;
    displayQuestion();
}

// 3. Саволни экранга чиқариш
function displayQuestion() {
    const questionTextElement = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const progressElement = document.getElementById('progress');
    const resultElement = document.getElementById('result');

    // Натижа қисмини тозалаш
    resultElement.innerText = "";

    if (currentQuestionIndex < quizQuestions.length) {
        const q = quizQuestions[currentQuestionIndex];
        
        // Прогрессни янгилаш
        progressElement.innerText = `Савол: ${currentQuestionIndex + 1} / ${quizQuestions.length}`;
        
        // Савол матнини чиқариш
        questionTextElement.innerText = q.question;
        
        // Вариантларни чиқариш
        optionsContainer.innerHTML = '';
        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.innerText = opt;
            btn.onclick = () => checkAnswer(index);
            optionsContainer.appendChild(btn);
        });

        // Формулаларни чиройли қилиш (MathJax)
        if (window.MathJax && window.MathJax.typeset) {
            window.MathJax.typeset();
        }
    } else {
        showFinalResults();
    }
}

// 4. Жавобни текшириш
function checkAnswer(selectedIndex) {
    const q = quizQuestions[currentQuestionIndex];
    
    if (selectedIndex === q.answer) {
        correctAnswersCount++;
    }

    currentQuestionIndex++;
    displayQuestion();
}

// 5. Якуний натижани кўрсатиш
function showFinalResults() {
    const container = document.getElementById('quiz-container');
    const total = quizQuestions.length;
    const wrongAnswers = total - correctAnswersCount;
    const percentage = Math.round((correctAnswersCount / total) * 100);

    container.innerHTML = `
        <h2 style="color: #2c3e50;">Тест якунланди!</h2>
        <div style="text-align: left; margin: 20px 0; font-size: 1.1rem;">
            <p>✅ Тўғри жавоблар: <strong>${correctAnswersCount}</strong></p>
            <p>❌ Хато жавоблар: <strong>${wrongAnswers}</strong></p>
            <p>📊 Умумий натижа: <strong>${percentage}%</strong></p>
        </div>
        <button onclick="location.reload()" style="
            background-color: #3498db; 
            color: white; 
            border: none; 
            padding: 12px 25px; 
            border-radius: 8px; 
            cursor: pointer;
            width: 100%;
            font-size: 1rem;">
            Қайта бошлаш
        </button>
    `;
}

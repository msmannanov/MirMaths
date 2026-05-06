let allQuestions = [];
let quizQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = []; 
let selectedOptionIndex = null;
let correctCount = 0;
let wrongCount = 0;
let timeLeft = 20 * 60; // 20 дақиқа сонияларда

// Таймерни ишга тушириш
function startTimer() {
    const timerElement = document.getElementById('timer');
    const timerInterval = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerElement.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showFinalResults(); // Вақт тугаса тугатиш
        }
        timeLeft--;
    }, 1000);
}

fetch('questions.json')
    .then(res => res.json())
    .then(data => {
        allQuestions = data;
        quizQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 20);
        userAnswers = new Array(quizQuestions.length).fill(null);
        startTimer();
        displayQuestion();
    });

function displayQuestion() {
    const qText = document.getElementById('question-text');
    const optCont = document.getElementById('options-container');
    const sBtn = document.getElementById('submit-btn');
    const totalCountEl = document.getElementById('total-count');

    selectedOptionIndex = null;
    sBtn.classList.remove('active');
    totalCountEl.innerText = quizQuestions.length - currentQuestionIndex;

    if (currentQuestionIndex < quizQuestions.length) {
        const q = quizQuestions[currentQuestionIndex];
        qText.innerText = q.question;
        
        optCont.innerHTML = '';
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.innerText = opt;
            btn.className = "option-btn";
            btn.onclick = () => {
                selectedOptionIndex = idx;
                highlightOption(btn);
                sBtn.classList.add('active');
            };
            optCont.appendChild(btn);
        });
        if (window.MathJax) MathJax.typeset();
    } else {
        checkSkipped();
    }
}

function highlightOption(btn) {
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
}

function submitAnswer() {
    const q = quizQuestions[currentQuestionIndex];
    if (selectedOptionIndex === q.answer) {
        correctCount++;
        document.getElementById('correct-count').innerText = correctCount;
    } else {
        wrongCount++;
        document.getElementById('wrong-count').innerText = wrongCount;
    }
    userAnswers[currentQuestionIndex] = selectedOptionIndex;
    moveToNext();
}

function skipQuestion() {
    userAnswers[currentQuestionIndex] = -1; // Пропустить
    moveToNext();
}

function moveToNext() {
    currentQuestionIndex++;
    displayQuestion();
}

// Ташлаб кетилганларни текшириш (Review Mode)
function checkSkipped() {
    let firstSkipped = userAnswers.indexOf(-1);
    if (firstSkipped !== -1) {
        currentQuestionIndex = firstSkipped;
        displayQuestion();
    } else {
        showFinalResults();
    }
}

function showFinalResults() {
    document.getElementById('quiz-container').innerHTML = `
        <h2>Тест Якунланди</h2>
        <p>✅ Тўғри: ${correctCount}</p>
        <p>❌ Хато: ${wrongCount}</p>
        <button onclick="location.reload()" style="padding:10px 20px; cursor:pointer;">Қайта бошлаш</button>
    `;
}

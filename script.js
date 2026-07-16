let allQuestions = [];
let quizQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let timeLeft = 20 * 60;
let timerInterval;

window.onload = async function() {
    await fetch('questions.json')
        .then(res => res.json())
        .then(data => { allQuestions = data; });

    const urlParams = new URLSearchParams(window.location.search);
    const selectedTopic = urlParams.get('topic');

    if (selectedTopic) {
        startQuiz(selectedTopic);
    } else {
        buildTopicsMenu();
    }
};

function buildTopicsMenu() {
    const container = document.getElementById('topics-container');
    const mathTopics = [...new Set(allQuestions.map(q => q.topic))];
    container.innerHTML = '';
    
    mathTopics.forEach(topic => {
        const box = document.createElement('div');
        box.className = 'topic-box';
        box.innerText = topic;
        box.onclick = () => {
            window.location.href = `test.html?topic=${encodeURIComponent(topic)}`;
        };
        container.appendChild(box);
    });
}

function startQuiz(topicName) {
    quizQuestions = allQuestions.filter(q => q.topic === topicName);
    
    document.getElementById('topics-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    document.getElementById('current-topic-title').innerText = topicName;

    currentQuestionIndex = 0;
    userAnswers = quizQuestions.map(() => ({ choice: null, isCorrect: false }));
    
    runTimer();
    displayQuestion();
    buildPagination();
}

function displayQuestion() {
    const q = quizQuestions[currentQuestionIndex];
    document.getElementById('question-text').innerText = `${currentQuestionIndex + 1}. ${q.question}`;
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        if (userAnswers[currentQuestionIndex].choice === idx) btn.classList.add('selected');
        btn.onclick = () => selectOption(idx, btn);
        optionsContainer.appendChild(btn);
    });
    
    if (window.MathJax) MathJax.typeset();
}

function selectOption(idx, btn) {
    userAnswers[currentQuestionIndex].choice = idx;
    userAnswers[currentQuestionIndex].isCorrect = (idx === quizQuestions[currentQuestionIndex].answer);
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('submit-btn').disabled = false;
    buildPagination();
}

function checkAnswer() {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
        buildPagination();
    } else {
        showResults();
    }
}

function buildPagination() {
    const pag = document.getElementById('pagination');
    pag.innerHTML = '';
    quizQuestions.forEach((_, idx) => {
        const num = document.createElement('div');
        num.className = `page-num ${idx === currentQuestionIndex ? 'active' : ''} ${userAnswers[idx].choice !== null ? (userAnswers[idx].isCorrect ? 'answered' : 'wrong') : ''}`;
        num.innerText = idx + 1;
        num.onclick = () => { currentQuestionIndex = idx; displayQuestion(); buildPagination(); };
        pag.appendChild(num);
    });
}

function runTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        let min = Math.floor(timeLeft / 60);
        let sec = timeLeft % 60;
        document.getElementById('timer').innerText = `${min}:${sec < 10 ? '0' + sec : sec}`;
        if (timeLeft <= 0) showResults();
    }, 1000);
}

function showResults() {
    clearInterval(timerInterval);
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
    document.getElementById('correct-count').innerText = userAnswers.filter(a => a.isCorrect).length;
    document.getElementById('total-count').innerText = quizQuestions.length;
}

function showTopicsScreen() { window.location.href = 'test.html'; }

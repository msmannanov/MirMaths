let allQuestions = [];
let quizQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = []; 
let selectedOptionIndex = null;
let timeLeft = 20 * 60;
let timerInterval;
let isAnswered = false;

function startQuiz() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-content').style.display = 'block';
    
    fetch('questions.json')
        .then(res => res.json())
        .then(data => {
            allQuestions = data;
            // 20 та тасодифий саволни танлаш
            quizQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 20);
            userAnswers = new Array(quizQuestions.length).fill(null);
            createPagination();
            runTimer();
            displayQuestion();
        });
}

function createPagination() {
    const pagCont = document.getElementById('pagination');
    pagCont.innerHTML = ''; // Бошини тозалаш
    for (let i = 0; i < quizQuestions.length; i++) {
        const div = document.createElement('div');
        div.className = 'num-box';
        div.innerText = i + 1;
        div.id = `nav-${i}`;
        div.onclick = () => { if(isAnswered || userAnswers[i] !== null) goToQuestion(i); };
        pagCont.appendChild(div);
    }
}

function displayQuestion() {
    isAnswered = false;
    const q = quizQuestions[currentQuestionIndex];
    document.getElementById('question-text').innerText = (currentQuestionIndex + 1) + ". " + q.question;
    const optCont = document.getElementById('options-container');
    const sBtn = document.getElementById('submit-btn');
    
    optCont.innerHTML = '';
    selectedOptionIndex = null;
    sBtn.disabled = true;
    sBtn.innerText = "Ответить";

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = "option-btn";
        
        // Агар бу саволга олдин жавоб берилган бўлса (навигация орқали қайтилганда)
        if (userAnswers[currentQuestionIndex] === idx) {
            btn.classList.add('selected');
        }

        btn.onclick = () => {
            if(!isAnswered) {
                selectedOptionIndex = idx;
                document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                sBtn.disabled = false;
            }
        };
        optCont.appendChild(btn);
    });

    // Навигация панелида ҳозирги саволни белгилаш
    document.querySelectorAll('.num-box').forEach(box => box.classList.remove('active'));
    let activeNav = document.getElementById(`nav-${currentQuestionIndex}`);
    if(activeNav) activeNav.classList.add('active');

    if (window.MathJax) MathJax.typeset();
}

function checkAnswer() {
    if (isAnswered) return;

    const q = quizQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.option-btn');
    const navBox = document.getElementById(`nav-${currentQuestionIndex}`);

    isAnswered = true;
    userAnswers[currentQuestionIndex] = selectedOptionIndex;

    // Рангларни янгилаш
    if (selectedOptionIndex === q.answer) {
        options[selectedOptionIndex].classList.add('correct-ans');
        navBox.classList.add('nav-correct');
    } else {
        options[selectedOptionIndex].classList.add('wrong-ans');
        options[q.answer].classList.add('correct-ans');
        navBox.classList.add('nav-wrong');
    }

    // 1 СЕКУНДДАН КЕЙИН АВТОМАТИК ЎТИШ
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizQuestions.length) {
            displayQuestion();
        } else {
            finishQuiz();
        }
    }, 1000); // 1000 миллисекунд = 1 секунд
}

function goToQuestion(index) {
    currentQuestionIndex = index;
    displayQuestion();
}

function runTimer() {
    timerInterval = setInterval(() => {
        let min = Math.floor(timeLeft / 60);
        let sec = timeLeft % 60;
        document.getElementById('timer').innerText = `${min}:${sec < 10 ? '0' : ''}${sec}`;
        if (timeLeft <= 0) finishQuiz();
        timeLeft--;
    }, 1000);
}

function finishQuiz() {
    clearInterval(timerInterval);
    let correct = userAnswers.filter((ans, i) => ans === quizQuestions[i].answer).length;
    document.getElementById('quiz-outer-container').innerHTML = `
        <h2 style="padding:20px;">Тест якунланди!</h2>
        <p style="font-size:1.3rem;">Натижа: <span style="color:green">${correct}</span> / ${quizQuestions.length}</p>
        <button class="start-btn" onclick="location.reload()">Қайтадан бошлаш</button>
    `;
}
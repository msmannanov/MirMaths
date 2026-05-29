let allQuestions = []; 
let quizQuestions = []; 
let currentQuestionIndex = 0;
let userAnswers = []; 
let timeLeft = 20 * 60;
let tempSelection = null;
let timerInterval;

// Тест тизимидаги математика мавзулари
const mathTopics = [
    "Матрицалар жана детерминанттар",
    "Векторлор жана алардын касиеттери",
    "Түз сызыктын теңдемелери",
    "Чектүүлүктөр (Пределдер)",
    "Функциянын туундусу",
    "Туундунун колдонулушу жана экстремумдар",
    "Аныкталбаган интеграл",
    "Аныкталган интеграл жана аянты",
    "Тригонометриялык теңдемелер",
    "Көрсөткүчтүү жана логарифмдик теңдемелер",
    "Прогрессиялар (Арифметикалык жана геометриялык)",
    "Ыктымалдуулуктар теориясы",
    "Комбинаториканын элементтери",
    "Стереометрия (Көлөмдөр жана аянттар)",
    "Дифференциалдык теңдемелер"
];

// Сайт юкланиши билан ишга тушадиган бош функция
window.onload = function() {
    buildTopicsMenu();
    fetchQuestions();
};

// 1. Мавзуларни экранга чиройли карточка қилиб чиқариш
function buildTopicsMenu() {
    const container = document.getElementById('topics-container');
    if (!container) return;
    
    container.innerHTML = '';
    mathTopics.forEach(topic => {
        const box = document.createElement('div');
        box.className = 'topic-box';
        box.innerText = topic;
        box.onclick = () => startQuiz(topic);
        container.appendChild(box);
    });
}

// JSON файлдан саволларни олиш
function fetchQuestions() {
    fetch('questions.json')
        .then(response => {
            if (!response.ok) throw new Error("JSON файл топилмади!");
            return response.json();
        })
        .then(data => {
            allQuestions = data;
            console.log("Саволлар муваффақиятли юкланди.");
        })
        .catch(error => {
            console.error(error);
            alert("Саволларни юклашда хатолик бўлди. questions.json файлини текширинг.");
        });
}

// 2. Тестни бошлаш (Мавзу босилганда ишга тушади)
function startQuiz(topicName) {
    // Танланган мавзуга тегишли саволларни саралаб олиш
    quizQuestions = allQuestions.filter(q => q.topic === topicName);

    // Агар бу мавзуда савол бўлмаса, вақтинча базадаги биринчи 20 тасини бериб турамиз
    if (quizQuestions.length === 0) {
        quizQuestions = allQuestions.slice(0, 20);
    }

    // Созламаларни янгилаш
    currentQuestionIndex = 0;
    timeLeft = 20 * 60;
    tempSelection = null;
    userAnswers = quizQuestions.map(() => ({ choice: null, isCorrect: false }));

    // Мавзулар экранини ёпиб, тест экранини очиш
    document.getElementById('topics-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    
    document.getElementById('current-topic-title').innerText = topicName;

    runTimer();
    displayQuestion();
    buildPagination();
}

// Саволни чиқариш
function displayQuestion() {
    const q = quizQuestions[currentQuestionIndex];
    document.getElementById('question-text').innerText = `${currentQuestionIndex + 1}. ${q.question}`;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        
        if (userAnswers[currentQuestionIndex].choice === idx) {
            btn.classList.add('selected');
        }

        btn.onclick = () => selectOption(idx, btn);
        optionsContainer.appendChild(btn);
    });

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = userAnswers[currentQuestionIndex].choice === null;

    if (window.MathJax) {
        MathJax.typesetPromise();
    }
}

function selectOption(idx, btn) {
    tempSelection = idx;
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    
    document.getElementById('submit-btn').disabled = false;
}

// Жавобни текшириш ва сақлаш
function checkAnswer() {
    if (tempSelection === null) return;

    const q = quizQuestions[currentQuestionIndex];
    const isCorrect = (tempSelection === q.answer);

    userAnswers[currentQuestionIndex] = {
        choice: tempSelection,
        isCorrect: isCorrect
    };

    // Доирачалар рангини янгилаш
    buildPagination();

    // Ярим сониядан кейин кейинги саволга ўтиш
    setTimeout(() => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            tempSelection = null;
            displayQuestion();
            buildPagination();
        } else {
            showResults();
        }
    }, 400);
}

// Пастки рақамли доирачаларни яратиш ва ранг бериш
function buildPagination() {
    const pag = document.getElementById('pagination');
    if (!pag) return;
    pag.innerHTML = '';

    quizQuestions.forEach((_, idx) => {
        const num = document.createElement('div');
        num.className = 'page-num';
        num.innerText = idx + 1;

        if (idx === currentQuestionIndex) {
            num.classList.add('active'); // Кўк фаол ранг
        } 
        else if (userAnswers[idx] && userAnswers[idx].choice !== null) {
            if (userAnswers[idx].isCorrect) {
                num.classList.add('answered'); // Тўғри бўлса - Яшил
            } else {
                num.classList.add('wrong');    // Хато бўлса - Қизил
            }
        }

        num.onclick = () => {
            currentQuestionIndex = idx;
            tempSelection = userAnswers[idx] ? userAnswers[idx].choice : null;
            displayQuestion();
            buildPagination();
        };
        pag.appendChild(num);
    });
}

// Натижани чиқариш
function showResults() {
    clearInterval(timerInterval);
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';

    const correct = userAnswers.filter(ans => ans.isCorrect).length;
    const total = quizQuestions.length;
    const percent = Math.round((correct / total) * 100);

    document.getElementById('correct-count').innerText = correct;
    document.getElementById('total-count').innerText = total;
    document.getElementById('percentage').innerText = `Сиздин көрсөткүчүңүз: ${percent}%`;
}

// Қайтадан мавзу танлаш экранига қайтиш
function showTopicsScreen() {
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('topics-screen').style.display = 'block';
}

function runTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        let min = Math.floor(timeLeft / 60);
        let sec = timeLeft % 60;
        if (sec < 10) sec = '0' + sec;
        
        document.getElementById('timer').innerText = `${min}:${sec}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Убакыт бүттү!");
            showResults();
        }
    }, 1000);
}
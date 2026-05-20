let allQuestions = []; // JSON'догу бардык суроолор сакталат
let quizQuestions = []; // Тандалган темага тиешелүү 20 суроо
let currentQuestionIndex = 0;
let userAnswers = []; 
let timeLeft = 20 * 60;
let tempSelection = null;
let timerInterval;

// Темалардын тизмеси (10-15 теманы ушул жерге кошосуз)
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

// Тиркеме же сайт жүктөлгөндө эң алгач бардык суроолорду фондо жүктөп алат
window.onload = function() {
    fetch('questions.json')
        .then(res => res.json())
        .then(data => {
            allQuestions = data;
        })
        .catch(err => console.error("JSON жүктөөдө ката кетти:", err));
};

// Экранда темалардын тизмесин көрсөтүүчү функция
function showTopics() {
    clearInterval(timerInterval); // Эгер эски таймер иштеп жатса токтотобуз
    
    // Бардык экрандарды жаап, бир гана темалар экранын ачабыз
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-content').style.display = 'none';
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('topics-screen').style.display = 'block';

    const topicsCont = document.getElementById('topics-container');
    topicsCont.innerHTML = ''; // Ичин тазалоо

    // Тизмедеги ар бир темага өзүнчө баскыч түзөбүз
    mathTopics.forEach((topicName) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.style.width = '100%';
        btn.style.marginBottom = '5px';
        btn.style.fontWeight = '600';
        btn.innerText = topicName;
        
        // Тема басылганда тестти баштоо функциясын чакырат
        btn.onclick = () => startQuizWithTopic(topicName);
        topicsCont.appendChild(btn);
    });
}

// Тандалган тема боюнча тестти баштоо
function startQuizWithTopic(topicName) {
    document.getElementById('topics-screen').style.display = 'none';
    document.getElementById('quiz-content').style.display = 'block';
    document.getElementById('current-topic-title').innerText = topicName;

    // Сиздин json файлыңызда "topic" деген бөлүм жок болсо, азырынча жөн эле бардык 
    // суроолорду аралаштырып берет. Кийин ар бир суроого тема атын кошуп алсаңыз болот.
    let filteredQuestions = [...allQuestions]; 

    // Суроолорду туш келди аралаштыруу (Фишер-Йетс алгоритми)
    for (let i = filteredQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredQuestions[i], filteredQuestions[j]] = [filteredQuestions[j], filteredQuestions[i]];
    }

    // Максимум 20 же андан аз суроо тандап алуу
    quizQuestions = filteredQuestions.slice(0, Math.min(20, filteredQuestions.length));
    userAnswers = quizQuestions.map(() => ({ choice: null, isCorrect: null }));
    
    currentQuestionIndex = 0;
    timeLeft = 20 * 60; // Убакытты баштапкы абалга келтирүү
    
    createPagination();
    runTimer();
    displayQuestion();
}

function createPagination() {
    const pagCont = document.getElementById('pagination');
    pagCont.innerHTML = '';
    for (let i = 0; i < quizQuestions.length; i++) {
        const div = document.createElement('div');
        div.className = 'num-box';
        div.innerText = i + 1;
        div.id = `nav-${i}`;
        div.onclick = () => goToQuestion(i);
        pagCont.appendChild(div);
    }
}

function displayQuestion() {
    if(quizQuestions.length === 0) return;
    
    const q = quizQuestions[currentQuestionIndex];
    const u = userAnswers[currentQuestionIndex];
    tempSelection = null;

    let cleanedQuestion = q.question.replace(/\\\\/g, '\\');
    document.getElementById('question-text').innerHTML = (currentQuestionIndex + 1) + ". " + cleanedQuestion;
    
    const imgCont = document.getElementById('image-container');
    const imgTag = document.getElementById('question-image');
    if(q.image && q.image !== "") { 
        imgTag.src = q.image; 
        imgCont.style.display = "block"; 
    } else { 
        imgCont.style.display = "none"; 
    }

    const optCont = document.getElementById('options-container');
    const sBtn = document.getElementById('submit-btn');
    optCont.innerHTML = '';
    sBtn.disabled = true;

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        let cleanedOption = opt.replace(/\\\\/g, '\\');
        btn.innerHTML = cleanedOption; 
        btn.className = "option-btn";
        
        if (u.choice !== null) {
            if (idx === q.answer) btn.classList.add('correct-ans');
            if (idx === u.choice && u.choice !== q.answer) btn.classList.add('wrong-ans');
            sBtn.disabled = true;
        } else {
            btn.onclick = () => {
                tempSelection = idx;
                document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                sBtn.disabled = false;
            };
        }
        optCont.appendChild(btn);
    });

    document.querySelectorAll('.num-box').forEach(box => box.classList.remove('active'));
    document.getElementById(`nav-${currentQuestionIndex}`).classList.add('active');

    if (window.MathJax && window.MathJax.typesetPromise) {
        MathJax.typesetPromise([
            document.getElementById('question-text'),
            document.getElementById('options-container')
        ]).catch((err) => console.log('MathJax катасы:', err));
    }
}

function checkAnswer() {
    if (tempSelection === null) return;
    const q = quizQuestions[currentQuestionIndex];
    userAnswers[currentQuestionIndex] = { choice: tempSelection, isCorrect: tempSelection === q.answer };

    const navBox = document.getElementById(`nav-${currentQuestionIndex}`);
    navBox.classList.add(userAnswers[currentQuestionIndex].isCorrect ? 'nav-correct' : 'nav-wrong');

    displayQuestion();

    setTimeout(() => {
        let next = userAnswers.findIndex((ans, idx) => ans.choice === null && idx > currentQuestionIndex);
        if (next === -1) next = userAnswers.findIndex(ans => ans.choice === null);

        if (next !== -1) {
            currentQuestionIndex = next;
            displayQuestion();
        } else {
            showResults();
        }
    }, 1000);
}

function goToQuestion(i) {
    currentQuestionIndex = i;
    displayQuestion();
}

function showResults() {
    clearInterval(timerInterval);
    document.getElementById('quiz-content').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';

    const correct = userAnswers.filter(ans => ans.isCorrect).length;
    const total = quizQuestions.length;
    const percent = Math.round((correct / total) * 100);

    document.getElementById('correct-count').innerText = correct;
    document.getElementById('total-count').innerText = total;
    document.getElementById('percentage').innerText = `Сиздин көрсөткүчүңүз: ${percent}%`;
}

function runTimer() {
    timerInterval = setInterval(() => {
        let min = Math.floor(timeLeft / 60);
        let sec = timeLeft % 60;
        document.getElementById('timer').innerText = `${min}:${sec < 10 ? '0' : ''}${sec}`;
        if (timeLeft <= 0) { 
            clearInterval(timerInterval);
            showResults(); 
        }
        timeLeft--;
    }, 1000);
}

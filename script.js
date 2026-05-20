let quizQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = []; 
let timeLeft = 20 * 60;
let tempSelection = null;
let timerInterval;

function startQuiz() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-content').style.display = 'block';
    
    fetch('questions.json')
        .then(res => res.json())
        .then(data => {
            // Суроолорду туш келди тартипте аралаштыруу (Фишер-Йетс алгоритми)
            for (let i = data.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [data[i], data[j]] = [data[j], data[i]];
            }
            
            // Аралаштырылган суроолордон 20 суроону тандап алуу
            quizQuestions = data.slice(0, 20);
            userAnswers = quizQuestions.map(() => ({ choice: null, isCorrect: null }));
            createPagination();
            runTimer();
            displayQuestion();
        })
        .catch(err => console.error("JSON жүктөөдө ката кетти:", err));
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
    const q = quizQuestions[currentQuestionIndex];
    const u = userAnswers[currentQuestionIndex];
    tempSelection = null;

    // Белгилерди туура форматка келтирүү (\\ белгисин \ га алмаштыруу)
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

    // MathJax аркылуу формулаларды кайрадан сулуулап чыгуу
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

let currentQuestion = 0;
let questions = [];

// Саволларни файлдан юклаб олиш
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        displayQuestion();
    });

function displayQuestion() {
    if (currentQuestion >= questions.length) {
        document.getElementById('quiz-container').innerHTML = "Тест якунланди!";
        return;
    }

    const q = questions[currentQuestion];
    document.getElementById('question-text').innerText = q.question;
    
    const optionsDiv = document.getElementById('options-container');
    optionsDiv.innerHTML = '';
    
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(index);
        optionsDiv.appendChild(btn);
    });

    // Формулаларни қайта ишлаш (MathJax)
    MathJax.typeset();
}

function checkAnswer(index) {
    if (index === questions[currentQuestion].answer) {
        alert("Тўғри!");
    } else {
        alert("Хато!");
    }
    currentQuestion++;
    displayQuestion();
}

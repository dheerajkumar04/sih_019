let currentQuestion = 0;
let score = 0;
let questions = [];
let timer;
const timePerQuestion = 30;
const el = document.getElementById('question-box');

async function loadQuizQuestions() {
    const res = await fetch('/get_quiz_questions');
    questions = await res.json();
    renderNavBar();
    showQuestion();
}

function renderNavBar() {
    const nav = document.getElementById("nav-bar");
    nav.innerHTML = "";
    questions.forEach((q, index) => {
        const btn = document.createElement("button");
        btn.innerText = q.qno.slice(4);
        btn.onclick = () => goToQuestion(index);
        btn.id = `nav-${index}`;
        nav.appendChild(btn);
    });
}

function updateNavBar() {
    questions.forEach((_, i) => {
        document.getElementById(`nav-${i}`).classList.remove("active");
    });
    document.getElementById(`nav-${currentQuestion}`).classList.add("active");
}


function startTimer() {
    let timeLeft = timePerQuestion;
    const timerDisplay = document.getElementById('timer');
    timerDisplay.innerText = timeLeft;

    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            handleAnswer(null);
        }
    }, 1000);
}

function showQuestion() {
    if (currentQuestion >= questions.length) {
        showFinalScore();
        return;
    }

    updateNavBar();
    startTimer();

    const q = questions[currentQuestion];
    const options = [q.option1, q.option2, q.option3, q.option4];
    document.getElementById('question-box').innerText = `${q.qno.slice(4)}. ${q.question}`;
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.innerText = `${String.fromCharCode(65 + i)}. ${opt}`;
        btn.onclick = () => handleAnswer(i + 1);
        btn.dataset.index = i + 1;
        optionsDiv.appendChild(btn);
    });

    document.getElementById('feedback').style.display = 'none';
    document.getElementById('next-btn').disabled = true;
    document.getElementById('prev-btn').disabled = currentQuestion === 0;
}

function handleAnswer(selectedIndex) {
    clearInterval(timer);

    const q = questions[currentQuestion];
    const correctIndex = q.correct_option;
    const optionsDiv = document.getElementById('options');
    const buttons = optionsDiv.querySelectorAll('button');

    buttons.forEach(btn => {
        const idx = parseInt(btn.dataset.index);
        btn.disabled = true;
        if (idx === correctIndex) {
            btn.classList.add("correct");
        }
        if (selectedIndex !== null && idx === selectedIndex && selectedIndex !== correctIndex) {
            btn.classList.add("incorrect");
        }
    });

    if (selectedIndex === correctIndex) {
        score++;
        document.getElementById(`nav-${currentQuestion}`).classList.add("correct");
    }
    else {
        document.getElementById(`nav-${currentQuestion}`).classList.add("incorrect");

    }

    const feedback = document.getElementById('feedback');
    const correctText = [q.option1, q.option2, q.option3, q.option4][correctIndex - 1];
    feedback.innerHTML = `✅ Correct Answer: ${correctText}<br>💡 Reason: ${q.reason}`;
    feedback.style.display = 'block';

    document.getElementById('next-btn').disabled = false;
    if (currentQuestion === questions.length - 1) {
        document.getElementById('next-btn').innerText = 'Finish';
    }

    el.style.position = 'relative'; // ensure it can be moved relative to original
    el.style.top = '-85px'; // moves the element 20 pixels up
}

function goToNext() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        el.style.top = '0px';
        showQuestion();
    } else {
        showFinalScore();
    }
}

function goToQuestion(index) {
    currentQuestion = index;
    showQuestion();
}

function showFinalScore() {
    clearInterval(timer);
    // Hide quiz content
    document.querySelector('.quiz-wrapper').style.display = 'none';

    // Show modal
    const modal = document.getElementById('final-score-modal');
    const scoreText = document.getElementById('final-score-text');
    scoreText.innerText = `${score} / ${questions.length}`;

    modal.classList.remove('hidden');

    // Add retry button listener
    document.getElementById('retry-btn').onclick = () => {
        window.location.href = '/quiz_page';
    };
}

loadQuizQuestions();

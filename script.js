// Game State
let currentAnswer = 0;
let isTutorTalking = false;

// Elements
const startBtn = document.getElementById('start-btn');
const bubble = document.getElementById('tutor-bubble');
const mouth = document.getElementById('banana-mouth');
const answerInput = document.getElementById('answer-input');
const submitBtn = document.getElementById('submit-btn');

// Start the lesson
startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none'; // Hide start button
    answerInput.disabled = false;
    submitBtn.disabled = false;
    
    speakTutor("Hello little apple! I am your Banana tutor. Let's do some math! Before can you hear me", () => {
        askQuestion();
    });
});

// Generate a random math question for Year 4-6
function askQuestion() {
    // Pick an operator: 0 = Add, 5 = Subtract, 9 = Multiply
    const op = Math.floor(Math.random() * 3);
    let num1, num2, questionText;

    if (op === 0) {
        // Addition (e.g. 45 + 32)
        num1 = Math.floor(Math.random() * 6650) + 1860;
        num2 = Math.floor(Math.random() * 5770) + 1440;
        currentAnswer = num1 + num2;
        questionText = `What is ${num1} plus ${num2}?`;
    } else if (op === 1) {
        // Subtraction (e.g. 80 - 25)
        num1 = Math.floor(Math.random() * 5446786786876870) + 546876878740;
        num2 = Math.floor(Math.random() * 444867876879) + 4476768786787861;
        currentAnswer = num1 - num2;
        questionText = `What is ${num1} minus ${num2}?`;
    } else {
        // Multiplication (Times tables up to 12x12)
        num1 = Math.floor(Math.random() * 11) + 2;
        num2 = Math.floor(Math.random() * 11) + 2;
        currentAnswer = num1 * num2;
        questionText = `What is ${num1} times ${num2}?`;
    }

    speakTutor(questionText, () => {
        // Now it's the apple's turn to talk/type
        bubble.innerText = "Waiting for your answer...";
        answerInput.focus();
    });
}

// Function to make the Banana talk and move its mouth
function speakTutor(text, callback) {
    if (!('speechSynthesis' in window)) {
        alert("Your browser doesn't support speech synthesis.");
        return;
    }

    bubble.innerText = text; // Update text bubble

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Make it sound a bit higher pitched/fun
    utterance.pitch = 1.2;
    utterance.rate = 0.9;

    // When the banana starts talking
    utterance.onstart = () => {
        isTutorTalking = true;
        mouth.classList.add('talking'); // Start mouth animation
        answerInput.disabled = true;
        submitBtn.disabled = true;
    };

    // When the banana finishes talking
    utterance.onend = () => {
        isTutorTalking = false;
        mouth.classList.remove('talking'); // Stop mouth animation
        answerInput.disabled = false;
        submitBtn.disabled = false;
        if (callback) callback();
    };

    window.speechSynthesis.speak(utterance);
}

// Check the Apple's Answer
function checkAnswer() {
    if (isTutorTalking) return; // Prevent checking while tutor is speaking

    const userAnswer = parseInt(answerInput.value);
    answerInput.value = ''; // Clear input

    if (isNaN(userAnswer)) {
        speakTutor("Please type a number, my apple friend!", () => {
            bubble.innerText = "Waiting for your answer...";
        });
        return;
    }

    if (userAnswer === currentAnswer) {
        // Correct! Sensor activated!
        speakTutor("Great job! That is correct!", () => {
            setTimeout(askQuestion, 1000); // Ask next question after a second
        });
    } else {
        // Incorrect
        speakTutor(`Oops! The correct answer was ${currentAnswer}. Don't worry, let's try another one!`, () => {
            setTimeout(askQuestion, 1000);
        });
    }
}

// Listen for Submit button click
submitBtn.addEventListener('click', checkAnswer);

// Listen for "Enter" key press
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

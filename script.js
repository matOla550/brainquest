/* =====================================================
   BrainQuest - script.js
   How it works:
   1. "questions" holds all the quiz data.
   2. A few variables remember where the student is.
   3. Small functions show each screen and handle clicks.
   ===================================================== */

// ---------- 1. QUIZ DATA ----------
// Each question has: category, text, four answers,
// "correct" (the position of the right answer, starting from 0),
// and a short explanation shown after answering.
// To add a question, copy one block and change the words.
const questions = [
  {
    category: "Science",
    text: "Which gas do plants take in from the air to make their food?",
    answers: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
    correct: 1,
    explanation: "Plants absorb carbon dioxide through tiny holes in their leaves, then use sunlight to turn it into sugar."
  },
  {
    category: "Maths",
    text: "What is 12 × 8?",
    answers: ["86", "88", "96", "108"],
    correct: 2,
    explanation: "10 × 8 = 80 and 2 × 8 = 16, and 80 + 16 = 96."
  },
  {
    category: "Geography",
    text: "What is the capital city of Nigeria?",
    answers: ["Lagos", "Abuja", "Kano", "Port Harcourt"],
    correct: 1,
    explanation: "Abuja became the capital in 1991, replacing Lagos."
  },
  {
    category: "Computing",
    text: "What does CPU stand for?",
    answers: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"],
    correct: 0,
    explanation: "The CPU is the part of a computer that carries out instructions."
  },
  {
    category: "Science",
    text: "Which planet is closest to the Sun?",
    answers: ["Venus", "Earth", "Mercury", "Mars"],
    correct: 2,
    explanation: "Mercury is the closest planet to the Sun and also the smallest."
  },
  {
    category: "Maths",
    text: "What is 25% of 200?",
    answers: ["25", "40", "50", "75"],
    correct: 2,
    explanation: "25% is one quarter, and 200 ÷ 4 = 50."
  },
  {
    category: "Geography",
    text: "Which is the longest river in Africa?",
    answers: ["Niger", "Congo", "Nile", "Zambezi"],
    correct: 2,
    explanation: "The Nile is about 6,650 km long and flows north into the Mediterranean Sea."
  },
  {
    category: "Computing",
    text: "Which language is used to build the structure of a web page?",
    answers: ["HTML", "CSS", "Python", "SQL"],
    correct: 0,
    explanation: "HTML sets out the headings, paragraphs and buttons. CSS then styles them."
  },
  {
    category: "Science",
    text: "What is the chemical formula for water?",
    answers: ["O2", "H2O", "CO2", "HO"],
    correct: 1,
    explanation: "Each water molecule has two hydrogen atoms and one oxygen atom."
  },
  {
    category: "Maths",
    text: "How many sides does a hexagon have?",
    answers: ["5", "7", "8", "6"],
    correct: 3,
    explanation: "Hex means six. Think of the six sides of a honeycomb cell."
  }
];

// ---------- 2. VARIABLES THAT REMEMBER THE QUIZ STATE ----------
let currentQuestionIndex = 0;  // which question we are on (starts at 0)
let score = 0;                 // how many answers are correct so far
let hasAnswered = false;       // true once the student has picked an answer

// ---------- 3. FIND THE HTML ELEMENTS WE NEED ----------
const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");

const startButton = document.getElementById("start-button");
const nextButton = document.getElementById("next-button");
const restartButton = document.getElementById("restart-button");

const questionCounter = document.getElementById("question-counter");
const scoreLive = document.getElementById("score-live");
const progressBar = document.querySelector(".progress");
const progressFill = document.getElementById("progress-fill");
const questionCategory = document.getElementById("question-category");
const questionText = document.getElementById("question-text");
const answerList = document.getElementById("answer-list");
const feedback = document.getElementById("feedback");

const resultsHeading = document.getElementById("results-heading");
const scoreValue = document.getElementById("score-value");
const scoreTotal = document.getElementById("score-total");
const scorePercent = document.getElementById("score-percent");
const resultsMessage = document.getElementById("results-message");
const correctCount = document.getElementById("correct-count");
const incorrectCount = document.getElementById("incorrect-count");

// Show the real number of questions on the welcome screen
document.getElementById("stat-questions").textContent = questions.length;

// ---------- 4. FUNCTIONS ----------

// Shows one screen and hides the other two.
function showScreen(screenToShow) {
  welcomeScreen.hidden = true;
  quizScreen.hidden = true;
  resultsScreen.hidden = true;
  screenToShow.hidden = false;
}

// Starts (or restarts) the quiz from question 1.
function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  showScreen(quizScreen);
  showQuestion();
}

// Fills the quiz screen with the current question.
function showQuestion() {
  const question = questions[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;
  hasAnswered = false;

  // Text at the top of the card
  questionCounter.textContent = "Question " + questionNumber + " of " + questions.length;
  scoreLive.textContent = "Score: " + score;
  questionCategory.textContent = question.category;
  questionText.textContent = question.text;

  // Progress bar: question 3 of 10 fills 30% of the bar
  const percentDone = (questionNumber / questions.length) * 100;
  progressFill.style.width = percentDone + "%";
  progressBar.setAttribute("aria-valuenow", Math.round(percentDone));

  // Reset the feedback message and the Next button
  feedback.hidden = true;
  nextButton.disabled = true;
  if (questionNumber === questions.length) {
    nextButton.textContent = "See Results";
  } else {
    nextButton.textContent = "Next Question";
  }

  // Build the four answer buttons
  answerList.innerHTML = "";
  const letters = ["A", "B", "C", "D"];

  question.answers.forEach(function (answerText, index) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";

    const letter = document.createElement("span");
    letter.className = "answer-letter";
    letter.textContent = letters[index];

    const text = document.createElement("span");
    text.className = "answer-text";
    text.textContent = answerText;

    button.appendChild(letter);
    button.appendChild(text);

    // When this button is clicked, check the answer
    button.addEventListener("click", function () {
      selectAnswer(index);
    });

    item.appendChild(button);
    answerList.appendChild(item);
  });
}

// Runs when the student clicks an answer.
// "chosenIndex" is the position of the button they clicked.
function selectAnswer(chosenIndex) {
  // Only the first click counts: stops the student picking twice
  if (hasAnswered) {
    return;
  }
  hasAnswered = true;

  const question = questions[currentQuestionIndex];
  const buttons = answerList.querySelectorAll(".answer-button");
  const isCorrect = chosenIndex === question.correct;

  if (isCorrect) {
    score++;
  }

  // Colour every button, then lock them all
  buttons.forEach(function (button, index) {
    const letter = button.querySelector(".answer-letter");

    if (index === question.correct) {
      button.classList.add("correct");
      letter.textContent = "✓";
      addTag(button, "Correct answer");
    } else if (index === chosenIndex) {
      button.classList.add("incorrect");
      letter.textContent = "✕";
      addTag(button, "Your answer");
    } else {
      button.classList.add("dimmed");
    }

    button.disabled = true;
  });

  // Show the feedback message
  feedback.hidden = false;
  if (isCorrect) {
    feedback.className = "feedback is-correct";
    feedback.innerHTML = "<strong>Correct!</strong> " + question.explanation;
  } else {
    feedback.className = "feedback is-wrong";
    feedback.innerHTML = "<strong>Not quite.</strong> " + question.explanation;
  }

  scoreLive.textContent = "Score: " + score;
  nextButton.disabled = false;
}

// Adds a small label like "Correct answer" to the right of a button.
function addTag(button, label) {
  const tag = document.createElement("span");
  tag.className = "answer-tag";
  tag.textContent = label;
  button.appendChild(tag);
}

// Runs when the student clicks Next Question / See Results.
function goToNextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

// Works out the percentage and shows the results screen.
function showResults() {
  const total = questions.length;
  const percentage = Math.round((score / total) * 100);

  scoreValue.textContent = score;
  scoreTotal.textContent = total;
  scorePercent.textContent = percentage + "%";
  correctCount.textContent = score;
  incorrectCount.textContent = total - score;

  // Choose an encouraging message based on the percentage
  if (percentage >= 80) {
    resultsHeading.textContent = "Brilliant! You nailed it.";
    resultsMessage.textContent = "Outstanding work. You know your stuff. Why not try again and aim for a perfect score?";
  } else if (percentage >= 50) {
    resultsHeading.textContent = "Great job!";
    resultsMessage.textContent = "Solid work. A little more revision and you could hit a perfect score.";
  } else {
    resultsHeading.textContent = "Good try. Let's practise!";
    resultsMessage.textContent = "Every quiz makes you stronger. Have another go and see how much you improve.";
  }

  showScreen(resultsScreen);
}

// ---------- 5. CONNECT THE BUTTONS ----------
startButton.addEventListener("click", startQuiz);
nextButton.addEventListener("click", goToNextQuestion);
restartButton.addEventListener("click", startQuiz);

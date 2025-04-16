// Available difficulties and level configurations
const difficulties = ["easy", "medium", "hard"];
const levels = {
  1: { questions: 5, minScore: 30, type: 'boolean' },
  2: { questions: 10, minScore: 60, type: 'multiple' },
  3: { questions: 15, minScore: 90, type: '' } // Mixed question types for level 3
};

let currentLevel = 1;
let currentQuestionIndex = 0;
let score = 0;
let questions = [];

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const summaryScreen = document.getElementById('summary-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const retryBtn = document.getElementById('retry-btn');
const nextLevelBtn = document.getElementById('next-level-btn');
const difficultySelect = document.getElementById('difficulty');
const categorySelect = document.getElementById('category');
const questionText = document.getElementById('question-text');
const answersList = document.getElementById('answers-list');
const scoreDisplay = document.getElementById('score');
const levelTitle = document.getElementById('level-title');
const questionNumberDisplay = document.getElementById('question-number');
const summaryText = document.getElementById('summary-text');
const categoryText = document.getElementById('category-text')
const difficultyText = document.getElementById('difficulty-text')
// Event Listeners

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', loadNextQuestion);
retryBtn.addEventListener('click', retryLevel);
nextLevelBtn.addEventListener('click', nextLevel);

// Initialize dynamic options for difficulties and categories
document.addEventListener('DOMContentLoaded', () => {
  populateDifficulties();
  populateCategories();
});

// Populate the difficulty select options dynamically
function populateDifficulties() {
  difficultySelect.innerHTML = '';
  difficulties.forEach(diff => {
    const option = document.createElement('option');
    option.value = diff;
    option.textContent = diff.charAt(0).toUpperCase() + diff.slice(1);
    difficultySelect.appendChild(option);
  });
}

// Populate the category select options from the API (with fallback)
async function populateCategories() {
  categorySelect.innerHTML = '';
  try {
    const res = await fetch('https://opentdb.com/api_category.php');
    const data = await res.json();
    if (data.trivia_categories && data.trivia_categories.length > 0) {
      data.trivia_categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Fallback to default categories if API fails
    const defaultCategories = [
      { id: "9", name: "General Knowledge" },
      { id: "10", name: "Entertainment: Books" },
      { id: "11", name: "Entertainment: Film" }
    ];
    defaultCategories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  }
}

// Start the quiz by initializing level 1
function startQuiz() {
  currentCategory = categorySelect.options[categorySelect.selectedIndex].text;
  categoryText.innerHTML = `Category: ${currentCategory}`;
  difficultyText.innerHTML = `Difficulty: ${difficultySelect.value}`;
  currentLevel = 1;
  score = 0;
  updateScore(0);
  startScreen.classList.add('hidden');
  summaryScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  startLevel(currentLevel);
}

// Fetch questions from the Trivia API and start the selected level
async function startLevel(level) {
  currentLevel = level;
  currentQuestionIndex = 0;
  questions = [];
  levelTitle.textContent = `Level ${level}`;
  nextLevelBtn.classList.add('hidden');
  nextBtn.classList.add('hidden');
  nextBtn.disabled = true;

  const config = levels[level];
  const amount = config.questions;
  const difficulty = difficultySelect.value;
  const category = categorySelect.value;
  const typeParam = config.type ? `&type=${config.type}` : '';
  const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}${typeParam}`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      questions = data.results;
      displayQuestion();
    } else {
      throw new Error('No questions found');
    }
  } catch (error) {
    console.error('Error fetching questions:', error);
    alert('Error loading questions. Please try again.');
  }
}

// Update the question number display
function updateQuestionNumber() {
  const total = questions.length;
  questionNumberDisplay.textContent = `Question ${currentQuestionIndex + 1} / ${total}`;
}

// Display the current question and answer options
function displayQuestion() {
  answersList.innerHTML = '';
  nextBtn.classList.add('hidden');
  nextBtn.disabled = true;

  if (currentQuestionIndex >= questions.length) {
    showSummary();
    return;
  }

  const currentQ = questions[currentQuestionIndex];
  questionText.innerHTML = decodeHTML(currentQ.question);
  updateQuestionNumber();

  let answers = [];
  if (currentQ.type === 'boolean') {
    answers = ['True', 'False'];
  } else {
    answers = shuffleArray([...currentQ.incorrect_answers, currentQ.correct_answer]);
  }

  answers.forEach(answer => {
    const li = document.createElement('li');
    li.innerHTML = decodeHTML(answer);
    li.addEventListener('click', () => selectAnswer(li, currentQ.correct_answer));
    answersList.appendChild(li);
  });
}

// Handle answer selection and marking correctness
function selectAnswer(selectedEl, correctAnswer) {
  Array.from(answersList.children).forEach(li => {
    li.classList.add('disabled');
    li.style.pointerEvents = 'none';
  });

  const userAnswer = selectedEl.innerHTML;
  if (userAnswer === decodeHTML(correctAnswer)) {
    score += 10;
    updateScore(score);
    selectedEl.classList.add('correct');
  } else {
    selectedEl.classList.add('incorrect');
    Array.from(answersList.children).forEach(li => {
      if (li.innerHTML === decodeHTML(correctAnswer)) {
        li.classList.add('correct');
      }
    });
  }
  nextBtn.classList.remove('hidden');
  nextBtn.disabled = false;
}

// Load the next question in the quiz
function loadNextQuestion() {
  currentQuestionIndex++;
  displayQuestion();
}

// Display the summary screen and determine next steps
function showSummary() {
  quizScreen.classList.add('hidden');
  summaryScreen.classList.remove('hidden');

  const config = levels[currentLevel];
  let message = `You scored ${score} points. `;
  if (score >= config.minScore) {
    if (currentLevel === 3) {
      message += 'Congratulations! You have won the game! 🏆';
    } else {
      message += 'You have qualified for the next level.';
      nextLevelBtn.classList.remove('hidden');
    }
  } else {
    message += 'Sorry, you did not pass this level. Please try again.';
  }
  summaryText.textContent = message;
}

// Update the score display
function updateScore(newScore) {
  scoreDisplay.textContent = newScore;
}

// Retry the current level
function retryLevel() {
  score = 0;
  updateScore(0);
  
  // Hide summary and show quiz screen
  summaryScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');

  // Restart the current level
  startLevel(currentLevel);
}

// Advance to the next level
function nextLevel() {
  if (currentLevel < 3) {
    score = 0;
    updateScore(score);
    currentLevel++;
    quizScreen.classList.remove('hidden');
    summaryScreen.classList.add('hidden');
    startLevel(currentLevel); // Start the next level
  } else {
    alert("You've completed all levels! Congratulations!");
  }

}

// Decode HTML entities for question and answer texts
function decodeHTML(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

// Shuffle the answer array (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

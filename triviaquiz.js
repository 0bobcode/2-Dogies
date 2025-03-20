//Quiz game configuration

const levels = {
    1:{questions : 10, minScore : 70, type : "boolean"},
    2:{questions : 20, minScore : 160, type: "multiple"},
    3:{questions : 30, minScore : 270, type: ""}
}

let currentLevel = 1;
let currentQuestionIndex = 0;
let score = 0;
let questions = [];

//DOM elements
const startScreen = document.getElementById("start-screen")
const quizScreen = document.getElementById("quiz-screen")
const summaryScreen = document.getElementById("summary-screen")
const startBtn = document.getElementById("start-button")
const nextBtn = document.getElementById("next-question")
const retryBtn = document.getElementById("try-again")
const nextLevelBtn = document.getElementById("next-level-btn")
const difficultySelect = document.getElementById("difficulty")
const categorySelect = document.getElementById("categories")
const questionList = document.getElementById("question-text")
const answerList = document.getElementById("answers-list")
const levelTitle = document.getElementById("level-title")
const scoreDisplay = document.getElementById("score")
const questionNumberDisplay = document.getElementById("question-number")
const summaryText = document.getElementById("summary-text")
//Event🥇 listener
startBtn.addEventListener("click", startQuiz)
nextBtn.addEventListener("click", loadNextQuestion)
retryBtn.addEventListener("click", ()=>{
    //reset the score for this level and update the display
    score = 0;
    updateScore(score)
    //hide the summary screen and show the quiz
    summaryScreen.classList.add("hidden")
    quizScreen.classList.remove("hidden")
    //restart the same level from the beggining
    startLevel(currentLevel)
})
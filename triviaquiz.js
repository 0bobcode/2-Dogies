const categoryLookUpApi = "https://opentdb.com/api_category.php"
//difine avalible difficulties(dynamicialy added to the UI)
const difficulties = ["Easy", "Medium", "Hard"];
// const categories = 
//Quiz game configuration

const levels = {
    1: { questions: 10, minScore: 70, type: "boolean" },
    2: { questions: 20, minScore: 160, type: "multiple" },
    3: { questions: 30, minScore: 270, type: "" }
};


let currentLevel = 1;
let currentQuestionIndex = 0;
let score = 0;
let questions = [];

//DOM elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const summaryScreen = document.getElementById("summary-screen");
const startBtn = document.getElementById("start-button");
const nextBtn = document.getElementById("next-question");
const retryBtn = document.getElementById("try-again");
const nextLevelBtn = document.getElementById("next-level-btn");
const difficultySelect = document.getElementById("difficulty");

const categorySelect = document.getElementById("categories");
const questionList = document.getElementById("question-text");
const answerList = document.getElementById("answers-list");
const levelTitle = document.getElementById("level-title");
const scoreDisplay = document.getElementById("score");
const questionNumberDisplay = document.getElementById("question-number");
const summaryText = document.getElementById("summary-text");
//Event🥇 listener
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", loadNextQuestion);
retryBtn.addEventListener("click", () => {
    //reset the score for this level and update the display
    score = 0;
    updateScore(score)
    //hide the summary screen and show the quiz
    summaryScreen.classList.add("hidden")
    quizScreen.classList.remove("hidden")
    //restart the same level from the beggining
    startLevel(currentLevel)
});

nextLevelBtn.addEventListener("click", () => startLevel(currentLevel + 1))

//initilaze dynamic options for difficulties and categories when the dom is ready
document.addEventListener("DOMContentLoaded", () => {
    populateDifficulties();
    populateCategories();
})

//populate select options difficulty dynamicly
function populateDifficulties() {
    difficultySelect.innerHTML = ' ';//clear any existing options
    difficulties.forEach(difficulty => {
        const options = document.createElement("option");
        options.textContent = difficulty;
        difficultySelect.appendChild(options);

    })

}

async function populateCategories() {
    categorySelect.innerHTML = ""//clear any existing options like the dino's and the metorie
    try {
        const response = await fetch(categoryLookUpApi)
        const data = await response.json()

        if (data.trivia_categories && data.trivia_categories.length > 0) {
            data.trivia_categories.forEach(category => {
                const option = document.createElement("option")
                option.value = category.id
                option.textContent = category.name
                categorySelect.appendChild(option)
            })

        }
    }
    catch(error){
        console.error(`error fetching data ${error}`)
        //fall back to defualt categories
        const defualtCategories = [
            {id: "9", name:"General Knowledge" },
            {id: "10", name:"Books"},
            {id: "11", name:"Entertainment: Film"}

        ]

        defualtCategories.forEach(category=>{
            const option = document.createElement("option")
            option.value = defualtCategories.id
            option.textContent = defualtCategories.name
            categorySelect.appendChild(option)
        })
    }

}


//start quiz by inittiliazing level 1
function startQuiz() {
        currentLevel = 1
        score = 0
        updateScore(0)
        startScreen.classList.add("hidden")
        quizScreen.classList.remove("hidden")
        summaryScreen.classList.add("hidden")
        startLevel(currentLevel)

    }

    function loadNextQuestion() { }
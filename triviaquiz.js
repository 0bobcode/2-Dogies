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
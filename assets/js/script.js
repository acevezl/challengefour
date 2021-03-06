var questions = [
    {question: "Inside which HTML element do we put the JavaScript?", 
    answers: ["<javascript>","<home>","<script>","<header>","<meta>"],
    correctAnswer: 2,
    asked: false},
    {question: "Which of the following is correct about features of JavaScript?", 
    answers: ["JavaScript is a lightweight, interpreted programming language.","JavaScript is designed for creating network-centric applications.","JavaScript is complementary to and integrated with Java.","All of the above"],
    correctAnswer: 0,
    asked: false},
    {question: "Which built-in method removes the last element from an array and returns that element?", 
    answers: ["last()","get()","pop()","push()","None of the above"],
    correctAnswer: 2,
    asked: false},
    {question: "Which built-in method returns the string representation of the number's value?", 
    answers: ["toValue()","toNumber()","toString()","toMadre()","None of the above"],
    correctAnswer: 2,
    asked: false},
    {question: "Which of the following functions of a String object returns the characters in a string between two indexes into the string?", 
    answers: ["slice()","split()","substr()","substring()","cut()"],
    correctAnswer: 3,
    asked: false},
    {question: "Which of the following functions of a String object returns the calling string value converted to lower case?", 
    answers: ["toLocaleLowerCase()","toLowerCase()","toString()","substring()","tinyCaps()"],
    correctAnswer: 1,
    asked: false},
    {question: "Which of the following functions of a String object creates an HTML hypertext link that requests another URL?", 
    answers: ["link()","sub()","sup()","small()","url()"],
    correctAnswer: 0,
    asked: false},
    {question: "Which of the following functions of an Array object creates a new array with all of the elements of this array for which the provided filtering function returns true?", 
    answers: ["filter()","some()","every()","concat()"],
    correctAnswer: 0,
    asked: false},
    {question: "Javascript is a __________-side programing language", 
    answers: ["Left","Client","Server","Beach","Client and Server"],
    correctAnswer: 4,
    asked: false},
    {question: "If you type the following code in the console window, what result will you get? \n 3 > 2 > 1 === false;", 
    answers: ["True","False","Undefined"],
    correctAnswer: 0,
    asked: false},
    {question: "Which of the following will write the message ???Hello World!??? in an alert box?", 
    answers: ["alertBox(\"Hello World!\");","alert(Hello World!);","alert(\"Hello World!\");","None of the above", "All of the above"],
    correctAnswer: 2,
    asked: false},
    {question: "How can you get a random number between 0 and 10?", 
    answers: ["Math.Random(0,10);","Math.Random()*10;","Math.Rand(10);","Math.Random(10);"],
    correctAnswer: 1,
    asked: false},
    {question: "Which is the correct ???if??? statement to execute certain code if ???x??? is equal to 2?", 
    answers: ["if (x^2)","if (x = 2)","if (x == 2)","if (x != 2)"],
    correctAnswer: 2,
    asked: false},
    {question: "What is the value of X after the following statement? var x = (3 > 2)? 30 : 31;", 
    answers: ["3","2","30","31","True","False"],
    correctAnswer: 2,
    asked: false},
    {question: "Which of the following functions will sort this array in descending order: var numbers = [2,6,3,4,1]?", 
    answers: ["numbers.sort(function(a, b) { return a - b;});","numbers.sort(function(a, b) { return b - a;});","numbers.sort('desc')"],
    correctAnswer: 1,
    asked: false}
];

var timeLeft = 0;
var questionsLeft = 10;
var score = 0;
var questionCounter = 0;
var correctAnswers = 0;

var localStorage = window.localStorage;
var timeContainer = document.getElementById('remaining-time');
var startBtn = document.getElementById('start-game');

// Get highscores array from local storage
var highScores = localStorage.getItem('highscores') ? JSON.parse(localStorage.getItem('highscores')) : [];
highScores.sort (function (a,b) {
    return b.score - a.score;
});
// Because we sorted the array by score, the first element is the highest
var highScore = highScores.length? highScores[0].score : 0;
var highScoreEl = document.getElementById('highest-score');
highScoreEl.innerHTML = highScore;


// Adds a left zero when seconds are less than 10 - I couldn't find an easier way
var padLeftZeros = function (num) {
    if (num < 10) {
        return "0"+num;
    } else {
        return ""+num;
    }
};

var updateTimeLeft;

// Starts the game and timer
function startGame() {
    timeLeft = 60;
    questionsLeft = 10;
    score = 0;
    questionCounter = 0;
    correctAnswers = 0;
    updateTimeLeft = setInterval(function() {
        timeLeft--;
        var mins = Math.floor(timeLeft / 60);
        var secs = timeLeft % 60;
        timeContainer.textContent = mins + ":" + padLeftZeros(secs);
        if (timeLeft<=0) {
            timeContainer.textContent = "0:00";
            clearInterval(updateTimeLeft); 
            endGame('Timeout');
        }
    },1000);

    startBtn.style.display = "none";
    selectNextQuestion();
};

function selectNextQuestion() {
    // Increase question counter
    questionCounter++;

    // Clear the controls area
    var footer = document.getElementById('controls');
    footer.innerHTML = "";
    // Randomly select a number between 0 and the number of questions
    var questionNumber = Math.floor(Math.random()*questions.length);
    
    // Check if we have asked that question before, if so, get a different number until we get one we haven't asked.
    while (questions[questionNumber].asked) {
        questionNumber = Math.floor(Math.random()*questions.length);
    } // Note: We must always ask (questions.length - 1) questions otherwise we'll get on an infinite loop on which all questions are asked!
    
    var currentQuestion = questions[questionNumber];

    // Print the question
    var questionEl = document.getElementById('question');
    questionEl.innerHTML = "<h2>" + questionCounter + " : " + currentQuestion.question +"</h2>"

    var answersEl = document.getElementById('answers');
    answersEl.innerHTML = "";
    // Print the answers as buttons
    for (var i=0; i<currentQuestion.answers.length; i++) {
        var answerButton = document.createElement("button");
        answerButton.setAttribute("answer-id", i); 
        answerButton.setAttribute("question-id", questionNumber);
        answerButton.setAttribute("class","answer-button")
        answerButton.innerText = currentQuestion.answers[i];
        answerButton.addEventListener("click", validateAnswer);
        answersEl.appendChild(answerButton);
    }

    // Mark this question asked so that we don't ask it again
    questions[questionNumber].asked = true;

    // Reduce the counter of questions left
    if (!questionsLeft) {
        clearInterval(updateTimeLeft); 
        endGame('Finished Questions');
    }
    questionsLeft--;
}

function validateAnswer (event) {
    var questionNumber = event.target.getAttribute('question-id');
    var answerSelected = event.target.getAttribute('answer-id');

    if (questions[questionNumber].correctAnswer === Number.parseInt(answerSelected)) {
        score+=10;
        correctAnswers++;
        console.log(correctAnswers);
        event.target.setAttribute('class', 'answer-button correct');
        displayMessage("Correct!");
    } else {
        timeLeft-=10;
        event.target.setAttribute('class', 'answer-button incorrect');
        displayMessage("Wrong!");
    }
    var scoreEl = document.getElementById('your-score');
    scoreEl.innerHTML = score;

    // If the score is higher than the high score update it in the screen
    if (score > highScore) {
        var highScoreEl = document.getElementById('highest-score');
        highScore = score;
        highScoreEl.innerHTML = highScore;
    }
    // Remove the event listener from all answers so that users can't validate the same question over and over
    var answers = document.getElementsByClassName('answer-button');
    for (var i=0; i<answers.length; i++) {
        answers[i].removeEventListener('click',validateAnswer);
    }
    
}  

function displayMessage(message) {
    var footer = document.getElementById('controls');
    var correctMessage = document.createElement ("h3");
    correctMessage.innerHTML = message;
    var nextQuestionButton = document.createElement ("button");
    nextQuestionButton.addEventListener("click", selectNextQuestion);
    nextQuestionButton.innerHTML = "Next >"
    footer.appendChild(correctMessage);
    footer.appendChild(nextQuestionButton);
}

function endGame(reason){
    
    // If the user answered correctly all questions, add time left to score as a bonus to create a grand total 
    var bonus = 0;
    if (correctAnswers === 10) {
        bonus = timeLeft;
        score += bonus;
    }
    
    // If the grand total is higher than the high score, then update screen
    if (score > highScore) {
        var highScoreEl = document.getElementById('highest-score');
        highScoreEl.innerHTML = score;
    }
    
    // Set header message
    var endGameMessage = reason === 'Timeout'? 'Time is over!' : 'You answered all questions!';
    var questionSection = document.getElementById('question');
    questionSection.innerHTML = ""; // Clear any questions that may be in here;

    var titleHeader = document.createElement("h2");
    titleHeader.innerHTML = endGameMessage;
    questionSection.appendChild(titleHeader);
   
    // Set score on the answers area and allow user to enter their initials
    var answersSection = document.getElementById('answers');
    answersSection.innerHTML = "<p>Your Score: "+ score+"</p>" +
        "<p>Time bonus: " + bonus + "</p>" +
        "<p>Total score: " + score + "</p><hr>"+
        "<label>Enter your initials</label>";

    var initialsBox = document.createElement("input");
    initialsBox.setAttribute('maxlength','3');
    initialsBox.setAttribute('id','initials-box');

    var saveInitialsButton = document.createElement("button");
    saveInitialsButton.innerText = "Save My Score";
    saveInitialsButton.addEventListener('click',recordHighscore);

    answersSection.appendChild(initialsBox);
    answersSection.appendChild(saveInitialsButton);
    
    // Clear the controls area and add a "Try Again" button
    var footer = document.getElementById('controls');
    footer.innerHTML = "";

    var tryAgainButton = document.createElement('button');
    tryAgainButton.innerHTML = "Try Again";
    tryAgainButton.addEventListener('click',refreshPage);

    footer.appendChild(tryAgainButton);

}

function recordHighscore(event) {
    var initialsBox = event.target.previousElementSibling;
    if (initialsBox.value!='') { 
        var currentScore = {
            initials: initialsBox.value,
            score: score
        }
        // Add score to high scores
        highScores.push (currentScore);
        // Reorder high scores from highest to lowest
        highScores.sort (function (a,b) {
            return b.score - a.score;
        });
        // Keep only the top 3 elements
        highScores = highScores.slice(0,3)
        // Record high scores in local storage
        localStorage.setItem('highscores', JSON.stringify(highScores));

        // Display high scores
        showHighscores();
    } else {
        alert('Please enter your initials');
    }
}

function showHighscores() {
    var answersSection = document.getElementById('answers');
    answersSection.innerHTML = "<p><strong>Top 3 Scores</strong></p>";
    
    for (var i=0; i<highScores.length; i++) {
        var highScoreEl = document.createElement('p');
        highScoreEl.innerHTML = highScores[i].initials + " - " + highScores[i].score;
        answersSection.appendChild(highScoreEl);
    }
    
}

function refreshPage() {
    location.reload();
}

startBtn.onclick = startGame;

// Questions from https://data-flair.training/blogs/javascript-quiz/ 
// Questions from https://www.tutorialspoint.com/javascript/javascript_online_quiz.htm
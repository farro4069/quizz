console.log('Quick quiz');
let acceptingAnswers = false;
let score = 0;
let questionNumber = 0;
const maxQuestions = 10;
const gameContainer = document.querySelector('.container');
const progressBar = document.querySelector('.progress__bar-fill');
const scorePad = document.querySelector('.score');
const question = document.querySelector('.question h2');
const multiChoice = document.querySelectorAll('.answer-choice');
const multiChoiceAnswers = document.querySelectorAll('.answer-choice p');
const playAgain = document.querySelector('.start');
let allQuestions = [];
let sampleQuestion = [];



// ****************************** Functions **********************************************

function play() {
	progressBar.style.width = `${(questionNumber - 1)/maxQuestions*100}%`;
	scorePad.innerText = `Score ${score} / ${questionNumber}`;
	question.innerText = currentQuestion.question;
	multiChoiceAnswers.forEach(choice => {
		const idx = choice.parentNode.dataset['number'];
		choice.innerText = currentQuestion.possible[idx - 1];
	})
}

function guess(e) {
	if (!acceptingAnswers) {
		return;
	} else {
		if (e.target.parentNode.dataset.number == currentQuestion.answer) {
			score++;
			classToApply = 'correct';
		} else {
			classToApply = 'wrong';
		}
		e.target.parentElement.classList.add(classToApply);
		setTimeout(() => {
			e.target.parentElement.classList.remove(classToApply);
			getNewQuestion();
		}, 1000);
	}
}

function getNewQuestion() {
	if (questionNumber < sampleQuestion.length && questionNumber < maxQuestions) {
		questionNumber++;
		questionIndex = Math.floor(Math.random() * sampleQuestion.length);
		currentQuestion = sampleQuestion[questionIndex];
		sampleQuestion.splice(questionIndex, 1);
		acceptingAnswers = true;
		play();
	} else {
		endGame();
	}	
}

function startGame() {
	questionNumber = 0;
	score = 0;
	getNewQuestion();
}

function endGame() {
	progressBar.style.width = `${questionNumber/maxQuestions*100}%`;
	scorePad.innerText = `Score ${score} / ${questionNumber}`;
	acceptingAnswers = false;
	gameContainer.style.display ='none';
	playAgain.style.display = "flex";
	return;
}

function startOver() {
	gameContainer.style.display ='flex';
	playAgain.style.display = "none";
	startGame();
}

// ***************************************** Initial call **************

fetch('millionnaire.json')
	.then (response => response.json())
	.then (data => {
		allQuestions = data;
		sampleQuestion = [...allQuestions];
		startGame();
	});


// ****************** Event listeners **********************************

multiChoiceAnswers.forEach(c => c.addEventListener('click', guess));
playAgain.addEventListener('click', startOver);

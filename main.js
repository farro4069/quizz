console.log('category', document.URL.substring(57));
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
let loadedQuestions = [];
let allQuestions = [];
let sampleQuestion = [];
let formattedQuestion = [];
let currentQuestion;
let newQuestions = [];



// ****************************** Functions **********************************************

function play() {
	progressBar.style.width = `${(questionNumber - 1)/maxQuestions*100}%`;
	scorePad.innerText = `Score ${score}`;
	question.innerText = `${questionNumber}. ${currentQuestion.question}`
		.replace(/&#039;/g, "'")
		.replace(/&rsquo;/g, "'")
		.replace(/&quot;/g, "'");
	multiChoiceAnswers.forEach(choice => {
		const idx = choice.parentNode.dataset['number'];
		choice.innerText = currentQuestion.possible[idx - 1]
			.replace(/&#039;/g, '')
			.replace(/&rsquo;/g, "'")
			.replace(/&amp;/g, '&');
	})
	console.log('Correct', currentQuestion.answer);
}

function guess(e) {
	if (!acceptingAnswers) {
		return;
	} else {
		console.log(questionNumber, e.target.parentNode.dataset.number, currentQuestion.answer)
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
	if (questionNumber < allQuestions.length && questionNumber < maxQuestions) {
		questionNumber++;
		questionIndex = Math.floor(Math.random() * allQuestions.length);
		currentQuestion = allQuestions[questionIndex];
		allQuestions.splice(questionIndex, 1);
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

// category=9 (General), Science - 17 , History -23

const category = document.URL.substring(document.URL.search('cat')+4);
const endPoint = `https://opentdb.com/api.php?amount=30&category=${category}&type=multiple`

fetch(endPoint)
	.then (response => response.json())
	.then (loadedQuestions => {
		loadedQuestions.results.map(loadedQuestion => {
			const answerChoices = [ ...loadedQuestion.incorrect_answers];
			const correctAnswer = Math.floor(Math.random() * 4) + 1;
			answerChoices.splice(correctAnswer - 1, 0, loadedQuestion.correct_answer)
			newQuestions = {
				question: loadedQuestion.question, 
				possible: answerChoices,
				answer: correctAnswer
				};
			allQuestions.push(newQuestions);

		});
		startGame();
	})




// ****************** Event listeners **********************************

multiChoiceAnswers.forEach(c => c.addEventListener('click', guess));

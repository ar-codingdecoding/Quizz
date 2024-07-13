const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");

const startBtn = document.querySelector(".start");
const questionsCount = document.getElementById("questions-count");
const subject = document.getElementById("subject");
const level = document.getElementById("level");
const timePerQuestion = document.getElementById("time");
const quiz = document.querySelector(".quiz");
const startScreen = document.querySelector(".start-screen");

let questions = [];
let time = 0;
let score = 0;
let currentQuestion;
let timer;

//creating the progress timer/clock..
const progress = (value) => {
  const percent = (value / time) * 100;
  progressBar.style.width = `${percent}%`;
  progressText.innerHTML = `${value}`;
};

//creating a loading animation.. called in startQuiz function.
const loadingAnimation = () => {
  startBtn.disabled = true;
  startBtn.innerHTML = "Starting the Quiz";
  setInterval(() => {
    if (startBtn.innerHTML.length === 20) {
      startBtn.innerHTML = "Starting the Quiz";
    } else {
      startBtn.innerHTML += ".";
    }
  }, 500);
};

//creating this function to generate question and suffled options...
const showQuestion = (question) => {
  const questionText = document.querySelector(".question");
  const answersWrapper = document.querySelector(".answer-wrapper");
  const questionNumber = document.querySelector(".number");

  questionText.innerHTML = question.question;

  const answers = [
    ...question.incorrect_answers,
    question.correct_answer.toString(),
  ];
  answersWrapper.innerHTML = "";
  answers.sort(() => Math.random() - 0.5);
  answers.forEach((answer) => {
    answersWrapper.innerHTML += `
                  <div class="answer ">
            <span class="text">${answer}</span>
            <span class="checkbox">
              <i class="fas fa-check"></i>
            </span>
          </div>
        `;
  });

  questionNumber.innerHTML = ` Question <span class="current">${
    questions.indexOf(question) + 1
  }</span>
  <span class="total">/${questions.length}</span>`;

  //add event listener to each answer
  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.addEventListener("click", () => {
      if (!answer.classList.contains("checked")) {
        answersDiv.forEach((answer) => {
          answer.classList.remove("selected");
        });
        answer.classList.add("selected");
        submitBtn.disabled = false;
      }
    });
  });

  //timer starts after updating the question
  time = timePerQuestion.value;
  startTimer(time);
};

//defining the activity of startQuiz button..
const startQuiz = () => {
  const num = questionsCount.value;
  const sub = subject.value;
  const lev = level.value;
  loadingAnimation();
  const url = `https://opentdb.com/api.php?amount=${num}&subject=${sub}&level=${lev}&type=multiple`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      questions = data.results;
      setTimeout(() => {
        startScreen.classList.add("hide");
        quiz.classList.remove("hide");
        currentQuestion = 1;
        showQuestion(questions[0]);
      }, 1000);
    });
};

startBtn.addEventListener("click", startQuiz);

//function to start the timer.. called in 'showQuestion'.
const startTimer = (time) => {
  timer = setInterval(() => {
    if (time === 3) {
      playAudio("countsound.mp3");
    }
    if (time >= 0) {
      progress(time);
      time--;
    } else {
      checkAnswer();
    }
  }, 1000);
};

// ----- Working on Submit, Quit and other buttons ------

const submitBtn = document.querySelector(".submit");
const nextBtn = document.querySelector(".next");

//function to check the correctness of the answer.
const checkAnswer = () => {
  clearInterval(timer);
  const selectedAnswer = document.querySelector(".answer.selected");
  if (selectedAnswer) {
    const answer = selectedAnswer.querySelector(".text").innerHTML;

    if (answer === questions[currentQuestion - 1].correct_answer) {
      score++;
      selectedAnswer.classList.add("correct");
    } else {
      selectedAnswer.classList.add("wrong");
      document.querySelectorAll(".answer").forEach((answer) => {
        if (
          answer.querySelector(".text").innerHTML ===
          questions[currentQuestion - 1].correct_answer
        ) {
          answer.classList.add("correct");
        }
      });
    }
  } else {
    document.querySelectorAll(".answer").forEach((answer) => {
      if (
        answer.querySelector(".text").innerHTML ===
        questions[currentQuestion - 1].correct_answer
      ) {
        answer.classList.add("correct");
      }
    });
  }
  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.classList.add("checked");
  });

  submitBtn.style.display = "none";
  nextBtn.style.display = "block";
};

submitBtn.addEventListener("click", () => {
  checkAnswer();
});

nextBtn.addEventListener("click", () => {
  nextQuestion();
  submitBtn.style.display = "block";
  nextBtn.style.display = "none";
});

const nextQuestion = () => {
  if (currentQuestion < questions.length) {
    currentQuestion++;
    showQuestion(questions[currentQuestion - 1]);
  } else {
    showScore();
  }
};

const playAudio = (src) => {
  const audio = new Audio(src);
  audio.play();
};

const endScreen = document.querySelector(".end-screen");
const finalScore = document.querySelector(".final-score");
const totalScore = document.querySelector(".total-score");

const restartBtn = document.querySelector(".restart");
const quitBtn = document.querySelector(".quit");

const showScore = () => {
  endScreen.classList.remove("hide");
  quiz.classList.add("hide");
  finalScore.innerHTML = score;
  totalScore.innerHTML = `/ ${questions.length}`;
};

restartBtn.addEventListener("click", () => {
  window.location.reload();
});

quitBtn.addEventListener("click", () => {
  window.location.reload();
});

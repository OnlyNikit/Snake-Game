//!Heart system
let hearts = 3; //!initializing the hearts to 3
const heart1 = document.querySelector(".heart1");
const heart2 = document.querySelector(".heart2");
const heart3 = document.querySelector(".heart3");

function loseHeart() {
  gameOverSound.play();
  hearts--; //!decreasing the hearts by 1
  if (hearts === 2) {
    heart3.innerHTML = '<i class="fa-regular fa-heart"></i>'; //!changing the third heart to empty heart
  } else if (hearts === 1) {
    heart2.innerHTML = '<i class="fa-regular fa-heart"></i>'; //!hiding the second heart
  } else if (hearts === 0) {
    heart1.innerHTML = '<i class="fa-regular fa-heart"></i>'; //!hiding the first heart
  }
}

//!sounds
let volume = 0.2; //!initializing the volume to 0.0

const eatSound = new Audio("sounds/food.mp3");
const gameOverSound = new Audio("sounds/gameover.mp3");
const moveSound = new Audio("sounds/move.mp3");
function playMoveSound() {
  moveSound.currentTime = 0; //!resetting the sound to play from the start
  moveSound.play(); //!playing the sound
}
const bgSound = new Audio("sounds/bg.mp3");
const bgSoundVolume = 0.5;
bgSound.loop = true; //!looping the background sound

//Volume control
const volumeIcon = document.querySelector(".volume-icon");
const volumeSlider = document.querySelector("#volume");
volumeSlider.value = volume / 100; //!setting the slider value to the volume value
updateVolume(); //!updating the volume of the sounds based on the volume value
updateVolumeIcon(); //!updating the volume icon based on the volume value

volumeSlider.addEventListener("input", () => {
  volume = volumeSlider.value / 100; //!updating the volume value based on the slider value
  updateVolume(); //!updating the volume of the sounds based on the volume value
  updateVolumeIcon(); //!updating the volume icon based on the volume value
});

//!function to update the volume of the sounds based on the volume value
function updateVolume() {
  eatSound.volume = volume * 1.0;
  gameOverSound.volume = volume * 1.0;
  moveSound.volume = volume;
  bgSound.volume = volume * 0.2;
}

//!function to update the volume icon based on the volume value
function updateVolumeIcon() {
  if (volume === 0) {
    volumeIcon.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
  } else if (volume <= 0.5) {
    volumeIcon.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
  } else {
    volumeIcon.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
  }
}

const board = document.querySelector(".board");
const modal = document.querySelector(".modal");
const startButton = document.querySelector(".btn-start");
const restartButton = document.querySelector(".btn-restart");
const startGame = document.querySelector(".start-game");
const gameOver = document.querySelector(".game-over");
const scoreCard = document.querySelector("#score-card");

const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

const blockheight = 20;
const blockwidth = 20;

const cols = Math.floor(board.clientWidth / blockwidth);
const rows = Math.floor(board.clientHeight / blockheight);

let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

let intervalId = null;
let timerIntervalId = null;
let fps = 300;
let limitScore = 50;

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let time = `00:00`;
// for(let i=0;i<rows*cols;i++){
//     const block = document.createElement("div");
//     block.classList.add("block");
//     board.appendChild(block);
// }
//!intializing blocks---------------------
const blocks = [];
//!creating snake body---------------------
const snake = [
  {
    x: 16,
    y: 17,
  },
  {
    x: 16,
    y: 18,
  },
  {
    x: 16,
    y: 19,
  },
];

//!directions declarations
let currentDirection = "left";
let nextDirection = "left";

//!creating blocks
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${i}-${j}`] = block;
  }
}

//!function that render the snake and food and all function

function render() {
  // !assiging the next direction on current direction to navigate
  currentDirection = nextDirection;
  //! adding food to the board
  blocks[`${food.x}-${food.y}`].classList.add("food");

  let head = null;
  //!checking the direction of the snake and moving the head accordingly
  if (currentDirection === "left") {
    head = {
      x: snake[0].x,
      y: snake[0].y - 1, //!decreasing the y coordinate to move left
    };
  } else if (currentDirection === "right") {
    head = {
      x: snake[0].x,
      y: snake[0].y + 1, //!increasing the y coordinate to move right
    };
  } else if (currentDirection === "up") {
    head = {
      x: snake[0].x - 1, //!decreasing the x coordinate to move up
      y: snake[0].y,
    };
  } else if (currentDirection === "down") {
    head = {
      x: snake[0].x + 1, //!increasing the x coordinate to move down
      y: snake[0].y,
    };
  }

  //!checking if the snake head is on the food position
  if (head.x === food.x && head.y === food.y) {
    eatSound.currentTime = 0; //!resetting the sound to play from the start
    eatSound.play(); //!playing the sound

    blocks[`${head.x}-${head.y}`].classList.remove("food"); //!removing the food from the board

    snake.unshift(head); //!adding the new head to the snake body
    // blocks[`${head.x}-${head.y}`].classList.add("fill");
    //!adding the new head to the snake body and filling the blocks with snake body
    snake.forEach((segment) => {
      blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    });
    //!removing the head class from the previous head and adding it to the new head
    document.querySelector(".head")?.classList.remove("head");
    blocks[`${snake[0].x}-${snake[0].y}`].classList.add("head");
    //!generating new food position and adding it to the board
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    blocks[`${food.x}-${food.y}`].classList.add("food");

    //!updating the score and high score
    score += 10;
    if (score >= limitScore && fps > 50) {
      fps -= 50;
      limitScore += 50;
      clearInterval(intervalId); //!clearing the previous interval to avoid multiple intervals running at the same time
      intervalId = setInterval(render, fps); //!setting the new interval with the updated fps
    }
    scoreElement.innerText = score;
    console.log("Score:", score);
    //!updating the high score in local storage if the current score is greater than the high score
    if (highScore < score) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }
    highScoreElement.innerText = highScore;
    return; //!returning to avoid moving the snake after eating the food
  }

  // !checking if the snake head is out of bounds or colliding with itself

  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    if (hearts > 0) {
      loseHeart(); //!decreasing the hearts by 1
      if (hearts > 0) {
        //!if the player still has hearts left, reset the game
        regenerateSnake();
        return;
      }
    }

    //!if the player has no hearts left, game over
    gameOverSound.currentTime = 0;
    gameOverSound.play();
    bgSound.pause(); //!pausing the background sound
    bgSound.currentTime = 0; //!resetting the background sound to play from the start

    clearInterval(intervalId);
    clearInterval(timerIntervalId);
    modal.style.display = "flex";
    startGame.style.display = "none";
    gameOver.style.display = "flex";
    scoreCard.innerHTML = `Your score is ${score}`;

    return; //!returning to avoid moving the snake after game over
  }

  //!checking if the snake head is colliding with itself
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      if (hearts > 0) {
        loseHeart(); //!decreasing the hearts by 1
        if (hearts > 0) {
          //!if the player still has hearts left, reset the game
          regenerateSnake();
          return;
        }
      }
      //!game over
      bgSound.pause(); //!pausing the background sound
      bgSound.currentTime = 0; //!resetting the background sound to play from the start
      gameOverSound.currentTime = 0;
      gameOverSound.play();
      clearInterval(intervalId);
      clearInterval(timerIntervalId);
      modal.style.display = "flex";
      startGame.style.display = "none";
      gameOver.style.display = "flex";
      scoreCard.innerHTML = `Your score is ${score}`;
      return;
    }
  }

  //!moving the snake by adding the new head and removing the tail
  snake.unshift(head);
  const tail = snake.pop();
  blocks[`${tail.x}-${tail.y}`].classList.remove("fill");

  //!removing the head class from the previous head and adding it to the new head
  document.querySelector(".head")?.classList.remove("head");
  blocks[`${snake[0].x}-${snake[0].y}`].classList.add("head");

  //!adding the new head to the snake body and filling the blocks with snake body
  const headBlock = blocks[`${snake[0].x}-${snake[0].y}`];
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.add("fill");
  });
}

//!starting the game on clicking the start button
startButton.addEventListener("click", () => {
  modal.style.display = "none";
  updateVolume(); //!updating the volume of the sounds based on the volume value
  bgSound.currentTime = 0; //!resetting the sound to play from the start
  bgSound.play();

  //!checking if the food is on the snake body and generating new food position if it is
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === food.x && snake[i].y === food.y) {
      food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols),
      };
    }
  }
  //!starting the game by calling the render function every fps milliseconds
  resetGame(); //!resetting the game variables
  fps = 300;
  intervalId = setInterval(() => {
    render();
  }, fps);

  startTimer(); //!starting the timer
});

//!function to start the timer and update the time element every second
function startTimer() {
  clearInterval(timerIntervalId); //!clearing the previous timer interval to avoid multiple intervals running at the same time

  //!updating the time element every second
  timerIntervalId = setInterval(() => {
    let [min, sec] = time.split(":").map(Number); //!splitting the time string into minutes and seconds and converting them to numbers

    //!incrementing the seconds and minutes accordingly
    if (sec === 59) {
      min += 1;
      sec = 0;
    } else {
      sec += 1;
    }

    //!updating the time string and the time element with the new time
    time = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`; //!padding the minutes and seconds with leading zeros if they are less than 10
    timeElement.innerText = time;
  }, 1000);
}

//!restarting the game on clicking the restart button
restartButton.addEventListener("click", () => {
  hearts = 3; //!resetting the hearts to 3
  heart1.style.innerHTML = '<i class="fa-solid fa-heart"></i>'; //!showing the first heart
  heart2.style.innerHTML = '<i class="fa-solid fa-heart"></i>'; //!showing the second heart
  heart3.style.innerHTML = '<i class="fa-solid fa-heart"></i>'; //!showing the third heart

  updateVolume(); //!updating the volume of the sounds based on the volume value
  bgSound.currentTime = 0; //!resetting the sound to play from the start
  bgSound.play();

  modal.style.display = "none";
  clearInterval(intervalId);

  // !clearing the snake and food blocks
  Object.values(blocks).forEach((block) => {
    block.classList.remove("fill");
    block.classList.remove("food");
  });

  //!checking if the food is on the snake body and generating new food position if it is
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === food.x && snake[i].y === food.y) {
      food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols),
      };
    }
  }
  resetGame();

  fps = 300;
  intervalId = setInterval(() => {
    render();
  }, fps);
  startTimer();
});

//!function to reset the game variables and update the score and time elements

function resetGame() {
  snake.length = 0;
  snake.push({ x: 16, y: 17 }, { x: 16, y: 18 }, { x: 16, y: 19 });
  currentdirection = "left";
  nextDirection = "left";
  score = 0;
  scoreElement.innerText = score;
  clearInterval(timerIntervalId);
  time = "00:00";
  timeElement.innerText = time;

  heart1.innerHTML = '<i class="fa-solid fa-heart"></i>'; //!showing the first heart
  heart2.innerHTML = '<i class="fa-solid fa-heart"></i>'; //!showing the second heart
  heart3.innerHTML = '<i class="fa-solid fa-heart"></i>'; //!showing the third heart
}

function regenerateSnake() {
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });
  snake.length = 0;
  snake.push({ x: 16, y: 17 }, { x: 16, y: 18 }, { x: 16, y: 19 });
  currentDirection = "left";
  nextDirection = "left";
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.add("fill");
  });
  document.querySelector(".head")?.classList.remove("head");
  blocks[`${snake[0].x}-${snake[0].y}`].classList.add("head");
}

//!listening for arrow key presses to change the snake's direction
addEventListener("keydown", (e) => {
  console.log(e.key);

  if (
    e.key === "ArrowLeft" &&
    currentDirection !== "right" &&
    nextDirection !== "right" &&
    nextDirection !== "left"
  ) {
    playMoveSound(); //!playing the move sound
    nextDirection = "left";
  } else if (
    e.key === "ArrowRight" &&
    currentDirection !== "left" &&
    nextDirection !== "left" &&
    nextDirection !== "right"
  ) {
    playMoveSound(); //!playing the move sound
    nextDirection = "right";
  } else if (
    e.key === "ArrowUp" &&
    currentDirection !== "down" &&
    nextDirection !== "down" &&
    nextDirection !== "up"
  ) {
    playMoveSound(); //!playing the move sound
    nextDirection = "up";
  } else if (
    e.key === "ArrowDown" &&
    currentDirection !== "up" &&
    nextDirection !== "up" &&
    nextDirection !== "down"
  ) {
    playMoveSound(); //!playing the move sound
    nextDirection = "down";
  }
});

//!pause system

let isPaused = false;
const pauseBtn = document.querySelector(".pause");
const pauseIcon = document.querySelector(".pauseIcon");

function pausedGame() {
  isPaused = true;
  clearInterval(intervalId);
  clearInterval(timerIntervalId);
  pauseIcon.innerHTML='<i class="fa-solid fa-play"></i>';

  bgSound.pause();
}

function resumeGame() {
  isPaused = false;
  intervalId = setInterval(render, fps);
  startTimer();
  bgSound.play();
  pauseIcon.innerHTML='<i class="fa-solid fa-pause"></i>';
}


pauseBtn.addEventListener("click", () => {
  if (isPaused) {
    resumeGame();
   
  } else {
    pausedGame();
    
  }
});

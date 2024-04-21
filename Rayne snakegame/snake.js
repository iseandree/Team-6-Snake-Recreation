// DOM element references
const modalEl = document.querySelector('#modalEl'); // Reference to the game over modal
const modalScoreEl = document.querySelector('#modalScoreEl'); // Reference to display the final score in the modal
const buttonEl = document.querySelector('#buttonEl'); // Reference to the button to reset the game
const modalHighScoreEl = document.querySelector('#modalHighScoreEl'); // Reference to display the high score in the modal
const startButtonEl = document.querySelector('#startButtonEl'); // Reference to the button to start the game
const startModalEl = document.querySelector('#startModalEl'); // Reference to the start game modal

// Board and game variables
var blockSize = 25; // Size of each block on the game board
var rows = 15; // Number of rows on the game board
var cols = 10; // Number of columns on the game board
var board; // Reference to the canvas element
var context; // Reference to the 2D context of the canvas

// Snake variables
var snakeX = blockSize * 5; // Initial X position of the snake head
var snakeY = blockSize * 5; // Initial Y position of the snake head
var velocityX = 0; // Initial velocity of the snake in the X direction
var velocityY = 0; // Initial velocity of the snake in the Y direction
var snakeBody = []; // Array to store the positions of the snake's body segments

// Food variables
var foodX; // X position of the food
var foodY; // Y position of the food

// Game state variables
var gameOver = false; // Flag to indicate if the game is over
var score = 0; // Current score
var highScore = 0; // Highest score achieved

// Function called when the window is loaded
window.onload = function() {

    // Get references to the canvas and its 2D context
    board = document.getElementById("board")
    context = board.getContext("2d"); 
    adjustBoardSize();

    // Initialize the game board and set up event listeners
    initializeGame();

    // Adjust board size when the window is resized
    window.addEventListener('resize', adjustBoardSize);//used for drawing on the board
    document.addEventListener("keyup", changeDirection);
    board.addEventListener("touchstart", handleTouchStart);
    board.addEventListener("touchmove", handleTouchMove);
}

// Function to initialize the game board and set up event listeners
function initializeGame() {

    // Set initial board size and adjust it based on window dimensions
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    adjustBoardSize();
    
    // Set up initial game state
    placeFood();
    
    // Set up event listeners for user input
    document.addEventListener("keyup", changeDirection);
    board.addEventListener("touchstart", handleTouchStart);
    board.addEventListener("touchmove", handleTouchMove);
}

// Function called to update the game state and render the game
function update() {

    // Check if the game is over
    if (gameOver) {
        return;
    }

    // Background of a Game
    context.fillStyle="black";
    context.fillRect(0, 0, board.width, board.height);

    // Set food color and position
    context.fillStyle=foodColorPicker.value;
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX == foodX && snakeY == foodY){
        snakeBody.push([foodX, foodY]);
        placeFood();
        score += 10; // Increase score by 10 when the snake eats food
        updateScoreDisplay(); // Update the displayed score
        if (score > highScore) {
            highScore = score;
            updateHighScoreDisplay();
        }
    }    

   // Loop to update the positions of the snake's body segments
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1]; // Move each segment one step forward
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }
    
    context.fillStyle=snakeColorPicker.value;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;

    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    //game over conditions
    if (snakeX < 0 || snakeX >= cols*blockSize || snakeY < 0 || snakeY >= rows*blockSize){
        gameOver = true;
        setTimeout(endGame, 100);
    }

    for (let i = 0; i < snakeBody.length; i++){
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]){
            gameOver = true;
            setTimeout(endGame, 100);
        }
    }
}


function changeDirection(e) {
    if(e.code == "ArrowUp" && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
    }
    else if(e.code == "ArrowDown" && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    }
    else if(e.code == "ArrowLeft" && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    }
    if(e.code == "ArrowRight" && velocityX != -1){
        velocityX = 1;
        velocityY = 0;
    }
}
function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    var touchEndX = event.touches[0].clientX;
    var touchEndY = event.touches[0].clientY;

    var dx = touchEndX - touchStartX;
    var dy = touchEndY - touchStartY;

    // Determine swipe direction
    if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 0 && velocityX != -1) {
            velocityX = 1;
            velocityY = 0;
        } else if (dx < 0 && velocityX != 1) {
            velocityX = -1;
            velocityY = 0;
        }
    } else {
        // Vertical swipe
        if (dy > 0 && velocityY != -1) {
            velocityX = 0;
            velocityY = 1;
        } else if (dy < 0 && velocityY != 1) {
            velocityX = 0;
            velocityY = -1;
        }
    }
}

function placeFood() {
    //0-1) * cols -> (0-19.9999) -> (0-19) * 15
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

// Function to adjust the size of the game board based on the window dimensions
function adjustBoardSize() {
    var maxWidth = window.innerWidth;
    var maxHeight = window.innerHeight;
    
    // Calculate optimal number of rows and columns based on device dimensions
    cols = Math.floor(maxWidth / blockSize);
    rows = Math.floor(maxHeight / blockSize);
    
    // Update canvas size
    board.width = cols * blockSize;
    board.height = rows * blockSize;
}
function updateScoreDisplay() {
    document.getElementById("scoreDisplay").innerText = "Score: " + score;
}
function updateHighScoreDisplay() {
    document.getElementById("highScoreDisplay").innerText = "High Score: " + highScore;
}
function endGame(){
    modalEl.style.display = 'block';
    modalScoreEl.innerHTML = score;
    modalHighScoreEl.innerHTML = highScore;
}
function startGame() {
    context.fillStyle = snakeColorPicker.value;
    context.fillStyle = foodColorPicker.value;

    // Update colors when user selects new colors
    snakeColorPicker.addEventListener('input', function() {
        context.fillStyle = this.value;
        context.strokeStyle = this.value;
    });

    foodColorPicker.addEventListener('input', function() {
        context.fillStyle = this.value;
    });
    setInterval(update, 1000/10); //100 milliseconds

}

function resetGame() {
    // Reset snake position and velocity
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 0;
    velocityY = 0;

    // Clear snake body
    snakeBody = [];

    // Reset food position
    placeFood();

    // Reset game over status and score
    gameOver = false;
    score = 0;

    // Update score display
    updateScoreDisplay();
}

buttonEl.addEventListener('click',() => {
   resetGame();
   modalEl.style.display = 'none';
})

startButtonEl.addEventListener('click',() => {
    startGame();
    startModalEl.style.display = 'none';
 })

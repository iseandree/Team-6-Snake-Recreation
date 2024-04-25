//#region DOM element references

// DOM element references
const modalEl = document.querySelector('#modalEl'); // Reference to the game over modal
const modalScoreEl = document.querySelector('#modalScoreEl'); // Reference to display the final score in the modal
const buttonEl = document.querySelector('#buttonEl'); // Reference to the button to reset the game
const modalHighScoreEl = document.querySelector('#modalHighScoreEl'); // Reference to display the high score in the modal
const startButtonEl = document.querySelector('#startButtonEl'); // Reference to the button to start the game
const startModalEl = document.querySelector('#startModalEl'); // Reference to the start game modal

//#endregion

//#region Gameplay Variables

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

// Power up variables
var powerX;
var powerY;
var powerUpOnBoard = false;
var goodPower = true;
var shrink = false;
var grow = false;
var double = false;
var half = false;
var invincible = false;
var invincibleFoodCount = 0;
var badFoodCount = 0;

// Game state variables
var gameOver = false; // Flag to indicate if the game is over
var initialPlay = true;
var score = 0; // Current score
var highScore = 0; // Highest score achieved

//#endregion

//#region Place Food and Powerups

// Function to place food on the board
function placeFood() {
    // Randomly place the food on the board
    foodX = Math.floor(Math.random() * cols) * blockSize; //(0-1) * cols -> (0-19.9999) -> (0-19) * 15
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

// Function to place powerups on the board
function placePowerUp() {
    // If there is no powerup on the board, randomly place one
    if (powerUpOnBoard == false) {
        chance = Math.floor(Math.random() * 10)
        powerX = Math.floor(Math.random() * cols) * blockSize;
        powerY = Math.floor(Math.random() * cols) * blockSize;

        if (chance == 1){    
            shrink = true;
            powerUpOnBoard = true;
            goodPower = true;
            var img = document.createElement("img");
            img.src = 'Shrink.png';
            context.drawImage(img, powerX, powerY, blockSize, blockSize);
        }
        else if (chance == 2){
            grow = true;
            powerUpOnBoard = true;
            goodPower = false;
            var img = document.createElement("img");
            img.src = 'Grow.png';
            context.drawImage(img, powerX, powerY, blockSize, blockSize);
        }
        else if (chance == 3){
            double = true;
            powerUpOnBoard = true;
            goodPower = true;
            var img = document.createElement("img");
            img.src = 'Double.png';
            context.drawImage(img, powerX, powerY, blockSize, blockSize);
        }
        else if (chance == 4){
            half = true;
            powerUpOnBoard = true;
            goodPower = false;
            var img = document.createElement("img");
            img.src = 'Half.png';
            context.drawImage(img, powerX, powerY, blockSize, blockSize);
        }
         else if (chance == 5){
            invincible = true;
            powerUpOnBoard = true;
            goodPower = true;
            var img = document.createElement("img");
            img.src = 'Invincible.png';
            context.drawImage(img, powerX, powerY, blockSize, blockSize);
        }
    }
}

// Function to draw powerups on the board
function drawPowerUps(){
    // Draw powerup on the board
    if (shrink == true){
        var img = document.createElement("img");
        img.src = 'Shrink.png';
        context.drawImage(img, powerX, powerY, blockSize, blockSize);
    }
    else if (grow == true){
        var img = document.createElement("img");
        img.src = 'Grow.png';
        context.drawImage(img, powerX, powerY, blockSize, blockSize);
    }
    else if (double == true){
        var img = document.createElement("img");
        img.src = 'Double.png';
        context.drawImage(img, powerX, powerY, blockSize, blockSize);
    }
    else if (half == true){
        var img = document.createElement("img");
        img.src = 'Half.png';
        context.drawImage(img, powerX, powerY, blockSize, blockSize);
    }
    else if (invincible == true){
        var img = document.createElement("img");
        img.src = 'Invincible.png';
        context.drawImage(img, powerX, powerY, blockSize, blockSize);
    }
}

//#endregion

//#region Adjust Board Size 

// Function to adjust the size of the game board based on the window dimensions
function adjustBoardSize() {
    // Get the dimensions of the window
    var maxWidth = window.innerWidth;
    var maxHeight = window.innerHeight;
    
    // Calculate optimal number of rows and columns based on device dimensions
    cols = Math.floor(maxWidth / blockSize);
    rows = Math.floor(maxHeight / blockSize);
    
    // Update canvas size
    board.width = cols * blockSize;
    board.height = rows * blockSize;
}

//#endregion

//#region Game UI Updates

// Function to update the score display
function updateScoreDisplay() {
    // Update the score display
    document.getElementById("scoreDisplay").innerText = "Score: " + score;
}

// Function to update the high score display
function updateHighScoreDisplay() {
    // Update the high score display
    document.getElementById("highScoreDisplay").innerText = "High Score: " + highScore;
}


//#endregion

//#region Gameplay Functions

// Function to start the game
function startGame() {
    // Set up initial game state with user generated colors
    context.fillStyle = snakeColorPicker.value;
    context.fillStyle = foodColorPicker.value;
    context.fillStyle = backgroundColorPicker.value;

    // Update colors when user selects new colors
    snakeColorPicker.addEventListener('input', function() {
        context.fillStyle = this.value;
        context.strokeStyle = this.value;
    });

    foodColorPicker.addEventListener('input', function() {
        context.fillStyle = this.value;
    });
    
    backgroundColorPicker.addEventListener('input', function() {
        context.fillStyle = this.value;
        context.strokeStyle = this.value;
    });
    // Start the game loop
    setInterval(update, 1000/10); //100 milliseconds

}
// Function to end the game and display the game over modal
function endGame(){
    // Display the game over modal
    modalEl.style.display = 'block';
    modalScoreEl.innerHTML = score;
    modalHighScoreEl.innerHTML = highScore;
}

// Function to reset the game
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
    initialPlay = false;
    gameOver = false;
    score = 0;

    // Update score display
    updateScoreDisplay();
}

// Event listeners for the reset button
buttonEl.addEventListener('click',() => {
   resetGame();
   modalEl.style.display = 'none';
})
// Event listeners for the start button
startButtonEl.addEventListener('click',() => {
    startGame();
    startModalEl.style.display = 'none';
 })

// Function called to update the game state and render the game
function update() {
    // Check if the game is over
    if (gameOver) {
        return;
    }

    if (initialPlay) {
        // Background of a Game
        context.fillStyle=backgroundColorPicker.value;
        context.fillRect(0, 0, board.width, board.height);

        // Set food color and position
        context.fillStyle=foodColorPicker.value;
        context.fillRect(foodX, foodY, blockSize, blockSize);

        context.fillStyle=snakeColorPicker.value;
        context.fillRect(snakeX, snakeY, blockSize, blockSize);

        drawPowerUps();
    }
    else {
        // Background of a Game
        context.fillStyle=backgroundColorPickerEnd.value;
        context.fillRect(0, 0, board.width, board.height);

        // Set food color and position
        context.fillStyle=foodColorPickerEnd.value;
        context.fillRect(foodX, foodY, blockSize, blockSize);
        
        // Set snake color and position
        context.fillStyle=snakeColorPickerEnd.value;
        context.fillRect(snakeX, snakeY, blockSize, blockSize);

        drawPowerUps();
    }

    // Check if the snake has eaten the food and if it is has Powerup
    if (snakeX == foodX && snakeY == foodY){
        if (invincible == true) {
            invincibleFoodCount++;
            if (invincibleFoodCount == 5){
                invincibleFoodCount = 0;
                invincible = false;
                powerUpOnBoard = false;
            }
        }
        if (goodPower == false){
            badFoodCount++;
            if (badFoodCount == 3){
                badFoodCount = 0;
                powerUpOnBoard = false;
                grow = false;
                half = false;
                context.fillStyle=backgroundColorPickerEnd.value;
                context.fillRect(powerX, powerY, blockSize, blockSize);
                powerX = -10000; powerY = -10000;
            }
        }
        snakeBody.push([foodX, foodY]);
        placeFood();
        placePowerUp();
        score += 10; // Increase score by 10 when the snake eats food
        updateScoreDisplay(); // Update the displayed score
        if (score > highScore) {
            highScore = score;
            updateHighScoreDisplay();
        }
    }    

    // Check if the snake has eaten the powerup
    if (snakeX == powerX && snakeY == powerY){
        if (shrink == true){
            snakeBody.pop();
            snakeBody.pop();
            snakeBody.pop();
            powerUpOnBoard = false;
            shrink = false;
            context.fillStyle=backgroundColorPickerEnd.value;
            context.fillRect(powerX, powerY, blockSize, blockSize);
            powerX = -10000; powerY = -10000;
        }
        else if (grow == true){
            snakeBody.push([powerX, powerY]);
            snakeBody.push([powerX, powerY]);
            snakeBody.push([powerX, powerY]);
            powerUpOnBoard = false;
            grow = false;
            context.fillStyle=backgroundColorPickerEnd.value;
            context.fillRect(powerX, powerY, blockSize, blockSize);
            powerX = -10000; powerY = -10000;
        }
        else if (double == true) {
            score = score*2;
            updateScoreDisplay();
            powerUpOnBoard = false;
            double = false;
            context.fillStyle=backgroundColorPickerEnd.value;
            context.fillRect(powerX, powerY, blockSize, blockSize);
            powerX = -10000; powerY = -10000;
        }
        else if (half == true) {
            score = score/2;
            updateScoreDisplay();
            powerUpOnBoard = false;
            half = false;
            context.fillStyle=backgroundColorPickerEnd.value;
            context.fillRect(powerX, powerY, blockSize, blockSize);
            powerX = -10000; powerY = -10000;
        }
        else if (invincible == true) {
            context.fillStyle=backgroundColorPickerEnd.value;
            context.fillRect(powerX, powerY, blockSize, blockSize);
            powerX = -10000; powerY = -10000;
        }
    }        

    // Loop to update the positions of the snake's body segments
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1]; // Move each segment one step forward
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }
    
    // Update the position of the snake's head based on the velocity
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;

    // Draw the snake's body segments
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    // Game over conditions
    if (snakeX < 0 || snakeX >= cols*blockSize || snakeY < 0 || snakeY >= rows*blockSize){
        gameOver = true;
        setTimeout(endGame, 100);
    }
    // Check if the snake has collided with itself
    if (invincible != true){
        for (let i = 0; i < snakeBody.length; i++){
            if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]){
                gameOver = true;
                setTimeout(endGame, 100);
            }
        }
    }
}

// Function to change the direction of the snake based on user input Arrows and Swipes
function changeDirection(e) {
    // Change the direction of the snake based on the key pressed or direction swiped
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

//#endregion

//#region Swipe Control Functions

// Function to handle touch start event
function handleTouchStart(event) {
    // Get the starting touch position
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

// Function to handle touch move event
function handleTouchMove(event) {
    // Get the ending touch position
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

//#endregion

//#region Window.OnLoad and Game Initialization
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
    // Set up initial game state
    placeFood();
    
    // Set up event listeners for user input
    document.addEventListener("keyup", changeDirection);
    board.addEventListener("touchstart", handleTouchStart);
    board.addEventListener("touchmove", handleTouchMove);
}

//#endregion
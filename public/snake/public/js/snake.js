(function(){ // IIFE wrapper
    
    'use strict';

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++ GLOBAL VARIABLES ++++++++++++++++++++++++++++++++++++++++++++++++++++

    // +++++++++++ Canvas Variables

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var canvasColor = "rgb(125,125,255)";
    var canvasHeight = document.getElementById("canvas").getAttribute("height");
    var canvasWidth = document.getElementById("canvas").getAttribute("width");
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    
    // +++++++++++ General Variables

    var game = true;
    var startMessage = document.getElementById("startMessage");
    var speed = 10; // speed of intervalTimer running game
    var intervalId;
    var intervalArray = [];
    var roundCounter = document.getElementById("roundCounter");

    // +++++++++++ Snake Variables

    var x = 0; // snake position on x axis
    var y = 0; // snake position on y axis
    var snakeColor = "lime";
    var currentDirection = 'right';
    var snakeHeight = 40;
    var snakeWidth = 40;
    var creepDistance = 1;
    
    // End-of-Snake Eraser Variables
    var snakeEndDistance = 100;
    var posEndX = 0;
    var posEndY = 0;
    var currentEndDirection = 'right';
    var iterator = 1;
    var snakePositionHistory = [];
    var endSnakeData;

    // +++++++++++ Food Variables
    
    var foodObject = {};
    var foodArray = [];
    var radius = 5; // radius of food item
    var numberOfFoodItems = 5;
    var foodEaten = 0;


    // ++++++++++++++++++++++++++++++++++++++++++++++++++++ SNAKE FRONT FUNCTIONS ++++++++++++++++++++++++++++++++++++++++++++++++++++

    // Renders snake head
    function fillIt() {
        ctx.fillRect(x, y, snakeWidth, snakeHeight);
    } 

    // Animates snake eyes based on snake orientation
    function fillEyes(direction) {
        switch(direction) {
            case 'up':
                // left eye
                ctx.fillStyle = "black";
                ctx.fillRect((x + snakeWidth * .35), (y + snakeWidth * .25), (snakeWidth * .05), (snakeWidth * .05));
                // right eye
                ctx.fillStyle = "black";
                ctx.fillRect(((x + snakeWidth * .65)), (y + snakeWidth * .25), (snakeWidth * .05), (snakeWidth * .05));
                break;

            case 'down':
                // left eye
                ctx.fillStyle = "black";
                ctx.fillRect(((x + snakeWidth * .65)), (y + snakeWidth * .75), (snakeWidth * .05), (snakeWidth * .05));
                // right eye
                ctx.fillStyle = "black";
                ctx.fillRect((x + snakeWidth * .35), (y + snakeWidth * .75), (snakeWidth * .05), (snakeWidth * .05));
                break;

            case 'left':
                // left eye
                ctx.fillStyle = "black";
                ctx.fillRect((x + snakeWidth * .25), (y + snakeWidth * .35), (snakeWidth * .05), (snakeWidth * .05));
                // right eye
                ctx.fillStyle = "black";
                ctx.fillRect((x + snakeWidth * .25), (y + snakeWidth * .65) , (snakeWidth * .05), (snakeWidth * .05));
                break;

            case 'right':
                // left eye
                ctx.fillStyle = "black";
                ctx.fillRect((x + snakeWidth * .75), (y + snakeWidth * .35), (snakeWidth * .05), (snakeWidth * .05));
                // right eye
                ctx.fillStyle = "black";
                ctx.fillRect((x + snakeWidth * .75), (y + snakeWidth * .65) , (snakeWidth * .05), (snakeWidth * .05)); 
                break;
        }
    }

    // Triggers stopGame() if snake face breaches a pixel = to the snake color
    function detectSnakeCollision(direction) {
        switch(direction) {
            case 'up':
                var snakeFace = ctx.getImageData(x, y - 1, snakeWidth, 1);
                for (var i = 1; i < snakeFace.data.length; i += 4) {
                    if (snakeFace.data[i] == 255) {
                        stopGame();
                        return null;
                    }
                }
                break;

            case 'down':
                var snakeFace = ctx.getImageData(x, y + 40, snakeWidth, 1);
                for (var i = 1; i < snakeFace.data.length; i += 4) {
                    if (snakeFace.data[i] == 255) {
                        stopGame();
                        return null;
                    }
                }
                break;

            case 'left':
                var snakeFace = ctx.getImageData(x - 1, y, 1, snakeHeight);
                for (var i = 1; i < snakeFace.data.length; i += 4) {
                    if (snakeFace.data[i] == 255) {
                        stopGame();
                        return null;
                    }
                }
                break;

            case 'right':
                var snakeFace = ctx.getImageData(x + 40, y, 1, snakeHeight);
                for (var i = 1; i < snakeFace.data.length; i += 4) {
                    if (snakeFace.data[i] == 255) {
                        stopGame();
                        return null;
                    }
                }
                break;
        }
    }

    // Animates snake movement on canvas and ends game if snake touches canvas border
    var direction = {
        up : function() {
                if (y > 0) {
                    detectSnakeCollision('up');
                    y -= creepDistance;
                    ctx.fillStyle = snakeColor;
                    fillIt();
                    fillEyes('up');
                } else {
                    stopGame();
                }    
            },
        down : function() {
                if (y < canvasHeight - snakeWidth) {
                    detectSnakeCollision('down');
                    y += creepDistance;
                    ctx.fillStyle = snakeColor;
                    fillIt();
                    fillEyes('down');
                } else {
                    stopGame();
                }    
            },
        left : function() {

                if (x > 0) {
                    detectSnakeCollision('left');
                    x -= creepDistance;
                    ctx.fillStyle = snakeColor;
                    fillIt();
                    fillEyes('left');
                } else {
                    stopGame();
                }    
            },
        right : function() {
                if (x < canvasWidth - snakeWidth) {
                    detectSnakeCollision('right');
                    x += creepDistance;
                    ctx.fillStyle = snakeColor;
                    fillIt();
                    fillEyes('right');
                } else {
                    stopGame();
                }    
            }
    }


    // ++++++++++++++++++++++++++++++++++++++++++++++++++++ SNAKE END FUNCTIONS ++++++++++++++++++++++++++++++++++++++++++++++++++++

    // +++++++++++ Functions to animate a two-pixel line of canvas color equal to snake width to control snake length

    function fillEndUp(color = canvasColor) {
        ctx.beginPath();
        ctx.moveTo(posEndX + 40, posEndY + 40);
        ctx.lineWidth = 2;
        ctx.lineTo(posEndX, posEndY + 40);
        ctx.strokeStyle = color;
        ctx.stroke();
    } 

    function fillEndDown(color = canvasColor) {
        ctx.beginPath();
        ctx.moveTo(posEndX, posEndY + 1);
        ctx.lineWidth = 2;
        ctx.lineTo(posEndX + 40, posEndY + 1);
        ctx.strokeStyle = color;
        ctx.stroke();
    } 

    function fillEndLeft(color = canvasColor) {
        ctx.beginPath();
        ctx.moveTo(posEndX + 39, posEndY + 40);
        ctx.lineWidth = 2;
        ctx.lineTo(posEndX + 39, posEndY);
        ctx.strokeStyle = color;
        ctx.stroke();
    } 

    function fillEndRight(color = canvasColor) {
        ctx.beginPath();
        ctx.moveTo(posEndX + 1, posEndY);
        ctx.lineWidth = 2;
        ctx.lineTo(posEndX + 1, posEndY + 40);
        ctx.strokeStyle = color;
        ctx.stroke();
    } 

    // +++++++++++ Stores position and direction information for snake end

    var endDirection = {
        up : function(positionX, positionY) {
                if (posEndY > 0) {
                    posEndX = positionX;
                    posEndY = positionY;
                    fillEndUp();
                    // fillEyes('up');
                }    
            },
        down : function(positionX, positionY) {
                if (posEndY < canvasHeight - snakeWidth) {
                    posEndX = positionX;
                    posEndY = positionY;
                    fillEndDown();
                    // fillEyes('down');
                }    
            },
        left : function(positionX, positionY) {
                if (posEndX > 0) {
                    posEndX = positionX;
                    posEndY = positionY;
                    fillEndLeft();
                    // fillEyes('left');
                }    
            },
        right : function(positionX, positionY) {
                if (posEndX < canvasWidth - snakeWidth) {
                    posEndX = positionX;
                    posEndY = positionY;
                    fillEndRight();
                    // fillEyes('right');
                }    
            }
    }

    // Creates object containing all placement inforamtion needed to pass to the snake end to imitate the snake front

    function createContext() {
        var timeInfo = {};
        timeInfo.xPlace = x;
        timeInfo.yPlace = y;
        timeInfo.direction = currentDirection;
        return timeInfo;
    }


    // ++++++++++++++++++++++++++++++++++++++++++++++++++++ FOOD ITEM FUNCTIONS ++++++++++++++++++++++++++++++++++++++++++++++++++++

    // Generates a random X coordinate for food item
    function randomX() {
        var randomNumber = Math.floor(Math.random() * 490);
        var randomPlusMinus = Math.floor(Math.random() * 2);
        if (randomPlusMinus == 1) {
            return randomNumber;
        } else {
            return randomNumber * -1;
        }
    }

    // Generates a random Y coordinate for food item
    function randomY() {
        var randomNumber = Math.floor(Math.random() * 285);
        var randomPlusMinus = Math.floor(Math.random() * 2);
        if (randomPlusMinus == 1) {
            return randomNumber;
        } else {
            return randomNumber * -1;
        }
    }

    // Re-renders all uneaten food to prevent partially erased food 
    function refillAllUneatenFood() {
        for (var i = 0; i < foodArray.length; i++) {
            if (foodArray[i].eaten == false) {
                fillFood('red', '#003300', foodArray[i].randomCoordinateX, foodArray[i].randomCoordinateY);
            }
        }
    }

    // Renders a specific food item
    function fillFood(color1 = 'red', color2 = '#003300', xCoordinate = randomX(), yCoordinate = randomY()) {
        
        // Prevents fruit from being placed on the current snake position
        var possibleFruitPlacementPosition = ctx.getImageData(xCoordinate, yCoordinate, 12, 12);
        for (var i = 1; i < possibleFruitPlacementPosition.data.length; i += 4) {
            if (possibleFruitPlacementPosition.data[i] == 255) {
                fillFood();
            }
        }
        
        var foodItemDataObject = {};
        foodItemDataObject.randomCoordinateX = xCoordinate;
        foodItemDataObject.randomCoordinateY = yCoordinate;
        foodItemDataObject.eaten = false;
        ctx.beginPath();
        ctx.arc(centerX + foodItemDataObject.randomCoordinateX, centerY + foodItemDataObject.randomCoordinateY, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color1;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = color2;
        ctx.stroke();
        return foodItemDataObject;
    }

    // Completely erases food item
    function fillOverFood(color, xCoordinate, yCoordinate) {
        ctx.fillStyle = color;
        ctx.fillRect(xCoordinate, yCoordinate, 12, 12);
    }

    // Fills an array containing foodItemDataObjects
    function generateFood() {
        foodArray = [];
        for (var i = 0; i < numberOfFoodItems; i++) {
            foodArray.push(fillFood());
        }
    }

    // Checks if snake breaches food item hit box then erases the food item
    function eatFood() {
        foodArray.forEach(function(element, index, array) {
            // Hit boxes for food
            switch(currentDirection) {
                case 'up':
                    // Conditionally checking position of snake relative to the food position in the canvas
                    if (y == centerY + element.randomCoordinateY + 5 && x >= centerX + element.randomCoordinateX - 50 && x <= centerX + element.randomCoordinateX + 5 && element.eaten == false) {
                        fillOverFood(canvasColor, centerX + element.randomCoordinateX - 6, centerY + element.randomCoordinateY - 6);
                        snakeEndDistance += 100;
                        element.eaten = true;
                        foodEaten += 1;
                    }
                    break;
                case 'down':
                    if (y == centerY + element.randomCoordinateY - 45 && x >= centerX + element.randomCoordinateX - 50 && x <= centerX + element.randomCoordinateX + 5 && element.eaten == false) {
                        fillOverFood(canvasColor, centerX + element.randomCoordinateX - 6, centerY + element.randomCoordinateY - 6);
                        snakeEndDistance += 100;
                        element.eaten = true;
                        foodEaten += 1;
                    }
                    break;
                case 'left':
                    if (y >= centerY + element.randomCoordinateY - 45 && y <= centerY + element.randomCoordinateY + 5 && x == centerX + element.randomCoordinateX - 5 && element.eaten == false) {
                        fillOverFood(canvasColor, centerX + element.randomCoordinateX - 6, centerY + element.randomCoordinateY - 6);
                        snakeEndDistance += 100;
                        element.eaten = true;
                        foodEaten += 1;
                    }
                    break;
                case 'right':
                    if (y >= centerY + element.randomCoordinateY - 45 && y <= centerY + element.randomCoordinateY + 5 && x == centerX + element.randomCoordinateX - 40 && element.eaten == false) {
                        fillOverFood(canvasColor, centerX + element.randomCoordinateX - 6, centerY + element.randomCoordinateY - 6);
                        snakeEndDistance += 100;
                        element.eaten = true;
                        foodEaten += 1;
                    }
                    break;
            }
        });
    }
                

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++ GAME LOGIC FUNCTIONS ++++++++++++++++++++++++++++++++++++++++++++++++++++
    
    // Runs game via intervalTimer
    function nextRound() {

        foodEaten = 0;
        snakeEndDistance = 100;
        speed *= 1.1;
        creepDistance = 1; 
        ctx.fillStyle = "rgb(125,125,255)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        generateFood();

        setRound(true);

        startMessage.className += ' hidden';

        // window.clearInterval(intervalId);
        intervalId = setInterval(function(orientation) {
            ++iterator;
            snakePositionHistory.push(createContext());
            endSnakeData = snakePositionHistory[snakePositionHistory.length - snakeEndDistance];
            orientation = currentDirection;

            eatFood();

            // Fires next round once all food is eaten by recursively calling the function
            if (foodEaten == foodArray.length) {
                nextRound();
            }

            switch(orientation) {
                case 'up':
                    direction.up();
                    break;

                case 'down':
                    direction.down();
                    break;

                case 'left':
                    direction.left();
                    break;

                case 'right':
                    direction.right();
                    break;
            }

            if (endSnakeData) {
                switch(endSnakeData.direction) {
                    case 'up':
                        endDirection.up(endSnakeData.xPlace, endSnakeData.yPlace);
                        break;

                    case 'down':
                        endDirection.down(endSnakeData.xPlace, endSnakeData.yPlace - 1);
                        break;

                    case 'left':
                        endDirection.left(endSnakeData.xPlace + 1, endSnakeData.yPlace);
                        break;

                    case 'right':
                        endDirection.right(endSnakeData.xPlace - 1, endSnakeData.yPlace);
                        break;
                }
            }
        }, speed);
        intervalArray.push(intervalId);
    } 

    // Clears all timers that are compounded by nextRound()
    function clearTimers() {
        intervalArray.forEach(function(element, index, array) {
            window.clearInterval(element);
        });
    }

    // Animated start state of snake
    function startState() {
        x = 0;
        y = 0;
        
        currentDirection = 'right';

        ctx.fillStyle = "rgb(125,125,255)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = "lime";
        ctx.fillRect(x, y, snakeWidth, snakeHeight);

        // left eye
        ctx.fillStyle = "black";
        ctx.fillRect((x + (snakeWidth * .75)), (y + (snakeWidth * .35)), (snakeWidth * .05), (snakeWidth * .05));
        // right eye
        ctx.fillStyle = "black";
        ctx.fillRect((x + (snakeWidth * .75)), (y + (snakeWidth * .65)), (snakeWidth * .05), (snakeWidth * .05));
    }

    // Resets relevant globals and ends game
    function stopGame() {
        document.getElementById('startMessage').innerHTML = 'GAME OVER at Round ' + document.getElementById('roundNumber').innerHTML + '<br> <br>Press Space to Start';
        foodEaten = 0;
        speed = 15;
        creepDistance = 1;
        startMessage.className = "startMessage"; 
        clearTimers()
        startState();
        setRound(false);
        endSnakeData = {};
        snakePositionHistory = [];
        snakeEndDistance = 100;
    }
    
    // Displays correct current round
    function setRound(state) {            
        if (state === true) {
            roundCounter.className = "pull-right rounds";
            // roundNumber = Number(roundNumber.innerHTML) + 1;
            document.getElementById('roundNumber').innerHTML = Number(document.getElementById('roundNumber').innerHTML) + 1;
        } else {
            roundCounter.className = "pull-right rounds hidden";
            document.getElementById('roundNumber').innerHTML = 0;
        }
    }

    // Sets direction of snake based on left and right rotation from keyboard events
    function deriveOrientation(command) {
        switch(command) {
            case 'left':
                switch(currentDirection) {
                    case 'up':
                        currentDirection = 'left';
                        break;
                    case 'down':
                        currentDirection = 'right';
                        break;
                    case 'left':
                        currentDirection = 'down';
                        break;
                    case 'right':
                        currentDirection = 'up';
                        break;
                }
                break;
            case 'right':
                switch(currentDirection) {
                    case 'up':
                        currentDirection = 'right';
                        break;
                    case 'down':
                        currentDirection = 'left';
                        break;
                    case 'left':
                        currentDirection = 'up';
                        break;
                    case 'right':
                        currentDirection = 'down';
                        break;
                }
                break;
        }  
    }

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++ PROCEDURE ++++++++++++++++++++++++++++++++++++++++++++++++++++

    // Prevents space bar from scrolling
    window.onkeydown = function(e) {
        if(e.keyCode == 32 && e.target == document.body) {
            e.preventDefault();
            return false;
        }
    };

    // Event listeners for all keyboard commands
    document.addEventListener('keydown', function(event) {
        if (event.which === 37) {
            deriveOrientation('left');
        }
        if (event.which === 39) {
            deriveOrientation('right');
        }
        if (event.which === 32) {
            event.preventDefault();
            currentDirection = 'right';
            nextRound();
        }
        if (event.which === 27) {
            stopGame();
        }
    });


})(); // end of IIFE
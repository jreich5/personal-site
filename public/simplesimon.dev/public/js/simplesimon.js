// $('document').ready(function() {
    
    "use strict";


    // ========================================================DEFINITIONS======================================================== \\


    // ================================ Global Variables ================================ 


    // Panel Definitions
    var $red1 = $('#red1');
    var $blue2 = $('#blue2');
    var $yellow3 = $('#yellow3');
    var $green4 = $('#green4');

    // Sound definitions ** can refactor as an object
    var soundRed = new Audio("sounds/red.mp3");
    soundRed.preload = 'auto'; // Procedural code placed after sound variables for readability
    soundRed.load();

    var soundBlue = new Audio('sounds/blue.mp3');
    soundBlue.preload = 'auto';
    soundBlue.load();

    var soundYellow = new Audio('sounds/yellow.mp3');
    soundYellow.preload = 'auto';
    soundYellow.load();

    var soundGreen = new Audio('sounds/green.mp3');
    soundGreen.preload = 'auto';
    soundGreen.load();

    var soundStart = new Audio('sounds/start.mp3');
    soundStart.preload = 'auto';
    soundStart.load();

    var soundPassRound = new Audio('sounds/passRound.mp3');
    soundPassRound.preload = 'auto';
    soundPassRound.load();

    var soundGameOver = new Audio('sounds/gameOver.mp3');
    soundGameOver.preload = 'auto';
    soundGameOver.load();

    // User input value
    var hitValue = null; // The value of most recent user input
    var totalArray = []; // Stores a complete version of each round array for the duration of the round
    var blinkCounter = []; // Stores the complete round sequence that shrinks with each correct user input until it is empty at the end of a round

    // Light board object 
    var board = {
        "red" : 0,
        "blue" : 1,
        "yellow" : 2,
        "green" : 3
    }

    // Array of light blinks
    var blinks = [redBlink, blueBlink, yellowBlink, greenBlink];

    // Round count ** can be refactored out of code by using totalArray.length
    var $roundNumber = 0;


    // ================================ Functions ================================ 


    // Resets global variables
    function variableReset () {
        blinkCounter = [];
        totalArray = [];
        $roundNumber = 0;
        hitValue = null;
    }

    // Round display
    function roundDisplayer (input) {
        $('#roundDisplay').html("Round " + input); 
    }


    // ===== Lighting Functions ===== \\

    
    function redLight (lightOn) {
        if (lightOn) {
            $red1.css("background-color", "#e00");
        } else {
            $red1.css("background-color", "#800");
        }
    }
    function blueLight (lightOn) {
        if (lightOn) {
            $blue2.css("background-color", "#00e");
        } else {
            $blue2.css("background-color", "#008");
        }
    }
    function yellowLight (lightOn) {
        if (lightOn) {
            $yellow3.css("background-color", "#ee0");
        } else {
            $yellow3.css("background-color", "#880");
        }
    }
    function greenLight (lightOn) {
        if (lightOn) {
            $green4.css("background-color", "#0e0");
        } else {
            $green4.css("background-color", "#080");
        }
    }

    function redBlink () {
        playRed(1);
        redLight(true);
        setTimeout(redLight, 100);
    }
    function blueBlink () {
        playBlue(1);
        blueLight(true);
        setTimeout(blueLight, 100);
    }
    function yellowBlink () {
        playYellow(1);
        yellowLight(true);
        setTimeout(yellowLight, 100);
    }
    function greenBlink () {
        playGreen(1);
        greenLight(true);
        setTimeout(greenLight, 100);
    }
    function turnOffAll () {
        redLight(false);
        blueLight(false);
        yellowLight(false);
        greenLight(false);
    }
    function turnOnAll () {
        redLight(true);
        blueLight(true);
        yellowLight(true);
        greenLight(true);
    }


    // ===== Click Functions ===== \\

    function redClick () {
        redLight(true);
        playRed(1);
        hitValue = board.red;
        if (board.red == blinkCounter[0]) {
            blinkCounter.shift();
            if (blinkCounter.length == 0) {
                fireNextRound();
            }
        } else {
            failure();
        }
    }
    function blueClick () {
        blueLight(true);
        playBlue(1);
        hitValue = board.blue;
        if (board.blue == blinkCounter[0]) {
            blinkCounter.shift();
            if (blinkCounter.length == 0) {
                fireNextRound();
            }
        } else {
            failure();
        }
    }
    function yellowClick () {
        yellowLight(true);
        playYellow(1);
        hitValue = board.yellow;
        if (board.yellow == blinkCounter[0]) {
            blinkCounter.shift();
            if (blinkCounter.length == 0) {
                fireNextRound();
            }
        } else {
            failure();
        }
    }
    function greenClick () {
        greenLight(true);
        playGreen(1);
        hitValue = board.green;
        if (board.green == blinkCounter[0]) {
            blinkCounter.shift();
            if (blinkCounter.length == 0) {
                fireNextRound();
            }
        } else {
            failure();
        }
    }
 

    // ===== Event Listener Functions ===== \\

    // Arm mouse clicks
    function armPanels () {
        $red1.mousedown(redClick);
        $red1.mouseup(redLight());

        $blue2.mousedown(blueClick);
        $blue2.mouseup(blueLight()); 

        $yellow3.mousedown(yellowClick);
        $yellow3.mouseup(yellowLight());

        $green4.mousedown(greenClick);
        $green4.mouseup(greenLight());
    }
    // Remove event listeners
    function disarmPanels () {
        $red1.off();
        $blue2.off();
        $yellow3.off();
        $green4.off();
    }

    // Key down events ** pull function out and give a name
    function activateKeys () { 
        $(document).keydown(function(e) {
            switch(e.which) {
                case 37: // left
                greenClick();
                break;

                case 38: // up
                redClick();
                break;

                case 39: // right
                blueClick();
                break;

                case 40: // down
                yellowClick();
                break;

                case 13: // enter
                startUp();

                break;

                default: return; // exit this handler for other keys
            }
            e.preventDefault(); // prevent the default action (scroll / move caret)
        });
    }

    // Deactivates all key events in the document
    function deactivateKeys () {
        $(document).off();
    }

    function controlLights () {
        $(document).keydown(function(e) {
            switch(e.which) {
                case 37: // left
                playGreen(1);
                greenLight(true);
                break;

                case 38: // up
                playRed(1);
                redLight(true);
                break;

                case 39: // right
                playBlue(1);
                blueLight(true);
                break;

                case 40: // down
                playYellow(1);
                yellowLight(true);
                break;

                default: return; // exit this handler for other keys
            }
            e.preventDefault(); // prevent the default action (scroll / move caret)
        });

        // Key up events
        $(document).keyup(function(e) {
            switch(e.which) {
                case 37: // left
                greenLight(false);
                break;

                case 38: // up
                redLight(false);
                break;

                case 39: // right
                blueLight(false);
                break;

                case 40: // down
                yellowLight(false);
                break;

                default: return; // exit this handler for other keys
            }
            e.preventDefault(); // prevent the default action (scroll / move caret)
        });
    }

    // Arms enter key to begin game
    function armEnterKey () {
        $(document).keypress(function(e) {
            if(e.which == 13) {
                startUp();
            }
        });
    }

    // Arms next round button
    function cowardsWay () {
        $('#round').click(function(){
            fireNextRound();
        });
    }


    // ===== Animations ===== \\

    function startAnimation () {
       $('.panel').addClass('spin'); 
       setTimeout(function() {
           $('.panel').removeClass('spin');
        }, 2000);
    }

    function failAnimation () {
        $('.simonGame').animate({
            opacity: '0',
            top: '100px',
            left: '100px'
        }, 3000).animate({
            opacity: '.9',
            top: '0',
            left: '0'
        }, 100);
    }

    function completedRoundAnimation () {
        for (var i = 1; i <= 11; i++) {
            if (i % 2 != 0) {
                setTimeout(function() {
                    turnOffAll();
                }, 50 * i); 
            } else {
                setTimeout(function() {
                    turnOnAll();
                }, 50 * i); 
            }
        }

        if ($roundNumber > 1) {
            $('.panel').animate({
                'border-radius': '100px',
            }, 400).animate({
                'border-radius': '0px',
            }, 400);
        }
    }


    // ===== Audio Functions ===== \\

    function roundMusic () {
        $('#music').attr('src', 'sounds/roundMusic.mp3');
    }

    function menuMusic () {
        $('#music').attr('src', 'sounds/menu.mp3');
    }

    function playRed(volume) {
      var click = soundRed.cloneNode();
      click.volume = volume;
      click.play();
    }

    function playBlue(volume) {
      var click = soundBlue.cloneNode();
      click.volume = volume;
      click.play();
    }

    function playYellow(volume) {
      var click = soundYellow.cloneNode();
      click.volume = volume;
      click.play();
    }

    function playGreen(volume) {
      var click = soundGreen.cloneNode();
      click.volume = volume;
      click.play();
    }

    function playStart(volume) {
      var click = soundStart.cloneNode();
      click.volume = volume;
      click.play();
    }

    function playPassRound(volume) {
      var click = soundPassRound.cloneNode();
      click.volume = volume;
      click.play();
    }

    function playGameOver(volume) {
      var click = soundGameOver.cloneNode();
      click.volume = volume;
      click.play();
    }


    // ===== Game Logic Functions ===== \\

    // Game start 
    function startUp () {
        playStart(1);
        roundMusic();
        turnOffAll();
        variableReset();
        deactivateKeys();
        startAnimation();
        disarmPanels();
        roundDisplayer($roundNumber);
        $('#roundDisplay').show();
        setTimeout(function() {
            deactivateKeys();
            disarmPanels();
            variableReset();
            activateKeys();
            armPanels();
            fireNextRound();
            controlLights();
            cowardsWay();
        }, 2000);

    }

    // Random generator function
    function randomIndex () {
        var blinksIndex;
        blinksIndex = Math.floor((Math.random() * 4));
        return blinksIndex;
    }

    // Engages round
    function fireNextRound () {
        playPassRound(1);
        $roundNumber++;
        roundDisplayer($roundNumber);
        blinkCounter = totalArray.slice();
        blinkAdder();
        totalArray = blinkCounter.slice();
        completedRoundAnimation();
        setTimeout(function() {
            fireBlinks(0);
        }, 2000);
    }

    // Adds new blink for each round
    function blinkAdder () {
        var random = randomIndex();
        blinkCounter.push(random);
    }

    // Fires blinks for each round
    function fireBlinks(index) {
        if (blinkCounter.length > index) {
            setTimeout(function() {
                var color = null;
                color = blinkCounter[index];
                blinks[color]();
                index++;
                fireBlinks(index);
            }, 500);
        } else {
            return;
        }
    }

    // Lose procedure
    function failure () {
        playGameOver(1);
        menuMusic();
        failAnimation();
        deactivateKeys();
        $('#roundDisplay').hide();
        variableReset();
        turnOffAll();
        disarmPanels();
        controlLights();
        armEnterKey();
        cowardsWay();
        return;
    }

    // Procedural code on page load

    function onLoad () {
        // Start button event
        $('#corePanelOuterBlack').click(function(){
            // alert("Round 1");
            startUp();
        });
        $('.corePanel').mousedown(function(){
            $(this).css("border-style", "groove");
        });
        $('.corePanel').mouseup(function(){
            $(this).css("border-style", "solid");
        });

        cowardsWay();

        // Allows for startup
        armEnterKey();

        // Enables the user to play with lights between rounds
        controlLights();

        menuMusic();
    }


    // ========================================================PROCEDURE========================================================


    onLoad();
    
    
// });

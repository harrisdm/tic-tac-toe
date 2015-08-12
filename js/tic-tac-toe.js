
/******************************************
  Fail-safe the local storage
******************************************/
if ( !localStorage ) {
  var localStorage = {
    gameCounter : 0,
    winsX : 0,
    winsO : 0
  };
}

/******************************************
  Create the game board and then attach on document.ready
******************************************/

var boards = [];

// Create gameBoard div
for ( var i = 1; i <= 9; i++ ) {
  var $gameBoard = $('<div class="'+i+' gameBoard" data-player=""></div>');

  // Append all the gameSquare divs
  for ( var j = 1; j <= 9; j++ ) {
    $gameBoard.append('<div class="'+j+' gameSquare" data-player=""></div> ');
  }
  boards.push($gameBoard);
}

/******************************************
  Initialise the default global variables
******************************************/
var totalMoves = 0;
var subMoves = [0,0,0,0,0,0,0,0,0];
var masterMoves = 0;
var gameCounter = parseInt(localStorage['gameCounter']) || 0;
var winsX = parseInt(localStorage['winsX']) || 0;
var winsO = parseInt(localStorage['winsO']) || 0;

var gameOver = false;
var isSuperGame = false;

var currentPlayer;
var $element;
var inputTypeX;
var inputTypeO;

  


$(document).ready( function() {

  /******************************************
    Initialise the page
  ******************************************/
  // Attach the game boards
  for ( var i = 0; i < boards.length; i++ ) {
    $("#gameBoardContainer").append(boards[i]);
  }

  // Hide the super gameboard
  $(".gameSquare").hide();


  /******************************************
    Opening Splash
  ******************************************/
  $("#winLine, #controlWrapper, #logo, #gameWrapper").hide();
  $("#leftBg, #rightBg, #vs").hide();

  setTimeout(function(){ $("#audio").trigger('play'); }, 750);
  setTimeout(function(){ $("#splash").fadeOut(2000); },4000);
  setTimeout(function(){ $("#logo").slideDown(1000); },7000);

  setTimeout(function(){ $("#leftBg").fadeIn(500); },8000);
  setTimeout(function(){ $("#rightBg").fadeIn(500); },8000);
  setTimeout(function(){ $("#vs").slideDown(500); },8500);
  setTimeout(function(){ $("#empire, #rebels").css("opacity", 1); },10000);

  setTimeout(function(){ $(".title-wrapper").fadeOut(500); },14000);
  setTimeout(function(){ $("#gameWrapper").fadeIn(1000); },14000);
  setTimeout(function(){ toggleControlPanel(); },15500);

  function volumeDown(){
      var volume = $("#audio").prop("volume")-0.01;
      if(volume <0){
          volume = 0;
      }
      $("#audio").prop("volume",volume);
  }

  timer = window.setInterval(volumeDown, 400);
  setTimeout(function(){ window.clearInterval(timer); },35000);

  /******************************************

    INITIATE HUMAN & COMPUTER MOVES

  ******************************************/

  /******************************************
    A Human takes a turn
  ******************************************/
  var humanTurn = function() {
    
    // Prevent the player from multi-clicking
    $(".gameBoard, .gameSquare").off("click");

    // Keep track of the clicked box
    $element = $(this);

    // Make the players move
    makeMove(true);

    // Get the next turn
    getMove(); 
  };

  /******************************************
    The Computer takes a turn
  ******************************************/
  var computerTurn = function() {
    
    // Find and make a move
    findComputerMove();

    // Get the next turn
    getMove();
  };

  /******************************************
    Find a valid move that the computer can make
  ******************************************/
  var findComputerMove = function() {

    // Pick a random board & square
    var board = Math.ceil(Math.random() * 9);
    var square = Math.ceil(Math.random() * 9);
    
    // Create a move
    if ( isSuperGame ) {
      $element = $(".gameBoard").filter("."+board).children("."+square);
    } else {
      $element = $(".gameBoard").filter("."+board);
    }

    // Try to make the generated move, generate another move on failure
    if ( !gameOver && !makeMove(false) ) {
      findComputerMove();
    }
  };

  



  /******************************************

    MAKE A MOVE ON THE BOARD

  ******************************************/

  /******************************************
    Make a move on the given game square 
  ******************************************/
  var makeMove = function(alertMsg) {

    // Check that the option is a valid move
    if ( validMove(alertMsg) ) {

      // Assign player to the game square
      assignSquare($element, currentPlayer);

      // Track # moves to choose next player
      totalMoves++;

      if ( isSuperGame ) {
        // Track # moves in the small games
        subMoves[$element.parent().attr('class').split(' ')[0] - 1]++;
      } else {
        // Track # moves in the main game
        masterMoves++;
      }

      // Decide if someone has won
      gameOver = isGameOver();

      // Return that a move has been made
      return true;
    }
    // Return that the move failed
    return false;
  };

  /******************************************
    Check the selected box is a valid move
  ******************************************/
  var validMove = function(alertMsg) {

    if ( gameOver ) {
      if(alertMsg) { alert("The game has already been won"); }
      return false;
    } else if ( $element.hasClass("X") 
                || $element.hasClass("O") 
                || $element.parent().hasClass("X")
                || $element.parent().hasClass("O")
                || $element.parent().hasClass("draw") ) {
      if ( alertMsg ) { alert("That square has already been chosen"); }
      return false;
    } else {
      return true;
    }
  };
  
  /******************************************
    Assign a game square to the given player
  ******************************************/
  var assignSquare = function(element, player) {

    element.data("player", player);
    element.addClass(player);
  };





/******************************************

    DO WE HAVE A WINNER????

  ******************************************/

  /******************************************
    Check if the game is over
  ******************************************/
  var isGameOver = function() {

    // checkWin() must go first in case the final move results in a win
    if ( isSuperGame && (isWin(true) || isDrawSub()) ) {
      return ( isWin(false) || isDraw() ) ? true : false;
    } else {
      return ( isWin(false) || isDraw() ) ? true : false;
    }
  };

  /*****************************************
     Check if the main game won
  *****************************************/
  var isWin = function(isSubGame) {

    // What are the possible win states
    var winStates = [ [1,2,3], [4,5,6], [7,8,9], 
                      [1,4,7], [2,5,8], [3,6,9],
                      [1,5,9], [3,5,7] ];

    if (isSubGame) {
      var $collection = $element.siblings().andSelf();
    } else {
      var $collection = $(".gameBoard");
    }
    // Check the board against each of the win states
    for ( var i = 0; i < winStates.length; i++ ) {

      var square_1 = $collection.filter("."+winStates[i][0]).data("player");
      var square_2 = $collection.filter("."+winStates[i][1]).data("player");
      var square_3 = $collection.filter("."+winStates[i][2]).data("player");

       // Ensure its not matching unselected game squares or draws
      if ( square_1 !== "" && square_1 !== "draw") {
        // Check that the win state elements match
        if ( square_1 === square_2 && square_1 === square_3 ) {

          if ( isSubGame ) {
            // Flip the gameboard on winning
            $element.siblings().andSelf().hide();
            assignSquare($element.parent(), currentPlayer);

            // Keep track of main game moves
            masterMoves++;

          } else {
            // Keep track of games winners
            if ( square_1 === "X" ) {
              winsX++;
            } else {
              winsO++;
            }

            // Keep track of games played
            gameCounter++;

            // Delay WIN annimation until after the tile has finished turning
            //window.setTimeout(winAnimation, 1000);
            winAnimation(i, square_1);
          }
          
          return true;
        }
      }
    }
    return false;
  };  

  /******************************************
    Animation for when a player wins
  ******************************************/
  var winAnimation = function(winLine, team) {
    
    $("#winLine").addClass("win"+winLine).addClass("win"+team);
    $("#winLine").fadeIn(2000, toggleControlPanel);
    
    // Update the score board
    updateScores();
  };

  /*****************************************
     Check if a sub game is a draw
  *****************************************/
  var isDrawSub = function() {

    // Find the current gameboard by extracting it from parents class list
    var gameBoard = [$element.parent().attr('class').split(' ')[0] - 1]

    // Have all squares been selected but no win
    if ( !gameOver && subMoves[gameBoard] === 9 ) {

      // Flip the gameboard on a draw
      $element.siblings().andSelf().hide();
      assignSquare($element.parent(), "draw");

      // Keep track of main game moves
      masterMoves++;

      return true;
    }
    return false;
   };

  /*****************************************
     Check the main game is a draw
  *****************************************/
  var isDraw = function() {

    // Have all squares been selected but no win
    if ( !gameOver && masterMoves === 9 ) {

      // Keep track of games played
      gameCounter++;

      // Delay DRAW annimation until after the tile has finished turning
      window.setTimeout(drawAnimation, 1000);
      
      return true;
    }
    return false;
   };

  /******************************************
    Animation for when a game draws
  ******************************************/
  var drawAnimation = function() {

    alert("DRAW: No more moves left");

    // Reveal the game controls
    toggleControlPanel();

    // Update the score board
    updateScores();
  };





  /******************************************

    GAMEPLAY CONTROLS

  ******************************************/

  /******************************************
    Update the scoreboard when a player wins
  ******************************************/
  var updateScores = function() {
    $("#gameCount").html(gameCounter);
    $("#scoreX").html(winsX);
    $("#scoreO").html(winsO);

    // Update the local storage values
    localStorage['gameCounter'] = JSON.stringify(gameCounter);
    localStorage['winsX'] = JSON.stringify(winsX);
    localStorage['winsO'] = JSON.stringify(winsO);
  };

  /******************************************
    Reset the game counters
  ******************************************/
  var resetCounters = function () {
    if ( confirm("Are you sure you want to clear the counters?") ) {
      gameCounter = 0;
      winsX = 0;
      winsO = 0;
      updateScores();
    }
  };
  $("#resetCounters").on("click", resetCounters);

  /******************************************
    Toggle between Human and Computer Players
  ******************************************/
  var toggleInputType_1 = function() {
    if ( $(this).data("input") === 0 ) {
      $(this).html("Battle Droid (CPU)");
      $(this).data("input", 1)
    }
    else {
      $(this).html("Darth Vader");
      $(this).data("input", 0)
    }
  };
  $("#playerX").on("click", toggleInputType_1);

  var toggleInputType_2 = function() {
    if ( $(this).data("input") === 0 ) {
      $(this).html("R2D2 (CPU)");
      $(this).data("input", 1)
    }
    else {
      $(this).html("Yoda");
      $(this).data("input", 0)
    }
  };
  $("#playerO").on("click", toggleInputType_2);

  /******************************************
    Toggle first move selection
  ******************************************/
  var toggleFirstPlayer = function() {
    if ( $(this).data("input") === 0 ) {
      $(this).html("Rebels");
      $(this).data("input", 1)
    }
    else {
      $(this).html("Empire");
      $(this).data("input", 0)
    }
  };
  $(".firstMove").on("click", toggleFirstPlayer);

  /******************************************
    Toggle between Normal & Super game versions
  ******************************************/
  var toggleSuper = function() {

    if( $('#playSuper').html() == 'Standard' ) {
      isSuperGame = true;
      $('#playSuper').html('Hyperspace');
    } else {
      isSuperGame = false;
      $('#playSuper').html('Standard');
    }

    if ( isSuperGame ) {
      $(".gameSquare").fadeIn(1000);
    } else {
      $(".gameSquare").fadeOut(1000);
    }

     $(".gameBoard, .gameSquare").off("click")
                               .removeClass("X")
                               .removeClass("O")
                               .removeClass("draw")
                               .data("player",""); 
  };
  $("#playSuper").on("click", toggleSuper);

  /******************************************
    Play a new game
  ******************************************/
  var newGame = function() {
    // Clear the board
    resetBoard();

    // Remove the control panel
    toggleControlPanel();

    // Remove the winning line animation
    $("#winLine").fadeOut(500);
    setTimeout(function(){ $('#winLine').removeClass(); },1000);

    // Get the first move
    getMove();
  }
  $("#playAgain").on("click", newGame);

  /******************************************
    Reset the board for another game
  ******************************************/
  var resetBoard = function() {
    $(".gameBoard, .gameSquare").off("click")
                                .removeClass("X")
                                .removeClass("O")
                                .removeClass("draw")
                                .data("player","")
                                .show();
    if ( !isSuperGame ) { $(".gameSquare").hide(); }

    totalMoves = $(".firstMove").data("input");
    subMoves = [0,0,0,0,0,0,0,0,0];
    masterMoves = 0;

    inputTypeX = $("#playerX").data("input");
    inputTypeO = $("#playerO").data("input");

    gameOver = false;
  };

  /******************************************
    Show or Hide the game controls
  ******************************************/
  var toggleControlPanel = function() {
    $("#controlWrapper").slideToggle(1000);
  }





  /******************************************

    CALCULATING PLAYER TURNS

  ******************************************/

  /******************************************
    Determine who makes the next move
  ******************************************/
  var getMove = function() {
    if ( !gameOver ) {
      currentPlayer = findNextPlayer();
      if ( currentPlayer === "X" ) {
        selectPlayerInput(inputTypeX);
      } else {
        selectPlayerInput(inputTypeO);
      }
    }
  };

  /******************************************
    Decide which player's turn it is
  ******************************************/
  var findNextPlayer = function() {
    // Find if the total move counter is odd or even
    return (totalMoves % 2 === 0) ? "X" : "O";
  };

  /******************************************
    Decide if player is Human or Computer
  ******************************************/
  var selectPlayerInput = function(playerInput) {
    if ( playerInput === 1 ) {
      window.setTimeout(computerTurn, 1000);
    } else if ( isSuperGame ) {
      $(".gameSquare").on("click", humanTurn);
    } else {
      $(".gameBoard").on("click", humanTurn);
    }
  };

  // Update the scoreboard
  updateScores();

});






















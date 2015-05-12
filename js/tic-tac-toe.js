
/******************************************

  Create the game board and then attach on document.ready

******************************************/
  
// Create gameBoard div
var $gameBoard = $('<div id="gameBoard"></div>');

// Append all the gameSquare divs
for (var i = 1; i <= 9; i++) {
  $gameBoard.append('<div id="'+i+'" class="gameSquare" data-player=""></div> ');
}



$(document).ready( function() {

  /******************************************

    Attach the gameboard to the DOM

  ******************************************/
  $("#gameBoardContainer").append($gameBoard);


  /******************************************

    Initialise the default global variables

  ******************************************/
  var moveCounter = 0;
  var gameOver = false;
  var gameCounter = 0;
  var winsX = 0;
  var winsO = 0;


  /******************************************

    Decide which player's turn it is

  ******************************************/
  var findPlayer = function() {

    // Find if the move counter is odd or even
    return (moveCounter % 2 === 0) ? "X" : "O";

  }


  /******************************************

    Check the selected box is a valid move

  ******************************************/
  var validMove = function($element, alertMsg) {

    if(gameOver) {
      if(alertMsg) { alert("The game has already been won"); }
      return false;
    } else if( $element.hasClass("X") || $element.hasClass("O") ) {
      if(alertMsg) { alert("That square has already been chosen"); }
      return false;
    } else {
      return true;
    }

  }


  /******************************************

    Assign a game square to the given player

  ******************************************/
  var assignGameSquare = function($element, player) {

    $element.data("player", player);
    $element.addClass(player);

  }


  /******************************************

    Make the player's move

  ******************************************/
  var makeMove = function($element, alertMsg) {

    // Check that the option is a valid move
    if(validMove($element, alertMsg)) {

      // Assign player to the game square
      assignGameSquare($element, findPlayer());

      // Increase the number of moves made
      moveCounter++;

      // Decide if someone has won
      gameOver = checkGameOver();
      if(gameOver) { gameCounter++; }

      return true;

    }
    return false;

  };

  var computerMove = function() {
    var move = Math.ceil(Math.random() * 9);
    //alert(move);
    if( !gameOver && !makeMove($('#'+move), false) ) {
      computerMove();
    }
    
    //return makeMove($('#'+move), false);

  }

  var playerMove = function() {
    makeMove($(this), true);

    window.setTimeout(computerMove, 1000);
    //while( !gameOver && !computerMove() ) {}
  }

  $(".gameSquare").on("click", playerMove);


  /******************************************

    Check if the move won the game

  ******************************************/
  var checkWin = function() {

    // What are the possible win states
    var winStates = [ [1,2,3], [4,5,6], [7,8,9], 
                      [1,4,7], [2,5,8], [3,6,9],
                      [1,5,9], [3,5,7] ];

    // Check the board against each of the win states
    for(var i = 0; i < winStates.length; i++) {

      var square_1 = $("#"+winStates[i][0]).data("player");
      var square_2 = $("#"+winStates[i][1]).data("player");
      var square_3 = $("#"+winStates[i][2]).data("player");

      // Ensure its not matching unselected game squares
      if( square_1 !== "") {
        // Check that the win state elements match
        if(square_1 === square_2 && square_1 === square_3) {
          if(square_1 === "X") {
            winsX++;
          } else {
            winsO++;
          }
          // Delay the win annimation until after the tile has finished turning
          window.setTimeout(winAnimation, 1500);
          return true;
        }
      } 
    }
  };


  /******************************************

    Animation for when a player wins

  ******************************************/
  var winAnimation = function() {
    alert("Game Won!!");

    // Update the score board
    updateScores();
  }


  /******************************************

    Check if the game is a draw

  ******************************************/
  var checkDraw = function() {

    // Have all squares been selected  but no win
    if(!gameOver && moveCounter === 9) {
      alert("DRAW: No more moves left");

      // Update the score board
      updateScores();

      return true;
    }

  };


  /******************************************

    Check if the game is a draw

  ******************************************/
  var checkGameOver = function() {

    // Has either game termination critera been met
    // checkWin() must go first in case the final move results in a win
    return ( checkWin() || checkDraw() ) ? true : false;

  };


  /******************************************

    Reset the board for another game

  ******************************************/
  var resetBoard = function () {

    if(gameOver) {
      $(".gameSquare").removeClass("X").removeClass("O").data("player","");
      gameOver = false;
      moveCounter = 0;
    } else if(confirm("Are you sure you want to discard this game?")) {
      gameOver = true;
      resetBoard();
    }

  }

  $("#resetBoard").on("click", resetBoard);


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

  }

  $("#resetCounters").on("click", resetCounters);


  /******************************************

    Update the scoreboard, called when a player wins

  ******************************************/
  var updateScores = function() {

    $("#scoreX").html(winsX);
    $("#gameCount").html(gameCounter);
    $("#scoreO").html(winsO);

  }



});














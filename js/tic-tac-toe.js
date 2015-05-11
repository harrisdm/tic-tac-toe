
$(document).ready( function() {

  /******************************************

    Initialise the default global variables

  ******************************************/
  var moveCounter = 0;
  var gameOver = false;


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
  var validMove = function($element) {

    if(gameOver) {
      alert("The game has already been won");
      return false;
    } else if( $element.hasClass("X") || $element.hasClass("O") ) {
      alert("That square has already been chosen");
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
  var playerMove = function() {

    // Check that the option is a valid move
    if(validMove($(this))) {

      // Assign player to the game square
      assignGameSquare($(this), findPlayer());

      // Increase the number of moves made
      moveCounter++;

      // Decide if someone has won
      gameOver = checkGameOver();
    }
    
  };

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
          alert("Game Won!!");
          return true;
        }
      } 
    }
  };


  /******************************************

    Check if the game is a draw

  ******************************************/
  var checkDraw = function() {

    // Have all squares been selected  but no win
    if(!gameOver && moveCounter === 9) {
      alert("DRAW: No more moves left");
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

  $("#reset").on("click", resetBoard);


});














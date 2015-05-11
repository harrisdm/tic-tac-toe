
$(document).ready( function() {

  /******************************************

    Initialise the default global variables

  ******************************************/
  var moveCounter = 0;
  var gameWon = false;


  /******************************************

    Decide which player's turn it is

  ******************************************/
  var findPlayer = function() {
    return (moveCounter % 2 === 0) ? 1 : 0;
  }


  /******************************************

    Check the selected box is a valid move

  ******************************************/
  var validMove = function($element) {
    if(gameWon) {
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

    Make the player's move

  ******************************************/
  var playerMove = function() {

    // Check that the option is a valid move
    if(validMove($(this))) {

      // Discover which player is making a move and change the appearance
      if(findPlayer()) {
        $(this).data("player", "X");
        $(this).addClass("X");
      } else {
        $(this).data("player", "O");
        $(this).addClass("O");
      }

      moveCounter++;

      checkWin();
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
          gameWon = true;
          alert("game won!!");
        }
      } 
    }

    // Check if the game ends in a draw
    if(!gameWon && moveCounter === 9) {
      alert("DRAW: No more moves left");
    }

  };


  /******************************************

    Reset the board for another game

  ******************************************/
  var resetBoard = function () {
    if(gameWon) {
      $(".gameSquare").removeClass("X").removeClass("O").data("player","");
      gameWon = false;
      moveCounter = 0;
    } else if(confirm("Are you sure you want to discard this game?")) {
      gameWon = true;
      resetBoard();
      gameWon = false;
      moveCounter = 0;
    }
  }

  $("#reset").on("click", resetBoard);



});















/******************************************

  Create the game board and then attach on document.ready

******************************************/

var boards = [];

// Create gameBoard div
for(var i = 1; i <= 9; i++){
  var $gameBoard = $('<div class="'+i+' gameBoard" data-player=""></div>');

  // Append all the gameSquare divs
  for (var j = 1; j <= 9; j++) {
    $gameBoard.append('<div class="'+j+' gameSquare" data-player=""></div> ');
  }
  boards.push($gameBoard);
}



/******************************************

  Initialise the default global variables

******************************************/
var totalMoves = 0;

var gameOver = false;
var gameStop = false;

var gameCounter = 0;
var winsX = 0;
var winsO = 0;

var isSuperGame = true;

var currentPlayer;
var $element;



$(document).ready( function() {


  /******************************************

    Attach the gameboard to the DOM

  ******************************************/
  //$("#gameBoardContainer").append($gameBoard);
  for(var i = 0; i < boards.length; i++) {
    $("#gameBoardContainer").append(boards[i]);
  }


  var inputTypeX = ( $("#playerX").data("input") === "human" ) ? 0 : 1;
  var inputTypeO = ( $("#playerO").data("input") === "human" ) ? 0 : 1;











  /******************************************

    MAKE A MOVE ON THE BOARD

  ******************************************/

  /******************************************
    Check the selected box is a valid move
  ******************************************/
  var validMove = function(alertMsg) {

    if(gameOver) {
      if(alertMsg) { alert("The game has already been won"); }
      return false;
    } else if( $element.hasClass("X") || $element.hasClass("O") ) {
      if(alertMsg) { alert("That square has already been chosen"); }
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
    Make a move on the given game square 
  ******************************************/
  var makeMove = function(alertMsg) {

    // Check that the option is a valid move
    if(validMove(alertMsg)) {

      // Assign player to the game square
      assignSquare($element, currentPlayer);

      // Track # moves to choose next player
      totalMoves++;

      // Decide if someone has won
      gameOver = checkGameOver();

      return true;
    }
    return false;
  };





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

    DO WE HAVE A WINNER????

  ******************************************/

  /******************************************
    Animation for when a player wins
  ******************************************/
  var winAnimation = function() {
    alert("Game Won!!");
    $("#playAgain").slideDown(500);
    // Update the score board
    //updateScores();
  };


  /******************************************
    Check if the move won the game
  ******************************************/
  var checkWin = function() {
    console.log("checkWin");
    // What are the possible win states
    var winStates = [ [1,2,3], [4,5,6], [7,8,9], 
                      [1,4,7], [2,5,8], [3,6,9],
                      [1,5,9], [3,5,7] ];

    // Check the board against each of the win states
    for(var i = 0; i < winStates.length; i++) {

      var square_1 = $element.parent().children("."+winStates[i][0]).data("player");
      var square_2 = $element.parent().children("."+winStates[i][1]).data("player");
      var square_3 = $element.parent().children("."+winStates[i][2]).data("player");

      console.log("1: "+square_1);
      console.log("2: "+square_2);
      console.log("3: "+square_3);

      // Ensure its not matching unselected game squares
      if ( square_1 !== "" ) {
        // Check that the win state elements match
        if ( square_1 === square_2 && square_1 === square_3 ) {
          $element.parent().children().hide();
          assignSquare($element.parent(), currentPlayer);
          
          // if ( square_1 === "X" ) {
          //   winsX++;
          // } else {
          //   winsO++;
          // }

          // gameCounter++;

          // Delay WIN annimation until after the tile has finished turning
          window.setTimeout(winAnimation, 1000);
          return true;
         }
      }
    }
    return false; 
  };


  /******************************************
    Check if the game is over
  ******************************************/
  var checkGameOver = function() {
    console.log("checkGameOver");
    // Has either game termination critera been met
    // checkWin() must go first in case the final move results in a win
    return ( checkWin() ) ? true : false;


  };








  /******************************************

    CALCULATING PLAYER TURNS

  ******************************************/

  /******************************************
    Decide which player's turn it is
  ******************************************/
  var findNextPlayer = function() {
    // Find if the total move counter is odd or even
    return (totalMoves % 2 === 0) ? "X" : "O";
  };

  /******************************************
    Determine if player in Human or Computer
  ******************************************/
  var selectPlayerInput = function(playerInput) {
    if ( playerInput === 0 ) {
      $(".gameSquare").on("click", humanTurn);
    } else {
      //window.setTimeout(computerTurn, 1000);
    }
  };

  /******************************************
    Control who makes the next move
  ******************************************/
  var getMove = function() {
    if ( !gameOver && !gameStop ) {
      currentPlayer = findNextPlayer();
      if(currentPlayer === "X") {
        selectPlayerInput(inputTypeX);
      } else {
        selectPlayerInput(inputTypeO);
      }
    }
  };

getMove();

});






















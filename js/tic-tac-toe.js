
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
var subMoves = [0,0,0,0,0,0,0,0,0];
var masterMoves = 0;

var gameOver = false;

var gameCounter = 0;
var winsX = 0;
var winsO = 0;

var isSuperGame = false;

var currentPlayer;
var $element;

var inputTypeX;
var inputTypeO;


$(document).ready( function() {


  /******************************************

    Attach the gameboard to the DOM

  ******************************************/
  //$("#gameBoardContainer").append($gameBoard);
  for(var i = 0; i < boards.length; i++) {
    $("#gameBoardContainer").append(boards[i]);
  }


  // var inputTypeX = ( $("#playerX").data("input") === "human" ) ? 0 : 1;
  // var inputTypeO = ( $("#playerO").data("input") === "human" ) ? 0 : 1;
  //var inputTypeX = 1;
  //var inputTypeO = 1;


$(".gameSquare").hide();







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
    } else if( $element.hasClass("X") 
                || $element.hasClass("O") 
                || $element.parent().hasClass("X")
                || $element.parent().hasClass("O")
                || $element.parent().hasClass("draw")  ) {
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

      if(isSuperGame) {
        // Track # moves in the small games
        subMoves[$element.parent().attr('class').split(' ')[0] - 1]++;
      } else {
        masterMoves++;
      }

      // Decide if someone has won
      gameOver = isGameOver();
      //console.log("G.O: "+gameOver);
      return true;
    }
    return false;
  };





  /******************************************

    INITIATE HUMAN & COMPUTER MOVES

  ******************************************/

  /******************************************
    Find a valid move that the computer can make
  ******************************************/
  var findComputerMove = function() {

    // Pick a random board
    var board = Math.ceil(Math.random() * 9);

    // Pick a random square
    var square = Math.ceil(Math.random() * 9);
    

    if ( isSuperGame ) {
      $element = $(".gameBoard").filter("."+board).children("."+square);
    } else {
      $element = $(".gameBoard").filter("."+board);
    }

    if ( !gameOver && !makeMove(false) ) {
      findComputerMove();
    }
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
    
    //assignSquare($("#gameBoardContainer"), currentPlayer);
    //$("#gameBoardContainer").children().hide();
    
    alert("Game Won!!");
    
    //$("#playAgain").slideDown(500);
    $("#controls").slideDown(500);
    
    // Update the score board
    updateScores();
  };


  /*****************************************
     Check if the main game won
  *****************************************/
  var isWin = function() {
    //console.log("isWin");
    // What are the possible win states
    var winStates = [ [1,2,3], [4,5,6], [7,8,9], 
                      [1,4,7], [2,5,8], [3,6,9],
                      [1,5,9], [3,5,7] ];


    var $mainSquares = $(".gameBoard");
    // Check the board against each of the win states
    for(var i = 0; i < winStates.length; i++) {

      var square_1 = $mainSquares.filter("."+winStates[i][0]).data("player");
      var square_2 = $mainSquares.filter("."+winStates[i][1]).data("player");
      var square_3 = $mainSquares.filter("."+winStates[i][2]).data("player");

       // console.log("1: "+square_1);
       // console.log("2: "+square_2);
       // console.log("3: "+square_3);

       // Ensure its not matching unselected game squares
      if ( square_1 !== "" && square_1 !== "draw") {
        // Check that the win state elements match
        if ( square_1 === square_2 && square_1 === square_3 ) {

          if ( square_1 === "X" ) {
            winsX++;
          } else {
            winsO++;
          }

          

          gameCounter++;

          // Delay WIN annimation until after the tile has finished turning
          window.setTimeout(winAnimation, 1000);
          return true;
        }
      }
    }
    return false;
  };


  /******************************************
    Check if a sub game won
  ******************************************/
  var isWinSub = function() {
    //console.log("isWinSub");
    // What are the possible win states
    var winStates = [ [1,2,3], [4,5,6], [7,8,9], 
                      [1,4,7], [2,5,8], [3,6,9],
                      [1,5,9], [3,5,7] ];

    // Check the board against each of the win states
    for(var i = 0; i < winStates.length; i++) {

      var square_1 = $element.parent().children("."+winStates[i][0]).data("player");
      var square_2 = $element.parent().children("."+winStates[i][1]).data("player");
      var square_3 = $element.parent().children("."+winStates[i][2]).data("player");

      // console.log("1: "+square_1);
      // console.log("2: "+square_2);
      // console.log("3: "+square_3);

      // Ensure its not matching unselected game squares
      if ( square_1 !== "" ) {
        // Check that the win state elements match
        if ( square_1 === square_2 && square_1 === square_3 ) {
          $element.siblings().andSelf().hide();
          //console.log("parent: "+$element.parent());
          assignSquare($element.parent(), currentPlayer);
          masterMoves++;
 
          return true;
         }
      }
    }
    return false; 
  };


  /******************************************
    Animation for when a game draws
  ******************************************/
  var drawAnimation = function() {

    //$element.parent().siblings().andSelf().hide();
    //assignSquare($("#gameBoardContainer"), "draw");

    alert("DRAW: No more moves left");

    //$("#playAgain").slideDown(500);
    $("#controls").slideDown(500);

    // Update the score board
    updateScores();
  };


  /*****************************************
     Check the main game is a draw
  *****************************************/
  var isDraw = function() {
    //console.log("isDraw");
    //console.log("isDraw - masterMoves: "+masterMoves);
    // Have all squares been selected but no win
    //var gameBoard = [$element.parent().attr('class').split(' ')[0] - 1]
    if ( !gameOver && masterMoves === 9 ) {

      gameCounter++;

      // Delay DRAW annimation until after the tile has finished turning
      window.setTimeout(drawAnimation, 1000);
      return true;
    }
    return false;
   };


  /*****************************************
     Check if a sub game is a draw
  *****************************************/
  var isDrawSub = function() {
    //console.log("isDrawSub");
    //console.log(subMoves);
    // Have all squares been selected but no win
    var gameBoard = [$element.parent().attr('class').split(' ')[0] - 1]
    if ( !gameOver && subMoves[gameBoard] === 9 ) {

      $element.siblings().andSelf().hide();
      assignSquare($element.parent(), "draw");

      masterMoves++;

      return true;
    }
    return false;
   };


  /******************************************
    Check if the game is over
  ******************************************/
  var isGameOver = function() {
    //console.log("checkGameOver");
    // Has either game termination critera been met
    // checkWin() must go first in case the final move results in a win
    if ( isSuperGame && (isWinSub() || isDrawSub()) ) {
      return ( isWin() || isDraw() ) ? true : false;
    } else {
      return ( isWin() || isDraw() ) ? true : false;
    }


  };







  /******************************************
    Update the scoreboard when a player wins
  ******************************************/
  var updateScores = function() {
    $("#gameCount").html(gameCounter);
    $("#scoreX").html(winsX);
    $("#scoreO").html(winsO);
  };

  var resetBoard = function() {
    $(".gameBoard, .gameSquare").off("click")
                                .removeClass("X")
                                .removeClass("O")
                                .removeClass("draw")
                                .data("player","")
                                .show();
    //$(".gameSquare").fadeOut(1000);
    if (!isSuperGame) { $(".gameSquare").hide(); }

    totalMoves = $(".firstMove").data("input");
    subMoves = [0,0,0,0,0,0,0,0,0];
    masterMoves = 0;

    gameOver = false;


    
  };



  /******************************************

    GAMEPLAY CONTROLS

  ******************************************/

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
    Toggle between Human and Computer
  ******************************************/
  var changeInputType = function() {
    if ( $(this).html() === "Human" ) {
      $(this).html("Computer");
      $(this).data("input", "computer")
    }
    else {
      $(this).html("Human");
      $(this).data("input", "human")
    }
  };
  $(".playerType").on("click", changeInputType);


  /******************************************
    Toggle first move
  ******************************************/
  var changeFirstPlayer = function() {
    if ( $(this).html() === "Red" ) {
      $(this).html("Blue");
      $(this).data("input", 1)
    }
    else {
      $(this).html("Red");
      $(this).data("input", 0)
    }
  };
  $(".firstMove").on("click", changeFirstPlayer);


 /******************************************
    Toggle between Normal & Super game versions
  ******************************************/
  var toggleSuper = function() {
    //if ( confirmResetBoard() ) {
      //console.log("toggleSuper");
      $(".gameBoard, .gameSquare").off("click");

      $(".gameSquare").fadeToggle(1000);

      if( $('#playSuper').html() == 'Standard' ) {

        isSuperGame = true;
        $('#playSuper').html('Super');
        $(".gameBoard").off("click");

      } else {

        isSuperGame = false;
        $('#playSuper').html('Standard');
        $(".gameSquare").off("click");

      }

      $(".gameBoard, .gameSquare").off("click")
                                .removeClass("X")
                                .removeClass("O")
                                .removeClass("draw")
                                .data("player","");
      //console.log(isSuperGame);
      //getMove();
    //}

      
  };
  $("#playSuper").on("click", toggleSuper);


  /******************************************
    Reset the board for another game
  ******************************************/
  var confirmResetBoard = function () {
    //console.log("Game Over: " + gameOver);
    if ( gameOver ) {
      //console.log("game over, do stuff");
      resetBoard();

      //$("#playAgain").slideUp(500);
      return true;

    } else if(confirm("Are you sure you want to discard this game?")) {
      resetBoard();
      return true;
    }
    return false;
  };

  var newGame = function() {
    resetBoard();
    $("#controls").slideUp(500);
    inputTypeX = ( $("#playerX").data("input") === "human" ) ? 0 : 1;
    inputTypeO = ( $("#playerO").data("input") === "human" ) ? 0 : 1;
    getMove();
  }
  $("#playAgain").on("click", newGame);







 












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
    // if ( isSuperGame && playerInput === 0 ) {
    //   $(".gameSquare").on("click", humanTurn);
    // } else if ( !isSuperGame && playerInput === 0 ) {
    //   $(".gameBoard").on("click", humanTurn);
    // } else {
    //   window.setTimeout(computerTurn, 1000);
    // }
    if ( playerInput === 1 ) {
      window.setTimeout(computerTurn, 1000);
    } else if ( isSuperGame ) {
      $(".gameSquare").on("click", humanTurn);
    } else {
      $(".gameBoard").on("click", humanTurn);
    }
  };

  /******************************************
    Control who makes the next move
  ******************************************/
  var getMove = function() {
    //console.log("make a move");
    if ( !gameOver ) {
      currentPlayer = findNextPlayer();
      if ( currentPlayer === "X" ) {
        selectPlayerInput(inputTypeX);
      } else {
        selectPlayerInput(inputTypeO);
      }
    }

    //console.log("Last Game Over: " + gameOver);
  };

//getMove();

});






















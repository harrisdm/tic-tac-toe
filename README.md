# tic-tac-toe


### Description
---
This is Project 0 for my GA Web Development Imersive course.
The task was to create a Tic-Tac-Toe game using client-side programming and the timeframe was 4 days


### Instructions
---
Load the page by going to http://harrisdm/github.io/tic-tac-toe
After the intro has played you can begin the game:
- Choose which side of the war you want to be on (**Empire** or **Rebels**)
- Set the 2nd player as either another person or play against the computer
- Decide which player is to go first
- Play on either the standard 3x3 board or the 9x9 "**Hyperspace**" board
- Click play to begin the game

##### The Hyperspace Board
The **Hyperspace** board is a 9x9 board made up of a 3x3 board made of 3x3 boards.
In order to win one of the main board squares you must win the mini game inside it.
The winner of the game is the first to create a winning line on the master board.
- There is a higher chance of a draw on this board so you need to keep focused

### Tech Used
---
- HTML
- CSS
- Javascript
- jQuery
- Local Storage
- Git.........lots of git!!

### Approach
---
I began the project by creating a fairly simple version of the regular Tic-Tac-Toe game using 
jQuery click event handlers. This allowed me to practice with the onClick event and work on
the game logic & sequencing.

Next I added features (on new git branches) such as:
- Keeping track of the games won
- Resetting the game counters
- Ability to play against the computer (random selection AI)

With a basic game I was happy with I moved on to integrating the 9x9 game. I added a control to 
switch boards and then began to adjust the logic to handle the extra squares. **This was not a good idea!!** 
I found that my existing code couldn't handle the extra squares without major duplication of code 
so I was brave ....scrapped development on that branch and branched out on a fresh start. With this 
empty canvas I rebuilt the game starting with the mini games first and working out. Re-using most of
my code but modifying it to handle the complexity.

After the I had all the features working I merged to master and branched again to start styling the page. 
I had a vision in my head and have achieved most of what I wanted.....to be continued

### The Good Bits
---
##### Win State Logic
I went through a few ideas for checking for a winner. I considered comparing the squares by
div#id, div.class and div Content but  decided to go with a data-attribute. This is because 
I wasn't going to be using the square's reference for styling (ruling out #id and .class) and 
I didn't want to use content as eventually I wanted to style the game using background images 
without text.

To actually make the comparisons, I used an array of possible win combinations and sequentially
checked for a win; matching the data-attribute values.

##### jQuery Traversing
While working on the logic for the game id decided to move away from referencing game squares 
by #id and went to refering to them by class. This could then be carried on through to the master 
board and allowed me to re-use most of the logic for both stages of the game.

Due to functioning out most of the work, I stored the game square being clicked as a global 
variable so that the functions could all access it.Knowing the item clicked I could use the
.parent(), .siblings() and .andSelf() jQuery selectors and simply vary them depending on the
board being played


### The Difficult Bits
---
##### 9x9 Board
Trying to integrate the larger board into my previous code proved very difficult and resulted 
in a very messy approach. Instead I took a step back and had a fresh look at the problem and 
how to have both game types compatible.

##### Controlling Computer AI
Although the selection process is quite simple (random move generator), making the computuer 
slow down to a human pace and prevent a backlog of function calls was a problem. Initially a 
user could pause the game and on restarting the computer would start making multilpe moves at 
once. I spent a lot of time working on this but fixing it for computer players broke it for 
human players. I resolved the issue by removing the feature completely. I felt it wasn't 
necessary for the project and was holding back other features.

### Further Work
---
- Finish the styling
- Add a better AI system for the computer






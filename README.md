# grid game 2x2
 A grid game created by Richard Fredlund, converted to javascript

To play you and another players should install the tampermonkey script, then go to lichess, to the inbox, open your opponent's inbox, and reload the page.

To create the grid, you should send a message like this
g[2,4,6,7,5]
where the numbers are: w,x,y,z,numberOfRounds
in the grid like:
w__x

y__z

You should choose either rows or columns (buttons [you will need to click them when the game starts, i.e. the grid is introduced first]: C1,C2 for columns, and R1,R2 for rows), and your opponent should choose the opposite.

After clicking the button, wait for your opponent's move, then you should see the current score.

Play until the number of rounds is zero, then reload the page to play again.

To do: 
- make the game renew without reloading
- fix bugs



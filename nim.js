/***********************************************************
 *                    THE GAME OF NIM                      *
 * Created by Rosie Zhao, Ran Tao, Yao Liu, and Marcel Goh *
 *                  of McGill University                   *
 *          for ConUHacks IV (26-27 January 2019)          *
 *             Ported to p5.js by Marcel Goh               *
 ***********************************************************
 */

//import processing.sound.*;

/* GLOBAL VARIABLES */
var g;
var chosenRow;         // restricts player to a specific row once chosen
var winLose;           // 1 if player won, -1 if CPU won, 0 otherwise
var startMin;          // number of items in top row to start
var startRows;         // number of rows

var levelOffset;       // offsets of green triangle
var rowOffset;
var misereOffset;
var musicOffset;

var menuScreen;    // are we on the menu screen?
var playersTurn;   // is it the player's turn?
var cpuEnabled;    // enable AI player
var misere;        // are we playing misere?
var soundtrack;    // chopin? 
var lonely;        // singleplayer?
var playerOneTurn; // player 1's turn?
var playerTwoTurn; // player 2's turn?
var quit;
var reset;
var myConfirm;
var playerOn;
var playerOff;
var playerOneOn;
var playerOneOff;
var playerTwoOn;
var playerTwoOff;
var cpuOn;
var cpuOff;
var canvas;
var win;
var win_p1;
var win_p2;
var lose;
var confirmNo;
var one_start;
var two_start;
var donut;
var select;
var titleFont;

var music;
var eatDonut;
var victory;
var boo;

var audioName1 = "data/tristesse.wav";
var path1;

var audioName2 = "data/sfx.wav";
var path2;

var audioName3 = "data/victory.wav";
var path3;

var audioName4 = "data/boo.wav";
var path4;

function Game(minItems,maxItems) {
  //var minItems;            // size of top row
  //var maxItems;            // size of bottom row
  //var table;             // current number of items in each row
  //var numRows;             // number of rows
  //var iconDim;             // side-length of a single (square) icon
  //var itemMatrix;     // the items in each row
  //var ran;

  /* constructs a heap with specified min/max row sizes */
  this.ran = new Robot();

  /* OLD JAVA CODE
  if (maxItems <= minItems) {
    throw new IllegalArgumentException("Invalid row sizes: HEAP()");
  }
  if (maxItems - minItems > 5) {
    throw new IllegalArgumentException("Number of rows cannot exceed 6");
  }
  */

  this.minItems = minItems;
  this.maxItems = maxItems;
  this.numRows = maxItems - minItems + 1;

  /* initialize table that counts items in each row */
  this.table = Array(this.numRows);
  for (var i=0; i<this.numRows; ++i) {
    this.table[i] = i+minItems;
  }

  /* determine size of icons */
  this.iconDim = 50;
  if (maxItems > 8) {
    this.iconDim = 480/maxItems;
  }
  /* buffer distance on either side of item */
  var bufferDist = this.iconDim / 8;
  var matrix = Array(this.numRows);
  for (var i=0; i<this.numRows; ++i) {
    matrix[i] = Array(maxItems);
  }

  /* start at bottom of screen */
  var y = 400 - (this.iconDim + bufferDist);

  /* loop through every row */
  for (var i=this.numRows-1; i>=0; --i) {
    var numItems = this.minItems + i;
    var x = (600 - ((numItems*(this.iconDim + 2*bufferDist)))) / 2;
    /* loop through number of items in row */
    for (var j=0; j<numItems; ++j) {
      /* create new item with unique coordinates */
      matrix[i][j] = new Item(x + bufferDist, y, this.iconDim, this.iconDim);
      x += this.iconDim + 2*bufferDist;
    }
    y -= this.iconDim + bufferDist;
  }

  this.itemMatrix = matrix

  /* the computer plays a turn */
  this.cpuNormalMove = function () {
    var mode = misere ? "misere" : "normal";
    var move = this.ran.nextMove(this.table, mode);
    var left = move[1];
    var correctRow = move[0];
    for (var i=0; i<this.minItems+correctRow; ++i) {
      if (!this.itemMatrix[correctRow][i].clicked) {
        this.itemMatrix[correctRow][i].clicked = true;
        eatDonut.play();
        --left;
      }
      if (left == 0) {
        break;
      }
    }
    this.table[correctRow] -= move[1];
    var won = true;
    for (var i=0; i<this.numRows; ++i) {
      if (this.table[i] != 0) {
        won = false;
        break;
      }
    }
    if (won) {
      this.winLose = misere ? 1 : -1;
    }
  }
}

function setup() {
  /* initialize game variables to defaults */
  chosenRow = -1;
  winLose = 0;
  startMin = 3;
  startRows = 3;
  if (lonely) {
    playersTurn = true;
  } else {
    playerOneTurn = true;
    playerTwoTurn = false;
  }
  menuScreen = true;
  misere = false;
  soundtrack = false;

  //path1 = sketchPath(audioName1);
  music = loadSound(audioName1);

  //path2 = sketchPath(audioName2);
  eatDonut = loadSound(audioName2);

  //path3 = sketchPath(audioName3);
  victory = loadSound(audioName3);

  //path4 = sketchPath(audioName4);
  boo = loadSound(audioName4);

  /* load images */
  donut = loadImage("data/donut_full.png");
  oneBite = loadImage("data/donut_onebite.png");
  twoBites = loadImage("data/donut_twobites.png");
  select = loadImage("data/select.png");
  quit = loadImage("data/quit.png");
  reset = loadImage("data/reset.png");
  myConfirm = loadImage("data/confirm.png");
  playerOn = loadImage("data/player_on.png");
  playerOff = loadImage("data/player_off.png");
  playerOneOn = loadImage("data/player1_on.png");
  playerOneOff = loadImage("data/player1_off.png");
  playerTwoOn = loadImage("data/player2_on.png");
  playerTwoOff = loadImage("data/player2_off.png");
  cpuOn = loadImage("data/cpu_on.png");
  cpuOff = loadImage("data/cpu_off.png");
  canvas = loadImage("data/background.png");
  win = loadImage("data/win.png");
  win_p1 = loadImage("data/win_p1.png");
  win_p2 = loadImage("data/win_p2.png");
  lose = loadImage("data/lose.png");
  confirmNo = loadImage("data/confirm_no.png");
  one_start = loadImage("data/one_p.png");
  two_start = loadImage("data/two_p.png");

  /* load fonts */
  titleFont = loadFont("data/munro-small.ttf");

  g = new Game(3,5);
  createCanvas(600, 450);
  background(0);
  noStroke();
  fill(102);
  noLoop();         // game does not automatically loop
}

function mousePressed() {
  if (menuScreen) {
    /* level 1 */
    if ((mouseX >= 50) && (mouseY >= 180) && (mouseX < 75) && (mouseY < 210)) {
      startMin = 3;
      levelOffset = 0;
    }
    /* level 2 */
    if ((mouseX >= 105) && (mouseY >= 180) && (mouseX < 130) && (mouseY < 210)) {
      startMin = 5;
      levelOffset = 55;
    }
    /* level 3 */
    if ((mouseX >= 160) && (mouseY >= 180) && (mouseX < 185) && (mouseY < 210)) {
      startMin = 7;
      levelOffset = 110;
    }
    /* level 4 */
    if ((mouseX >= 215) && (mouseY >= 180) && (mouseX < 240) && (mouseY < 210)) {
      startMin = 11;
      levelOffset = 165;
    }
    /* 3 rows */
    if ((mouseX >= 345) && (mouseY >= 180) && (mouseX < 370) && (mouseY < 210)) {
      startRows = 3;
      rowOffset = 0;
    }
    /* 4 rows */
    if ((mouseX >= 400) && (mouseY >= 180) && (mouseX < 425) && (mouseY < 210)) {
      startRows = 4;
      rowOffset = 55;
    }
    /* 5 rows */
    if ((mouseX >= 455) && (mouseY >= 180) && (mouseX < 485) && (mouseY < 210)) {
      startRows = 5;
      rowOffset = 110;
    }
    /* 6 rows */
    if ((mouseX >= 510) && (mouseY >= 180) && (mouseX < 533) && (mouseY < 210)) {
      startRows = 6;
      rowOffset = 165;
    }
    /* misere on */
    if ((mouseX >= 65) && (mouseY >= 280) && (mouseX < 110) && (mouseY < 310)) {
      misere = true;
      misereOffset = -100;
    }
    /* misere off */
    if ((mouseX >= 157) && (mouseY >= 280) && (mouseX < 217) && (mouseY < 310)) {
      misere = false;
      misereOffset = 0;
    }
    /* music on */
    if ((mouseX >= 365) && (mouseY >= 280) && (mouseX < 410) && (mouseY < 310)) {
      soundtrack = true;
      musicOffset = -100;
    }
    /* music off */
    if ((mouseX >= 457) && (mouseY >= 280) && (mouseX < 517) && (mouseY < 310)) {
      soundtrack = false;
      musicOffset = 0;
    }
    /* 1P start */
    if ((mouseX >= 40) && (mouseY >= 340) && (mouseX < 240) && (mouseY < 420)) {
      lonely = true;
      g = new Game(startMin, startMin + startRows - 1);
      menuScreen = false;
      /* load sound */
      if (soundtrack){
        music.loop();
      }
    }
    /* 2P start */
    if ((mouseX >= 360) && (mouseY >= 340) && (mouseX < 560) && (mouseY < 420)) {
      lonely = false;
      g = new Game(startMin, startMin + startRows - 1);
      menuScreen = false;
      /* load sound */
      if (soundtrack){
        music.loop();
      }
    }

  } else if ((playersTurn || playerOneTurn || playerTwoTurn) && winLose == 0) {
    /* check if any doughnuts are clicked */
    for (var i=0; i<g.numRows; ++i) {
      var numItems = g.minItems + i;
      for (var j=0; j<numItems; ++j) {
        var currItem = g.itemMatrix[i][j];
        if ((mouseX >= currItem.x) && (mouseX < currItem.x + currItem.width) &&
            (mouseY >= currItem.y) && (mouseY < currItem.y + currItem.height)) {
          if ((chosenRow == -1 || chosenRow == i) && !currItem.clicked) {
            currItem.clicked = true;
            eatDonut.play();
            --g.table[i];
            chosenRow = i;
          }
          var won = true;
          /* ACHIEVEMENT UNLOCKED! (Triple for-loop) */
          for (var k=0; k<g.numRows; ++k) {
            if (g.table[k] != 0) {
              won = false;
              break;
            }
          }
          if (won) {
            winLose = misere ? -1 : 1;
          }
          break;
        }
      }
    }

    /* check if confirm button clicked */
    if ((mouseX >= 250) && (mouseX < 350) && (mouseY >= 410) && (mouseY < 450) && (chosenRow != -1)) {
      chosenRow = -1;
      if (lonely){
        g.cpuNormalMove();
      } else {
        playerOneTurn = playerOneTurn ? false : true;
        playerTwoTurn = playerTwoTurn ? false : true;
      }
    }
  }

  /* check if quit button clicked */
  if ((mouseX >= 550) && (mouseX < 600) && (mouseY >= 430) && (mouseY < 450)) {
    playersTurn = true;
    playerOneTurn = true;
    playerTwoTurn = false;
    chosenRow = -1;
    winLose = 0;
    music.stop();
    menuScreen = true;
  }

  /* check if reset button clicked */
  if ((mouseX >= 500) && (mouseX < 550) && (mouseY >= 430) && (mouseY < 450)) {
    g = new Game(g.minItems,g.maxItems);
    playersTurn = true;
    playerOneTurn = true;
    playerTwoTurn = false;
    chosenRow = -1;
    winLose = 0;
  }

  /* update the screen */
  redraw();
}

function draw() {
  background(0);
  image(canvas, 0, 0, 600, 450);
  if (menuScreen) {
    fill(255);
    textAlign(CENTER, CENTER);
    //game title
    textFont(titleFont);
    text("NIM", 305, 75);
    donut.resize(80, 80);
    image(donut, 60, 40);
    image(donut, 460, 40);

    //customization headings
    textSize(42);
    text("LEVEL:", 150, 150);
    text("NUMBER OF ROWS:", 450, 150);
    text("MISERE MODE:", 150, 250);
    text("MUSIC:", 450, 250);

    //level options
    textSize(50);
    text("1", 65, 195);
    text("2", 120, 195);
    text("3", 175, 195);
    text("4", 230, 195);

    //number of row options
    text("3", 360, 195);
    text("4", 415, 195);
    text("5", 470, 195);
    text("6", 525, 195);

    //misere mode options
    text("ON", 90, 295);
    text("OFF", 190, 295);

    //music options
    text("ON", 390, 295);
    text("OFF", 490, 295);

    //start buttons
    image(one_start, 40, 340);
    image(two_start, 360, 340);

    //selector positions
    select.resize(18, 15);
    //level
    image(select, 57+levelOffset, 215);
    //row
    image(select, 345+rowOffset, 215);
    //misere
    image(select, 178+misereOffset, 315);
    //music
    image(select, 478+musicOffset, 315);
  } else {
    /* draw doughnuts */
    console.log(g.numRows);
    /* print item matrix to screen */
    for (let i=0; i<g.numRows; ++i) {
      console.log("first for loop")
      let numItems = g.minItems + i;
      for (let j=0; j<numItems; ++j) {
        console.log("snd for loop")
        if (!g.itemMatrix[i][j].clicked) {
          let p = g.itemMatrix[i][j];
          image(p.icon, p.x, p.y, p.width, p.height);
        }
      }
    }
    /*
    this.show = function () {
      if (!this.clicked) {
        image(this.icon, this.x, this.y, this.width, this.height);
      }
    }
    */

    /* draw buttons */
    image(quit, 550, 430, 50, 20);   // quit button
    image(reset, 500, 430, 50, 20);  // reset button
    if (chosenRow == -1) {           // confirm button
      image(confirmNo, 250, 410, 100, 40);
    } else {
      image(myConfirm, 250, 410, 100, 40);
    }

    if (lonely) {
      /* draw player/CPU icons */
      if (playersTurn) {
        image(playerOn, 0, 0, 100, 40);
        image(cpuOff, 527, 0, 100, 40);
      } else {
        image(playerOff, 0, 0, 100, 40);
        image(cpuOn, 527, 0, 100, 40);
      }
    } else {
      //2p turns
        if (playerOneTurn) {
        image(playerOneOn, 0, 0, 100, 40);
        image(playerTwoOff, 500, 0, 100, 40);
      } else {
        image(playerOneOff, 0, 0, 100, 40);
        image(playerTwoOn, 500, 0, 100, 40);
      }
    }

    /* draw win/lose icons */
    if (winLose == 1) {
      if (lonely) {
        image(win, 200, 185, 200, 80);
        victory.cue(6);
        victory.play();
      } else if (playerOneTurn) {
        image(win_p1, 200, 185, 200, 80);
        victory.cue(6);
        victory.play();
      } else {
        image(win_p2, 200, 185, 200, 80);
        victory.cue(6);
        victory.play();
      }
    }
    if (winLose == -1) {
      if (lonely) {
        image(lose, 200, 185, 200, 80);
        boo.play();
      } else if (playerOneTurn) {
        //P1 lost so P2 won
        image(win_p2, 200, 185, 200, 80);
        victory.cue(6);
        victory.play();
      } else {
        //P2 lost so P1 won
        image(win_p1, 200, 185, 200, 80);
        victory.cue(6);
        victory.play();
      }
    }

  }
}

function Item(x,y,width,height) {
  //PImage icon;     // image object
  //var x;           // x-coordinate
  //var y;           // y-coordinate
  //var width;       // display width
  //var height;      // display height
  //var clicked; // has item been clicked?

  /* Create new icon with specified png file
  constructor(filename, x, y, width, height) {
    this.icon = loadImage(filename);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.clicked = false;
  }
  */

  /* Use default png file */
  this.icon = loadImage("data/donut_full.png");
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.clicked = false;

  this.animate = function () {
    this.icon = oneBite;
    delay(300);
    redraw();

    this.icon = twoBites;
    delay(300);
    redraw();

    this.clicked = true;
  }
}

function Robot() {
  this.nextMove = function (heaps, gameType) {

    //assert heaps != null;

    var is_misere = (gameType === "misere");
    var move = Array(2);

    //general strategy is identical for misere and normal play, until endgame state
    //endgame is defined as if there are about to be only heaps of size one left
    var endgame = false;

    //count number of heaps that have strictly more than one items left
    var moreThanOne = 0;
    for (var i=0; i<heaps.length; i++) {
      if (heaps[i] > 1) {
        moreThanOne++;
      }
    }

    //endgame occurs if we have only 1 or 0 heaps with strictly more than one items
    endgame = (moreThanOne <= 1);

    //in a misere game and endgame state
    //make a move that will end with an odd number of heaps all containing 1
    if (is_misere && endgame) {

      //count number of nonempty heaps
      var moves_left=0;
      for (var i=0; i<heaps.length; i++) {
        if (heaps[i] != 0) {
          moves_left++;
        }
      }

      //checks if we have an odd number of nonempty heaps
      //and the max number of items out of all of the heaps
      var odd_heaps = (moves_left % 2 == 1);
      var max_items = findMax(heaps);

      //if maximum number of items is 1, i.e. we only have heaps of size 1 left
      //and there are an odd number of such heaps
      //robot doesn't have a winning move, therefore leave random move
      if (max_items == 1 && odd_heaps) {
        return this.randomMove(heaps);
      }

      //we want to remove from the row that has 1 item
      //results in an odd number of heaps of size 1
      var index_of_max = findIndex(heaps, max_items);
      move[0] = index_of_max;

      var boolInt = (odd_heaps) ? 1 : 0;
      move[1] = max_items - boolInt;

      return move;
    }

    //if we aren't in misere or endgame, then the gameplay is the same!
    //find nimsum and try to make it 0:
    var nimSum = this.calcNimSum(heaps);

    if (nimSum == 0){
      //no winning move if nimsum is 0
      return this.randomMove(heaps);
    }

    //nimSum doesn't equal 0 so the bot has a winning move
    for (var i=0; i<heaps.length; i++) {
      var target_size = heaps[i] ^ nimSum;
      if (target_size < heaps[i]) {
        move[0]= i;
        move[1]= heaps[i] - target_size;
        return move;
      }
    }
    move[0] = 0;
    move[1] = 0;
    return move;
  }

  //helper methods!

  //max of int array
  this.findMax = function (arr) {
    //assume max is first entry
    var max = arr[0];
    for (var i = 0; i<arr.length; i++) {
      if (arr[i] > max) {
        max = arr[i];
      }
    }
    return max;
  }

  //index of max
  this.findIndex = function (arr, max) {
    for (var i=0; i<arr.length; i++) {
      if (arr[i] == max) {
        return i;
      }
    }
    //dummy return
    return 0;
  }

  //generates a random move if robot can't win
  this.randomMove = function (heaps) {
    var retTable = Array(2);
    while(true){
      var r = int((random(heaps.length)));
      if (heaps[r] != 0) {
        retTable[0] = r;
        break;
      }
    }

    var n = int(random(1, heaps[retTable[0]]+1));
    //random integer from 1 to heaps[r] inclusive
    retTable[1] = n;

    return retTable;
  }

  //calculates nimsum
  this.calcNimSum = function (heaps) {
    var toReturn = heaps[0];

    for (var i=1; i<heaps.length; i++) {
      toReturn = toReturn ^ heaps[i];
    }
    return toReturn;
  }

}

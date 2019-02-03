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
  titleFont = loadFont("MunroSmall-172.vlw");

  g = Game(3,5);
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
      g = Game(startMin, startMin + startRows - 1);
      menuScreen = false;
      /* load sound */
      if (soundtrack){
        music.loop();
      }
    }
    /* 2P start */
    if ((mouseX >= 360) && (mouseY >= 340) && (mouseX < 560) && (mouseY < 420)) {
      lonely = false;
      g = Game(startMin, startMin + startRows - 1);
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
    g = Game(g.minItems,g.maxItems);
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
    g.display();

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
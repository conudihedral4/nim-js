class Game {
  //var minItems;            // size of top row
  //var maxItems;            // size of bottom row
  //var table;             // current number of items in each row
  //var numRows;             // number of rows
  //var iconDim;             // side-length of a single (square) icon
  //var itemMatrix;     // the items in each row
  //var ran;

  /* constructs a heap with specified min/max row sizes */
  constructor(minItems, maxItems) {
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
    this.table = Array(numRows);
    for (var i=0; i<numRows; ++i) {
      this.table[i] = i+minItems;
    }

    /* determine size of icons */
    this.iconDim = 50;
    if (maxItems > 8) {
      this.iconDim = 480/maxItems;
    }

    /* fill matrix */
    this.itemMatrix = createMatrix();
  }

  /* the computer plays a turn */
  cpuNormalMove() {
    var mode = misere ? "misere" : "normal";
    var move = ran.nextMove(this.table, mode);
    var left = move[1];
    var correctRow = move[0];
    for (var i=0; i<minItems+correctRow; ++i) {
      if (!itemMatrix[correctRow][i].clicked) {
        itemMatrix[correctRow][i].clicked = true;
        eatDonut.play();
        --left;
      }
      if (left == 0) {
        break;
      }
    }
    table[correctRow] -= move[1];
    var won = true;
    for (var i=0; i<numRows; ++i) {
      if (table[i] != 0) {
        won = false;
        break;
      }
    }
    if (won) {
      winLose = misere ? 1 : -1;
    }
  }

  /* create and fill matrix with items at correct places */
  createMatrix() {
    /* buffer distance on either side of item */
    var bufferDist = iconDim / 8;
    var matrix = Array(numRows);
    for (var i=0; i<numRows; ++i) {
      matrix[i] = Array(maxItems);
    }

    /* start at bottom of screen */
    var y = 400 - (iconDim + bufferDist);

    /* loop through every row */
    for (var i=numRows-1; i>=0; --i) {
      var numItems = minItems + i;
      var x = (600 - ((numItems*(iconDim + 2*bufferDist)))) / 2;
      /* loop through number of items in row */
      for (var j=0; j<numItems; ++j) {
        /* create new item with unique coordinates */
        matrix[i][j] = Item(x + bufferDist, y, iconDim, iconDim);
        x += iconDim + 2*bufferDist;
      }
      y -= iconDim + bufferDist;
    }

    return matrix;
  }

  /* print item matrix to screen */
  display() {
    for (var i=0; i<numRows; ++i) {
      var numItems = minItems + i;
      for (var j=0; j<numItems; ++j) {
        itemMatrix[i][j].display();
      }
    }
  }

}

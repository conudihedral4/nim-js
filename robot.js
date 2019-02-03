class Robot {
  nextMove(heaps, gameType) {

    //assert heaps != null;

    var is_misere = (gameType.equalsIgnoreCase("misere"));
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
        return randomMove(heaps);
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
    var nimSum = calcNimSum(heaps);

    if (nimSum == 0){
      //no winning move if nimsum is 0
      return randomMove(heaps);
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
  findMax(arr) {
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
  findIndex(arr, max) {
    for (var i=0; i<arr.length; i++) {
      if (arr[i] == max) {
        return i;
      }
    }
    //dummy return
    return 0;
  }

  //generates a random move if robot can't win
  randomMove(heaps) {
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
  calcNimSum(heaps) {
    var toReturn = heaps[0];

    for (var i=1; i<heaps.length; i++) {
      toReturn = toReturn ^ heaps[i];
    }
    return toReturn;
  }

}

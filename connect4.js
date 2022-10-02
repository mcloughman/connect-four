/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

var currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard(h, w) {
  // Take inputs for height and width
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array

  for (let i = 0; i < h; i++) {
    let row = [];
    for (let j = 0; j < w; j++) {
      row.push(null);
    }
    board.push(row);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector("#board");
  // TODO: add comment for this code
  // The top row is unique compared to other rows so we create it separately and give it a unique id. Then we add a click event listener
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  // then we add the individual cells to the top row and we set the x variable as each cell's unique id. We then append the cell to the top row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  // append the top row to the board
  htmlBoard.append(top);

  // TODO: add comment for this code
  // Now we make the game table where the pieces will be placed
  // The instruction for section 5 placeInTable say that we should at least be able to see our piece at the bottom row of the correct column. The way I achieved this was to count backwards on height so bottom row is index 0
  for (let y = HEIGHT - 1; y >= 0; y--) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");

      // we need to be able to identfy each cell uniquely
      // I wanted to use data-it. but my prettier code formatter kept overriding it
      cell.setAttribute("id", `${y}-${x}`);

      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  // I think I have it this time, we start at 0 which is our bottom row the way i created the board, then we check to see if the x position in the row is null. If so, we know that the position is not filled and we can use it so we return y. If we iterate over each row and the x position is filled in each row, we return null
  for (let y = 0; y < board.length; y++) {
    if (board[y][x] === null) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const pieceDiv = document.createElement("div");
  pieceDiv.classList.add("piece");
  // there might be a more concise way than what I have below. Perhaps, in addition to that, I could just use an else statement and not else if. But if gameOver and no active players.......(Probably doesn't matter)
  if (currPlayer === 1) {
    pieceDiv.classList.add("p1");
    pieceDiv.classList.remove("p2");
  } else if (currPlayer === 2) {
    pieceDiv.classList.add("p2");
    pieceDiv.classList.remove("p1");
  }

  const squareToPlacePiece = document.getElementById(`${y}-${x}`);
  squareToPlacePiece.append(pieceDiv);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call endGame
  // check if every space in memory is filled, since we initialize every value in the board to be null. Then with each click, we check to see if every position is NOT null. If it evaluates to false, then we know that at least one value is equal to null and therefore the board is NOT filled
  let isBoardFilled = board.every((row) =>
    row.every((element) => element !== null)
  );
  console.log(isBoardFilled);
  if (isBoardFilled) {
    return endGame(`It's a draw!`);
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer === 1 ? (currPlayer = 2) : (currPlayer = 1);
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  // create subarrays all with length of 4 that will be used to check to see if there's a winner. if one of the players has all of the values in one of these subarrays, that player wins.
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard(HEIGHT, WIDTH);
makeHtmlBoard();

function Player(name, symbol) {
  const getName = () => name;
  const getSymbol = () => symbol;

  return { getName, getSymbol };
}

function Cell() {
  let value = "";

  const getValue = () => value;
  const setValue = (newValue) => {
    if (value === "") {
      value = newValue;
    }
  };

  return { getValue, setValue };
}

const Gameboard = (() => {
  const board = [];

  const init = () => {
    for (let i = 0; i < 3; i += 1) {
      board[i] = [];
      for (let j = 0; j < 3; j += 1) {
        board[i].push(Cell());
      }
    }
  };
  const getBoard = () => board;
  const printBoard = () => {
    board.map((row) => console.log(row.map((cell) => cell.getValue())));
  };
  const placeSymbol = (cell, symbol) => {
    cell.setValue(symbol);
  };
  // placeSymbol - if Cell is empty, check active player, Cell.setValue(newValue)

  return { init, getBoard, printBoard, placeSymbol };
})();

const GameController = (() => {
  const players = [];

  let activePlayer = players[0];

  const addPlayer = (name, symbol) => {
    if (players.length === 2) {
      alert("Error: Already two players present.");
    } else {
      players.push(Player(name, symbol));
    }
  };
  const togglePlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    console.log(`${activePlayer.getName()}'s turn.`);
  };
  const getActivePlayer = () => activePlayer;
  // check win condition

  return { addPlayer, togglePlayerTurn, getActivePlayer };
})();

const DisplayController = (() => {
  const gameboardDiv = document.getElementById("gameboard");

  const clearBoard = () => {
    while (gameboardDiv.firstChild) {
      gameboardDiv.removeChild(gameboardDiv.lastChild);
    }
  };
  const fillBoard = () => {
    Gameboard.getBoard().forEach((row) => {
      row.forEach((cell) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.textContent = cell.getValue();
        cellDiv.addEventListener("click", () => {
          Gameboard.placeSymbol(
            cell,
            GameController.getActivePlayer().getSymbol()
          );
          GameController.togglePlayerTurn();
          DisplayController.clearBoard();
          DisplayController.fillBoard();
          // + call check win condition
        });

        gameboardDiv.appendChild(cellDiv);
      });
    });
  };

  return { clearBoard, fillBoard };
})();

GameController.addPlayer("Mike", "O");
GameController.addPlayer("Betty", "X");
GameController.togglePlayerTurn();

Gameboard.init();
DisplayController.fillBoard();

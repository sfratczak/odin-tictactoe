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
    let isValidPlacement = false;

    if (cell.getValue() === "") {
      cell.setValue(symbol);
      isValidPlacement = true;
    }

    return isValidPlacement;
  };
  const getNumberedBoard = () => {
    const numberedBoard = board.map((rows) =>
      rows.map((cell) => {
        if (cell.getValue() === "X") {
          return 1;
        }
        if (cell.getValue() === "O") {
          return -1;
        }

        return 0;
      })
    );

    return numberedBoard;
  };

  return { init, getBoard, printBoard, placeSymbol, getNumberedBoard };
})();

const GameController = (() => {
  const players = [];

  let activePlayer = players[0];
  let gameOver = false;

  const addPlayer = (name, symbol) => {
    if (players.length === 2) {
      DisplayController.setStatus("Error: Already two players present.");
    } else {
      players.push(Player(name, symbol));
    }
  };
  const togglePlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    DisplayController.setStatus(`${activePlayer.getName()}'s turn.`);
  };
  const getActivePlayer = () => activePlayer;
  const checkWinCondition = () => {
    const numBoard = Gameboard.getNumberedBoard();
    const row1sum = numBoard[0].reduce((a, b) => a + b, 0);
    const row2sum = numBoard[1].reduce((a, b) => a + b, 0);
    const row3sum = numBoard[2].reduce((a, b) => a + b, 0);
    const col1sum = numBoard[0][0] + numBoard[1][0] + numBoard[2][0];
    const col2sum = numBoard[0][1] + numBoard[1][1] + numBoard[2][1];
    const col3sum = numBoard[0][2] + numBoard[1][2] + numBoard[2][2];
    const diag1sum = numBoard[0][0] + numBoard[1][1] + numBoard[2][2];
    const diag2sum = numBoard[0][2] + numBoard[1][1] + numBoard[2][0];
    const winConditions = [
      row1sum,
      row2sum,
      row3sum,
      col1sum,
      col2sum,
      col3sum,
      diag1sum,
      diag2sum,
    ];

    if (winConditions.includes(-3)) {
      gameOver = true;
      DisplayController.setStatus("WINNER O");
    }
    if (winConditions.includes(3)) {
      gameOver = true;
      DisplayController.setStatus("WINNER X");
    }
  };
  const isGameOver = () => gameOver;

  return {
    addPlayer,
    togglePlayerTurn,
    getActivePlayer,
    checkWinCondition,
    isGameOver,
  };
})();

const DisplayController = (() => {
  const gameboardDiv = document.getElementById("gameboard");
  const statusTextDiv = document.getElementById("status-text");

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

        if (cell.getValue() === "X") {
          const xFull = document.createElement("img");
          xFull.src = "./img/x-full.svg";

          cellDiv.appendChild(xFull);
        } else if (cell.getValue() === "O") {
          const xFull = document.createElement("img");
          xFull.src = "./img/o-full.svg";

          cellDiv.appendChild(xFull);
        }

        cellDiv.addEventListener("click", () => {
          if (GameController.isGameOver()) {
            return;
          }

          if (
            Gameboard.placeSymbol(
              cell,
              GameController.getActivePlayer().getSymbol()
            )
          ) {
            GameController.togglePlayerTurn();
            DisplayController.clearBoard();
            DisplayController.fillBoard();
            GameController.checkWinCondition();
          }
        });

        gameboardDiv.appendChild(cellDiv);
      });
    });
  };

  const setStatus = (str) => {
    statusTextDiv.textContent = str;
  };

  return { clearBoard, fillBoard, setStatus };
})();

GameController.addPlayer("Mike", "O");
GameController.addPlayer("Betty", "X");
GameController.togglePlayerTurn();

Gameboard.init();
DisplayController.fillBoard();

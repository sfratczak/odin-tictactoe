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
    board.length = 0;

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

  const restartButton = document.querySelector(".btn-restart");

  let activePlayer = players[0];
  let gameOver = false;

  const playerNameSetup = () => {
    const playerOneInput = document.getElementById("player-one-name");
    const playerTwoInput = document.getElementById("player-two-name");
    const beginBtn = document.querySelector(".btn-begin");

    DisplayController.revealButton(beginBtn);
    DisplayController.hideBoardDiv();
    DisplayController.setStatus("Add players to begin the game.");

    beginBtn.addEventListener("click", () => {
      players.length = 0;

      if (playerOneInput.value !== "") {
        GameController.addPlayer(playerOneInput.value, "O");
      } else {
        GameController.addPlayer("Player 1", "O");
      }

      DisplayController.setPlayerDivCSSActive(".player-one");

      if (playerOneInput.value !== "") {
        GameController.addPlayer(playerTwoInput.value, "X");
      } else {
        GameController.addPlayer("Player 2", "X");
      }

      DisplayController.setPlayerDivCSSActive(".player-two");

      DisplayController.hideButton(beginBtn);
      DisplayController.revealBoardDiv();
      GameController.newGame();
    });
  };
  const newGame = () => {
    gameOver = false;
    Gameboard.init();
    DisplayController.clearBoard();
    DisplayController.fillBoard();
    // Choose a random active player at the start of the game
    activePlayer = players[Math.round(Math.random())];
    DisplayController.setStatus(`${activePlayer.getName()}'s turn.`);

    restartButton.addEventListener("click", GameController.newGame);
  };
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
    const isBoardFull = () =>
      numBoard.filter((row) => row.includes(0)).length === 0;

    if (winConditions.includes(-3) || winConditions.includes(3)) {
      gameOver = true;
      DisplayController.setStatus(
        `${GameController.getActivePlayer().getName()} wins!`
      );
      DisplayController.procGameOverLayout();
    }
    if (isBoardFull() && !gameOver) {
      gameOver = true;
      DisplayController.setStatus("Game Over. Nobody wins!");
      DisplayController.procGameOverLayout();
    }
  };
  const isGameOver = () => gameOver;

  return {
    addPlayer,
    newGame,
    togglePlayerTurn,
    getActivePlayer,
    checkWinCondition,
    isGameOver,
    playerNameSetup,
  };
})();

const DisplayController = (() => {
  const gameboardContainer = document.querySelector(".gb-container");
  const gameboardDiv = document.getElementById("gameboard");
  const statusTextDiv = document.getElementById("status-text");
  const restartBtn = document.querySelector(".btn-restart");

  const xFull = document.createElement("img");
  xFull.src = "./img/x-full.svg";
  xFull.alt = "X";

  const xEmpty = document.createElement("img");
  xEmpty.src = "./img/x-empty.svg";
  xEmpty.alt = "X";

  const oFull = document.createElement("img");
  oFull.src = "./img/o-full.svg";
  oFull.alt = "O";

  const oEmpty = document.createElement("img");
  oEmpty.src = "./img/o-empty.svg";
  oEmpty.alt = "O";

  const hideBoardDiv = () => {
    gameboardContainer.style.display = "none";
  };
  const revealBoardDiv = () => {
    gameboardContainer.style.display = "grid";
  };
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
          cellDiv.appendChild(xFull.cloneNode());
        } else if (cell.getValue() === "O") {
          cellDiv.appendChild(oFull.cloneNode());
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
  const setPlayerDivCSSActive = (playerDivClassName) => {
    const playerDiv = document.querySelector(playerDivClassName);
    const plusLabel = playerDiv.querySelector("label");
    const input = playerDiv.querySelector("input");
    const playerName = document.createElement("div");
    playerName.classList.add("player-name");

    if (playerDivClassName === ".player-one") {
      if (input.value !== "") {
        playerName.textContent = input.value;
      } else {
        playerName.textContent = "Player 1";
      }

      plusLabel.remove();
      input.remove();

      playerDiv.appendChild(oEmpty);
      playerDiv.appendChild(playerName);
    } else if (playerDivClassName === ".player-two") {
      if (input.value !== "") {
        playerName.textContent = input.value;
      } else {
        playerName.textContent = "Player 2";
      }

      plusLabel.remove();
      input.remove();

      playerDiv.appendChild(xEmpty);
      playerDiv.appendChild(playerName);
    }

    if (playerDiv.classList.contains("border-2px-dashed")) {
      playerDiv.classList.remove("border-2px-dashed");
      playerDiv.classList.add("border-2px");
    }
  };
  const hideButton = (button) => {
    button.style.display = "none";
  };
  const revealButton = (button) => {
    button.style.display = "inline-block";
  };
  const setBorderWidth = (target, pixels) => {
    const borderOptions = {
      2: "border-2px",
      4: "border-4px",
      8: "border-8px",
    };

    // first remove border, if there is any
    Object.values(borderOptions).forEach((value) => {
      if (target.classList.contains(value)) {
        target.classList.remove(value);
      }
    });

    if (pixels !== 0) {
      target.classList.add(borderOptions[pixels]);
    }
  };
  const procGameOverLayout = () => {
    // 1. Make restart button filled
    if (!restartBtn.classList.contains("filled")) {
      restartBtn.classList.add("filled");
    }
    // 2. Remove fat border from gameboard
    setBorderWidth(gameboardContainer, 0);
    // 3. Leave winning three symbols on gameboard full, make the rest empty
    // 4. Change winning player's card symbol to full
    // 5. Proc the confetti on status text
  };

  return {
    clearBoard,
    fillBoard,
    setStatus,
    setPlayerDivCSSActive,
    hideBoardDiv,
    revealBoardDiv,
    hideButton,
    revealButton,
    procGameOverLayout,
  };
})();

GameController.playerNameSetup();

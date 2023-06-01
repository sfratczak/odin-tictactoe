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

  for (let i = 0; i < 3; i += 1) {
    board[i] = [];
    for (let j = 0; j < 3; j += 1) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;
  const printBoard = () => {
    board.map((row) => console.log(row.map((cell) => cell.getValue())));
  };

  return { getBoard, printBoard };
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

  return { addPlayer, togglePlayerTurn };
})();

GameController.addPlayer("Mike", "O");
GameController.addPlayer("Betty", "X");
GameController.togglePlayerTurn();

Gameboard.printBoard();

function Player(name, symbol) {
  const getName = () => name;
  const getSymbol = () => symbol;

  return { getName, getSymbol };
}

const Gameboard = (() => {
  const board = [];

  for (let i = 0; i < 3; i += 1) {
    board[i] = [];
    for (let j = 0; j < 3; j += 1) {
      board[i].push(/* Cell */);
    }
  }

  const getBoard = () => board;

  return { getBoard };
})();

const GameController = (() => {
  const board = Gameboard();

  const players = [];

  const activePlayer = players[0];

  const addPlayer = (name, symbol) => {
    if (players.length === 2) {
      alert("Error: Already two players present.");
    } else {
      players.push(Player(name, symbol));
    }
  };

  return { addPlayer };
})();

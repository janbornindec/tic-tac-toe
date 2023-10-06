//gameboard object using module pattern
const Gameboard = (function() {
    const board = [];
    for (let i = 0; i < 9; i++) {
        board[i] = ' ';
    };

    const addToken = (selectedCell,player) => {
        const availableCells = board.filter((cell) => cell === ' ');
        if (availableCells.length === 0) {
            return;
        } else {
            selectedCell = player.getMarker();
        };
    };

    const getBoard = () => board;

    return {getBoard, addToken};

})();

//players object using factory 
const Player = (name,marker) => {
    const getName = () => name;
    const getMarker = () => marker;
    return {getName,getMarker};
};

const playerOne = Player("Player One", "X");
const playerTwo = Player("Player Two", "O");

//controller object using module pattern 
const GameController = (function() {

    let activePlayer = playerOne;
    const switchTurn = () => {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    };
    const getActivePlayer = () => activePlayer;

    return {switchTurn,getActivePlayer};
    
})();

//controller object using module pattern 
const ScreenController = (function() {

    const board = Gameboard.getBoard();
    //render board
    for (i in board) {
        const boardContainer = document.querySelector('#board');
        const cellButton = document.createElement('button');
        cellButton.classList.add("cell");

        cellButton.textContent = board[i];
        boardContainer.appendChild(cellButton);
    };

    return {};
    
})();


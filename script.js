//gameboard object using module pattern
const Gameboard = (function() {
    const board = [];
    for (let i = 0; i < 9; i++) {
        board[i] = '';
    };    

    const availableCells = board.filter((cell) => cell === '');

    const addToken = (selectedCell, player) => {
        if (availableCells.length === 0) {
            return;
        } else {
            selectedCell.textContent = player.getMarker();
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

//game logic
const GameController = (function() {

    const playerOne = Player("Player One", "X");
    const playerTwo = Player("Player Two", "O");
    let activePlayer = playerOne;

    const switchTurn = () => {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    };
    const getActivePlayer = () => activePlayer;

    const playRound = (selectedCell) => {
        Gameboard.addToken(selectedCell, getActivePlayer());
        console.log(`${activePlayer.getName()} dropped their marker.`);
    };

    return {switchTurn, getActivePlayer, playRound};

})();

//anything that shows on screen, rendering
const ScreenController = (function() {
    const boardContainer = document.querySelector('#board');
    const turnContainer = document.querySelector('#turn');
    const newGameBtn = document.createElement("button");
    newGameBtn.classList.add("new");
    newGameBtn.textContent = "New Game";

    const newScreen = () => {
        boardContainer.textContent = "";
        turnContainer.textContent = "";

        const board = Gameboard.getBoard();    
        //render board
        for (i in board) {
            const cellButton = document.createElement('button');
            cellButton.classList.add("cell");
            cellButton.textContent = board[i];
            boardContainer.appendChild(cellButton);
        }; 
    };

    const updateTurn = () => {
        turnContainer.textContent = `It's ${GameController.getActivePlayer().getName()}'s turn.`;
    };

    const buttonHandler = (e) => {
        const selectedCell = e.target;
        GameController.playRound(selectedCell);
        GameController.switchTurn();
        updateTurn();
    };

    //check if board is full
    const checkBoard = () => {
        const disabledBtn = document.querySelectorAll(".disabled");
        if (disabledBtn.length === 9) {
            turnContainer.textContent = "";
            turnContainer.appendChild(newGameBtn);
        };
    };

    //make the chosen cell unable to click
    const checkCell = (e) => {
        if (e.target.textContent !== "") {
            e.target.disabled = true;
            e.target.classList.add("disabled");
        };
        checkBoard();
    }
    
    boardContainer.addEventListener("mousemove", checkCell);
    boardContainer.addEventListener("click", buttonHandler);
    newGameBtn.addEventListener("click", newScreen);
    newScreen();
    updateTurn();
})();

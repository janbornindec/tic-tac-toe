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
            board[selectedCell.id] = selectedCell.textContent; //logging marker it into the board object
            selectedCell.disabled = true; //make the chosen cell unclickable
            selectedCell.classList.add("disabled"); 
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
    const playerTwo = Player("Computer", "O");
    let activePlayer = playerOne;

    const switchTurn = () => {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    };
    const getActivePlayer = () => activePlayer;

    const playRound = (selectedCell) => {
        Gameboard.addToken(selectedCell, getActivePlayer());
        console.log(`${activePlayer.getName()} dropped their marker.`);
    };

    function checkWin(board) {
        let winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        
        for (let pattern of winPatterns) {
            if (board[pattern[0]] == board[pattern[1]] && board[pattern[1]] == board[pattern[2]] && board[pattern[0]] !== "") {
                return true;
            };
        };

        return false;
    };
    
    return {switchTurn, getActivePlayer, playRound, checkWin};

})();

//anything that shows on screen, rendering
const ScreenController = (function() {
    const boardContainer = document.querySelector('#board');
    const turnContainer = document.querySelector('#turn');
    const newGameBtn = document.createElement("button");
    newGameBtn.classList.add("new");
    newGameBtn.textContent = "New Game";
    const startGameBtn = document.querySelector(".start");
    const board = Gameboard.getBoard();  

    //start the game when click the start button
    const startGame = () => {
        renderBtn();
        //show the board
        boardContainer.style.display = "grid";
        updateTurn();
    };

    const renderBtn = () => {
        for (i in board) {
            const cellButton = document.createElement('button');
            cellButton.classList.add("cell");
            cellButton.setAttribute('id',i)
            cellButton.textContent = board[i];
            boardContainer.appendChild(cellButton);
        }; 
    };
    
    //restart game
    const newGame = () => {
        boardContainer.textContent = "";
        turnContainer.textContent = "";
        
        for (let i = 0; i < 9; i++) {
            board[i] = '';
        };    
        renderBtn();
        updateTurn(); //displays which player's turn when starting a new game
    };

    const updateTurn = () => {
        turnContainer.textContent = `It's ${GameController.getActivePlayer().getName()}'s turn.`;
    };

    const buttonHandler = (e) => {
        const selectedCell = e.target;
        GameController.playRound(selectedCell);
        if (GameController.checkWin(board)) {
            gameStop();
            return;
        };
        GameController.switchTurn();
        updateTurn();
        //make sure to check if board is full each round.
        //have to be at the end of func so it doesn't get overwritten by other funcs
        checkBoard(); 
    };

    //stop the game once a winner is found
    const gameStop = () => {;
        const cells = document.querySelectorAll('.cell');

        cells.forEach((cell) => {
            cell.disabled = true;
            cell.classList.add("disabled");
        })
        turnContainer.textContent = `${GameController.getActivePlayer().getName()} won!`;
        turnContainer.appendChild(newGameBtn);
    };

    //check if board is full
    const checkBoard = () => {
        const disabledBtn = document.querySelectorAll(".disabled");
        if (disabledBtn.length === 9) {
            turnContainer.textContent = "It's a tie!";
            turnContainer.appendChild(newGameBtn);
        };
    };
    
    boardContainer.addEventListener("click", buttonHandler);
    newGameBtn.addEventListener("click", newGame);
    startGameBtn.addEventListener("click", startGame);
})();
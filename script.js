//gameboard object using module pattern
const Gameboard = (function() {
    const board = [];
    
    for (let i = 0; i < 9; i++) {
        board[i] = '';
    };    

    const addToken = (selectedCell, player) => {
        selectedCell.textContent = player.getMarker();
        board[selectedCell.id] = selectedCell.textContent; //logging marker it into the board object
        selectedCell.disabled = true; //make the chosen cell unclickable
        selectedCell.classList.add("disabled"); 
    };

    const getBoard = () => board;

    return {getBoard, addToken};

})();

//players object constructor
function Player(name,marker) {
    this.name = name;
    this.getMarker = () => marker;
};

//game logic
const GameController = (function() {

    const playerOne = new Player("Name", "X");
    const computer = new Player("Computer", "O");
    let activePlayer = playerOne;

    const getActivePlayer = () => activePlayer;

    const switchTurn = () => {
        activePlayer = activePlayer === playerOne ? computer : playerOne;
        if (activePlayer === computer) {
            compPlay();
        }
        return activePlayer;
    };

    const compPlay = (selectedCell) => {
        const availableCells = document.querySelectorAll(".cell:not(.disabled)") //using not selector
        cellNumber = Math.floor(Math.random() * availableCells.length);
        selectedCell = availableCells[cellNumber];
        setTimeout(()=> {
            playRound(selectedCell);
        }, 1000);
    }

    const playRound = (selectedCell) => {
        Gameboard.addToken(selectedCell, getActivePlayer());
        console.log(`${activePlayer.name} dropped their marker on ${selectedCell.id}.`);
        if (checkWin(Gameboard.getBoard())) {
            ScreenController.announceResult(`${activePlayer.name} won!`);
            gameStop();
            return;
        } 
        if (Gameboard.getBoard().filter((cell)=>cell==="").length === 0) {
            ScreenController.announceResult("It's a tie!");
            gameStop();
            return;
        }
        switchTurn();
        ScreenController.updateTurn();
    };

    //stop the game once a winner is found
    const gameStop = () => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell) => {
            cell.disabled = true;
            cell.classList.add("disabled");
        })
        activePlayer = playerOne;
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
    
    return {playerOne, switchTurn, getActivePlayer, playRound, compPlay, checkWin};

})();

//anything that shows on screen, rendering
const ScreenController = (function() {
    const gameForm = document.querySelector(".form");
    const boardContainer = document.querySelector('#board');
    const turnContainer = document.querySelector('#turn');
    const newGameBtn = document.createElement("button");
    newGameBtn.classList.add("new");
    newGameBtn.textContent = "New Game";
    const startGameBtn = document.querySelector(".start");
    const board = Gameboard.getBoard();  

    //start the game when click the start button
    const startGame = () => {
        GameController.playerOne.name = document.getElementById("name").value;
        renderBtn();
        toggleForm();
        //show the board
        boardContainer.style.display = "grid";
        updateTurn();
    };

    let formOn = true;

    const toggleForm = () => {
        formOn = formOn === true ? gameForm.style.display = "none" : gameForm.style.display = "block";
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
        turnContainer.textContent = `It's ${GameController.getActivePlayer().name}'s turn.`;
    };

    const buttonHandler = (e) => {
        const selectedCell = e.target;
        GameController.playRound(selectedCell);
    };

    const announceResult = (message) => {
        turnContainer.textContent = message;
        turnContainer.appendChild(newGameBtn);
    }
    

    boardContainer.addEventListener("click", buttonHandler);
    newGameBtn.addEventListener("click", newGame);
    startGameBtn.addEventListener("click", startGame);

    return {updateTurn, announceResult}
})();
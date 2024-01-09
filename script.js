const gameboard = (function () {
    const gameArray = ["","","","","","","","",""];
   
    function updateGameArray(index, token) {
        gameArray.splice(index,1,token)
        _render();        
        _checkWinCondition();
    }

    function _render() {
        console.log(`GAMEBOARD: ${gameArray}`);
        //access DOM module [TO BE ADDED]
    }

    function _checkWinCondition() {
        if (gameArray[0] === gameArray[1] && gameArray[0] === gameArray[2] && gameArray[0]!="") {
            gameManager.announceResult("winner");
        } else if (gameArray[3] === gameArray[4] && gameArray[3] === gameArray[5] && gameArray[3]!="") {
            gameManager.announceResult("winner"); 
        } else if (gameArray[6] === gameArray[7] && gameArray[6] === gameArray[8] && gameArray[6]!="") {
            gameManager.announceResult("winner");   
        } else if (gameArray[0] === gameArray[3] && gameArray[0] === gameArray[6] && gameArray[0]!="") {
            gameManager.announceResult("winner");       
        } else if (gameArray[1] === gameArray[4] && gameArray[1] === gameArray[7] && gameArray[1]!="") {
            cgameManager.announceResult("winner"); 
        } else if (gameArray[2] === gameArray[5] && gameArray[2] === gameArray[8] && gameArray[2]!="") {
            gameManager.announceResult("winner"); 
        } else if (gameArray[0] === gameArray[4] && gameArray[0] === gameArray[8] && gameArray[0]!="") {
            gameManager.announceResult("winner"); 
        } else if (gameArray[2] === gameArray[4] && gameArray[2] === gameArray[6] && gameArray[2]!="") {
            gameManager.announceResult("winner"); 
        } else if (gameArray.includes("")) {
            return;
        } else {
            gameManager.announceResult("tied");
        }
    }

    return { updateGameArray }
})();

const gameManager = (function () {

    let currentTurn = "X";
    const availableMoves = [0,1,2,3,4,5,6,7,8];
    let gameState = "ongoing";
    console.log(`${currentTurn} to play`);
    
    function makeMove (moveRef) {
        if (availableMoves.includes(moveRef)) {
            availableMoves.splice(availableMoves.indexOf(moveRef),1);
            console.log(`${currentTurn} played moveRef:${moveRef}`, `Available Moves are ${availableMoves}`);
            gameboard.updateGameArray(moveRef,currentTurn);

            if (gameState == "ongoing") {
                _updateCurrentTurn();
                console.log(`${currentTurn} to play`);
            }

        } else {
            console.log(`${currentTurn} tried to play moveRef:${moveRef}. That move is not available`, `Available Moves are ${availableMoves}`);
        }
    }

    function _updateCurrentTurn() {
        if (currentTurn === "X") {
            currentTurn = "O";
        } else {
            currentTurn = "X";
        }
    }

    function announceResult(outcome) {
        if (outcome == "winner") {
        console.log(`GAME OVER! ${currentTurn} won this round.`);
        } else {
        console.log("GAME OVER! The round was drawn")
        }        
        gameState = "finished";
    }

    return { makeMove , announceResult }
})();

    //makeMove too complicated.  Break into separate functions
    //CONSIDER if cWC should be in gameboard module or gameManager
    //ADD PLAYER MODULE AND TRACK SCORES
    //OFFER TO PLAY ANOTHER ROUND AFTER GAME COMPLETED

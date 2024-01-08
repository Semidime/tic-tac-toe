const gameboard = {
    gameArray: ["","","","","","","","",""],
}

console.log(gameboard.gameArray)

const gameManager = (function () {

    let currentTurn = "X"
    const updateCurrentTurn = () => {
        if (currentTurn === "X") {
            currentTurn = "O";
        } else {
            currentTurn = "X";
        }
    }
    
    const makeMove = (index) => {
        if (gameboard.gameArray[index]=="") {
            gameboard.gameArray.splice(index,1,currentTurn);
            updateCurrentTurn();
            console.log(gameboard.gameArray,`${currentTurn} to play`);
        } else if (gameboard.gameArray[index]!="") {
            console.log("move not available",gameboard.gameArray,`${currentTurn} to play`)
        }
    
        checkWinCondition();
    }

    const checkWinCondition = () => {
        if (gameboard.gameArray[0] === gameboard.gameArray[1] && gameboard.gameArray[0] === gameboard.gameArray[2] && gameboard.gameArray[0]!="") {
            console.log("WINNER");
        } else if (gameboard.gameArray[3] === gameboard.gameArray[4] && gameboard.gameArray[3] === gameboard.gameArray[5] && gameboard.gameArray[3]!="") {
            console.log("WINNER"); 
        } else if (gameboard.gameArray[6] === gameboard.gameArray[7] && gameboard.gameArray[6] === gameboard.gameArray[8] && gameboard.gameArray[6]!="") {
            console.log("WINNER");   
        } else if (gameboard.gameArray[0] === gameboard.gameArray[3] && gameboard.gameArray[0] === gameboard.gameArray[6] && gameboard.gameArray[0]!="") {
            console.log("WINNER");       
        } else if (gameboard.gameArray[1] === gameboard.gameArray[4] && gameboard.gameArray[1] === gameboard.gameArray[7] && gameboard.gameArray[1]!="") {
            console.log("WINNER"); 
        } else if (gameboard.gameArray[2] === gameboard.gameArray[5] && gameboard.gameArray[2] === gameboard.gameArray[8] && gameboard.gameArray[2]!="") {
            console.log("WINNER"); 
        } else if (gameboard.gameArray[0] === gameboard.gameArray[4] && gameboard.gameArray[0] === gameboard.gameArray[8] && gameboard.gameArray[0]!="") {
            console.log("WINNER"); 
        } else if (gameboard.gameArray[2] === gameboard.gameArray[4] && gameboard.gameArray[2] === gameboard.gameArray[6] && gameboard.gameArray[2]!="") {
            console.log("WINNER"); 
        } else if (gameboard.gameArray.includes("")) {
            return;
        } else {
            console.log("TIED")
        }
    }

    //CHECK TIE CONDITION
    //DECLARE A WINNER
    //UPDATE PLAYER SCORE
    //RESET BOARD
    return { currentTurn, makeMove, checkWinCondition }
})();
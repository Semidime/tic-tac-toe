const gameboard = {
    gameArray: ["","","","","","","","",""],
}

console.log(gameboard.gameArray)

const gameManager = (function () {

    const makeMove = (index, xOrO) => {
        if (gameboard.gameArray[index]=="") {
            gameboard.gameArray.splice(index,1,xOrO);   
            console.log(gameboard.gameArray);
        } else if (gameboard.gameArray[index]!="") {
            console.log("move not available",gameboard.gameArray)
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
        } else return
    }
    //MANAGE TURN
    //MAKE MOVE
    //CHECK WIN/DRAW CONDITION
    //DECLARE A WINNER
    //RESET BOARD
    return { makeMove, checkWinCondition }
})();
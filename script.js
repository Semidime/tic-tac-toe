//PubSub module
const events = {
    events: {},
    on: function (eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },
    off: function(eventName, fn) {
        if (this.events[eventName]) {
        for (var i = 0; i < this.events[eventName].length; i++) {
            if (this.events[eventName][i] === fn) {
            this.events[eventName].splice(i, 1);
            break;
            }
        };
        }
    },
    emit: function (eventName, data) {
        if (this.events[eventName]) {
        this.events[eventName].forEach(function(fn) {
            fn(data);
        });
        }
    }
};

const players = (function () {
    const playerX = "";
    const playerO = "";
    
    function assignPlayer(playerName, token) {
        if(token == "X") {
            players.playerX = playerName;
        } else if (token == "O") {
            players.playerO = playerName;
        }
        const lowerCaseName = playerName.toLowerCase();
        if (lowerCaseName in players === false) {
            let gamesWon = 0;
            const getGamesWon = () => gamesWon;
            const increaseGamesWon = () => gamesWon++;
    
            players[lowerCaseName] = {
                playerName, getGamesWon , increaseGamesWon 
            }
        }
    };

    return { playerX , playerO , assignPlayer }
})()

const gameboard = (function () {
    let gameArray = ["","","","","","","","",""];
   
    function updateBoard(index, token) {
        gameArray.splice(index,1,token)
        events.emit("gameArrayChanged", gameArray);  
        _render();              
    }

    function resetBoard () {
        gameArray = ["","","","","","","","",""];
        _render();           
    }

    function _render() {
        console.log(`GAMEBOARD: ${gameArray}`);
        //access DOM module [TO BE ADDED]
        //could be replaced by subscribing DOM module to gameArrayChanged event
    }

    return { updateBoard, resetBoard }
    // ADD PLAYER NAME DISPLAY
    // ADD SCOREBOARD 
})();

const gameManager = (function () {

    //default start values
    let availableSquares = [0,1,2,3,4,5,6,7,8];
    let currentScoreX = 0;
    let currentScoreO = 0;
    let firstMove = "X";
    let currentTurn = "X";
    players.assignPlayer("Xenophon","X");
    players.assignPlayer("Odysseus","O");
    let currentPlayer = players.playerX;
    console.log(`${currentPlayer} to play.`, `Available squares are ${availableSquares}`); 
    

    //Listeners
    events.on("gameArrayChanged",_checkWinCondition);
    

    //functions
    function makeMove (moveRef) {
        if (availableSquares.includes(moveRef)) {
            availableSquares.splice(availableSquares.indexOf(moveRef),1);
            console.log(`${currentPlayer} played moveRef:${moveRef}`);
            gameboard.updateBoard(moveRef,currentTurn);

        } else {
            console.log(`${currentPlayer} tried to play moveRef:${moveRef}. That move is not available.`)
            console.log(`${currentPlayer} to play.`, `Available squares are ${availableSquares}.`); 
        }
    }

    function _checkWinCondition(currentBoard) {
        if (currentBoard[0] === currentBoard[1] && currentBoard[0] === currentBoard[2] && currentBoard[0]!="") {
            _processResult("winner");
        } else if (currentBoard[3] === currentBoard[4] && currentBoard[3] === currentBoard[5] && currentBoard[3]!="") {
            _processResult("winner"); 
        } else if (currentBoard[6] === currentBoard[7] && currentBoard[6] === currentBoard[8] && currentBoard[6]!="") {
            _processResult("winner");   
        } else if (currentBoard[0] === currentBoard[3] && currentBoard[0] === currentBoard[6] && currentBoard[0]!="") {
            _processResult("winner");       
        } else if (currentBoard[1] === currentBoard[4] && currentBoard[1] === currentBoard[7] && currentBoard[1]!="") {
            _processResult("winner"); 
        } else if (currentBoard[2] === currentBoard[5] && currentBoard[2] === currentBoard[8] && currentBoard[2]!="") {
            _processResult("winner"); 
        } else if (currentBoard[0] === currentBoard[4] && currentBoard[0] === currentBoard[8] && currentBoard[0]!="") {
            _processResult("winner"); 
        } else if (currentBoard[2] === currentBoard[4] && currentBoard[2] === currentBoard[6] && currentBoard[2]!="") {
            _processResult("winner"); 
        } else if (currentBoard.includes("")) {
            _updateCurrentTurn();
            console.log(`${currentPlayer} to play.`, `Available squares are ${availableSquares}.`);
            return;
        } else {
            _processResult("tied");
        }
    }
    
    function _updateCurrentTurn() {
        if (currentTurn === "X") {
            currentTurn = "O";
        } else {
            currentTurn = "X";
        }
        currentPlayer = currentTurn === "X" ? players.playerX : players.playerO;
    }

    function _processResult(outcome) {
        if (outcome == "winner" && currentTurn =="X") {
            currentScoreX ++;
            players[players.playerX.toLowerCase()].increaseGamesWon();
            console.log(`GAME OVER! ${players.playerX} won this round.`);
            console.log(`Current score: X:${currentScoreX} | O:${currentScoreO}`);
            console.log(`Total games won by ${players.playerX}: ${players[players.playerX.toLowerCase()].getGamesWon()}`);
        } else if ((outcome == "winner" && currentTurn =="O")){
            currentScoreO ++;
            players[players.playerO.toLowerCase()].increaseGamesWon();
            console.log(`GAME OVER! ${players.playerO} won this round.`);
            console.log(`Current score: X:${currentScoreX} | O:${currentScoreO}`);
            console.log(`Total games won by ${players.playerO}: ${players[players.playerO.toLowerCase()].getGamesWon()}`);
        } else {
        console.log("GAME OVER! The round was drawn.")
        }
        resetGame()        
    }

    function resetGame() {
        availableSquares = [0,1,2,3,4,5,6,7,8];
        currentTurn = firstMove === "X" ? "O" : "X";
        firstMove = currentTurn;
        currentPlayer = currentTurn === "X" ? players.playerX : players.playerO;
        gameboard.resetBoard();
        console.log(`New Game. ${currentPlayer} to play.`, `Available squares are ${availableSquares}.`); 
    }

    //APIs
    return { makeMove , resetGame }
})();




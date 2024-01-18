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
            let gamesPlayed = 0;
            let netScore = 0;
            const getGamesWon = () => gamesWon;
            const getGamesPlayed = () => gamesPlayed;
            const getNetScore = () => netScore;
            const increaseGamesWon = () => gamesWon++;
            const increaseGamesPlayed = () => gamesPlayed++;
            const updateNetScore = a => netScore += a;
    
            players[lowerCaseName] = {
                playerName , getGamesWon , getGamesPlayed , getNetScore ,
                increaseGamesWon , increaseGamesPlayed , updateNetScore
            }
        }
        events.emit("newPlayerAssigned", "newPlayer")
    };

    return { playerX , playerO , assignPlayer }
})()

const gameboard = (function () {
    let gameArray = ["","","","","","","","",""];
   
    function updateBoard(index, token) {
        gameArray.splice(index,1,token)
        events.emit("gameArrayChanged", gameArray);              
    }

    function resetBoard () {
        gameArray = ["","","","","","","","",""];
    }

    return { updateBoard, resetBoard }
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
    

    //subscriptions and listeners
    events.on("gameArrayChanged",_checkWinCondition);
    events.on("newPlayerAssigned",resetGame);
    

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
        if (outcome == "winner") {
            if (currentTurn =="X") {
                currentScoreX ++;
                players[players.playerX.toLowerCase()].increaseGamesWon();
                players[players.playerX.toLowerCase()].increaseGamesPlayed();
                players[players.playerO.toLowerCase()].increaseGamesPlayed();
                players[players.playerX.toLowerCase()].updateNetScore(1);
                players[players.playerO.toLowerCase()].updateNetScore(-1);
            } else {
                currentScoreO ++;
                players[players.playerO.toLowerCase()].increaseGamesWon();
                players[players.playerO.toLowerCase()].increaseGamesPlayed();
                players[players.playerX.toLowerCase()].increaseGamesPlayed();
                players[players.playerO.toLowerCase()].updateNetScore(1);
                players[players.playerX.toLowerCase()].updateNetScore(-1);
            }
        console.log(`GAME OVER! ${currentPlayer} won this round.`); 
        } else {
            console.log("GAME OVER! The round was drawn.");
            players[players.playerX.toLowerCase()].increaseGamesPlayed();
            players[players.playerO.toLowerCase()].increaseGamesPlayed();
        }
    events.emit("scoreChanged", [currentScoreX, currentScoreO] )
    console.log(`${players.playerX}'s net score is: ${players[players.playerX.toLowerCase()].getNetScore()}. (${players[players.playerX.toLowerCase()].getGamesWon()} wins from ${players[players.playerX.toLowerCase()].getGamesPlayed()} games.)`);
    console.log(`${players.playerO}'s net score is: ${players[players.playerO.toLowerCase()].getNetScore()}. (${players[players.playerO.toLowerCase()].getGamesWon()} wins from ${players[players.playerO.toLowerCase()].getGamesPlayed()} games.)`);
    resetGame("newRound")        
    }

    function resetGame(type) {      
        if (type === "resetRound") {
            currentTurn = firstMove;
        } else if (type === "newPlayer") {
            currentScoreX = 0;
            currentScoreO = 0;
            currentTurn = firstMove;
        } else if (type === "newRound") {
            currentTurn = firstMove === "X" ? "O" : "X";
            firstMove = currentTurn;
        }
        availableSquares = [0,1,2,3,4,5,6,7,8];       
        currentPlayer = currentTurn === "X" ? players.playerX : players.playerO;
        gameboard.resetBoard();
        console.log(`New Game. ${currentPlayer} to play.`, `Available squares are ${availableSquares}.`);
    }

    return { makeMove, resetGame }
})();

const dOMModule = (function () {

    //subscriptions
    events.on("gameArrayChanged",_renderGameboard);
    events.on("scoreChanged",_renderScores);
    
    //DOM elements
    

    //functions
    function _renderGameboard (currentBoard) {
        document.getElementById("GS0").innerHTML = `<span>${currentBoard[0]}</span>`;
        document.getElementById("GS1").innerHTML = `<span>${currentBoard[1]}</span>`;
        document.getElementById("GS2").innerHTML = `<span>${currentBoard[2]}</span>`;
        document.getElementById("GS3").innerHTML = `<span>${currentBoard[3]}</span>`;
        document.getElementById("GS4").innerHTML = `<span>${currentBoard[4]}</span>`;
        document.getElementById("GS5").innerHTML = `<span>${currentBoard[5]}</span>`;
        document.getElementById("GS6").innerHTML = `<span>${currentBoard[6]}</span>`;
        document.getElementById("GS7").innerHTML = `<span>${currentBoard[7]}</span>`;
        document.getElementById("GS8").innerHTML = `<span>${currentBoard[8]}</span>`;
    }

    function _renderScores (currentScores) {
        document.querySelector(".score-X>.player-score").innerHTML = currentScores[0];
        document.querySelector(".score-Y>.player-score").innerHTML = currentScores[1];
    }
})();


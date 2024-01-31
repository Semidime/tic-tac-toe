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

    // EVENT LISTENERS
    document.getElementById("openChangePlayerDialogButton").addEventListener('click', function() {
        document.querySelector(".modal").showModal();
    });

    document.getElementById("closeChangePlayerDialogButton").addEventListener('click', function() {
        document.getElementById("newPlayerForm").reset();
        document.querySelector(".modal").close();
    });

    newPlayerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        assignPlayer(playerName.value,newPlayerForm.elements["selectToken"].value);
        document.getElementById("newPlayerForm").reset();
        document.querySelector(".modal").close();
      }) 

    
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
        events.emit("newPlayerAssigned", "newPlayer");
        events.emit("publishPlayers",[`${players.playerX} (X)`,`${players.playerO} (O)`]);
    };

    return { playerX , playerO , assignPlayer }
})()

const gameboard = (function () {
    let gameArray = ["","","","","","","","",""];

    events.on("resetBoard",_resetBoard);
   
    function updateBoard(index, token) {
        gameArray.splice(index,1,token)
        events.emit("gameArrayChanged", gameArray);  
        events.emit("checkWinCondition", gameArray);            
    }

    function _resetBoard(emptyGameArray) {
        gameArray = emptyGameArray;
    }

    return { updateBoard }
})();

const dOMModule = (function () {

    //subscriptions
    events.on("gameArrayChanged",_renderGameboard);
    events.on("scoreChanged",_renderScores);
    events.on("resetBoard",_renderGameboard);
    events.on("publishMessage",_renderMessage);
    events.on("publishPlayers",_publishPlayers)
    
    //DOM elements
    const GS0 = document.getElementById("GS0");
    const GS1 = document.getElementById("GS1");
    const GS2 = document.getElementById("GS2");
    const GS3 = document.getElementById("GS3");
    const GS4 = document.getElementById("GS4");
    const GS5 = document.getElementById("GS5");
    const GS6 = document.getElementById("GS6");
    const GS7 = document.getElementById("GS7");
    const GS8 = document.getElementById("GS8");
    
    //functions
    function _renderGameboard (currentBoard) {
        GS0.innerHTML = `<span>${currentBoard[0]}</span>`;
        GS1.innerHTML = `<span>${currentBoard[1]}</span>`;
        GS2.innerHTML = `<span>${currentBoard[2]}</span>`;
        GS3.innerHTML = `<span>${currentBoard[3]}</span>`;
        GS4.innerHTML = `<span>${currentBoard[4]}</span>`;
        GS5.innerHTML = `<span>${currentBoard[5]}</span>`;
        GS6.innerHTML = `<span>${currentBoard[6]}</span>`;
        GS7.innerHTML = `<span>${currentBoard[7]}</span>`;
        GS8.innerHTML = `<span>${currentBoard[8]}</span>`;
    }

    function _renderScores (currentScores) {
        document.querySelector(".score-X>.player-score").innerHTML = currentScores[0];
        document.querySelector(".score-Y>.player-score").innerHTML = currentScores[1];
    }

    function _renderMessage(messageText) {
        document.querySelector(".message-body").innerHTML = messageText;
    }

    function _publishPlayers(currentPlayers) {
        document.querySelector(".score-X>.player-name").innerHTML = currentPlayers[0];
        document.querySelector(".score-Y>.player-name").innerHTML = currentPlayers[1];
    }
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
    events.emit("publishMessage",`New Game. ${currentPlayer} to play.`); 
    

    //subscriptions and event listeners
    events.on("checkWinCondition",_checkWinCondition);
    events.on("newPlayerAssigned",_resetGame);
    
    const gameSquares = document.querySelectorAll('.game-square');
        gameSquares.forEach(gameSquare => gameSquare.addEventListener('click', function(){
            makeMove(Number(this.id.charAt(2)))
        }));

    document.querySelector('.new-game-button').addEventListener('click', function(){
        _resetGame("newRound")
    });
    

    //functions
    function makeMove (moveRef) {
        if (availableSquares.includes(moveRef)) {
            availableSquares.splice(availableSquares.indexOf(moveRef),1);
            // console.log(`${currentPlayer} played moveRef:${moveRef}`);
            gameboard.updateBoard(moveRef,currentTurn);

        } else {
            // console.log(`${currentPlayer} tried to play moveRef:${moveRef}. That move is not available.`)
            // console.log(`${currentPlayer} to play.`, `Available squares are ${availableSquares}.`); 
            events.emit("publishMessage",`${currentPlayer}, that move is not available. Please try again!`); 
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
            events.emit("publishMessage",`${currentPlayer} to play.`);
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
            console.log(`GAME OVER! ${currentPlayer} won this round. Click "New Game" to play again.`); 
            events.emit("publishMessage",`GAME OVER! ${currentPlayer} won this round. Click "New Game" to play again.`);
            setTimeout(function() { alert(`GAME OVER! ${currentPlayer} won this round. Click "New Game" to play again.`); }, 10);
        } else {
            console.log(`GAME OVER! The round was drawn. Click "New Game" to play again.`);
            events.emit("publishMessage",`GAME OVER! The round was drawn. Click "New Game" to play again.`);
            setTimeout(function() { alert(`GAME OVER! The round was drawn. Click "New Game" to play again.`); }, 10);
            players[players.playerX.toLowerCase()].increaseGamesPlayed();
            players[players.playerO.toLowerCase()].increaseGamesPlayed();
        }
    events.emit("scoreChanged", [currentScoreX, currentScoreO] )
    console.log(`${players.playerX}'s net score is: ${players[players.playerX.toLowerCase()].getNetScore()}. (${players[players.playerX.toLowerCase()].getGamesWon()} wins from ${players[players.playerX.toLowerCase()].getGamesPlayed()} games.)`);
    console.log(`${players.playerO}'s net score is: ${players[players.playerO.toLowerCase()].getNetScore()}. (${players[players.playerO.toLowerCase()].getGamesWon()} wins from ${players[players.playerO.toLowerCase()].getGamesPlayed()} games.)`);
   
   
    // setTimeout(function() { _resetGame("newRound"); }, 10);

    }

    function _resetGame(type) {      
        if (type === "newPlayer") {
            currentScoreX = 0;
            currentScoreO = 0;
            currentTurn = firstMove;
            events.emit("scoreChanged", [currentScoreX, currentScoreO] )
        } else if (type === "newRound") {
            currentTurn = firstMove === "X" ? "O" : "X";
            firstMove = currentTurn;
        }
        availableSquares = [0,1,2,3,4,5,6,7,8];       
        currentPlayer = currentTurn === "X" ? players.playerX : players.playerO;
        // gameboard.resetBoard();
        events.emit("resetBoard",["","","","","","","","",""]);
        events.emit("publishMessage",`New Game. ${currentPlayer} to play.`);
    }

    return { makeMove }
})();


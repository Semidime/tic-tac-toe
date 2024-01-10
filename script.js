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

const gameboard = (function () {
    const gameArray = ["","","","","","","","",""];
   
    function updateGameArray(index, token) {
        gameArray.splice(index,1,token)
        events.emit("gameArrayChanged", gameArray);  
        _render();              
    }

    function _render() {
        console.log(`GAMEBOARD: ${gameArray}`);
        //access DOM module [TO BE ADDED]
        //could be replaced by subscribing DOM module to gameArrayChanged event
    }

    return { updateGameArray }
    // ADD PLAYER NAME DISPLAY
    // ADD SCOREBOARD 
})();

const gameManager = (function () {

    let currentTurn = "X";
    const availableSquares = [0,1,2,3,4,5,6,7,8];
    let gameState = "ongoing";
    events.on("gameArrayChanged",_checkWinCondition);
    console.log(`${currentTurn} to play.`, `Available squares are ${availableSquares}`); 
    
    function makeMove (moveRef) {
        if (availableSquares.includes(moveRef)) {
            availableSquares.splice(availableSquares.indexOf(moveRef),1);
            console.log(`${currentTurn} played moveRef:${moveRef}`, `Available squares are ${availableSquares}`);
            gameboard.updateGameArray(moveRef,currentTurn);

            if (gameState == "ongoing") {
                _updateCurrentTurn();
                console.log(`${currentTurn} to play`);
            }

        } else {
            console.log(`${currentTurn} tried to play moveRef:${moveRef}. That move is not available.`)
            console.log(`${currentTurn} to play.`, `Available squares are ${availableSquares}`);
        }
    }

    function _checkWinCondition(currentBoard) {
        if (currentBoard[0] === currentBoard[1] && currentBoard[0] === currentBoard[2] && currentBoard[0]!="") {
            _announceResult("winner");
        } else if (currentBoard[3] === currentBoard[4] && currentBoard[3] === currentBoard[5] && currentBoard[3]!="") {
            _announceResult("winner"); 
        } else if (currentBoard[6] === currentBoard[7] && currentBoard[6] === currentBoard[8] && currentBoard[6]!="") {
            _announceResult("winner");   
        } else if (currentBoard[0] === currentBoard[3] && currentBoard[0] === currentBoard[6] && currentBoard[0]!="") {
            _announceResult("winner");       
        } else if (currentBoard[1] === currentBoard[4] && currentBoard[1] === currentBoard[7] && currentBoard[1]!="") {
            _announceResult("winner"); 
        } else if (currentBoard[2] === currentBoard[5] && currentBoard[2] === currentBoard[8] && currentBoard[2]!="") {
            _announceResult("winner"); 
        } else if (currentBoard[0] === currentBoard[4] && currentBoard[0] === currentBoard[8] && currentBoard[0]!="") {
            _announceResult("winner"); 
        } else if (currentBoard[2] === currentBoard[4] && currentBoard[2] === currentBoard[6] && currentBoard[2]!="") {
            _announceResult("winner"); 
        } else if (currentBoard.includes("")) {
            return;
        } else {
            _announceResult("tied");
        }
    }
    
    function _updateCurrentTurn() {
        if (currentTurn === "X") {
            currentTurn = "O";
        } else {
            currentTurn = "X";
        }
    }

    function _announceResult(outcome) {
        if (outcome == "winner") {
        console.log(`GAME OVER! ${currentTurn} won this round.`);
        } else {
        console.log("GAME OVER! The round was drawn")
        }        
        gameState = "finished";
    }

    return { makeMove }
})();

    // makeMove too complicated.  Break into separate functions?
    // ADD PLAYER MODULE - new player module
    // ADD SCOREBOARD & TRACK SCORES - gameboard module
    // RESET BOARD TO PLAY ANOTHER ROUND AFTER GAME COMPLETED
    // ADD DOM MODULE 


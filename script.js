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
            const getGamesWon = () => gamesWon;
            const getGamesPlayed = () => gamesPlayed;
            const increaseGamesWon = () => gamesWon++;
            const increaseGamesPlayed = () => gamesPlayed++;
            players[lowerCaseName] = {
                playerName , getGamesWon , getGamesPlayed , increaseGamesWon , increaseGamesPlayed 
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
    events.on("publishPlayers",_publishPlayers);
    events.on("gSEnter",_showAvailability);
    events.on("gSLeave",_hideAvailability);
    events.on("highlightWin",_highlightWin);
    events.on("resetBoard",_removeWinHighlight);
    events.on("removeAvailableClass",_removeAvailableClass);
    
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
        _renderLeaderBoard();
    }

    function _renderMessage(messageText) {
        document.querySelector(".message-body").innerHTML = messageText;
    }

    function _publishPlayers(currentPlayers) {
        document.querySelector(".score-X>.player-name").innerHTML = currentPlayers[0];
        document.querySelector(".score-Y>.player-name").innerHTML = currentPlayers[1];
        _renderLeaderBoard();
    }

    function _showAvailability(gSArr) {
        if (gSArr[0] === 1) {
            document.getElementById(`GS${gSArr[1]}`).classList.add('available');
        } else {
            document.getElementById(`GS${gSArr[1]}`).classList.add('unavailable');
        }
    }

    function _hideAvailability(gSRef) {
        document.getElementById(`GS${gSRef}`).classList.remove('available', 'unavailable');
    }

    function _highlightWin(winArr) {
        // winArrLength = winArr.length;
        for (let i = 0; i < winArr.length; i ++) {
            document.getElementById(`GS${winArr[i]}`).classList.add('win');
        }
    }

    function _removeWinHighlight() {
        const winSquares = document.querySelectorAll('.win');
        winSquares.forEach(winSquare => winSquare.classList.remove('win', 'available'));
    };

    function _removeAvailableClass() {
        const gameSquares = document.querySelectorAll('.game-square');
        gameSquares.forEach(gameSquare => gameSquare.classList.remove('available', 'unavailable'));
    };

    function _renderLeaderBoard() {
        const tableBody = document.getElementById("leaderboardTable").getElementsByTagName("tbody")[0];
        const leaderBoardRows = Object.keys(players).slice(3).length;
        const playerArray = Object.keys(players).slice(3);
        const playerDataArray = [];      
        for (let i = 0;  i < leaderBoardRows; i++) {
            playerDataArray.push([players[playerArray[i]].playerName,players[playerArray[i]].getGamesWon(),players[playerArray[i]].getGamesPlayed()])
        }       
        const sortedPlayerDataArray = playerDataArray.toSorted(function(a, b) {
            if (a[1] == b[1]) {
              if(a[2] == 0 || b[2] == 0) {
                return b[2] - a[2];
                } else {
                return a[2] - b[2];
                }
            }
            return b[1] - a[1];
          });

        tableBody.innerHTML = ""; //clears current rows from tableBody
        
        for (let i = 0;  i < leaderBoardRows; i++) {           
            let newRow = tableBody.insertRow(-1);
            let c0 = newRow.insertCell(0);
            let c1 = newRow.insertCell(1);
            let c2 = newRow.insertCell(2);

            c0.innerHTML = i+1;
            c1.innerHTML = sortedPlayerDataArray[i][0];
            c2.innerHTML = `${sortedPlayerDataArray[i][1]} / ${sortedPlayerDataArray[i][2]}`
        } 
    }
})();

const gameManager = (function () {

    //initialize game
    const availableSquares = [];
    const moveSequence = [];
    let currentScoreX = 0;
    let currentScoreO = 0;
    let firstMove = "X";
    let currentTurn = "X";
    players.assignPlayer("Xenophon","X");
    players.assignPlayer("Odysseus","O");
    let currentPlayer = players.playerX;
    let xBot = 0;
    let xBotDifficulty = 2;
    let oBot = 0;
    let oBotDifficulty = 2;
    events.emit("publishMessage",`New Game. ${currentPlayer} to play.`); 
    

    //subscriptions and event listeners
    events.on("checkWinCondition",_checkWinCondition);
    events.on("newPlayerAssigned",_resetGame);
    
    document.querySelector('.new-game-button').addEventListener('click', function(){
        _resetGame("newRound")
    });
   

    const _gBListenerMove = function() {makeMove(Number(this.id.charAt(2)))};
    
    const _gBListenerEnter = function() {
        const gSRef = Number(this.id.charAt(2))
        if (availableSquares.includes(gSRef)) {
            events.emit("gSEnter",[1,gSRef]);
        } else {
            events.emit("gSEnter",[0,gSRef]);
        };
    }  
    
    const _gBListenerLeave = function() {events.emit("gSLeave",(Number(this.id.charAt(2))))};           
    
    function _manageGameBoardListeners(action) {
        const gameSquares = document.querySelectorAll('.game-square');
        if (action === "add") {
            gameSquares.forEach(gameSquare => gameSquare.addEventListener('click', _gBListenerMove));
            gameSquares.forEach(gameSquare => gameSquare.addEventListener('mouseenter', _gBListenerEnter)); 
            gameSquares.forEach(gameSquare => gameSquare.addEventListener('mouseleave', _gBListenerLeave)); 

        } else if (action === "remove") {
            gameSquares.forEach(gameSquare => gameSquare.removeEventListener('click', _gBListenerMove));
            gameSquares.forEach(gameSquare => gameSquare.removeEventListener('mouseenter', _gBListenerEnter)); 
            gameSquares.forEach(gameSquare => gameSquare.removeEventListener('mouseleave', _gBListenerLeave)); 
        }
    }
    _manageGameBoardListeners("add");

    //bot controls
    const xBotCheckbox = document.getElementById("xBotCheckbox");
    const oBotCheckbox = document.getElementById("oBotCheckbox");
    const xBotDifficultySlider = document.getElementById("xBotDifficulty");
    const oBotDifficultySlider = document.getElementById("oBotDifficulty");
    const xBotDifficultyText = document.getElementById("x-difficulty-text");
    const oBotDifficultyText = document.getElementById("o-difficulty-text");
    xBotCheckbox.oninput = function () {
        if (xBot == 0) { xBot = 1 } else {xBot = 0};
        if (currentPlayer == players.playerX && xBot == 1) {
            compPlayer.tacTicBot();
        }    
    };
    oBotCheckbox.oninput = function () {
        if (oBot == 0) {oBot = 1} else {oBot = 0};
        if (currentPlayer == players.playerO && oBot == 1) {
            compPlayer.tacTicBot();
        }
    };
    xBotDifficultySlider.oninput = function () {
        xBotDifficulty = xBotDifficultySlider.value;
        if (xBotDifficulty == 1) {
            xBotDifficultyText.textContent = "Difficulty: easy"
        } else if (xBotDifficulty == 2) {
            xBotDifficultyText.textContent = "Difficulty: normal"
        } else if (xBotDifficulty == 3) {
            xBotDifficultyText.textContent = "Difficulty: hard"
        }
        console.log(xBotDifficulty);
    };
    oBotDifficultySlider.oninput = function () {
        oBotDifficulty = oBotDifficultySlider.value;
        if (oBotDifficulty == 1) {
            oBotDifficultyText.textContent = "Difficulty: easy"
        } else if (oBotDifficulty == 2) {
            oBotDifficultyText.textContent = "Difficulty: normal"
        } else if (oBotDifficulty == 3) {
            oBotDifficultyText.textContent = "Difficulty: hard"
        }
        console.log(oBotDifficulty);
    };

    //functions

    function makeMove (moveRef) {
        if (availableSquares.includes(moveRef)) {
            availableSquares.splice(availableSquares.indexOf(moveRef),1);
            moveSequence.push(moveRef);
            gameboard.updateBoard(moveRef,currentTurn);
            console.log(`aS:${availableSquares}`);
            console.log(`mS:${moveSequence}`);
        } else {
            events.emit("publishMessage",`${currentPlayer}, that move is not available. Please try again!`); 
        }
    }

    function _checkWinCondition(currentBoard) {
        const winArr = [];
        if (currentBoard[0] === currentBoard[1] && currentBoard[0] === currentBoard[2] && currentBoard[0]!="") {winArr.push(0,1,2)}; 
        if (currentBoard[3] === currentBoard[4] && currentBoard[3] === currentBoard[5] && currentBoard[3]!="") {winArr.push(3,4,5)};
        if (currentBoard[6] === currentBoard[7] && currentBoard[6] === currentBoard[8] && currentBoard[6]!="") {winArr.push(6,7,8)};
        if (currentBoard[0] === currentBoard[3] && currentBoard[0] === currentBoard[6] && currentBoard[0]!="") {winArr.push(0,3,6)};
        if (currentBoard[1] === currentBoard[4] && currentBoard[1] === currentBoard[7] && currentBoard[1]!="") {winArr.push(1,4,7)};
        if (currentBoard[2] === currentBoard[5] && currentBoard[2] === currentBoard[8] && currentBoard[2]!="") {winArr.push(2,5,8)};
        if (currentBoard[0] === currentBoard[4] && currentBoard[0] === currentBoard[8] && currentBoard[0]!="") {winArr.push(0,4,8)};
        if (currentBoard[2] === currentBoard[4] && currentBoard[2] === currentBoard[6] && currentBoard[2]!="") {winArr.push(2,4,6)};
        if (winArr.length == 0 && currentBoard.includes("") == false) {
            _processResult("tied");
        } else if (winArr.length > 0) {
            _processResult(winArr); 
        } else {
            _updateCurrentTurn();
            events.emit("publishMessage",`${currentPlayer} to play.`);
        }
    }
    
    function _updateCurrentTurn() {
        if (currentTurn === "X") {
            currentTurn = "O";
        } else {
            currentTurn = "X";
        }
        currentPlayer = currentTurn === "X" ? players.playerX : players.playerO;
        
        if (currentPlayer == players.playerX && xBot == 1) {
            compPlayer.tacTicBot();
        } else if (currentPlayer == players.playerO && oBot == 1) {
            compPlayer.tacTicBot();
        }
    }

    function _processResult(outcome) {
        if (outcome == "tied") {
            events.emit("publishMessage",`GAME OVER! The round was drawn. Click "New Game" to play again.`);
        } else {
            if (currentTurn =="X") {
                currentScoreX ++;
                players[players.playerX.toLowerCase()].increaseGamesWon();
            } else {
                currentScoreO ++;
                players[players.playerO.toLowerCase()].increaseGamesWon();
            }
            events.emit("highlightWin",outcome);
            events.emit("publishMessage",`GAME OVER! ${currentPlayer} won this round. Click "New Game" to play again.`);
        }
    events.emit("removeAvailableClass");
    players[players.playerX.toLowerCase()].increaseGamesPlayed();
    players[players.playerO.toLowerCase()].increaseGamesPlayed();    
    events.emit("scoreChanged", [currentScoreX, currentScoreO] ); 
    _manageGameBoardListeners("remove");
    }

    function _resetGame(type) {      
        if (type === "newPlayer") {
            currentScoreX = 0;
            currentScoreO = 0;
            currentTurn = "X";
            events.emit("scoreChanged", [currentScoreX, currentScoreO] )
        } else if (type === "newRound") {
            currentTurn = firstMove === "X" ? "O" : "X";
        }
        firstMove = currentTurn;
        currentPlayer = currentTurn === "X" ? players.playerX : players.playerO;
        _initializeGameArrays();
        _manageGameBoardListeners("remove");
        _manageGameBoardListeners("add");
        events.emit("resetBoard",["","","","","","","","",""]);
        events.emit("publishMessage",`New Game. ${currentPlayer} to play.`);

        if (currentPlayer == players.playerX && xBot == 1) {
            compPlayer.tacTicBot();
        } else if (currentPlayer == players.playerO && oBot == 1) {
            compPlayer.tacTicBot();
        }
    }

    function _initializeGameArrays () {
        availableSquares.length = 0;
        moveSequence.length = 0;
        for (i = 0; i < 9; i++) {
            availableSquares.push(i);
        }
        console.log(`aS:${availableSquares}`);
        console.log(`mS:${moveSequence}`);
    }
    _initializeGameArrays();

    return { availableSquares , moveSequence , makeMove }
})();

const compPlayer = (function () {

    function _tTBMove(moveRef) {
        if (gameManager.availableSquares.includes(moveRef)) {
            console.log(`${moveRef} - Available`);
        } else {
            console.log(`${moveRef} - Not Available`); 
        }
        
        setTimeout(() => {
            gameManager.makeMove(moveRef);;
        }, 500);
        
    }


    function tacTicBot() {
        const cPAvailableSquares = gameManager.availableSquares;
        console.log(`cPAS: ${cPAvailableSquares}`);
        const cPMoveSequence = gameManager.moveSequence;
        console.log(`cPMS: ${cPMoveSequence}`);
        const cornerGS = [0,2,6,8];
        const cruxGS = [1,3,5,8];
        const availableCornerGS = cPAvailableSquares.filter(value => cornerGS.includes(value));
        const availableCruxGS = cPAvailableSquares.filter(value => cruxGS.includes(value));
        const tacTicBotMoves = [];
        const opponentMoves = [];
        const revMoveSequence = cPMoveSequence.reverse();
        for (i = 0; i<revMoveSequence.length; i ++) {
            if (i % 2 === 0) { // index is even
                opponentMoves.push(revMoveSequence[i]);
            } else {
                tacTicBotMoves.push(revMoveSequence[i]);
            }
        } 
        cPMoveSequence.reverse();

        console.log(`tTB: ${tacTicBotMoves}`);
        console.log(`Opp: ${opponentMoves}`);

        // FIRST MOVE: 
        //Always select middle or any corner 
        if (cPMoveSequence.length == 0) {
            console.log("AP01");
            if ((Math.floor(Math.random()*5)) < 4) { 
                _tTBMove(cornerGS[Math.floor(Math.random()*4)]);
            } else {
                _tTBMove(4);
            }
            return
        } 

        // SECOND MOVE:
        // if P1 selected a corner, select middle or opposite corner;
        if (cPMoveSequence.length == 1 && cornerGS.includes(cPMoveSequence[0])) {
            console.log("AP02");
            if (Math.floor(Math.random()*2)<1) {
                _tTBMove(4);
            } else if (cPMoveSequence[0] == 0) {
                _tTBMove(8); 
            } else if (cPMoveSequence[0] == 2) {
                _tTBMove(6); 
            } else if (cPMoveSequence[0] == 6) {
                _tTBMove(2); 
            } else if (cPMoveSequence[0] == 8) {
                _tTBMove(0); 
            }
            return
        }

        // THIRD MOVE
        // if first move was a corner, opponent did not select a Crux GS, select opposite corner if available; 
        if (cPMoveSequence.length == 2  && cornerGS.includes(cPMoveSequence[0]) && !cruxGS.includes(cPMoveSequence[1])) {
            console.log("AP03");
            if (cPMoveSequence[0] == 0 && !cPMoveSequence.includes(8)) {
                _tTBMove(8);
                return;
            } else if (cPMoveSequence[0] == 2 && !cPMoveSequence.includes(6)) {
                _tTBMove(6);
                return;
            } else if (cPMoveSequence[0] == 6 && !cPMoveSequence.includes(2)) {
                _tTBMove(2);
                return;
            } else if (cPMoveSequence[0] == 8 && !cPMoveSequence.includes(0)) {
                _tTBMove(0);
                return;
            }
        }

        //FOURTH MOVE
        //If first and third moves diagonal corners AND second move middle
        // MUST select any Crux GS     
        if (cPMoveSequence.length == 3
            &&  (  (cPMoveSequence[0] == 0 && cPMoveSequence[1] == 4 && cPMoveSequence[2] == 8 )
                || (cPMoveSequence[0] == 8 && cPMoveSequence[1] == 4 && cPMoveSequence[2] == 0 )
                || (cPMoveSequence[0] == 2 && cPMoveSequence[1] == 4 && cPMoveSequence[2] == 6 )
                || (cPMoveSequence[0] == 6 && cPMoveSequence[1] == 4 && cPMoveSequence[2] == 2 ))) {
                    console.log("AP04");
                    _tTBMove(cruxGS[Math.floor(Math.random()*4)]);
                return
            }; 

        //ANY MOVE AFTER tTBot HAS ALREADY PLAYED TWO MOVES
        // Is winning move available
        if (tacTicBotMoves.length >= 2) {
            console.log("AP05");
            const checkWin = tacTicBotMoves.slice();
            for (i = 0; i < cPAvailableSquares.length; i ++) {
                checkWin.push(cPAvailableSquares[i]);
                
                if ((checkWin.includes(0) && checkWin.includes(1) && checkWin.includes(2))
                || (checkWin.includes(3) && checkWin.includes(4) && checkWin.includes(5))
                || (checkWin.includes(6) && checkWin.includes(7) && checkWin.includes(8))
                || (checkWin.includes(0) && checkWin.includes(3) && checkWin.includes(6))
                || (checkWin.includes(1) && checkWin.includes(4) && checkWin.includes(7))
                || (checkWin.includes(2) && checkWin.includes(5) && checkWin.includes(8))
                || (checkWin.includes(0) && checkWin.includes(4) && checkWin.includes(8))
                || (checkWin.includes(2) && checkWin.includes(4) && checkWin.includes(6))
                ) {
                    _tTBMove(cPAvailableSquares[i]);
                    return
                }
                checkWin.pop();
            }
        }

        //ANY MOVE AFTER tTBot OPPONENT HAS ALREADY PLAYED TWO MOVES
        //Is losing move a risk on next round
        if (opponentMoves.length >= 2) {
            console.log("AP06");
            const checkLose = opponentMoves.slice();
                for (i = 0; i < cPAvailableSquares.length; i ++) {
                checkLose.push(cPAvailableSquares[i]);                 
                    if ((checkLose.includes(0) && checkLose.includes(1) && checkLose.includes(2))
                    || (checkLose.includes(3) && checkLose.includes(4) && checkLose.includes(5))
                    || (checkLose.includes(6) && checkLose.includes(7) && checkLose.includes(8))
                    || (checkLose.includes(0) && checkLose.includes(3) && checkLose.includes(6))
                    || (checkLose.includes(1) && checkLose.includes(4) && checkLose.includes(7))
                    || (checkLose.includes(2) && checkLose.includes(5) && checkLose.includes(8))
                    || (checkLose.includes(0) && checkLose.includes(4) && checkLose.includes(8))
                    || (checkLose.includes(2) && checkLose.includes(4) && checkLose.includes(6))
                    ) {
                        _tTBMove(cPAvailableSquares[i]);
                        return
                    }
                    checkLose.pop();
                }
            }
        //OTHERWISE DEFAULT BEHAVIOUR:

        //Is middle still available
        if (cPAvailableSquares.includes(4)) {
            console.log("AP07");
            _tTBMove(4);
            return
        }

        //Is Corner available that is not adjacent to an opp move
        if (availableCornerGS.length > 0 ) {
            console.log("AP08");
            if (availableCornerGS.includes(0) && !opponentMoves.includes(1) && !opponentMoves.includes(3) ) {
                _tTBMove(0);
                return
            } else if (availableCornerGS.includes(2) && !opponentMoves.includes(1) && !opponentMoves.includes(5) ) {
                _tTBMove(2);
                return
            } else if (availableCornerGS.includes(6) && !opponentMoves.includes(3) && !opponentMoves.includes(7) ) {
                _tTBMove(6);
                return
            } else if (availableCornerGS.includes(8) && !opponentMoves.includes(5) && !opponentMoves.includes(7) ) {
                _tTBMove(8);
                return
            }
        }

        //If tTB controls middle are there two vacant Crux GS opposite each other
        if (tacTicBotMoves.includes(4) && availableCruxGS.length >= 2) {
            console.log("AP09");
            if (availableCruxGS.includes(1) && availableCruxGS.includes(7)) {
                if ((Math.floor(Math.random()*2)) < 1) { 
                    _tTBMove(1);
                } else {
                    _tTBMove(7);
                }
                return
            } else if (availableCruxGS.includes(3) && availableCruxGS.includes(5)) {
                if ((Math.floor(Math.random()*2)) < 1) { 
                    _tTBMove(3);
                } else {
                    _tTBMove(5);
                }
                return
            } 
        }

        // RNG
        console.log("AP10");    
        _tTBMove(cPAvailableSquares[(Math.floor(Math.random()*cPAvailableSquares.length))])
        return
    }

    return { tacTicBot }

})()
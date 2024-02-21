const compPlayer = (function () {

    function _tTBMove(moveRef) {
        console.log(moveRef);
        if (gameManager.availableSquares.includes(moveRef)) {
            console.log(`${moveRef} - Available`);
        } else {
            console.log(`${moveRef} - Not Available`); 
        }

    }

    // CODE ABOVE THIS COMMENT FOR TESTING AND DEBUGGING ONLY
    // CONSOLE LOG STATEMENTS TO BE REMOVED

    function tacTicBot() {
        const cornerGS = [0,2,6,8];
        const cruxGS = [1,3,5,8];
        const availableCornerGS = gameManager.availableSquares.filter(value => cornerGS.includes(value));
        const availableCruxGS = gameManager.availableSquares.filter(value => cruxGS.includes(value));
        const tacTicBotMoves = [];
        const opponentMoves = [];
        const revMoveSequence = gameManager.moveSequence.reverse();
        for (i = 0; i<revMoveSequence.length; i ++) {
            if (i % 2 === 0) { // index is even
                opponentMoves.push(revMoveSequence[i]);
            } else {
                tacTicBotMoves.push(revMoveSequence[i]);
            }
        } 

        // FIRST MOVE: 
        //Always select middle or any corner 
        if (gameManager.moveSequence.length == 0) {
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
        if (gameManager.moveSequence.length == 1 && cornerGS.includes(gameManager.moveSequence[0])) {
            console.log("AP02");
            if (Math.floor(Math.random()*2)<1) {
                _tTBMove(4);
            } else if (gameManager.moveSequence[0] == 0) {
                _tTBMove(8); 
            } else if (gameManager.moveSequence[0] == 2) {
                _tTBMove(6); 
            } else if (gameManager.moveSequence[0] == 6) {
                _tTBMove(2); 
            } else if (gameManager.moveSequence[0] == 8) {
                _tTBMove(0); 
            }
            return
        }

        // THIRD MOVE
        // if first move was a corner, opponent did not select a Crux GS, select opposite corner if available; 
        if (gameManager.moveSequence.length == 2  && cornerGS.includes(gameManager.moveSequence[0]) && !cruxGS.includes(gameManager.moveSequence[1])) {
            console.log("AP03");
            if (gameManager.moveSequence[0] == 0 && !gameManager.moveSequence.includes(8)) {
                _tTBMove(8);
            } else if (gameManager.moveSequence[0] == 2 && !gameManager.moveSequence.includes(6)) {
                _tTBMove(6);
            } else if (gameManager.moveSequence[0] == 6 && !gameManager.moveSequence.includes(2)) {
                _tTBMove(2);
            } else if (gameManager.moveSequence[0] == 8 && !gameManager.moveSequence.includes(0)) {
                _tTBMove(0);
            }
            return
        }

        //FOURTH MOVE
        //If first and third moves diagonal corners AND second move middle
        // MUST select any Crux GS     
        if (gameManager.moveSequence.length == 3
            &&  (  (gameManager.moveSequence[0] == 0 && gameManager.moveSequence[1] == 4 && gameManager.moveSequence[2] == 8 )
                || (gameManager.moveSequence[0] == 8 && gameManager.moveSequence[1] == 4 && gameManager.moveSequence[2] == 0 )
                || (gameManager.moveSequence[0] == 2 && gameManager.moveSequence[1] == 4 && gameManager.moveSequence[2] == 6 )
                || (gameManager.moveSequence[0] == 6 && gameManager.moveSequence[1] == 4 && gameManager.moveSequence[2] == 2 ))) {
                    console.log("AP04");
                    _tTBMove(cruxGS[Math.floor(Math.random()*4)]);
                return
            }; 

        //ANY MOVE AFTER tTBot HAS ALREADY PLAYED TWO MOVES
        // Is winning move available
        if (tacTicBotMoves.length >= 2) {
            console.log("AP05");
            const checkWin = tacTicBotMoves.slice();
            for (i = 0; i < gameManager.availableSquares.length; i ++) {
                checkWin.push(gameManager.availableSquares[i]);
                
                if ((checkWin.includes(0) && checkWin.includes(1) && checkWin.includes(2))
                || (checkWin.includes(3) && checkWin.includes(4) && checkWin.includes(5))
                || (checkWin.includes(6) && checkWin.includes(7) && checkWin.includes(8))
                || (checkWin.includes(0) && checkWin.includes(3) && checkWin.includes(6))
                || (checkWin.includes(1) && checkWin.includes(4) && checkWin.includes(7))
                || (checkWin.includes(2) && checkWin.includes(5) && checkWin.includes(8))
                || (checkWin.includes(0) && checkWin.includes(4) && checkWin.includes(8))
                || (checkWin.includes(2) && checkWin.includes(4) && checkWin.includes(6))
                ) {
                    _tTBMove(gameManager.availableSquares[i]);
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
                for (i = 0; i < gameManager.availableSquares.length; i ++) {
                checkLose.push(gameManager.availableSquares[i]);                 
                    if ((checkLose.includes(0) && checkLose.includes(1) && checkLose.includes(2))
                    || (checkLose.includes(3) && checkLose.includes(4) && checkLose.includes(5))
                    || (checkLose.includes(6) && checkLose.includes(7) && checkLose.includes(8))
                    || (checkLose.includes(0) && checkLose.includes(3) && checkLose.includes(6))
                    || (checkLose.includes(1) && checkLose.includes(4) && checkLose.includes(7))
                    || (checkLose.includes(2) && checkLose.includes(5) && checkLose.includes(8))
                    || (checkLose.includes(0) && checkLose.includes(4) && checkLose.includes(8))
                    || (checkLose.includes(2) && checkLose.includes(4) && checkLose.includes(6))
                    ) {
                        _tTBMove(gameManager.availableSquares[i]);
                        return
                    }
                    checkLose.pop();
                }
            }
        //OTHERWISE DEFAULT BEHAVIOUR:

        //Is middle still available
        if (gameManager.availableSquares.includes(4)) {
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
                _tTBMove(2);
                return
            }
        }

        //If tTB controls middle is there two vacat Crus GS opposite each other
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
        _tTBMove(gameManager.availableSquares[(Math.floor(Math.random()*gameManager.availableSquares.length))])
        return
    }

    return { tacTicBot }

})()
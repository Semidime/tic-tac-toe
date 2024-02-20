function tacTicBot() {
    let moveSequence = []; //DELETE WHEN INCORPORATED INTO GAME MODULE
    let availableSquares = [0,1,2,3,4,5,6,7,8]; //DELETE WHEN INCORPORATED INTO GAME MODULE
    const cornerGS = [0,2,6,8];
    const cruxGS = [1,3,5,8];
    const availableCornerGS = availableSquares.filter(value => cornerGS.includes(value));
    const availableCruxGS = availableSquares.filter(value => cruxGS.includes(value));
    const tacTicBotMoves = [];
    const opponentMoves = [];
    const revMoveSequence = moveSequence.reverse();
    for (i = 0; i<revMoveSequence.length; i ++) {
        if (i % 2 === 0) { // index is even
            opponentMoves.push(revMoveSequence[i]);
        } else {
            tacTicBotMoves.push(revMoveSequence[i]);
        }
    } 

    // FIRST MOVE: 
    //Always select middle or any corner 
    if (moveSequence.length == 0) {
        if ((Math.floor(Math.random()*5)) < 4) { 
            _makeMove(cornerGS[Math.floor(Math.random()*4)]);
        } else {
            _makeMove(4);
        }
        return
    } 

    // SECOND MOVE:
    // if P1 selected a corner, select middle or opposite corner;
    if (moveSequence.length == 1 && cornerGS.includes(moveSequence[0])) {
        if (Math.floor(Math.random()*2)<1) {
            _makeMove(4);
        } else if (moveSequence[0] == 0) {
            _makeMove(8); 
        } else if (moveSequence[0] == 2) {
            _makeMove(6); 
        } else if (moveSequence[0] == 6) {
            _makeMove(2); 
        } else if (moveSequence[0] == 8) {
            _makeMove(0); 
        }
        return
    }

    // THIRD MOVE
    // if first move was a corner, opponent did not select a Crux GS, select opposite corner if available; 
    if (moveSequence.length == 2  && cornerGS.includes(moveSequence[0]) && !cruxGS.includes(moveSequence[1])) {
        if (moveSequence[0] == 0 && !moveSequence.includes(8)) {
            _makeMove(8);
        } else if (moveSequence[0] == 2 && !moveSequence.includes(6)) {
            _makeMove(6);
        } else if (moveSequence[0] == 6 && !moveSequence.includes(2)) {
            _makeMove(2);
        } else if (moveSequence[0] == 8 && !moveSequence.includes(0)) {
            _makeMove(0);
        }
        return
    }

    //FOURTH MOVE
    //If first and third moves diagonal corners AND second move middle
    // MUST select any Crux GS     
    if (moveSequence.length == 3
        &&  (  (moveSequence[0] == 0 && moveSequence[1] == 4 && moveSequence[2] == 8 )
            || (moveSequence[0] == 8 && moveSequence[1] == 4 && moveSequence[2] == 0 )
            || (moveSequence[0] == 2 && moveSequence[1] == 4 && moveSequence[2] == 6 )
            || (moveSequence[0] == 6 && moveSequence[1] == 4 && moveSequence[2] == 2 ))) {
            _makeMove(cruxGS[Math.floor(Math.random()*4)]);
            return
        }; 
        
    //FIFTH MOVE (CORNER; CRUX GS; MIDDLE; DIAG CORNER; MOVE TO CORNER NOT ADJACENT TO CRUX GS)
            //TBC - MAY NOT BE REQUIRED

    //ANY MOVE AFTER tTBot HAS ALREADY PLAYED TWO MOVES
    // Is winning move available
    if (tacTicBotMoves.length >= 2) {
        const checkWin = tacTicBotMoves.slice();
        for (i = 0; i < availableSquares.length; i ++) {
            checkWin.push(availableSquares[i]);
            
            if ((checkWin.includes(0) && checkWin.includes(1) && checkWin.includes(2))
            || (checkWin.includes(3) && checkWin.includes(4) && checkWin.includes(5))
            || (checkWin.includes(6) && checkWin.includes(7) && checkWin.includes(8))
            || (checkWin.includes(0) && checkWin.includes(3) && checkWin.includes(6))
            || (checkWin.includes(1) && checkWin.includes(4) && checkWin.includes(7))
            || (checkWin.includes(2) && checkWin.includes(5) && checkWin.includes(8))
            || (checkWin.includes(0) && checkWin.includes(4) && checkWin.includes(8))
            || (checkWin.includes(2) && checkWin.includes(4) && checkWin.includes(6))
            ) {
                _makeMove(availableSquares[i]);
                return
            }
            checkWin.pop();
        }
    }

    //ANY MOVE AFTER tTBot OPPONENT HAS ALREADY PLAYED TWO MOVES
    //Is losing move a risk on next round
    if (opponentMoves.length >= 2) {
        const checkLose = opponentMoves.slice();
            for (i = 0; i < availableSquares.length; i ++) {
            checkLose.push(availableSquares[i]);                 
                if ((checkLose.includes(0) && checkLose.includes(1) && checkLose.includes(2))
                || (checkLose.includes(3) && checkLose.includes(4) && checkLose.includes(5))
                || (checkLose.includes(6) && checkLose.includes(7) && checkLose.includes(8))
                || (checkLose.includes(0) && checkLose.includes(3) && checkLose.includes(6))
                || (checkLose.includes(1) && checkLose.includes(4) && checkLose.includes(7))
                || (checkLose.includes(2) && checkLose.includes(5) && checkLose.includes(8))
                || (checkLose.includes(0) && checkLose.includes(4) && checkLose.includes(8))
                || (checkLose.includes(2) && checkLose.includes(4) && checkLose.includes(6))
                ) {
                    _makeMove(availableSquares[i]);
                    return
                }
                checkLose.pop();
            }
        }
    //OTHERWISE DEFAULT BEHAVIOUR:

    //Is middle still available
    if (availableSquares.includes(4)) {
        _makeMove(4);
        return
    }

    //Is Corner available that is not adjacent to an opp move
    if (availableCornerGS.length > 0 ) {
        if (availableCornerGS.includes(0) && !opponentMoves.includes(1) && !opponentMoves.includes(3) ) {
            _makeMove(0);
            return
        } else if (availableCornerGS.includes(2) && !opponentMoves.includes(1) && !opponentMoves.includes(5) ) {
            _makeMove(2);
            return
        } else if (availableCornerGS.includes(6) && !opponentMoves.includes(3) && !opponentMoves.includes(7) ) {
            _makeMove(6);
            return
        } else if (availableCornerGS.includes(8) && !opponentMoves.includes(5) && !opponentMoves.includes(7) ) {
            _makeMove(2);
            return
        }
    }

    //If tTB controls middle is there two vacat Crus GS opposite each other
    if (tacTicBotMoves.includes(4) && availableCruxGS.length >= 2) {
        if (availableCruxGS.includes(1) && availableCruxGS.includes(7)) {
            if ((Math.floor(Math.random()*2)) < 1) { 
                _makeMove(1);
            } else {
                _makeMove(7);
            }
            return
        } else if (availableCruxGS.includes(3) && availableCruxGS.includes(5)) {
            if ((Math.floor(Math.random()*2)) < 1) { 
                _makeMove(3);
            } else {
                _makeMove(5);
            }
            return
        } 
    }

    // RNG
    _makeMove(availableSquares[(Math.floor(Math.random()*availableSquares.length))])
    return
}

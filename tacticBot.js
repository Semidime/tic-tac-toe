function _tacTicBot() {
    let moveSequence = [];
    let availableSquares = [0,1,2,3,4,5,6,7,8];
    const cornerGS = [0,2,6,8];
    const nMCGS = [1,3,5,8];

    if (moveSequence.length == 0) {
        // First move: select random corner
        _makeMove(cornerGS[Math.floor(Math.random()*4)]);
    } else if (moveSequence.length == 1) {
        // Second move:
        // if P1 selected a corner, select opposite corner;
        // otherwise, default to _winBlockRNG();
         if (moveSequence[0] == 0) {
            _makeMove(8);
        } else if (moveSequence[0] == 2) {
            _makeMove(6);
        } else if (moveSequence[0] == 6) {
            _makeMove(2);
        } else if (moveSequence[0] == 8) {
            _makeMove(0);
        } else {
            _winBlockRNG();
        }
    } else if (moveSequence.length == 2) {
        // Third move
        // if first move was a corner, select opposite corner;
        if (moveSequence[0] == 0) {
            _makeMove(8);
        } else if (moveSequence[0] == 2) {
            _makeMove(6);
        } else if (moveSequence[0] == 6) {
            _makeMove(2);
        } else if (moveSequence[0] == 8) {
            _makeMove(0);
        };
    }

    //FOURTH MOVE :
    // X     NOT   // X  O
    //  O O        //  O
    //    X        //    X
    //
    //If first and third moves diagonal corners
    //AND second move middle
    // MUST select any nonMC


    //_winBlockRNG()
}

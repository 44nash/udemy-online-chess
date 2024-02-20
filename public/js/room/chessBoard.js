// ====================================
// Const Variables (Initial Values For The Game)
// ====================================

const xAxis = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const yAxis = [1, 2, 3, 4, 5, 6, 7, 8];

let player = null;
let enemy = null;

let selectedPiece = null;

let isLeftCastlingPerformed = false;
let isRightCastlingPerformed = false;

// White is Lowercase
const lightPieces = [
    {
        position: "A-8",
        icon: "../assets/chess-icons/light/chess-rook-light.svg",
        points: 5,
        piece: 'rook',
        identity:'rA'
    },
    {
        position: "B-8",
        icon: "../assets/chess-icons/light/chess-knight-light.svg",
        points: 3,
        piece: 'knight',
        identity:'nB'
        
    },
    {
        position: "C-8",
        icon: "../assets/chess-icons/light/chess-bishop-light.svg",
        points: 3,
        piece: 'bishop',
        identity:'bC'
    },
    {
        position: "D-8",
        icon: "../assets/chess-icons/light/chess-queen-light.svg",
        points: 9,
        piece: 'queen',
        identity:'qD'
    },
    {
        position: "E-8",
        icon: "../assets/chess-icons/light/chess-king-light.svg",
        points: 10,
        piece: 'king',
        identity:'kE'
    },
    {
        position: "F-8",
        icon: "../assets/chess-icons/light/chess-bishop-light.svg",
        points: 3,
        piece: 'bishop',
        identity:'bF'
    },
    {
        position: "G-8",
        icon: "../assets/chess-icons/light/chess-knight-light.svg",
        points: 3,
        piece: 'knight',
        identity:'nG'
    },
    {
        position: "H-8",
        icon: "../assets/chess-icons/light/chess-rook-light.svg",
        points: 5,
        piece: 'rook',
        identity:'rH'
    },
    {
        position: "A-7",
        icon: "../assets/chess-icons/light/chess-pawn-light.svg",
        points: 5,
        piece: 'pawn',
        identity:'pA'
    },
    {
        position: "B-7",
        icon: "../assets/chess-icons/light/chess-pawn-light.svg",
        points: 5,
        piece: 'pawn',
        identity:'pB'
    },
    {
        position: "C-7",
        icon: "../assets/chess-icons/light/chess-pawn-light.svg",
        points: 5,
        piece: 'pawn',
        identity:'pC'
    },
    {
        position: "D-7",
        icon: "../assets/chess-icons/light/chess-pawn-light.svg",
        points: 5,
        piece: 'pawn',
        identity:'pD'
    },
    {
        position: "E-7",
        icon: "../assets/chess-icons/light/chess-pawn-light.svg",
        points: 5,
        piece: 'pawn',
        identity:'pE'
    },
    {
        position: "F-7",
        icon: "../assets/chess-icons/light/chess-pawn-light.svg",
        points: 5,
        piece: 'pawn',
        identity:'pF'
    },
    {
        position: "G-7",
        icon: "../assets/chess-icons/light/chess-pawn-light.svg",
        points: 5,
        piece: 'pawn',
        identity:'pG'
    },
    {
        position: "H-7",
        icon: "../assets/chess-icons/light/chess-pawn-light.svg",
        points: 5,
        piece: 'pawn',
        identity:'pH'
    },

]


// Black is UpperCase
const blackPieces = [
    {
        position: "A-1",
        icon: "../assets/chess-icons/black/chess-rook-black.svg",
        points: 5,
        piece: 'rook',
        identity:'RA'
    },
    {
        position: "B-1",
        icon: "../assets/chess-icons/black/chess-knight-black.svg",
        points: 3,
        piece: 'knight',
        identity:'NB'
        
    },
    {
        position: "C-1",
        icon: "../assets/chess-icons/black/chess-bishop-black.svg",
        points: 3,
        piece: 'bishop',
        identity:'BC'
    },
    {
        position: "D-1",
        icon: "../assets/chess-icons/black/chess-queen-black.svg",
        points: 9,
        piece: 'queen',
        identity:'QD'
    },
    {
        position: "E-1",
        icon: "../assets/chess-icons/black/chess-king-black.svg",
        points: 10,
        piece: 'king',
        identity:'KE'
    },
    {
        position: "F-1",
        icon: "../assets/chess-icons/black/chess-bishop-black.svg",
        points: 3,
        piece: 'bishop',
        identity:'BF'
    },
    {
        position: "G-1",
        icon: "../assets/chess-icons/black/chess-knight-black.svg",
        points: 3,
        piece: 'knight',
        identity:'NG'
    },
    {
        position: "H-1",
        icon: "../assets/chess-icons/black/chess-rook-black.svg",
        points: 5,
        piece: 'rook',
        identity:'RH'
    },
    {
        position: "A-2",
        icon: "../assets/chess-icons/black/chess-pawn-black.svg",
        points: 5,
        piece: 'pawn',
        identity:'PA'
    },
    {
        position: "B-2",
        icon: "../assets/chess-icons/black/chess-pawn-black.svg",
        points: 5,
        piece: 'pawn',
        identity:'PB'
    },
    {
        position: "C-2",
        icon: "../assets/chess-icons/black/chess-pawn-black.svg",
        points: 5,
        piece: 'pawn',
        identity:'PC'
    },
    {
        position: "D-2",
        icon: "../assets/chess-icons/black/chess-pawn-black.svg",
        points: 5,
        piece: 'pawn',
        identity:'PD'
    },
    {
        position: "E-2",
        icon: "../assets/chess-icons/black/chess-pawn-black.svg",
        points: 5,
        piece: 'pawn',
        identity:'PE'
    },
    {
        position: "F-2",
        icon: "../assets/chess-icons/black/chess-pawn-black.svg",
        points: 5,
        piece: 'pawn',
        identity:'PF'
    },
    {
        position: "G-2",
        icon: "../assets/chess-icons/black/chess-pawn-black.svg",
        points: 5,
        piece: 'pawn',
        identity:'PG'
    },
    {
        position: "H-2",
        icon: "../assets/chess-icons/black/chess-pawn-black.svg",
        points: 5,
        piece: 'pawn',
        identity:'PH'
    },

]

const getPawnPossibleMoves = (xAxisPos, yAxisPos, xAxisIndex, yAxisIndex) => {
    let possibleMoves = []

    let forwardMoves = 1;

    let yAxisIndexForCapture = null;
    let canMoveForward = false;

    if(player === 'light'){
        if(yAxisPos === 7){
            forwardMoves = 2;
        }

        yAxisIndexForCapture = yAxisIndex - 1
        canMoveForward = yAxisIndex > 0

        for(let y = yAxisIndex - 1; y >= yAxisIndex - forwardMoves; y--){
            if(y < 0){
                break;
            }

            let box = document.getElementById(`${xAxisPos}-${yAxis[y]}`);

            if(box.childElementCount === 0){
                possibleMoves.push(box);
            }else{
                break;
            }
        }
    }else{
        if(yAxisPos === 2){
            forwardMoves = 2;
        }

        yAxisIndexForCapture = yAxisIndex + 1
        canMoveForward = yAxisIndex > 0

        for(let y = yAxisIndex + 1; y <= yAxisIndex + forwardMoves; y++){
            if(y > yAxis.length){
                break;
            }

            let box = document.getElementById(`${xAxisPos}-${yAxis[y]}`);

            if(box.childElementCount === 0){
                possibleMoves.push(box);
            }else{
                break;
            }
        }
    }

    if(canMoveForward){
        if(xAxisIndex > 0){
            let pieceToCaptureLeft = document.getElementById(`${xAxis[xAxisIndex - 1]}-${yAxis[yAxisIndexForCapture]}`);
            
            if(pieceToCaptureLeft.childElementCount > 0 && pieceToCaptureLeft.children[0].classList.contains(enemy)){
                possibleMoves.push(pieceToCaptureLeft);
            }
        } 

        if(xAxisIndex < xAxis.length - 1){
            let pieceToCaptureRight = document.getElementById(`${xAxis[xAxisIndex + 1]}-${yAxis[yAxisIndexForCapture]}`);
            
            if(pieceToCaptureRight.childElementCount > 0 && pieceToCaptureRight.children[0].classList.contains(enemy)){
                possibleMoves.push(pieceToCaptureRight);
            }
        } 
    }

    // TODO: Check for el passant

    return possibleMoves
}

const  getRookPossibleMoves = (xAxisPos, yAxisPos, xAxisIndex, yAxisIndex) => {
    let possibleMoves = [];

    let topCollision = false;
    let bottomCollision = false;
    let rightCollision = false;
    let leftCollision = false;
    let yInc = 1;
    let xInc = 1;

    while(!topCollision || !bottomCollision || !leftCollision || !rightCollision){
        if(!topCollision || !bottomCollision){
            if(yAxisIndex + yInc < yAxis.length){
                if(!topCollision){
                    let topBlock = document.getElementById(`${xAxisPos}-${yAxis[yAxisIndex + yInc]}`);

                    if(topBlock.childElementCount > 0){
                        if(topBlock.children[0].classList.contains(enemy)){
                            possibleMoves.push(topBlock)
                        }

                        topCollision = true
                    }else{
                        possibleMoves.push(topBlock)
                    }
                }

            }else{
                topCollision = true
            }

            if(yAxisIndex - yInc > -1){
                if(!bottomCollision){
                    let bottomBlock = document.getElementById(`${xAxisPos}-${yAxis[yAxisIndex - yInc]}`);
    
                    if(bottomBlock.childElementCount > 0){
                        if(bottomBlock.children[0].classList.contains(enemy)){
                            possibleMoves.push(bottomBlock)
                        }
    
                        bottomCollision = true
                    }else{
                        possibleMoves.push(bottomBlock)
                    }
                }
            }else{
                bottomCollision = true
            }

            yInc++;
        }
        if(!leftCollision || !rightCollision){
            if(xAxisIndex + xInc < xAxis.length){
                if(!rightCollision){
                    let rightBlock = document.getElementById(`${xAxis[xAxisIndex + xInc]}-${yAxisPos}`);

                    if(rightBlock.childElementCount > 0){
                        if(rightBlock.children[0].classList.contains(enemy)){
                            possibleMoves.push(rightBlock);
                        }else{
                             if(!isLeftCastlingPerformed){
                                let pieceCollideWith = rightBlock.children[0];

                                if(pieceCollideWith.CDATA_SECTION_NODE.piece === 'king'){
                                    let myKingPosition = rightBlock.id;

                                    if(player === 'light'){
                                        if(xAxisPos + '-' + yAxisPos === 'A-8' && myKingPosition === 'E-8'){
                                            possibleMoves.push(rightBlock);
                                        }
                                    }else{
                                        if(xAxisPos + '-' + yAxisPos === 'A-1' && myKingPosition === 'E-1'){
                                            possibleMoves.push(rightBlock);
                                        }
                                    }
                                }
                             }


                        }
                        rightCollision = true;
                    }else{
                        possibleMoves.push(rightBlock);
                    }
                }

                
            }else{
                rightCollision = true;
            }

            if(xAxisIndex - xInc > -1){
                if(!leftCollision){
                    let leftBlock = document.getElementById(`${xAxis[xAxisIndex - xInc]}-${yAxisPos}`);

                    if(leftBlock.childElementCount > 0){
                        if(leftBlock.children[0].classList.contains(enemy)){
                            possibleMoves.push(leftBlock);
                        }else{
                            if(!isLeftCastlingPerformed){
                            let pieceCollideWith = leftBlock.children[0];

                                if(pieceCollideWith.CDATA_SECTION_NODE.piece === 'king'){
                                    let myKingPosition = leftBlock.id;

                                    if(player === 'light'){
                                        if(xAxisPos + '-' + yAxisPos === 'H-8' && myKingPosition === 'E-8'){
                                            possibleMoves.push(leftBlock);
                                        }
                                    }else{
                                        if(xAxisPos + '-' + yAxisPos === 'H-1' && myKingPosition === 'E-1'){
                                            possibleMoves.push(leftBlock);
                                        }
                                    }
                                }
                            }
                        }
                        leftCollision = true;
                    }else{
                        possibleMoves.push(leftBlock);
                    }
                }

            }else{
                leftCollision = true
            }
            xInc++;
        }
    }
    return possibleMoves

}

const getBishopPossibleMoves = (xAxisIndex, yAxisIndex) => {
    let possibleMoves = [];

    let topLeftCollision = false;
    let topRightCollision = false;
    let bottomLeftCollision = false;
    let bottomRightCollision = false;

    let yInc = 1;
    let xInc = 1;

    while(!topLeftCollision || !topRightCollision || !bottomLeftCollision || !bottomRightCollision){
        if(!topLeftCollision || !topRightCollision){
            if(yAxisIndex + yInc < yAxis.length && xAxisIndex - xInc > -1){
                if(!topLeftCollision){
                    let topLeftBlock = document.getElementById(`${xAxis[xAxisIndex - xInc]}-${yAxis[yAxisIndex + yInc]}`);

                    if(topLeftBlock.childElementCount > 0){
                        if(topLeftBlock.children[0].classList.contains(enemy)){
                            possibleMoves.push(topLeftBlock)
                        }

                        topLeftCollision = true
                    }else{
                        possibleMoves.push(topLeftBlock)
                    }
                }

            }else{
                topLeftCollision = true
            }

            //

            if(yAxisIndex + yInc < yAxis.length && xAxisIndex + xInc < xAxis.length){
                if(!topRightCollision){
                    let topRightBlock = document.getElementById(`${xAxis[xAxisIndex + xInc]}-${yAxis[yAxisIndex + yInc]}`);

                    if(topRightBlock.childElementCount > 0){
                        if(topRightBlock.children[0].classList.contains(enemy)){
                            possibleMoves.push(topRightBlock)
                        }

                        topRightCollision = true
                    }else{
                        possibleMoves.push(topRightBlock)
                    }
                }

            }else{
                topRightCollision = true
            }
        }

        if(!bottomLeftCollision || !bottomRightCollision){
            if(yAxisIndex - yInc > -1 && xAxisIndex - xInc > -1){
                if(!bottomLeftCollision){
                    let bottomLeftBlock = document.getElementById(`${xAxis[xAxisIndex - xInc]}-${yAxis[yAxisIndex - yInc]}`);

                    if(bottomLeftBlock.childElementCount > 0){
                        if(bottomLeftBlock.children[0].classList.contains(enemy)){
                            possibleMoves.push(bottomLeftBlock)
                        }

                        bottomLeftCollision = true
                    }else{
                        possibleMoves.push(bottomLeftBlock)
                    }
                }

            }else{
                bottomLeftCollision = true
            }

            //

            if(yAxisIndex - yInc > -1 && xAxisIndex + xInc < xAxis.length){
                if(!bottomRightCollision){
                    let bottomRightBlock = document.getElementById(`${xAxis[xAxisIndex + xInc]}-${yAxis[yAxisIndex - yInc]}`);

                    if(bottomRightBlock.childElementCount > 0){
                        if(bottomRightBlock.children[0].classList.contains(enemy)){
                            possibleMoves.push(bottomRightBlock)
                        }

                        bottomRightCollision = true
                    }else{
                        possibleMoves.push(bottomRightBlock)
                    }
                }

            }else{
                bottomRightCollision = true
            }
        }
        xInc++;
        yInc++;
    }
    return possibleMoves
}

const getKnightPossibleMoves = (xAxisIndex, yAxisIndex) => {
    let possibleMoves = []

    // Left-Up
    if(xAxisIndex - 2 > -1 && yAxisIndex + 1 < yAxis.length){
        let block = document.getElementById(`${xAxis[xAxisIndex - 2]}-${yAxis[yAxisIndex + 1]}`);

        if(block.childElementCount > 0){
            if(block.children[0].classList.contains(enemy)){
                possibleMoves.push(block)
            }
        }else{
            possibleMoves.push(block)
        }

    }

    // Left-Down
    if(xAxisIndex - 2 > -1 && yAxisIndex - 1 > -1){
        let block = document.getElementById(`${xAxis[xAxisIndex - 2]}-${yAxis[yAxisIndex - 1]}`);

        if(block.childElementCount > 0){
            if(block.children[0].classList.contains(enemy)){
                possibleMoves.push(block)
            }
        }else{
            possibleMoves.push(block)
        }
    }

    // Right-Up
    if(xAxisIndex + 2 < xAxis.length && yAxisIndex + 1 < yAxis.length){
        let block = document.getElementById(`${xAxis[xAxisIndex + 2]}-${yAxis[yAxisIndex + 1]}`);

        if(block.childElementCount > 0){
            if(block.children[0].classList.contains(enemy)){
                possibleMoves.push(block)
            }
        }else{
            possibleMoves.push(block)
        }

    }        

    // Right-Down
    if(xAxisIndex + 2 < xAxis.length && yAxisIndex - 1 > -1){
        let block = document.getElementById(`${xAxis[xAxisIndex + 2]}-${yAxis[yAxisIndex - 1]}`);

        if(block.childElementCount > 0){
            if(block.children[0].classList.contains(enemy)){
                possibleMoves.push(block)
            }
        }else{
            possibleMoves.push(block)
        }

    }

    // Up-Left
    if(xAxisIndex - 1 > -1 && yAxisIndex + 2 < yAxis.length){
        let block = document.getElementById(`${xAxis[xAxisIndex - 1]}-${yAxis[yAxisIndex + 2]}`);

        if(block.childElementCount > 0){
            if(block.children[0].classList.contains(enemy)){
                possibleMoves.push(block)
            }
        }else{
            possibleMoves.push(block)
        }

    }  
    
    // Up-Right
    if(xAxisIndex + 1 < xAxis.length && yAxisIndex + 2 < yAxis.length){
        let block = document.getElementById(`${xAxis[xAxisIndex + 1]}-${yAxis[yAxisIndex + 2]}`);

        if(block.childElementCount > 0){
            if(block.children[0].classList.contains(enemy)){
                possibleMoves.push(block)
            }
        }else{
            possibleMoves.push(block)
        }

    }
    
    // Down-Left
    if(xAxisIndex - 1 > -1 && yAxisIndex - 2 > -1){
        let block = document.getElementById(`${xAxis[xAxisIndex - 1]}-${yAxis[yAxisIndex - 2]}`);

        if(block.childElementCount > 0){
            if(block.children[0].classList.contains(enemy)){
                possibleMoves.push(block)
            }
        }else{
            possibleMoves.push(block)
        }

    }

    // Down-Right
    if(xAxisIndex + 1 < xAxis.length && yAxisIndex - 2 > -1){
        let block = document.getElementById(`${xAxis[xAxisIndex + 1]}-${yAxis[yAxisIndex - 2]}`);

        if(block.childElementCount > 0){
            if(block.children[0].classList.contains(enemy)){
                possibleMoves.push(block)
            }
        }else{
            possibleMoves.push(block)
        }

    }

    return possibleMoves;
}

const getKingPossibleMoves = (xAxisPos, yAxisPos, xAxisIndex, yAxisIndex) => {
    let possibleMoves = []

    // TOP
    if(yAxisIndex + 1 < yAxis.length){
        let block = document.getElementById(`${xAxisPos}-${yAxis[yAxisIndex + 1]}`)

        if(block.childElementCount > 0){
            if(block.children[0].classList.contains(enemy)){
                possibleMoves.push(block)
            }
        }else{
            possibleMoves.push(block)
        }
    }

    // Bottom
    if(yAxisIndex - 1 > -1){
        let block = document.getElementById(`${xAxisPos}-${yAxis[yAxisIndex - 1]}`)

        if(block.childElementCount > 0){
            if(block.children[0].classList.contains(enemy)){
                possibleMoves.push(block)
            }
        }else{
            possibleMoves.push(block)
        }
    }

    // Left
    if(xAxisIndex - 1 > -1){
        let block = document.getElementById(`${xAxis[xAxisIndex - 1]}-${yAxisPos}`)

        if(block.childElementCount > 0){
            if(block.children[0].classList.contains(enemy)){
                possibleMoves.push(block)
            }
        }else{
            possibleMoves.push(block)
        }
    }

    // Right
    if(xAxisIndex + 1 < xAxis.length){
        let block = document.getElementById(`${xAxis[xAxisIndex + 1]}-${yAxisPos}`)

        if(block.childElementCount > 0){
            if(block.children[0].classList.contains(enemy)){
                possibleMoves.push(block)
            }
        }else{
            possibleMoves.push(block)
        }
    }


    // TOP-Left
    if (xAxisIndex - 1 > -1 && yAxisIndex + 1 < yAxis.length){
        let block = document.getElementById(`${xAxis[xAxisIndex - 1]}-${yAxis[yAxisIndex + 1]}`)

        if(block.childElementCount > 0){
            if(block.children[0].classList.contains(enemy)){
                possibleMoves.push(block)
            }
        }else{
            possibleMoves.push(block)
        }
    }

    // TOP-Right
    if (xAxisIndex + 1 < xAxis.length && yAxisIndex + 1 < yAxis.length){
        let block = document.getElementById(`${xAxis[xAxisIndex + 1]}-${yAxis[yAxisIndex + 1]}`)

        if(block.childElementCount > 0){
            if(block.children[0].classList.contains(enemy)){
                possibleMoves.push(block)
            }
        }else{
            possibleMoves.push(block)
        }
    }

    // Bottom-Left
    if (xAxisIndex - 1 > -1 && yAxisIndex - 1 > -1){
        let block = document.getElementById(`${xAxis[xAxisIndex - 1]}-${yAxis[yAxisIndex - 1]}`)

        if(block.childElementCount > 0){
            if(block.children[0].classList.contains(enemy)){
                possibleMoves.push(block)
            }
        }else{
            possibleMoves.push(block)
        }
    }

    // Bottom-Right
    if (xAxisIndex + 1 < xAxis.length && yAxisIndex - 1 > -1){
        let block = document.getElementById(`${xAxis[xAxisIndex + 1]}-${yAxis[yAxisIndex - 1]}`)

        if(block.childElementCount > 0){
            if(block.children[0].classList.contains(enemy)){
                possibleMoves.push(block)
            }
        }else{
            possibleMoves.push(block)
        }
    }

    // TODO: Check if king is not attacked in one of these postions
    possibleMoves = possibleMoves.filter(possibleMove => {
        let kingPosition = possibleMove.id;

        if(!isCheck(kingPosition)){
            return possibleMove
        }
    })

    return possibleMoves
}

const switchPlayerAndEnemy = () => {
    if(player === 'light'){
        player = 'black'
        enemy = 'light'
    }else{
        player = 'light'
        enemy = 'black'
    }
}

const isCheck = (kingPosition, myKing = true) => {
    let splittedPos = kingPosition.split("-")

    let xAxisPos = splittedPos[0];
    let yAxisPos = +splittedPos[1];

    let xAxisIndex = xAxis.findIndex(x => x === xAxisPos)
    let yAxisIndex = yAxis.findIndex(y => y === yAxisPos)

    if(!myKing){
        switchPlayerAndEnemy()
    }

    let possibleMoves = Array.prototype.concat(
        getRookPossibleMoves(xAxisPos, yAxisPos, xAxisIndex, yAxisIndex),
        getBishopPossibleMoves(xAxisIndex, yAxisIndex),
        getKnightPossibleMoves(xAxisIndex, yAxisIndex)  
    )

    for(let i = 0; i < possibleMoves.length; i++){
        let box = possibleMoves[i];

        if(box. children.length > 0){
            let piece = box.children[0]

            let pieceXPos = box.id.split("-")[0]
            let pieceYPos = +box.id.split("-")[1]

            let pieceXAxisIndex = xAxis.findIndex(x => x === pieceXPos)
            let pieceYAxisIndex = yAxis.findIndex(y => y === pieceYPos)

            switch(piece.dataset.piece){
                case 'pawn':
                    if(enemy === 'light'){
                        if(
                            pieceXAxisIndex === xAxisIndex - 1 && pieceYAxisIndex === yAxisIndex + 1 ||
                            pieceXAxisIndex === xAxisIndex + 1 && pieceYAxisIndex === yAxisIndex + 1
                        ){
                            if(!myKing){
                                switchPlayerAndEnemy()
                            }
                            return true;
                        }
                    }else{
                        if(
                            pieceXAxisIndex === xAxisIndex - 1 && pieceYAxisIndex === yAxisIndex - 1 ||
                            pieceXAxisIndex === xAxisIndex + 1 && pieceYAxisIndex === yAxisIndex - 1
                        ){
                            if(!myKing){
                                switchPlayerAndEnemy()
                            }
                            return true;
                        }
                    }
                    break;
                case 'knight':
                    if(
                        pieceXAxisIndex === xAxisIndex - 1 && pieceYAxisIndex === yAxisIndex + 2 ||
                        pieceXAxisIndex === xAxisIndex - 1 && pieceYAxisIndex === yAxisIndex - 2 ||
                        pieceXAxisIndex === xAxisIndex + 1 && pieceYAxisIndex === yAxisIndex + 2 ||
                        pieceXAxisIndex === xAxisIndex + 1 && pieceYAxisIndex === yAxisIndex + 2 ||

                        pieceXAxisIndex === xAxisIndex - 2 && pieceYAxisIndex === yAxisIndex + 1 ||
                        pieceXAxisIndex === xAxisIndex - 2 && pieceYAxisIndex === yAxisIndex - 1 ||
                        pieceXAxisIndex === xAxisIndex + 2 && pieceYAxisIndex === yAxisIndex + 1 ||
                        pieceXAxisIndex === xAxisIndex + 2 && pieceYAxisIndex === yAxisIndex - 1 
                    ){
                        if(!myKing){
                            switchPlayerAndEnemy()
                        }
                        return true;
                    }
                    break;
                case 'rook':
                    if(
                        pieceXPos === xAxisPos || pieceYPos === yAxisPos
                    ){
                        if(!myKing){
                            switchPlayerAndEnemy()
                        }
                        return true;
                    }
                    break;
                case 'bishop':
                    let xyBlockDiffIsTheSame = Math.abs(xAxisIndex - pieceXAxisIndex) === Math.abs(yAxisIndex - pieceYAxisIndex);
                    if(
                        pieceXAxisIndex < xAxisIndex && pieceXAxisIndex > yAxisIndex && xyBlockDiffIsTheSame ||
                        pieceXAxisIndex < xAxisIndex && pieceXAxisIndex < yAxisIndex && xyBlockDiffIsTheSame ||
                        pieceXAxisIndex > xAxisIndex && pieceXAxisIndex > yAxisIndex && xyBlockDiffIsTheSame ||
                        pieceXAxisIndex > xAxisIndex && pieceXAxisIndex < yAxisIndex && xyBlockDiffIsTheSame 
                    ){
                        if(!myKing){
                            switchPlayerAndEnemy()
                        }
                        return true;
                    }
                    break;
                case 'queen':
                    let xyBlockDiffIsTheSameQueen = Math.abs(xAxisIndex - pieceXAxisIndex) === Math.abs(yAxisIndex - pieceYAxisIndex);
                    if(
                        pieceXPos === xAxisPos || pieceYPos === yAxisPos ||
                        pieceXAxisIndex < xAxisIndex && pieceXAxisIndex > yAxisIndex && xyBlockDiffIsTheSameQueen ||
                        pieceXAxisIndex < xAxisIndex && pieceXAxisIndex < yAxisIndex && xyBlockDiffIsTheSameQueen ||
                        pieceXAxisIndex > xAxisIndex && pieceXAxisIndex > yAxisIndex && xyBlockDiffIsTheSameQueen ||
                        pieceXAxisIndex > xAxisIndex && pieceXAxisIndex < yAxisIndex && xyBlockDiffIsTheSameQueen 
                    ){
                        if(!myKing){
                            switchPlayerAndEnemy()
                        }
                        return true;
                    }
                    break;
                default:
                    break;
            }
        }
    }
    if(!myKing){
        switchPlayerAndEnemy()
    }
    return false;
}

const isCheckmate = (enemyKingPosition) => {
    switchPlayerAndEnemy()

    let splittedPos = kingPosition.split("-")

    let xAxisPos = splittedPos[0];
    let yAxisPos = +splittedPos[1];

    let xAxisIndex = xAxis.findIndex(x => x === xAxisPos)
    let yAxisIndex = yAxis.findIndex(y => y === yAxisPos)

    let kingPossibleMoves = getKingPossibleMoves(xAxisPos, yAxisPos, xAxisIndex, yAxisIndex);

    let myPieces = document.getElementById(`.piece.${player}`);

    for(let i = 0; i <  myPieces.length; i++){
        let myPiece = myPieces[i]

        if(myPiece.dataset.piece === 'king') continue;

        let myPieceXPos = myPiece.parentNode.id.split("-")[0]
        let myPieceYPos = +myPiece.parentNode.id.split("-")[1]

        let myPieceXAxisIndex = xAxis.findIndex(x => x === myPieceXPos)
        let myPieceYAxisIndex = yAxis.findIndex(y => y === myPieceYPos)

        let piecePossibleMoves;

        switch(myPiece.dataset.piece){
            case "pawn":
                piecePossibleMoves = getPawnPossibleMoves(myPieceXPos, myPieceYPos, myPieceXAxisIndex, myPieceYAxisIndex)
                break;
            case "rook":
                piecePossibleMoves = getRookPossibleMoves(myPieceXPos, myPieceYPos, myPieceXAxisIndex, myPieceYAxisIndex)
                break;
            case "bishop":
                piecePossibleMoves = getBishopPossibleMoves(myPieceXAxisIndex, myPieceYAxisIndex) 
                break;
            case "knight":
                piecePossibleMoves = getKnightPossibleMoves(myPieceXAxisIndex, myPieceYAxisIndex)  
                break; 
            case "queen":
                piecePossibleMoves = Array.prototype.concat(
                    getRookPossibleMoves(myPieceXPos, myPieceYPos, myPieceXAxisIndex, myPieceYAxisIndex),
                    getBishopPossibleMoves(myPieceXAxisIndex, myPieceYAxisIndex) 
                )
                break;                   
            default:
                break;
        }

        let currentBox = myPiece.parentNode
        currentBox.innerHTML = ""

        for(let j = 0; j < piecePossibleMoves.length; j++){
            let possibleMove = piecePossibleMoves[i];

            let boxToMove = document.getElementById(possibleMove.id);

            let removedPiece = null;

            if(boxToMove.children.length > 0){
                removedPiece = boxToMove.children[0]
            }

            boxToMove.innerHTML = ""

            boxToMove.appendChild(myPiece);

            let check = isCheck(enemyKingPosition);

            boxToMove.innerHTML = ""

            if(removedPiece){
                boxToMove.appendChild(removedPiece)
            }

            if(!check){
                currentBox.appendChild(myPiece);
                switchPlayerAndEnemy()
                return false
            }
        }

        currentBox.appendChild(myPiece)
    }
    switchPlayerAndEnemy()

    if(kingPossibleMoves.length === 0){
        return true
    }
    return false
}

const getKingPosition = (pieceColor) => {
    let pieces = document.querySelectorAll(`.piece.${pieceColor}`);

    for(let i = 0; i < pieces.length; i++){
        if(pieces[i].dataset.piece === 'king'){
            return pieces[i].parentNode.id
        }
    }
}
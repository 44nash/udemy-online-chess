// ====================================
// DOM Elements
// ====================================
const room = document.getElementById("game-room");
const boxes = document.querySelectorAll(".box");
const playerLight = document.getElementById("player-light");
const playerBlack = document.getElementById("player-black");
const waitingMessage = document.getElementById("waiting-message");
const playerLightTimer = playerLight.querySelector(".timer");
const playerBlackTimer = playerBlack.querySelector(".timer");
const lightCapturedPieces = document.getElementById("light-captured-pieces");
const blackCapturedPieces = document.getElementById("black-captured-pieces");
const piecesToPromoteContainer = document.getElementById("pieces-to-promote-container");
const piecesToPromote = document.getElementById("pieces-to-promote");
const gameOverMessageContainer = document.getElementById("game-over-message-container");
const winnerUsername = gameOverMessageContainer.querySelector("p strong");
const myScoreElement = document.getElementById("my-score");
const enemyScoreElement = document.getElementById("enemy-score");

// ====================================
// Game Variables
// ====================================

let user = null 

let search = window.location.search.split("&")

let roomId = null;
let password = null;

let gameDetails = null;

let gameHasTimer = false;
let timer = null;
let myTurn = false;
let kingIsAttacked = false;
let pawnToPromotePosition = null;
let castling = null;

let gameOver = false;
let myScore = 0;
let enemyScore = 0;

let gameStartedAtTimestamp = null;

if(search.length > 1){
    roomId = search[0].split("=")[1]
    password = search[1].split("=")[1]
}else{
    roomId = search[0].split("=")[1]
}

// ====================================
// Functions
// ====================================

const fetchUserCallback = (data) => {
    user = data;

    if(password){
        socket.emit("user-connected", user, roomId, password);
    }else{
        socket.emit("user-connected", user, roomId);
    }

    socket.emit("get-game-details", roomId, user);
}

fetchData("/api/user-info", fetchUserCallback)

// Display chess board logic
const displayChessPieces = () => {
    boxes.forEach(box => {
        box.innerHTML = ""
    })

    lightPieces.forEach(piece => {
        let box = document.getElementById(piece.position)
    
        // ${piece.identity}
        box.innerHTML += `
            <div class="piece light ${piece.identity}" data-piece="${piece.piece}" data-points="${piece.points}">
                <img src="${piece.icon}" alt="Chess Piece">
            </div>
        `
    })


    blackPieces.forEach(piece => {
        let box = document.getElementById(piece.position)
    
        // ${piece.identity}
        box.innerHTML += `
            <div class="piece black ${piece.identity}" data-piece="${piece.piece}" data-points="${piece.points}">
                <img src="${piece.icon}" alt="Chess Piece">
            </div>
        `
    })

    addPieceListeners()
}

const onClickPiece = (e) => {
    if(!myTurn || gameOver){
        return;
    }

    hidePossibleMoves()
    
    let element = e.target.closest(".piece");
    let position = element.parentNode.id;
    let piece = element.dataset.piece;

    if(selectedPiece && selectedPiece.piece === piece && selectedPiece.position === position){
        hidePossibleMoves()
        selectedPiece = null
        return;
    }

    selectedPiece = {position, piece}

    let possibleMoves = findPossibleMoves(position, piece);

    console.log(possibleMoves)

    showPossibleMoves(possibleMoves)
}

const addPieceListeners = () => {
    document.querySelectorAll(`.piece.${player}`).forEach(piece => {
        piece.addEventListener("click", onClickPiece)
    })
    document.querySelectorAll(`.piece.${enemy}`).forEach(piece => {
        piece.style.cursor = "default"
    })
}
// ---------------------------------------------------

// Possible Moves Logic

const showPossibleMoves = (possibleMoves) => {
    possibleMoves.forEach(box => {
        let possibleMoveBox = document.createElement('div')
        possibleMoveBox.classList.add("possible-move");

        possibleMoveBox.addEventListener("click", move)

        box.appendChild(possibleMoveBox)
    })
}

const hidePossibleMoves = () => {
    document.querySelectorAll('.possible-move').forEach(possibleMoveBox => {
        let parent = possibleMoveBox.parentNode
        possibleMoveBox.removeEventListener('click', move)
        parent.removeChild(possibleMoveBox)
    })
}

const findPossibleMoves = (position, piece) => {
    let splittedPos = position.split("-");
    let yAxisPos = +splittedPos[1];
    let xAxisPos = splittedPos[0];

    let yAxisIndex = yAxis.findIndex(y => y === yAxisPos)
    let xAxisIndex = xAxis.findIndex(x => x === xAxisPos)

    switch(piece){
        case "pawn":
            return getPawnPossibleMoves(xAxisPos, yAxisPos, xAxisIndex, yAxisIndex)
        case "rook":
            return getRookPossibleMoves(xAxisPos, yAxisPos, xAxisIndex, yAxisIndex)
        case "bishop":
            return getBishopPossibleMoves(xAxisIndex, yAxisIndex) 
        case "knight":
            return getKnightPossibleMoves(xAxisIndex, yAxisIndex)   
        case "queen":
            return Array.prototype.concat(
                getRookPossibleMoves(xAxisPos, yAxisPos, xAxisIndex, yAxisIndex),
                getBishopPossibleMoves(xAxisIndex, yAxisIndex) 
            )
        case "king":
            return getKingPossibleMoves(xAxisPos, yAxisPos, xAxisIndex, yAxisIndex)                         
        default:
            return []
    }
}


// ---------------------------------------------------

// Timer Logic
const updateTimer = (currentPlayer, minutes, seconds) => {
    if(currentPlayer === 'light'){
        playerLightTimer.innerText = 
            `${minutes >= 10 ? minutes : "0" + minutes}:${seconds >= 10 ? seconds : "0" + seconds}`
    }else{
        playerBlackTimer.innerText = 
            `${minutes >= 10 ? minutes : "0" + minutes}:${seconds >= 10 ? seconds : "0" + seconds}`
    }
}

const timerEndedCallback = () => {
    socket.emit('timer-ended', roomId, user.username, gameStartedAtTimestamp)   
}
// ---------------------------------------------------

// Game Logic
const setCursor = (cusror) => {
    document.querySelectorAll(`.piece.${player}`).forEach(piece => {
        piece.getElementsByClassName.cusror = cusror
    })
}

const startGame = (playerTwo) => {
    playerBlack.querySelector(".username").innerText = playerTwo.username;

    waitingMessage.classList.add('hidden');
    playerBlack.classList.remove('hidden');

    displayChessPieces();

    setPiecesToPromote();
}

const endMyTurn = (newPieceBox, pawnPromoted = false, castlingPerformed = false, elPassantPerformed = false) => {
    if(kingIsAttacked){
        setKingIsAttacked(false);
    }

    myTurn = false;
    setCursor("default")

    saveMove(newPieceBox, pawnPromoted, castlingPerformed, elPassantPerformed);

    checkIfKingIsAttacked(enemy);
}
// ---------------------------------------------------

// Move Logic


const move = (e) => {
    let currentBox = document.getElementById(selectedPiece.position);
    let boxToMove = e.target.parentNode;
    let piece = currentBox.querySelector('.piece');

    hidePossibleMoves();

    let pieceToRemove = null;
    let pieceToRemovePieceImg = null;

    if(boxToMove.children.length > 0){
        if(boxToMove.children[0].classList.contains(player)){
            // TODO: Perform castling
           performCastling(player, currentBox.id, boxToMove.id);

            return;
        }

        pieceToRemove = boxToMove.children[0];
        pieceToRemovePieceImg = pieceToRemove.children[0];
    }else{
        // TODO: Check for castling
        if(!isLeftCastlingPerformed || !isRightCastlingPerformed){
            if(piece.dataset.piece === 'rook'){
                let myKingPosition = getKingPosition(player);

                let pieceXAxisIndex = xAxis.findIndex(x => x === currentBox.id[0]);
                let myKingXAxisIndex = xAxis.findIndex(x => x === myKingPosition[0]);

                if(pieceXAxisIndex < myKingXAxisIndex){
                    isLeftCastlingPerformed = true;
                }else{
                    isRightCastlingPerformed = true;
                }
            }
            
        }
    }

    currentBox.innerHTML = "";

    if(pieceToRemove){
        // TODO: Capture piece
        capturePiece(pieceToRemove)
        boxToMove.innerHTML = ""
    }

    boxToMove.appendChild(piece)

    let boxesNeededForCheck = {
        currentBox, boxToMove
    }

    let piecesNeededForCheck = {
        piece, pieceToRemove, pieceToRemovePieceImg
    }

    let isMovePossible = canMakeMove(boxesNeededForCheck, piecesNeededForCheck);

    if(!isMovePossible){
        return;
    }

    // TODO: Check for piece promotion and el passant
    if(piece.dataset.piece === 'pawn'){
        // pawn promotion check
        if(
            (player === 'light' && boxToMove.id[2] === '1') ||
            (player === 'black' && boxToMove.id[2] === '8') 
        ){
            let canBePromoted = isPawnAtTheEndOfTheBoard(player, boxToMove.id);

            if(canBePromoted){
                pawnToPromotePosition = boxToMove.id;

                piecesToPromoteContainer.classList.remove('hidden');

                return;
            }
        }

        // el passant check
    }

    
    // TODO: Check for draw

    // TODO: End my turn
    endMyTurn(boxToMove)       
}

const canMakeMove = ({ currentBox, boxToMove },{ piece, pieceToRemove, pieceToRemovePieceImg }) => {
    // TODO: Check if move is valid
    let moveIsNotValid = checkIfKingIsAttacked(player);

    if(moveIsNotValid){
        selectedPiece = null;

        if(pieceToRemove){
            // TODO: undo everything
            pieceToRemove.appendChild(pieceToRemovePieceImg)

            boxToMove.removeChild(piece);
            boxToMove.appendChild(pieceToRemove);

            if(pieceToRemove.classList.contains('black')){
                blackCapturedPieces.removedChild(blackCapturedPieces.lastChild)
            }else{
                lightCapturedPieces.removedChild(lightCapturedPieces.lastChild)
            }
        }

        currentBox.appendChild(piece);


        displayToast("You cant make this move. Your King is under attack")
    }

    return true
}

const capturePiece = (pieceToRemove) => {
    let pawnImg = pieceToRemove.children[0];

    let li = document.createElement('li');
    li.appendChild(pawnImg);

    if(pieceToRemove.classList.contains('black')){
        blackCapturedPieces.appendChild(li)

        if(!gameOver){
            if(player === 'light'){
                myScore += parseInt(pieceToRemove.dataset.points)
            }else{
                enemyScore += parseInt(pieceToRemove.dataset.points)
            }
        }
    }else{
        lightCapturedPieces.appendChild(li);
         
        if(!gameOver){
            if(player === 'black'){
                myScore += parseInt(pieceToRemove.dataset.points)
            }else{
                enemyScore += parseInt(pieceToRemove.dataset.points)
            }
        }
    }
}

const checkIfKingIsAttacked = (playerToCheck) => {
    let kingPosition = getKingPosition(playerToCheck);

    let check = isCheck(kingPosition, playerToCheck === player);

    if(check){
        if(player !== playerToCheck){
            // TODO: Check if this is a character or just check
            if(isCheckmate(kingPosition)){
                socket.emit('checkmate', roomId, user.username, myScore, gameStartedAtTimestamp)
                //endGame(user.username)
            }else{
                socket.emit('check', roomId);
            }
        }

        return true;
    }

    return false
}

const saveMove = (newPieceBox, pawnPromoted, castlingPerformed, elPassantPerformed) => {
    let move = {from: selectedPiece.position, to: newPieceBox.id, piece: selectedPiece.piece, pieceColor: player};
    selectedPiece = null;
    pawnToPromotePosition = null;

    if(gameHasTimer){
        let currentTime;

        if(player === 'light'){
            currentTime = playerLightTimer.innerText
        }else{
            currentTime = playerBlackTimer.innerText
        }

        move.time = currentTime

        timer.stop()
    }

    if(pawnPromoted){
        // TODO: pass the pawn promotion also
        let promotedPiece = newPieceBox.children[0];

        let pawnPromotion = {
            promotedTo: promotedPiece.dataset.piece,
            pieceImg: promotedPiece.children[0].src
        }

        socket.emit('move-made', roomId, move, pawnPromotion)
    }else if(castlingPerformed){
        // TODO: pass the castling also
        socket.emit('move-made', roomId, move, null , castling)
    }else if(elPassantPerformed){
        // TODO: pass the el passant alsp
    }else{
        socket.emit('move-made', roomId, move)
    }
}

const moveEnemy = (move, pawnPromotion = null, elPassantPerformed = false) => {
    // TODO: initialize pawnsToPerformElPassant Object

    const {from, to, piece} = move; // Error piece not used

    let boxMovedFrom = document.getElementById(from);
    let boxMovedTo = document.getElementById(to);

    if(boxMovedTo.children.length > 0){
        let pieceToRemove = boxMovedTo.children[0];

        capturePiece(pieceToRemove)
    }

    boxMovedTo.innerHTML = "";

    let enemyPiece = boxMovedFrom.children[0];

    if(pawnPromotion){
        // TODO: promote piece
        const {promotedTo, pieceImg } = pawnPromotion

        enemyPiece.dataset.piece = promotedTo;
        enemyPiece.children[0].src = pieceImg;
    }

    boxMovedFrom.innerHTML = ""
    boxMovedTo.appendChild(enemyPiece);

    if(elPassantPerformed){
        // TODO: perform el passant
    }

    // TODO: Check if piece and if true add the piece tp the pawnsTo PerformElPassant object

    myTurn = true;
    setCursor('pointer')

    if(gameHasTimer){
        timer.start()
    }

}
// ---------------------------------------------------

// ====================================
// Castling Logic
// ====================================

const performCastling = (currentPlayer, rookPosition, kingPosition) => {
    let rookBox = document.getElementById(rookPosition)
    let kingBox = document.getElementById(kingPosition)

    let rook = rookBox.children[0];
    let king = kingBox.children[0];

    let newRookPosition = rookPosition;
    let newKingPosition = kingPosition;

    if(rookPosition[0] === 'A'){
        newRookPosition = 'D' + rookPosition.substr(1);
        newKingPosition = 'C' + kingPosition.substr(1);
    }else{
        newRookPosition = 'F' + rookPosition.substr(1);
        newKingPosition = 'G' + kingPosition.substr(1);
    }

    rookBox.innerHTML = ""
    kingBox.innerHTML = ""
    
    let newRookBox = document.getElementById(newRookPosition)
    let newKingBox = document.getElementById(newKingPosition)

    newRookBox.appendChild(rook);
    newKingBox.appendChild(king);

    if(currentPlayer === player){
        let check = isCheck(newKingPosition);

        if(check){
            newRookBox.innerHTML = ""
            newKingBox.innerHTML = ""

            rookBox.appendChild(rook)
            kingBox.appendChild(king)

            // TODO: display error toast
            displayToast("Your King is under attack")
        }else{
            if(rookPosition[0] === 'A'){
                isLeftCastlingPerformed = true;
            }else{
                isRightCastlingPerformed = true;
            }

            castling = {
                rookPosition,
                kingPosition
            }

            endMyTurn(document.getElementById(kingPosition), false, true)
        }
    }else{
        castling = null;

        myTurn = true;
        setCursor('pointer');

        if(gameHasTimer){
            timer.start()
        }
    }
}

// ---------------------------------------------------
// ====================================
// Pawn Promotion Logic
// ====================================

const setPiecesToPromote = () => {
    if(player === 'light'){
        lightPieces.forEach(piece => {
            if(piece.piece !== 'pawn' && piece.piece !== 'king'){
                const li = document.createElement("li");
                li.setAttribute("data-piece", piece.piece);

                const img = document.createElement("img");
                img.src = piece.icon;

                li.appendChild(img);
                piecesToPromote.appendChild(li);
            }
        })
    }else{
        blackPieces.forEach(piece => {
            if(piece.piece !== 'pawn' && piece.piece !== 'king'){
                const li = document.createElement("li");
                li.setAttribute("data-piece", piece.piece);

                const img = document.createElement("img");
                img.src = piece.icon;

                li.appendChild(img);
                piecesToPromote.appendChild(li);
            }
        })
    }
    addListenerToPiecesToPromote();
}

const onChoosePieceToPromote = e => {
    if(!pawnToPromotePosition){
        return;
    }

    const pieceToPromote = e.target.closest("li");
    const pieceToPromoteImg = pieceToPromote.children[0];
    const pieceToPromoteType = pieceToPromote.dataset.piece;

    let pieceToChange = document.getElementById(pawnToPromotePosition).children[0];

    pieceToChange.innerHTML = ""
    pieceToChange.appendChild(pieceToPromoteImg)
    pieceToChange.dataset.piece = pieceToPromoteType;

    piecesToPromoteContainer.classList.add('hidden');

    endMyTurn(document.getElementById(pawnToPromotePosition), true);
}

const addListenerToPiecesToPromote = () => {
    for(let i = 0; i < piecesToPromote.children.length; i++){
        piecesToPromote.children[i].addEventListener("click", onChoosePieceToPromote)
    }
}
// ---------------------------------------------------


displayChessPieces()



// ====================================
// Socket Listeners
// ====================================

socket.on('receive-game-details', (details) => {
    gameDetails = details;

    let playerOne = gameDetails.players[0];

    gameHasTimer = gameDetails.time > 0;

    if(!gameHasTimer){
        playerLightTimer.classList.add('hidden');
        playerBlackTimer.classList.add('hidden');
    }else{
        playerLightTimer.innerText = gameDetails.time + ":00";
        playerBlackTimer.innerText = gameDetails.time + ":00";
    }

    playerLight.querySelector(".username").innerText = playerOne.username;

    if(playerOne.username === user.username){
        player = 'light'
        enemy = 'black'

        myTurn = true
    }else{
        gameStartedAtTimestamp = new Date().toISOString().slice(0,19).replace("T", ' ')

        player = 'black'
        enemy = 'light'

        setCursor('default')
        startGame(user)
    }
    if(gameHasTimer){
        timer = new Timer(player, roomId, gameDetails.time, 0, updateTimer, timerEndedCallback)
    }
    
    hideSpinner();
    room.classList.remove('hidden')
})

// If we are the first player and someone joins then this event is emitted
socket.on('game-started', (playerTwo) => {
    console.log(playerTwo)
    gameStartedAtTimestamp = new Date().toISOString().slice(0, 19).replace("T", ' ')
    startGame(playerTwo)

    if(gameHasTimer){
        timer.start()
    }
})

socket.on("enemy-moved", (move) => {
    moveEnemy(move)
})

socket.on("enemy-moved_castling", (enemyCastling) => {
    const {rookPosition, kingPosition} = enemyCastling
    performCastling(enemy, rookPosition, kingPosition);
})

socket.on("enemy-moved_pawn-promotion", (move, pawnPromotion) => {
    moveEnemy(move, pawnPromotion)
})

socket.on("enemy-timer-updated", (minutes, seconds) => {
    updateTimer(enemy, minutes, seconds)
})
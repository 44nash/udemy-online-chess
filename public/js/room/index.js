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
// const piecesToPromoteContainer = document.getElementById("pieces-to-promote-container");
// const piecesToPromote = document.getElementById("pieces-to-promote");
// const gameOverMessageContainer = document.getElementById("game-over-message-container");
// const winnerUsername = gameOverMessageContainer.querySelector("p strong");
// const myScoreElement = document.getElementById("my-score");
// const enemyScoreElement = document.getElementById("enemy-score");

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
const updateTimer = () => {}

const timerEndedCallback = () => {}
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

    displayChessPieces()
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

    if(boxToMove.children > 0){
        if(boxToMove.children[0].classList.contains(player)){
            // TODO: Perform castling

            return;
        }

        pieceToRemove = boxToMove.children[0];
        pieceToRemovePieceImg = pieceToRemove.children[0];
    }else{
        // TODO: Check for castling
    }

    currentBox.innerHTML = "";

    if(pieceToRemove){
        // TODO: Capture piece
        // capturePiece(pieceToRemove)
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


        // displayToast("You cant make this move. Your King is under attack")
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
    }else if(castlingPerformed){
        // TODO: pass the castling also
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
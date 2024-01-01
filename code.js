const gameBoard = (function(){
	let arr = 	(new Array(9)).fill("")
	const markX = "X"
	const markO = "O"
	
	const markCell = function(i, mark){
		arr[i] = mark
	}
	const resetBoard = function() {
		arr.length = 0
		arr.length = 9
		arr.fill("")
	}
	
	const getBoardState = function(){
		const boardState = Array.from(arr)
		return boardState
	}
	return {markCell, resetBoard,getBoardState}
})()

const gameController = (function(){
	let turns = 0
	let gameFinished = false
	const initControlButtons = function(){
		const newGameBtn = document.querySelector("#new-game")
		const resetGameBtn = document.querySelector("#reset-game")
		newGameBtn.addEventListener("click", startNewGame)
		resetGameBtn.addEventListener("click", resetGame)
	}
	const startNewGame = function(){
		gameBoard.resetBoard()
		displayController.attachListeners()
		displayController.renderBoard()
		gameFinished = false
		turns = 0
	}
	const resetGame = function(){
		startNewGame()
		playerX.resetScore()
		playerO.resetScore()
		displayController.displayScore()
	}
	const checkWin = function(){
		const combs = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];
		const cells = gameBoard.getBoardState()
		for (let comb of combs) {
			if (
				cells[comb[0]] == cells[comb[1]] &&
				cells[comb[1]] == cells[comb[2]] &&
				cells[comb[0]] != '' &&
				cells[comb[0]] != undefined 
			) {
				displayController.announceResult(`Player ${cells[comb[0]]} wins!`)
				displayController.removeEventListeners()
				gameFinished = true
				cells[comb[0]] === "X" ? playerX.updateScore() : playerO.updateScore()
				displayController.displayScore()
				setTimeout(startNewGame, 2000) 
			} 
		}
		if(!gameFinished && !cells.includes("")){
			displayController.announceResult("It's a draw!")
		}
		if(!gameFinished && cells.includes("")){
		}

	}

	const playTurn = function (cellNumber){
		if(turns % 2 === 0){
			playerX.playTurn(cellNumber)
		} else {
			playerO.playTurn(cellNumber)
		}
		turns++
		displayController.renderBoard()
		setTimeout(gameController.checkWin, 100) 

	}
	return {checkWin, playTurn, initControlButtons}
})()

const displayController = (function(){
	const cells = document.querySelectorAll(".cell")

	const initCells = function(){
		for(let i = 0; i < 9; i++){
			cells[i].setAttribute("data", i)
		}
	}
	const cellOnClick = function(event){
		let i = event.target.getAttribute("data")
		gameController.playTurn(i)
	}
	const attachListeners = function(){
		for(let i = 0; i<9; i++){
			cells[i].addEventListener("click", cellOnClick, { once: true })
		}
	}

	const removeEventListeners = function(){
		for(let i = 0; i<9; i++){
			cells[i].removeEventListener("click", cellOnClick)
		}

	}
	const announceResult = function(result){
		const modal = document.querySelector("#modal")
		modal.textContent = result
		modal.showModal()
		setTimeout(() =>{modal.close()}, 2000)
		}
	const displayScore = function(){
		document.querySelector("#playerXScore").textContent = playerX.getScore()
		document.querySelector("#playerOScore").textContent = playerO.getScore()
	}
	const renderBoard = function () {
		const boardState = gameBoard.getBoardState()
		for(let i = 0; i < 9; i++) {
			cells[i].textContent = boardState[i]
		}
	}
	return {initCells, renderBoard, attachListeners, removeEventListeners, announceResult, displayScore}
})()

function createPlayer (sign) {
	const name = `Player ${sign}`
	const mark = sign
	let score = 0
	const	updateScore = function () {
		score++
	}
	const getScore = function () {
		return score
	}
	const resetScore = function(){
		score = 0
	}
	const playTurn = function(cellNumber){
		gameBoard.markCell(cellNumber, this.mark)
	}
	return {name, mark, playTurn, updateScore, getScore, resetScore}
}

gameController.initControlButtons()
displayController.initCells()
displayController.attachListeners()

const playerX = createPlayer("X")
const playerO = createPlayer("O")
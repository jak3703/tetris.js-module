import Backlog from "./Backlog"
import Board from "./Board"
import Piece from './Piece'
import * as WALL_KICKS from './offset-tests/offset-tests.json'

class Tetris {

	static NORMAL_FALL_SPEED = 650 // milliseconds
	static FAST_FALL_SPEED = 75 // milliseconds
	static GRID_WIDTH = 10
	static GRID_HEIGHT = 15

	constructor(anchorElem) {
		this.anchor = anchorElem
		this.score = 0
		this.paused = false
		this.terminated = false
		this.board = new Board(Tetris.GRID_WIDTH, Tetris.GRID_HEIGHT)
		this.backlog = new Backlog(anchorElem)
		this.fallingPiece = this.backlog.nextPiece()
		this.isFastFall = false
	}

	init() {
		this.fallInterval = setInterval(this.normalFallCallback.bind(this), Tetris.NORMAL_FALL_SPEED)
		this.anchor.addEventListener('keydown', e => this.keydownHandler(e) )
		this.anchor.addEventListener('keydown', e => this.escDownHandler(e) )
		this.anchor.addEventListener('keyup', e => this.keyupHandler(e) )
	}

	terminate() {
		clearInterval(this.fallInterval)
		this.anchor.dispatchEvent(new CustomEvent('tetris-game-over'))
	}

	normalFallCallback() {
		this.anchor.setAttribute('tabindex', '0')
		this.anchor.focus()
		const instance = this
		const { isSolidified, scoreGained } = this.board.solidifyPiece(this.fallingPiece)
		if (isSolidified) {
			if (this.board.isInLosingState()) {
				this.terminate()
			} else {
				this.fallingPiece = this.backlog.nextPiece()
				this.score += scoreGained
				this.anchor.dispatchEvent(new CustomEvent('board-updated', {
					detail: {
						grid: instance.board.grid.slice(4), // the top 4 rows are buffer that doesn't get rendered
						score: instance.score
					}
				}))
			}
		} else {
			this.fallingPiece.moveDown()
		}
		this.anchor.dispatchEvent(new CustomEvent('falling-piece-updated', {
			detail: {
				fallingPiece: instance.fallingPiece
			}
		}))
	}

	fastFallCallback() {
		this.normalFallCallback()
		this.score++
	}

	onSPACEKeydown() {
		clearInterval(this.fallInterval)
		const instance = this
		let { isSolidified, scoreGained } = this.board.solidifyPiece(this.fallingPiece)
		while (!isSolidified) {
			this.fallingPiece.moveDown()
			this.score++
			const solidifiedRet = this.board.solidifyPiece(this.fallingPiece)
			isSolidified = solidifiedRet.isSolidified
			scoreGained = solidifiedRet.scoreGained
		}
		this.score += scoreGained
		this.fallingPiece = this.backlog.nextPiece()
		this.anchor.dispatchEvent(new CustomEvent('falling-piece-updated', {
			detail: {
				fallingPiece: instance.fallingPiece
			}
		}))
		this.anchor.dispatchEvent(new CustomEvent('board-updated', {
			detail: {
				grid: instance.board.grid.slice(4),
				score: instance.score
			}
		}))
		this.fallInterval = setInterval(this.normalFallCallback.bind(this), Tetris.NORMAL_FALL_SPEED)
	}

	onDOWNKeydown() {
		this.isFastFall = true
		clearInterval(this.fallInterval)
		this.fallInterval = setInterval(this.fastFallCallback.bind(this), Tetris.FAST_FALL_SPEED)
	}

	onDOWNKeyup() {
		this.isFastFall = false
		clearInterval(this.fallInterval)
		this.fallInterval = setInterval(this.normalFallCallback.bind(this), Tetris.NORMAL_FALL_SPEED)
	}

	onUPKeydown() {
		if (this.fallingPiece.getSymbol() === 'Q') { return }
		clearInterval(this.fallInterval)
		const instance = this
		const { offsetRow, offsetCol, normalizedLocs } = Piece.getNormalizedPositions(this.fallingPiece.tileLocations)
		const rotatedLocs = Piece.getClockwiseRotation(normalizedLocs)
		const rotatingTo = (this.fallingPiece.rotateState + 1) % 4
		const wallKickRules = this.fallingPiece.getSymbol() === 'I' ? 'ITests' : 'OtherTests'
		let testSucceeded = false
		let newLocs = []
		for (let i = 1; i <= 5 && !testSucceeded; i++) {
			newLocs = []
			for (let j = 0; j < 4; j++) {
				const newRow = rotatedLocs[j][0] + offsetRow + WALL_KICKS[wallKickRules][rotatingTo][i][0]
				const newCol = rotatedLocs[j][1] + offsetCol + WALL_KICKS[wallKickRules][rotatingTo][i][1]
				newLocs.push([newRow, newCol])
			}
			testSucceeded = !this.board.isPieceOverlapping(newLocs)
		}
		if (testSucceeded) {
			this.fallingPiece.rotateState = rotatingTo
			this.fallingPiece.tileLocations = newLocs
			this.anchor.dispatchEvent(new CustomEvent('falling-piece-updated', {
				detail: {
					fallingPiece: instance.fallingPiece
				}
			}))
		}
		this.fallInterval = this.isFastFall ? setInterval(this.fastFallCallback.bind(this), Tetris.FAST_FALL_SPEED)
											: setInterval(this.normalFallCallback.bind(this), Tetris.NORMAL_FALL_SPEED)
	}

	onLEFTKeydown() {
		const instance = this
		if (this.board.isPieceOverlapping(this.fallingPiece.tileLocations.map(tLoc => [tLoc[0], tLoc[1] - 1]))) {
			return
		}
		this.fallingPiece.moveLeft()
		this.anchor.dispatchEvent(new CustomEvent('falling-piece-updated', {
			detail: {
				fallingPiece: instance.fallingPiece
			}
		}))
	}

	onRIGHTKeydown() {
		const instance = this
		if (this.board.isPieceOverlapping(this.fallingPiece.tileLocations.map(tLoc => [tLoc[0], tLoc[1] + 1]))) {
			return
		}
		this.fallingPiece.moveRight()
		this.anchor.dispatchEvent(new CustomEvent('falling-piece-updated', {
			detail: {
				fallingPiece: instance.fallingPiece
			}
		}))
	}

	togglePause() {
		this.paused = !this.paused
		if (this.paused) {
			clearInterval(this.fallInterval)
		} else {
			this.fallInterval = setInterval(this.normalFallCallback.bind(this), Tetris.NORMAL_FALL_SPEED)
		}
	}

	keydownHandler(event) {
		if (event.isComposing || event.keyCode === 229 || this.paused || this.terminated) {
			return
		}
		
		if (!this.paused && event.keyCode === 32) { // SPACE
			this.onSPACEKeydown()
		}
		else if (!this.paused && event.keyCode === 37) { // LEFT
			this.onLEFTKeydown()
		}
		else if (!this.paused && event.keyCode === 38) { // UP
			this.onUPKeydown()
		}
		else if (!this.paused && event.keyCode === 39) { // RIGHT
			this.onRIGHTKeydown()
		}
		else if (!this.paused && event.keyCode === 40 && !this.isFastFall) { // DOWN
			this.onDOWNKeydown()
		}
	}

	escDownHandler(event) {
		if (event.isComposing || event.keyCode === 229 || this.terminated) {
			return
		}
		if (event.keyCode === 27) { //ESC
			this.togglePause()
		}
	}

	keyupHandler(event) {
		if (event.isComposing || event.keyCode === 229 || this.paused || this.terminated) {
			return
		}
		if (event.keyCode === 40) {
			this.onDOWNKeyup()
		}
	}

	// methods for exposure

	getBoard() {
		return this.board.grid.slice(4)
	}

	getFallingPiece() {
		return this.fallingPiece
	}

	getBacklog() {
		return this.backlog.backlogPiece
	}

	normalizePiecePositions(piece) {
		return Piece.getNormalizedPositions(piece.tileLocations).normalizedLocs
	}
}

export default Tetris
import Backlog from "./Backlog"
import Board from "./Board"
import Piece from './Piece'
import * as WALL_KICKS from './offset-tests/offset-tests.json'

class Tetris {

	static NORMAL_FALL_SPEED = 700 // milliseconds
	static FAST_FALL_SPEED = 250 // milliseconds
	static GRID_WIDTH = 10
	static GRID_HEIGHT = 15

	constructor(anchorElem) {
		this.anchor = anchorElem
		this.score = 0
		this.paused = false
		this.board = new Board(Tetris.GRID_WIDTH, Tetris.GRID_HEIGHT)
		this.backlog = new Backlog(anchorElem)
		this.fallingPiece = this.backlog.nextPiece()
	}

	init() {
		this.score = 0
		this.fallInterval = setInterval(this.normalFallCallback.bind(this), Tetris.NORMAL_FALL_SPEED)
		this.anchor.addEventListener('keydown', e => this.keydownHandler(e).bind(this) )
		this.anchor.addEventListener('keydown', e => this.escDownHandler(e).bind(this) )
		this.anchor.addEventListener('keyup', e => this.keyupHandler(e).bind(this) )
	}

	terminate() {
		clearInterval(this.fallInterval)
		this.anchor.removeEventListener('keydown', e => this.keydownHandler(e).bind(this) )
		this.anchor.removeEventListener('keydown', e => this.escDownHandler(e).bind(this) )
		this.anchor.removeEventListener('keyup', e => this.keyupHandler(e).bind(this) )
	}

	normalFallCallback() {
		const instance = this
		const { isSolidified, scoreGained } = this.board.solidifyPiece(this.fallingPiece)
		if (isSolidified) {
			if (this.board.isInLosingState()) {
				this.terminate()
				this.anchor.dispatchEvent(new CustomEvent('tetris-game-over'))
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
			score++
			const solidifiedRet = this.board.solidifyPiece(this.fallingPiece)
			isSolidified = solidifiedRet.isSolidified
			scoreGained = solidifiedRet.scoreGained
		}
		score += 5 // bonus for hitting space
		score += scoreGained
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
		clearInterval(this.fallInterval)
		this.fallInterval = setInterval(this.fastFallCallback.bind(this), Tetris.FAST_FALL_SPEED)
	}

	onDOWNKeyup() {
		clearInterval(this.fallInterval)
		this.fallInterval = setInterval(this.normalFallCallback.bind(this), Tetris.NORMAL_FALL_SPEED)
	}

	onUPKeydown() {
		if (this.fallingPiece.getSymbol() === 'Q') { return }
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
			testSucceeded = this.board.isPieceOverlapping(newLocs)
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
		
	}

	onLEFTKeydown() {
		const instance = this
		const { leftMostTiles } = this.fallingPiece.getHorizontalBounds()
		for (let i = 0; i < leftMostTiles.length; i++) {
			const curTile = leftMostTiles[i]
			if (curTile[1] - 1 < 0 || this.board.grid[curTile[0]][curTile[1] - 1] !== '.') {
				return
			}
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
		const { rightMostTiles } = this.fallingPiece.getHorizontalBounds()
		for (let i = 0; i < rightMostTiles.length; i++) {
			const curTile = rightMostTiles[i]
			if (curTile[1] + 1 >= GRID_WIDTH || this.board.grid[curTile[0]][curTile[1] + 1] !== '.') {
				return
			}
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
		if (paused) {
			clearInterval(this.fallInterval)
			this.anchor.removeEventListener('keydown', e => this.keydownHandler(e).bind(this) )
			this.anchor.removeEventListener('keyup', e => this.keyupHandler(e).bind(this) )
		} else {
			this.fallInterval = setInterval(this.normalFallCallback.bind(this), Tetris.NORMAL_FALL_SPEED)
			this.anchor.addEventListener('keydown', e => this.keydownHandler(e).bind(this) )
			this.anchor.addEventListener('keyup', e => this.keyupHandler(e).bind(this) )
		}
	}

	keydownHandler(event) {
		if (event.isComposing || event.keyCode === 229) {
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
		else if (!this.paused && event.keyCode === 40) { // DOWN
			this.onDOWNKeydown()
		}
	}

	escDownHandler(event) {
		if (event.isComposing || event.keyCode === 229) {
			return
		}
		if (event.keyCode === 27) { //ESC
			this.togglePause()
		}
	}

	keyupHandler(event) {
		if (event.isComposing || event.keyCode === 229) {
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
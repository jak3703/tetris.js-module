import Backlog from "./Backlog"
import Board from "./Board"

class Tetris {

	static NORMAL_FALL_SPEED = 500 // milliseconds
	static FAST_FALL_SPEED = 100 // milliseconds
	static GRID_WIDTH = 10
	static GRID_HEIGHT = 15

	constructor(anchorElem) {
		this.anchor = anchorElem
	}

	init() {
		this.score = 0
		this.paused = false
		this.board = new Board(GRID_WIDTH, GRID_HEIGHT)
		this.backlog = new Backlog()
		this.fallingPiece = this.backlog.nextPiece()
		this.fallInterval = setInterval(this.normalFallCallback, NORMAL_FALL_SPEED)

	}

	normalFallCallback() {
		const { isSolidified, scoreGained } = this.board.solidifyPiece(this.fallingPiece)
		if (isSolidified) {
			this.fallingPiece = this.backlog.nextPiece()
			this.score += scoreGained
		} else {
			this.fallingPiece.moveDown()
			// TODO: emit event updating fallingPiece
		}
	}

	fastFallCallback() {
		this.normalFallCallback()
		this.score++
	}

	onDOWNKeydown() {
		clearInterval(this.fallInterval)
		this.fallInterval = setInterval(this.fastFallCallback, FAST_FALL_SPEED)
	}

	onDOWNKeyup() {
		clearInterval(this.fallInterval)
		this.fallInterval = setInterval(this.normalFallCallback, NORMAL_FALL_SPEED)
	}

	onUPKeydown() {

	}

	onLEFTKeydown() {

	}

	onRIGHTKeydown() {

	}

	onSPACEKeydown() {

	}

	togglePause() {
		this.paused = !this.paused
	}

	terminate() {

	}


}

export default Tetris
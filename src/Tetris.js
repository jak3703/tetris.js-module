import Backlog from "./Backlog"
import Board from "./Board"

class Tetris {

	static NORMAL_FALL_SPEED = 700 // milliseconds
	static FAST_FALL_SPEED = 250 // milliseconds
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
		// TODO: initialize event listeners
	}

	terminate() {
		// TODO: remove event listeners
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

	onSPACEKeydown() {
		let { isSolidified, scoreGained } = this.board.solidifyPiece(this.fallingPiece)
		while (!isSolidified) {
			this.fallingPiece.moveDown()
			score++
			const solidifiedRet = this.board.solidifyPiece(this.fallingPiece)
			isSolidified = solidifiedRet.isSolidified
			scoreGained = solidifiedRet.scoreGained
		}
		score += scoreGained
		this.fallingPiece = this.backlog.nextPiece()
		// TODO: emit event updating board AND falling piece
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
		const { leftMostTiles } = this.fallingPiece.getHorizontalBounds()
		for (let i = 0; i < leftMostTiles.length; i++) {
			const curTile = leftMostTiles[i]
			if (curTile[0] - 1 < 0 || this.board.grid[curTile[0] - 1][curTile[1]] !== '.') {
				return
			}
		}
		this.fallingPiece.moveLeft()
		// TODO: emit event updating fallingPiece
	}

	onRIGHTKeydown() {
		const { rightMostTiles } = this.fallingPiece.getHorizontalBounds()
		for (let i = 0; i < rightMostTiles.length; i++) {
			const curTile = rightMostTiles[i]
			if (curTile[0] + 1 >= GRID_WIDTH || this.board.grid[curTile[0] + 1][curTile[1]] !== '.') {
				return
			}
		}
		this.fallingPiece.moveRight()
		// TODO: emit event updating fallingPiece
	}

	togglePause() {
		this.paused = !this.paused
		if (paused) {
			clearInterval(this.fallInterval)
			// TODO: clear event listeners
		} else {
			this.fallInterval = setInterval(this.normalFallCallback, NORMAL_FALL_SPEED)
			// TODO: reinstate event listeners
		}
	}


}

export default Tetris
import Board from "./Board"

class Tetris {

	static NORMAL_FALL_SPEED = 500
	static FAST_FALL_SPEED = 100
	static GRID_WIDTH = 10
	static GRID_HEIGHT = 15

	constructor(anchorElem) {
		this.anchor = anchorElem
	}

	init() {
		this.score = 0
		this.paused = false
		this.fallSpeedMs = NORMAL_FALL_SPEED
		this.board = new Board(GRID_WIDTH, GRID_HEIGHT)
		//backlog
		//fallingpiece
		//fallInterval
	}

}

export default Tetris
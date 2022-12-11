class Board {
	constructor(width, height) {
		this.grid = []
		for (let i = 0; i < height + 4; i++) {
			this.grid.push(new Array(width).fill('.'))
		}
		this.highestTiles = new Array(width).fill(this.grid.length-1)
	}
}

export default Board
class Board {

	constructor(width, height) {
		this.grid = []
		for (let i = 0; i < height + 4; i++) {
			this.grid.push(new Array(width).fill('.'))
		}
		this.highestTiles = new Array(width).fill(this.grid.length)
	}

	/**
	 * Check if the fallingPiece's position is directly above
	 * an existing piece. If it is, add the piece to the board,
	 * "solidifying" it
	 * @param {Piece} piece 
	 * @returns Object
	 * 				isSolidified {Boolean} : true if the piece was solidified
	 * 				scoreGained {Number} : the score gained from any lines broken
	 */
	solidifyPiece(piece) {
		const tLocs = piece.tileLocations
		let needToStop = false
		for (let i = 0; i < 4; i++) {
			const curCol = tLocs[i][1]
			if (tLocs[i][0] === this.highestTiles[curCol] - 1) {
				needToStop = true
			}
		}
		if (needToStop) {
			for (let i = 0; i < 4; i++) {
				const curCol = tLocs[i][1]
				if (tLocs[i][0] < this.highestTiles[curCol]) {
					this.highestTiles[curCol] = tLocs[i][0]
				}
				this.grid[tLocs[i][0]][tLocs[i][1]] = piece.getSymbol()
			}
			let scoreDelta = 0
			let ys = tLocs.map((elem) => elem[0])
			ys = [...new Set(ys)]
			const brokenLines = []
			for (let i = 0; i < ys.length; i++) {
				if (this.checkLine(ys[i])) {
					brokenLines.push(ys[i])
				}
			}
			switch (brokenLines.length) {
				case 1:
					scoreDelta = 10
					break
				case 2:
					scoreDelta = 30
					break
				case 3:
					scoreDelta = 60
					break
				case 4:
					scoreDelta = 100
					break
				default:
					scoreDelta = 0
					break
			}
			brokenLines.sort((a, b) => b - a)
			for (let i = 0; i < brokenLines.length; i++) {
				this.resolveBrokenLine(brokenLines[i])
			}
			return {
				isSolidified: true,
				scoreGained: scoreDelta
			}
		}
		return {
			isSolidified: false,
			scoreGained: 0
		}
	}

	checkLine(lineIdx) {
		for (let i = 0; i < this.grid[0].length; i++) {
			if (this.grid[lineIdx][i] === '.') {
				return false
			}
		}
		return true
	}

	resolveBrokenLine(lineIdx) {
		this.grid.splice(lineIdx, 1)
		this.grid.unshift(new Array(this.grid[0].length).fill('.'))
	}

	isInLosingState() {
		for (let i = 0; i < this.grid[0].length; i++) {
			if (this.grid[3][i] !== '.') {
				return true
			}
		}
		return false
	}

	isPieceOverlapping(pieceLocs) {
		for (let i = 0; i < 4; i++) {
			if (pieceLocs[i][0] < 0 || 
				pieceLocs[i][0] > this.grid.length - 1 ||
				pieceLocs[i][1] < 0 ||
				pieceLocs[i][1] > this.grid[0].length - 1 ||
				this.grid[pieceLocs[i][0]][pieceLocs[i][1]] !== '.')
			{
				return true
			}
		}
		return false
	}
}

export default Board
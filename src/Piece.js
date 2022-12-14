class Piece {
	
	/**
	 * Returns the locations of a piece's tiles when the piece is rotated
	 * 90 degrees clockwise
	 * @param {Number[][]} tLocs normalized locations of a piece's tiles
	 * @returns the piece rotated 90 degrees clockwise
	 */
	static getClockwiseRotation(tLocs) {
		const rotatedLocs = []
		for (let i = 0; i < tLocs.length; i++) {
			const newX = tLocs[i][1]
			const newY = -tLocs[i][0]
			rotatedLocs.push([newX, newY])
		}
		return rotatedLocs
	}

	static getNormalizedPositions(tLocs) {
		const offsetX = tLocs[0][0]
		const offsetY = tLocs[0][1]
		const normalizedLocs = []
		for (let i = 0; i < tLocs.length; i++) {
			normalizedLocs.push([tLocs[i][0] - offsetX, tLocs[i][1] - offsetY])
		}
		return {
			offsetX,
			offsetY,
			normalizedLocs
		}
	}
	
	constructor(tileLocations) {
		this.tileLocations = tileLocations
		this.rotateState = 0
	}

	moveLeft() {
		for (let i = 0; i < 4; i++) {
			this.tileLocations[i][0] -= 1
		}
	}

	moveRight() {
		for (let i = 0; i < 4; i++) {
			this.tileLocations[i][0] += 1
		}
	}

	moveDown() {
		for (let i = 0; i < 4; i++) {
			this.tileLocations[i][1] += 1
		}
	}

	getHorizontalBounds() {
		const ys = [...new Set(this.tileLocations.map((elem) => elem[1]))]
		const leftmostTiles = []
		const rightmostTiles = []
		for (let i = 0; i < ys.length; i++) {
			let leftmostXForThisY = this.tileLocations[0].length
			let idxOfLeftMost = 0
			let rightmostXForThisY = 0
			let idxOfRightMost = 0
			for (let j = 0; j < 4; j++) {
				if (this.tileLocations[j][1] === ys[i]) {
					if (this.tileLocations[j][0] < leftmostXForThisY) {
						leftmostXForThisY = this.tileLocations[j][0]
						idxOfLeftMost = j
					}
					if (this.tileLocations[j][0] > rightmostXForThisY) {
						rightmostXForThisY = this.tileLocations[j][0]
						idxOfRightMost = j
					}
				}
			}
			leftmostTiles.push(this.tileLocations[idxOfLeftMost])
			rightmostTiles.push(this.tileLocations[idxOfRightMost])
		}
		return {
			leftmostTiles,
			rightmostTiles
		}
	}
}

export default Piece
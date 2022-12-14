class Piece {
	constructor(tileLocations) {
		this.tileLocations = tileLocations
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
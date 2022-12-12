class Piece {
	constructor(tileLocations) {
		this.tileLocations = tileLocations
	}

	rotate() {

	}

	moveLeft() {

	}

	moveRight() {

	}

	moveDown() {
		for (let i = 0; i < 4; i++) {
			this.tileLocations[i][1] += 1
		}
	}
}

export default Piece
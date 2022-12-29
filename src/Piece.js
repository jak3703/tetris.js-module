class Piece {
	/*
		List of pieces & symbols in one place:
		SquarePiece: Q
		LeftLPiece: L
		RightLPiece: R
		LinePiece: I
		SPiece: S
		ZPiece: Z
		TPiece: T
	*/
	
	/**
	 * Returns the locations of a piece's tiles when the piece is rotated
	 * 90 degrees clockwise
	 * @param {Number[][]} tLocs normalized locations of a piece's tiles
	 * @returns the piece rotated 90 degrees clockwise
	 */
	static getClockwiseRotation(tLocs) {
		const rotatedLocs = []
		for (let i = 0; i < tLocs.length; i++) {
			const newCol = tLocs[i][0]
			const newRow = -tLocs[i][1]
			rotatedLocs.push([newRow, newCol])
		}
		return rotatedLocs
	}

	static getNormalizedPositions(tLocs) {
		const offsetRow = tLocs[0][0]
		const offsetCol = tLocs[0][1]
		const normalizedLocs = []
		for (let i = 0; i < tLocs.length; i++) {
			normalizedLocs.push([tLocs[i][0] - offsetRow, tLocs[i][1] - offsetCol])
		}
		return {
			offsetRow,
			offsetCol,
			normalizedLocs
		}
	}
	
	constructor(tileLocations) {
		this.tileLocations = tileLocations
		this.rotateState = 0
	}

	moveLeft() {
		for (let i = 0; i < 4; i++) {
			this.tileLocations[i][1] -= 1
		}
	}

	moveRight() {
		for (let i = 0; i < 4; i++) {
			this.tileLocations[i][1] += 1
		}
	}

	moveDown() {
		for (let i = 0; i < 4; i++) {
			this.tileLocations[i][0] += 1
		}
	}

}

export default Piece
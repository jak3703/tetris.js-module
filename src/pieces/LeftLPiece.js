import Tetris from '../Tetris'
import Piece from '../Piece'

class LeftLPiece extends Piece {

	constructor() {
		const width = Tetris.GRID_WIDTH
		const centerTile = [3, Math.floor(width / 2)]
		const tLocs = []
		// the 0th index has the tile we want to rotate around
		tLocs.push(centerTile)
		tLocs.push([centerTile[0], centerTile[1] - 1])
		tLocs.push([centerTile[0], centerTile[1] + 1])
		tLocs.push([centerTile[0] - 1, centerTile[1] + 1])
		super(tLocs)
	}

	getSymbol() {
		return 'L'
	}
}

export default LeftLPiece
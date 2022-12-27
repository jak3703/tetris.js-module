import Tetris from '../Tetris'
import Piece from '../Piece'

class LinePiece extends Piece {

	constructor() {
		const width = Tetris.GRID_WIDTH
		const centerTile = [Math.floor(width / 2), 3]
		const tLocs = []
		// the 0th index has the tile we want to rotate around
		tLocs.push(centerTile)
		tLocs.push([centerTile[0] - 1, centerTile[1]])
		tLocs.push([centerTile[0] - 2, centerTile[1]])
		tLocs.push([centerTile[0] + 1, centerTile[1]])
		super(tLocs)
	}

	getSymbol() {
		return 'I'
	}
}

export default LinePiece
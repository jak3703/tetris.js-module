import Tetris from '../Tetris'
import Piece from '../Piece'

class SquarePiece extends Piece {

	constructor() {
		const width = Tetris.GRID_WIDTH
		const centerTile = [Math.floor(width / 2), 3]
		const tLocs = []
		tLocs.push(centerTile)
		tLocs.push([centerTile[0] - 1, centerTile[1]])
		tLocs.push([centerTile[0] - 1, centerTile[1] - 1])
		tLocs.push([centerTile[0], centerTile[1] - 1])
		super(tLocs)
	}

	getSymbol() {
		return 'Q'
	}
}

export default SquarePiece
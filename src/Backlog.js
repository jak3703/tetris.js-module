import LeftLPiece from "./pieces/LeftLPiece"
import LinePiece from "./pieces/LinePiece"
import RightLPiece from "./pieces/RightLPiece"
import SPiece from "./pieces/SPiece"
import SquarePiece from "./pieces/SquarePiece"
import TPiece from "./pieces/TPiece"
import ZPiece from "./pieces/ZPiece"

class Backlog {
	constructor() {
		this.backlogPiece = null
		this.nextPiece()
	}

	nextPiece() {
		const oldBacklogPiece = this.backlogPiece
		const randNum = Math.floor(Math.random() * 8)
		switch (randNum) {
			case 0:
				this.backlogPiece =  new TPiece()
				break
			case 1:
				this.backlogPiece =  new SPiece()
				break
			case 2:
				this.backlogPiece =  new ZPiece()
				break
			case 3:
				this.backlogPiece =  new LinePiece()
				break
			case 4:
				this.backlogPiece =  new SquarePiece()
				break
			case 5:
				this.backlogPiece =  new RightLPiece()
				break
			case 6:
				this.backlogPiece =  new LeftLPiece()
				break
			default:
				// good form to have a default, even if it's useless
				console.error('RNG stopped working??')
				break
		}
		// TODO: throw event indicating backlog change
		return oldBacklogPiece
	}
}

export default Backlog
class Player {
	private _score = 0
	public get score() {
		return this._score
	}

	public scorePoint() {
		this._score += 1
	}
}

export default Player

import Player from './Player'

class Game {
	private _players: [Player, Player]
	public get players() {
		return this._players
	}

	public get scores() {
		return this.players.map((p) => p.score) as [number, number]
	}

	static scoringLabels = ['0', '15', '30', '40']

	public get formattedScore() {
		return this.scores
			.map((score) => {
				const scoreIndex = Math.min(score, Game.scoringLabels.length - 1)
				return Game.scoringLabels[scoreIndex]
			})
			.join(' - ')
	}

	private get _scoreDifference() {
		return Math.abs(this.scores[0] - this.scores[1])
	}

	public get winner() {
		if (!this.completed) return null

		if (this._scoreDifference === 0) return null
		if (this.scores[0] > this.scores[1]) return this.players[0]

		return this.players[1]
	}

	public get completed() {
		const eitherHasEnoughPoints = this.scores.some((score) => score >= 4)

		if (this._scoreDifference >= 2 && eitherHasEnoughPoints) return true
		if (this._scoreDifference === 0 && this.scores[0] === 4) return true

		return false
	}

	public constructor(players: [Player, Player]) {
		this._players = players
	}

	public progress(forPlayer?: number): boolean {
		if (this.completed) return false

		const playerScored = forPlayer ?? Math.round(Math.random() * (this.players.length - 1))

		this.players[playerScored].scorePoint()
		return true
	}
}

export default Game

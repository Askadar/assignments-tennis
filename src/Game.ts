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

	public get winner() {
		if (!this.completed) return null

		if (this.scores[0] > this.scores[1]) return this.players[0]

		return this.players[1]
	}

	public get completed() {
		const scoreDifference = Math.abs(this.scores[0] - this.scores[1])
		const eitherHasEnoughPoints = this.scores.some((score) => score >= 4)

		if (scoreDifference >= 2 && eitherHasEnoughPoints) return true

		return false
	}

	constructor(players: [Player, Player]) {
		this._players = players
	}

	progress(forPlayer?: number): boolean {
		if (this.completed) return false

		const playerScored = forPlayer ?? Math.round(Math.random() * (this.players.length - 1))

		this.players[playerScored].scorePoint()
		return true
	}
}

export default Game

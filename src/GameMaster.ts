import Game from './Game'
import Player from './Player'

export enum GameStatus {
	INITIAL,
	IN_PROGRESS,
	COMPLETED,
}

class GameMaster {
	private _players: [Player, Player] = [new Player(), new Player()]
	public get players() {
		return this._players
	}

	private _game = new Game(this.players)
	public get game() {
		return this._game
	}

	private get _gameStatus() {
		if (this.game.completed) return GameStatus.COMPLETED

		if (this.game.scores.join(',') === '0,0') return GameStatus.INITIAL

		return GameStatus.IN_PROGRESS
	}

	public get gameStats() {
		return {
			status: this._gameStatus,
			formattedScore: this.game.formattedScore,
			winner: this.game.winner,
		}
	}

	public get formattedGameStats() {
		const stats = this.gameStats
		const winnerIndex = this.players.findIndex((p) => p === stats.winner)

		return [
			`P1 - P2`,
			stats.formattedScore,
			stats.status === GameStatus.COMPLETED ? `P${winnerIndex + 1}  won` : null,
		]
			.filter(Boolean)
			.join('\n')
	}

	public executeTurn(forPlayer?: number) {
		const processedTurn = this.game.progress(forPlayer)

		if (!processedTurn) return this.game.formattedScore

		return false
	}

	private runGameTimes(turns: number) {
		for (let i = 0; i < turns; i++) this.executeTurn()
	}

	private runGameTillCompletion() {
		while (!this.executeTurn()) {}
	}

	public runGame(turns?: number) {
		if (turns) this.runGameTimes(turns)
		else this.runGameTillCompletion()

		return this.formattedGameStats
	}
}

export default GameMaster

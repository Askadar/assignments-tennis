import GameMaster, { GameStatus } from '../GameMaster'
import Game from '../Game'
import Player from '../Player'

describe('GameMaster', () => {
	let master: GameMaster
	beforeEach(() => {
		master = new GameMaster()
	})

	it('should initialize Game with two players', () => {
		expect(master.game).toBeInstanceOf(Game)

		expect(master.players[0]).toBeInstanceOf(Player)
		expect(master.players).toHaveLength(2)
	})

	describe('executeTurn', () => {
		it('should progress() Game', () => {
			const progress$ = jest.spyOn(master.game, 'progress')

			master.executeTurn()
			expect(progress$).toBeCalledTimes(1)
		})

		it('should progress(forPlayer) game when argument passed', () => {
			const progress$ = jest.spyOn(master.game, 'progress')

			master.executeTurn(0)
			expect(progress$).toHaveBeenCalledWith(0)
		})

		it('should return false untill game is completed', () => {
			expect(master.executeTurn(0)).toBe(false)

			let gameResult
			while (!gameResult) gameResult = master.executeTurn(0)

			expect(gameResult).toBe('40 - 0')
		})
	})

	describe('runGame', () => {
		it('should run games N turns if it is specified', () => {
			const progress$ = jest.spyOn(master.game, 'progress')

			master.runGame(3)
			expect(progress$).toHaveBeenCalledTimes(3)
		})

		it('should run until game completion without arguments', () => {
			const executeTurn$ = jest.spyOn(master, 'executeTurn')

			master.runGame()
			expect(executeTurn$).not.toHaveLastReturnedWith(false)
			expect(executeTurn$.mock.calls.length).toBeGreaterThan(0)
		})
	})

	describe('gameStats', () => {
		it('should return initial status of the game', () => {
			expect(master.gameStats).toStrictEqual({
				status: GameStatus.INITIAL,
				formattedScore: '0 - 0',
				winner: null,
			})
		})

		it('should return inProgress status of the game', () => {
			master.executeTurn(0)
			master.executeTurn(0)
			master.executeTurn(1)

			expect(master.gameStats).toStrictEqual({
				status: GameStatus.IN_PROGRESS,
				formattedScore: '30 - 15',
				winner: null,
			})
		})

		it('should return completed status of the game with winner', () => {
			master.executeTurn(1)
			master.executeTurn(1)
			master.executeTurn(0)
			master.executeTurn(0)
			master.executeTurn(1)
			master.executeTurn(1)

			expect(master.gameStats).toStrictEqual({
				status: GameStatus.COMPLETED,
				formattedScore: '30 - 40',
				winner: master.players[1],
			})
		})

		it('should return completed status of the game with tie', () => {
			;[0, 1, 0, 1, 0, 1, 0, 1].forEach((forPlayer) => master.executeTurn(forPlayer))

			expect(master.gameStats).toStrictEqual({
				status: GameStatus.COMPLETED,
				formattedScore: '40 - 40',
				winner: null,
			})
		})
	})

	describe('formattedGameStats', () => {
		it('should return formatted gameStats when one player wins', () => {
			;[0, 0, 0, 0].forEach((forPlayer) => master.executeTurn(forPlayer))

			expect(master.formattedGameStats).toMatch(/P1 - P2\n?\d{1,2} - \d{1,2}\n?P\d{1}  won/)
		})

		it('should return formatted gameStats for tied game', () => {
			;[1, 0, 1, 0, 1, 0, 1, 0].forEach((forPlayer) => master.executeTurn(forPlayer))

			expect(master.formattedGameStats).toMatch(/P1 - P2\n?\d{1,2} - \d{1,2}\n?tied/)
		})

		it('should return formatted gameStats for unfinished game', () => {
			const gameResult = master.runGame(3)

			expect(gameResult).toMatch(/P1 - P2\n?\d{1,2} - \d{1,2}/)
		})
	})
})

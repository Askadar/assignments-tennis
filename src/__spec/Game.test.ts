import Game from '../Game'
import Player from '../Player'

describe('Game', () => {
	let game: Game
	beforeEach(() => {
		game = new Game([new Player(), new Player()])
	})

	it('should initialize with two players', () => {
		expect(game).toBeInstanceOf(Game)

		expect(game.players[0]).toBeInstanceOf(Player)
		expect(game.players).toHaveLength(2)
	})

	it('should have initial scores of 0, 0', () => {
		expect(game.scores).toStrictEqual([0, 0])
	})

	it('should initialize without winner', () => {
		expect(game.winner).toBe(null)
	})

	it('should initialize as not completed', () => {
		expect(game.completed).toBe(false)
	})

	describe('progress', () => {
		it('should score() player', () => {
			const score$ = jest.spyOn(game.players[1], 'scorePoint')

			game.progress(1)
			expect(score$).toBeCalledTimes(1)
		})

		it('should update points for player', () => {
			game.progress(0)
			expect(game.scores).toContain(1)
			expect(game.scores[0]).toBe(1)
		})

		it('should complete when one of players scores at least 4 points, and 2 points above other', () => {
			game.progress(0)
			game.progress(0)
			game.progress(0)
			expect(game.completed).toBe(false)

			game.progress(0)
			expect(game.completed).toBe(true)
			expect(game.winner).toBe(game.players[0])
		})

		it('should complete when one of players scores after deuce', () => {
			// Enter "deuce" -> 40 - 40
			;[0, 1, 0, 1, 0, 1].forEach((forPlayer) => game.progress(forPlayer))

			expect(game.completed).toBe(false)

			game.progress(1) // Gain "advantage"
			game.progress(1) // Win
			expect(game.completed).toBe(true)
			expect(game.winner).toBe(game.players[1])
		})

		it('should complete when players tie', () => {
			// Enter "deuce" -> 40 - 40
			;[0, 1, 0, 1, 0, 1].forEach((forPlayer) => game.progress(forPlayer))

			expect(game.completed).toBe(false)

			game.progress(1)
			game.progress(0)
			expect(game.completed).toBe(true)
			expect(game.winner).toBe(null)
		})

		it('should return false after game is completed', () => {
			;[0, 0, 0].forEach((forPlayer) => game.progress(forPlayer))

			expect(game.completed).toBe(false)
			expect(game.progress(0)).toBe(true) // Winning progress, still scores

			expect(game.completed).toBe(true)
			expect(game.progress(0)).toBe(false) // Game is completed, does nothing
		})
	})

	describe('formattedScore', () => {
		it('should display current score according to tennis rules', () => {
			game.progress(1)
			expect(game.formattedScore).toBe('0 - 15')

			game.progress(0)
			// expect(game.formattedScore).toBe('All') // Extra rule for ties?

			game.progress(0)
			expect(game.formattedScore).toBe('30 - 15')

			game.progress(1)
			game.progress(1)
			expect(game.formattedScore).toBe('30 - 40')

			// Extra case with player having "advantage" but score staying 40
			game.progress(1)
			expect(game.formattedScore).toBe('30 - 40')
		})
	})
})

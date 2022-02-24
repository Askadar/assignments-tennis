import Player from '../Player'

describe('Game', () => {
	let player: Player
	beforeEach(() => {
		player = new Player()
	})

	it('should initialize with score of 0', () => {
		expect(player).toBeInstanceOf(Player)
		expect(player.score).toBe(0)
	})

	describe('scorePoint', () => {
		it('should increase player\'s score by 1', () => {
			player.scorePoint()
			expect(player.score).toBe(1)

			player.scorePoint()
			player.scorePoint()
			expect(player.score).toBe(3)
		})
	})
})

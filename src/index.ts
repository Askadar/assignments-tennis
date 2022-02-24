export { default as GameMaster } from './GameMaster'
export { default as Game } from './Game'
export { default as Player } from './Player'

/**
 * Runner just in case
 */
import { GameMaster } from '.'

const master = new GameMaster()

const result = master.runGame()
console.log(result)

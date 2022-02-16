import { tileTypes } from './constants.js';

class Tile {
    #type;
    #pos;

    /**
     * Constructor of Tile.
     * @param {Emoji}       type    Tile type, represented by an emoji.
     * @param {Position}    pos     Tile position.
     */
    constructor(type, pos) {
        this.#type = type;
        this.#pos = pos;
    }

    /**
     * Checks if the tile is a Box, or a Box on goal.
     * @returns {Boolean} Returns a boolean value.
     */
    isBox() {
        return this.#type === tileTypes.box || this.#type === tileTypes.boxGoal;
    }

    /**
     * Checks if the tile is a Goal.
     * @returns {Boolean} Returns a boolean value.
     */
    isGoal() {
        return this.#type === tileTypes.goal;
    }

    /**
     * Checks if the character is on a Goal tile.
     * @returns {Boolean} Returns a boolean value.
     */
    isCharacterOnGoal() {
        return this.#type === tileTypes.onGoal;
    }

    /**
     * Checks if the tile is walkable.
     * @returns {Boolean} Returns a boolean value.
     */
    isWalkable() {
        return this.#type === tileTypes.empty || this.#type === tileTypes.goal;
    }

    /**
     * Gets the tile type.
     * @returns {Emoji} Returns an emoji.
     */
    getType() {
        return this.#type;
    }

    /**
     * Gets the tile position.
     * @returns {Position} Returns a Position.
     */
    getPosition() {
        return this.#pos;
    }
}

export default Tile;
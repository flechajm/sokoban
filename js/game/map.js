import Position from "./position.js";
import Tile from './tile.js';
import { levels, tileTypes } from './constants.js';

class Map {
    #tileSize;

    constructor(level) {
        this.currentLevel = level;
        this.level = levels[this.currentLevel - 1];
        this.grid = [];
        this.#tileSize = 16;
        this.#initialize();
    }

    /**
     * Gets the character position.
     * @returns {Position} Character position coordinates.
     */
    getCharacterPosition() {
        for (let y = 0; y < this.grid.length; y++) {
            const row = this.grid[y];
            for (let x = 0; x < row.length; x++) {
                const tile = row[x];

                if (tile.getType() == tileTypes.player || tile.getType() == tileTypes.onGoal)
                    return new Position(x, y);
            }
        }
    }

    /**
     * Gets the tile from a specific position.
     * @param {Position} pos Tile position.
     * @returns {Tile} Returns a Tile.
     */
    getTile(pos) {
        let posY = pos.getY();
        let posX = pos.getX();

        return this.grid[posY][posX];
    }

    /**
     * Sets a tile type at a specific position.
     * @param {Tile}        type    Type of tile.
     * @param {Position}    pos     Position to set the tile.
     */
    setTile(type, pos) {
        let posY = pos.getY();
        let posX = pos.getX();

        this.grid[posY][posX] = new Tile(type, pos);
    }

    /**
     * Gets the tile size.
     * @returns {Number} Returns a number that represents the tile size.
     */
    getTileSize() {
        return this.#tileSize;
    }

    /**
     * Initialize the map.
     */
    #initialize() {
        const tiles = {
            '🚹': tileTypes.player,
            '🟢': tileTypes.empty,
            '📦': tileTypes.box,
            '❌': tileTypes.boxGoal,
            '⭕': tileTypes.goal,
            '🔴': tileTypes.onGoal,
            '🧱': tileTypes.wall,
        }

        this.level.forEach((row, y) => {
            this.grid.push(row.slice(0));
            row.forEach((tile, x) => {
                let pos = new Position(x, y);
                this.setTile(tiles[tile], pos);
            });
        });
    }
}

export default Map;
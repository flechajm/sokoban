import GameController from "./game_controller.js";
import Position from "./position.js";
import { tileTypes } from './constants.js';

class Canvas {
    #canvas;
    #context
    #gameController;
    #timeIntervalDraw;

    /**
     * Constructor of Canvas.
     * @param {GameController} gameController 
     */
    constructor(gameController) {
        this.#canvas = document.getElementById('canvas');
        this.#context = this.#canvas.getContext("2d");
        this.#gameController = gameController;
        this.#timeIntervalDraw = null;
    }

    /**
     * Configures all the canvas settings.
     */
    configure() {
        this.#canvas.onblur = () => {
            this.#canvas.focus();
        };
        this.#setCanvasSize();
        this.#loadSprites();
        this.#setTimeIntervalUpdate();
        this.#drawLevelNumber();
    }

    /**
     * Renders the canvas and draw the map.
     */
    render() {
        this.#context.clearRect(0, 0, this.#canvas.style.width, this.#canvas.style.width);
        const map = this.#gameController.getMap();

        map.grid.forEach((row, y) => {
            row.forEach((tile, x) => {
                this.#drawTile(tile, x, y);
            });
        });
    }

    /**
     * Removes the time interval draw.
     */
    removeTimeIntervalDraw() {
        clearInterval(this.#timeIntervalDraw);
    }


    /**
     * Shows a Win dialog in front of the canvas.
     * @param {Boolean} show            Show dialog?
     * @param {Boolean} finishedGame    If this param is set to true, the display message is about congratulations.
     */
    showWinDialog(show, finishedGame = false) {
        const map = this.#gameController.getMap();
        const winDialogDOM = document.getElementById('win-dialog');

        winDialogDOM.style.display = show ? "flex" : 'none';

        if (show) {
            let text = finishedGame ? 'CONGRATS!<br /><br />YOU FINISHED THE GAME' : `LEVEL ${map.currentLevel}<br /><br />COMPLETE!`
            winDialogDOM.style.fontSize = finishedGame ? 'xx-large' : 'xxx-large';
            winDialogDOM.innerHTML = text;

            if (!finishedGame) {
                setTimeout(() => {
                    winDialogDOM.innerHTML = `LEVEL ${map.currentLevel + 1}`;
                }, 1500);
            }
        }
    }

    /**
     * Sets the canvas size according the level size.
     */
    #setCanvasSize() {
        const map = this.#gameController.getMap();

        let width = (map.getTileSize() * map.level[0].length);
        let height = (map.getTileSize() * map.level.length);

        this.#canvas.width = width;
        this.#canvas.height = height;

        this.#canvas.style.width = width * 4;
        this.#canvas.style.height = height * 4;
    }


    /**
     * Draw a tile on the canvas map.
     * @param {Tile}        tile    Tile to be drawn. 
     * @param {Position}    x       X position.
     * @param {Position}    y       Y position.
     */
    #drawTile(tile, x, y) {
        let tileSize = this.#gameController.getMap().getTileSize();
        let spritePosition = this.#getSpritePosition(tile.getType());

        let posX = x * tileSize;
        let posY = y * tileSize;

        // Draw the floor.
        if (tile.getType() === tileTypes.boxGoal) {
            this.#context.drawImage(this.sprite, 16, 16, tileSize, tileSize, posX, posY, 8, tileSize);
        } else {
            this.#context.drawImage(this.sprite, 0, 16, tileSize, tileSize, posX, posY, tileSize, tileSize);
        }

        // Draw actual tile.
        this.#context.drawImage(this.sprite, spritePosition.getX(), spritePosition.getY(), tileSize, tileSize, posX, posY, tileSize, tileSize);

        // If the player is on Goal, draw the player on it.
        if (tile.getType() === tileTypes.onGoal) {
            let characterSprite = this.#getCharacterSprite(this.#gameController.getLastDirection());

            this.#context.drawImage(this.sprite, characterSprite.getX(), characterSprite.getY(), tileSize, tileSize, posX, posY, tileSize, tileSize);
        }

        this.#updateMoves();
    }

    /**
     * Draw the level number.
     */
    #drawLevelNumber() {
        document.getElementById('level').innerHTML = `LEVEL ${this.#gameController.getMap().currentLevel}`;
    }

    /**
     * Updates moves count.
     */
    #updateMoves() {
        document.getElementById('moves').innerHTML = `Moves: ${this.#gameController.moves}`;
    }

    /**
     * Updates the elapsed time.
     */
    #updateTime() {
        document.getElementById('time').innerHTML = `Time: ${this.#gameController.time.toLocaleTimeString()}`;
    }

    /**
     * Inits the interval to update the timer every second.
     */
    #setTimeIntervalUpdate() {
        this.#updateTime();

        this.#timeIntervalDraw = setInterval(() => {
            this.#updateTime();
        }, 1000);
    }


    // 🚹 Player
    // 🟢 Empty
    // 📦 Box
    // ❌ Box on goal
    // ⭕ Goal
    // 🔴 Character on goal
    // 🧱 Wall

    /**
     * Gets the sprite position for the current tile type.
     * @param {tileTypes} tileType Tile type.
     * @returns {Position} Sprite position.
     */
    #getSpritePosition(tileType) {
        switch (tileType) {
            case tileTypes.player:
                return this.#getCharacterSprite(this.#gameController.getLastDirection());
            case tileTypes.box:
                return new Position(0, 0);
            case tileTypes.boxGoal:
                return new Position(0, 32);
            case tileTypes.goal:
                return new Position(16, 16);
            case tileTypes.onGoal:
                return new Position(16, 16);
            case tileTypes.wall:
                return new Position(16, 0);
            default:
                return new Position(0, 16);
        }
    }

    /**
     * Gets the correct sprite for the current player direction.
     * @param {directions} direction Last player direction.
     * @returns {Position} Player sprite position.
     */
    #getCharacterSprite(direction) {
        switch (direction) {
            case 'up':
                return new Position(32, 16);
            case 'right':
                return new Position(32, 0);
            case 'down':
                return new Position(48, 16);
            case 'left':
                return new Position(48, 0);
            default:
                return new Position(32, 0);
        }
    }

    /**
     * Loads the images sprite.
     */
    #loadSprites() {
        this.sprite = new Image();
        this.sprite.src = '../img/sprite.png';
        this.sprite.onload = () => {
            this.render();
        };
    }
}

export default Canvas;
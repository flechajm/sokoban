import Map from './map.js';
import Canvas from './canvas.js';
import Position from './position.js';
import AudioManager from './audio_manager.js';
import { coordinates, directions, soundTypes, tileTypes } from './constants.js';

class GameController {
    #map;
    #canvas;
    #paused;
    #audioManager;
    #lastDirection;
    #timeInterval;

    /**
     * Constructor of GameController.
     * @param {Map}             map 
     * @param {AudioManager}    audioManager 
     */
    constructor(map, audioManager) {
        this.moves = 0;
        this.time = new Date(0, 0, 0, 0, 0, 0);
        this.coordinates = coordinates;
        this.#map = map;
        this.#canvas;
        this.#paused = true;
        this.#audioManager = audioManager;
        this.#lastDirection = directions.right;
        this.#timeInterval;
        this.#initialize();
    }

    setMap(map) {
        this.moves = 0
        this.time = new Date(0, 0, 0, 0, 0, 0);
        this.#map = map;

        this.#initialize();
    }

    /**
     * Gets the Map.
     * @returns {Map} Returns a Map object.
     */
    getMap() {
        return this.#map;
    }

    /**
     * Pauses the game.
     */
    pause() {
        this.#paused = true;
    }

    /**
     * Unpauses the game.
     */
    unpause() {
        this.#paused = false;
    }

    /**
     * Gets if the game is paused.
     * @returns {Boolean} Returns if it's paused.
     */
    isPaused() {
        return this.#paused;
    }

    /**
     * Gets the Canvas.
     * @returns {Canvas} Returns a Canvas object.
     */
    getCanvas() {
        return this.#canvas;
    }

    /**
     * Gets the AudioManager.
     * @returns {AudioManager} Returns an AudioManager object.
     */
    getAudioManager() {
        return this.#audioManager;
    }

    /**
     * Handles the entire character's movement. Including the push of boxes.
     * @param {directions} direction Next movement direction.
     */
    move(direction) {
        const characterPosition = this.#map.getCharacterPosition();
        const futurePosition = this.#checkFuturePosition(characterPosition, direction);

        this.#lastDirection = direction;
        this.#defineNextMovement(characterPosition, futurePosition, direction);

        // Redraw the canvas for every move.
        this.#canvas.render();

        return this.checkIfWin();
    }

    /**
     * Checks if all boxes are in their goal place and, if it's true, the level is complete.
     * @returns Boolean value
     */
    checkIfWin() {
        const tiles = [].concat(...this.#map.grid);
        return !tiles.some(tile => tile.getType() == tileTypes.box);
    }

    /**
     * Returns the character's last direction.
     * @returns {directions} Direction
     */
    getLastDirection() {
        return this.#lastDirection;
    }

    /**
     * Resets the timer.
     */
    resetTimer() {
        clearInterval(this.#timeInterval);
    }

    /**
     * Initialize the Game Controller.
     */
    #initialize() {
        document.getElementById('canvas-container').scroll({ top: 0, left: 0, behavior: 'smooth' });

        if (this.#canvas == null) this.#canvas = new Canvas(this);

        this.#setTimer();
        this.#canvas.configure();
    }

    /**
     * Inits the timer interval.
     */
    #setTimer() {
        this.#timeInterval = setInterval(() => {
            if (this.moves > 0 && !this.#paused) {
                let seconds = this.time.getSeconds() + 1;
                this.time.setSeconds(seconds);
            }
        }, 1000);
    }

    /**
     * Checks the future position of the character or the boxes.
     * @param {Position}    currentPosition     Current character/box position.
     * @param {directions}  direction           Next movement direction.
     */
    #checkFuturePosition(currentPosition, direction) {
        let posX = currentPosition.getX() + this.coordinates[direction].getX();
        let posY = currentPosition.getY() + this.coordinates[direction].getY();

        let futurePosition = new Position(posX, posY);

        return futurePosition;
    }

    /**
     * Defines the next movement to do. Could be: move the character position or push a box.
     * @param {Position}    characterPosition   Current character position.
     * @param {Position}    futurePosition      Future tile position.
     * @param {directions}  direction           Next movement direction.
     */
    #defineNextMovement(characterPosition, futurePosition, direction) {
        const futureTile = this.#map.getTile(futurePosition);

        if (futureTile.isWalkable()) {
            this.#moveCharacter(characterPosition, futurePosition);
            this.#scroll(direction);

            this.#audioManager.play(soundTypes.walk);
        } else if (futureTile.isBox()) {
            this.#pushBox(characterPosition, futurePosition, direction);
        }
    }

    /**
     * Moves the character to the future position.
     * @param {Position} characterPosition  Curent character position.
     * @param {Position} futurePosition     Future character position. 
     */
    #moveCharacter(characterPosition, futurePosition) {
        this.#setCurrentPosition(characterPosition);
        this.#setFutureCharacterPos(futurePosition);

        // The BGM starts when the player does his first move.
        if (this.moves == 0) this.#audioManager.play(soundTypes.bgm);

        this.moves += 1;
    }

    /**
     * Pushes the box to the next position according to the direction.
     * @param {Position}    characterPosition   Current character position. 
     * @param {Position}    futureBoxPosition   Future box position. 
     * @param {directions}  direction           Next movement direction.
     */
    #pushBox(characterPosition, futureBoxPosition, direction) {
        const subsequentBoxPosition = this.#checkFuturePosition(futureBoxPosition, direction);
        const subsequentBoxTile = this.#map.getTile(subsequentBoxPosition);

        if (subsequentBoxTile.isWalkable()) {
            this.#moveCharacter(characterPosition, futureBoxPosition);
            this.#setFutureBoxPosition(subsequentBoxPosition);
            this.#scroll(direction);
            this.#audioManager.play(soundTypes.push);
        }
    }

    /**
     * Updates the future player tile position and its type.
     * @param {Position} pos Tile position to update.
     */
    #setFutureCharacterPos(pos) {
        const tile = this.#map.getTile(pos);
        this.#map.setTile(tile.isGoal() ? tileTypes.onGoal : tile.getType() === tileTypes.boxGoal ? tileTypes.onGoal : tileTypes.player, pos);
    }

    /**
     * Updates the future box tile position and its type.
     * @param {Position} pos Tile position to update.
     */
    #setFutureBoxPosition(pos) {
        const tile = this.#map.getTile(pos);
        this.#map.setTile(tile.getType() === tileTypes.goal ? tileTypes.boxGoal : tileTypes.box, pos);
    }

    /**
     * Updates the current tile position and its type.
     * @param {Position} pos Tile position to update.
     */
    #setCurrentPosition(pos) {
        const tile = this.#map.getTile(pos);
        this.#map.setTile(tile.isCharacterOnGoal() ? tileTypes.goal : tileTypes.empty, pos);
    }

    /**
     * 
     * @param {directions} direction 
     */
    #scroll(direction) {
        const offsetMultiplier = 64;
        const container = document.getElementById('canvas-container');
        const characterPosY = this.#map.getCharacterPosition().getY() * 64;
        const characterPosX = this.#map.getCharacterPosition().getX() * 64;

        let offsetTop = container.offsetTop;
        let offsetLeft = container.offsetLeft;

        let scrollTop = container.scrollTop;
        let scrollLeft = container.scrollLeft;

        switch (direction) {
            case directions.up:
                if ((characterPosY - scrollTop - (offsetMultiplier)) < offsetTop) {
                    container.scroll({ top: scrollTop - offsetTop, behavior: 'smooth' });
                }
                break;
            case directions.right:
                if ((characterPosX - scrollLeft - (offsetMultiplier)) > offsetLeft) {
                    container.scroll({ left: scrollLeft + offsetLeft, behavior: 'smooth' });
                }
                break;
            case directions.down:
                if ((characterPosY - scrollTop - (offsetMultiplier)) > offsetTop) {
                    container.scroll({ top: scrollTop + offsetTop, behavior: 'smooth' });
                }
                break;
            case directions.left:
                if ((characterPosX - scrollLeft - (offsetMultiplier)) < offsetLeft) {
                    container.scroll({ left: scrollLeft - offsetLeft, behavior: 'smooth' });
                }
                break;
            default:
                break;
        }
    }
}

export default GameController;
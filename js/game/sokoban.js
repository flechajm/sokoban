import Map from './map.js';
import AudioManager from './audio_manager.js';
import LevelStatistic from './level_statistic.js';
import GameController from './game_controller.js';
import KeyboardController from '../libs/keyboard_controller.js';
import levels from './levels.js';
import { directions } from './constants.js';

class Sokoban {
    #startLevel;
    #title;
    #statistics;
    #gameController;
    #audioManager;
    #preparingNextLevel;
    #isGameStarted;
    #titleClicks;

    /**
     * Creates an instance of a Sokoban game.
     * @param {levels} levels Array of levels.
     */
    constructor(levels) {
        this.levels = levels;
        this.currentLevel = 1;
        this.#startLevel = 1;
        this.#title = "SOKOBAN";
        this.#statistics = [];
        this.#audioManager = new AudioManager();
        this.#preparingNextLevel = false;
        this.#isGameStarted = false;
        this.#titleClicks = 0;
        this.#initialize();
    }

    /**
     * Starts the game.
     */
    start(level) {
        this.#isGameStarted = true;
        if (level == this.#startLevel) this.clearStatistics();

        this.currentLevel = level;
        this.#reset();

        const map = new Map(this.currentLevel);
        const gameController = this.getGameController();

        if (gameController == null) {
            this.setGameController(new GameController(map, this.#audioManager));
        } else {
            gameController.setMap(map);
        }

        this.#showGameContainer();
        this.#gameController.unpause();
    }

    /**
     * Saves the current level and their statistics.
     */
    save() {
        const currentLevel = this.currentLevel;
        const statistics = this.#statistics;

        let gameData = {
            currentLevel,
            statistics,
        };

        let item = JSON.stringify(gameData);
        localStorage.setItem(this.#title, item);
    }

    /**
     * Gets the Game Controller.
     * @returns {GameController} Returns a Game Controller object.
     */
    getGameController() {
        return this.#gameController;
    }

    /**
     * Sets the Game Controller.
     * @param {GameController} gameController Game Controller.
     */
    setGameController(gameController) {
        this.#gameController = gameController;
    }

    /**
     * Gets the Audio Manager.
     * @returns {AudioManager} Returns an Audio Manager object.
     */
    getAudioManager() {
        return this.#audioManager;
    }

    /**
     * Gets the game title.
     * @returns {String} Returns the title.
     */
    getTitle() {
        return this.#title;
    }

    /**
     * Loads de game and the statistics.
     */
    load() {
        const gameData = localStorage.getItem(this.#title);

        if (gameData) {
            const item = JSON.parse(gameData);
            this.currentLevel = item.currentLevel;

            if (item.statistics.length == levels.length) {
                const continueDOM = document.getElementById('continue-option');
                continueDOM.style.display = 'none';
            }

            const audioManager = this.#audioManager;
            const map = new Map(this.currentLevel);
            this.#gameController = new GameController(map, audioManager);

            for (let i = 0; i < item.statistics.length; i++) {
                const statistic = item.statistics[i];
                this.addLevelStatistic(statistic.level, statistic.time, statistic.moves);
            }
        } else {
            const continueOptionDOM = document.getElementById('continue-option');
            const statisticsOptionDOM = document.getElementById('statistics-option');

            continueOptionDOM.style.display = 'none';
            statisticsOptionDOM.style.display = 'none';
        }
    }

    /**
     * Adds to the statistics list a level completed.
     * @param {Number}      level   Game level.
     * @param {DateTime}    time    Time it took to complete the level.
     * @param {Number}      moves   Moves it took to complete the level.
     */
    addLevelStatistic(level, time, moves) {
        let numberLevel = level ?? this.#gameController.getMap().currentLevel;
        let levelFormatted = numberLevel < 10 ? '0' + numberLevel : numberLevel;
        let timeLocale = time ?? this.#gameController.time.toLocaleTimeString();

        const statistic = new LevelStatistic(numberLevel, timeLocale, moves ?? this.#gameController.moves);
        this.#statistics.push(statistic);

        const statisticsDOM = document.getElementById('statistics');
        const childToAppend = statisticsDOM.children[3];

        let div = document.createElement('div');
        let template = `<div class="option disabled">
                            <div class="fixed">${levelFormatted}:</div>
                            <div class="value">${statistic.time} (${statistic.moves})</div>
                        </div>`;
        div.innerHTML = template;
        childToAppend.appendChild(div);
    }

    /**
     * Remove all the statistics in the main menu.
     */
    clearStatistics() {
        this.#statistics = [];
        const statisticsDOM = document.getElementById('statistics');
        const statisticsOptionDOM = document.getElementById('statistics-option');
        const childToAppend = statisticsDOM.children[3];

        statisticsOptionDOM.style.display = 'none';
        childToAppend.innerHTML = '';
    }

    /**
     * Sets if the game is preparing the next level.
     * @param {Boolean} preparing   Is prerparing the next level? 
     */
    preparingNextLevel(preparing) {
        this.#preparingNextLevel = preparing;
    }

    isGameStarted() {
        return this.#isGameStarted;
    }

    /**
     * Shows the Game Container.
     */
    #showGameContainer() {
        const titleDOM = document.getElementById('title');
        const startMenuOptions = document.getElementById('start-menu');
        const gameContainer = document.getElementById('game-container');
        const footerDOM = document.getElementsByTagName('footer')[0];

        footerDOM.style.display = 'none';
        titleDOM.style.display = 'none';
        startMenuOptions.style.display = 'none';
        gameContainer.style.display = 'flex';
    }

    /**
     * Prepares and config the game.
     */
    #initialize() {
        this.rainbowTitle(this.#title);
        this.#bindListeners();
    }

    /**
     * Resets the current level.
     */
    #reset() {
        this.#audioManager.stop();

        if (this.#gameController != null) {
            this.#gameController.getCanvas().removeTimeIntervalDraw();
            this.#gameController.resetTimer();
        }
    }

    /**
     * Binds the event listeners to DOM elements.
     */
    #bindListeners() {
        const sokoban = this;

        const titleDOM = document.getElementById('title');
        const newGameOptionDOM = document.getElementById('new-game-option');
        const continueOptionDOM = document.getElementById('continue-option');
        const constrolsOptionDOM = document.getElementById('controls-option');
        const optionsOptionDOM = document.getElementById('options-option');
        const statisticsOptionDOM = document.getElementById('statistics-option');
        const backButtonsDOM = document.getElementsByClassName('option back');
        const bgmDOM = document.getElementById('bgm');
        const sfxDOM = document.getElementById('sfx');

        newGameOptionDOM.addEventListener('click', () => {
            localStorage.removeItem(sokoban.getTitle());
            sokoban.start(this.#startLevel);
        });
        titleDOM.addEventListener('click', () => sokoban.rainbowTitle(sokoban.getTitle()));
        continueOptionDOM.addEventListener('click', () => sokoban.start(sokoban.currentLevel));
        constrolsOptionDOM.addEventListener('click', this.#showControlsMenu);
        optionsOptionDOM.addEventListener('click', this.#showOptionsMenu);
        statisticsOptionDOM.addEventListener('click', this.#showStatistics);
        Array.from(backButtonsDOM).forEach(button => {
            button.addEventListener('click', this.#showStartOptions);
        });
        bgmDOM.addEventListener('click', () => sokoban.getAudioManager().toggleBGM(sokoban.isGameStarted()));
        sfxDOM.addEventListener('click', () => sokoban.getAudioManager().toggleSFX());

        new KeyboardController({
            KeyW: () => { this.#keyDirectionHandler(directions.up); },
            ArrowUp: () => { this.#keyDirectionHandler(directions.up); },

            KeyD: () => { this.#keyDirectionHandler(directions.right); },
            ArrowRight: () => { this.#keyDirectionHandler(directions.right); },

            KeyS: () => { this.#keyDirectionHandler(directions.down); },
            ArrowDown: () => { this.#keyDirectionHandler(directions.down); },

            KeyA: () => { this.#keyDirectionHandler(directions.left); },
            ArrowLeft: () => { this.#keyDirectionHandler(directions.left); },

            KeyR: () => { if (!this.#gameController.isPaused()) this.start(this.currentLevel); },
            KeyM: () => { this.#audioManager.toggleBGM(); },
            KeyX: () => { this.#audioManager.toggleSFX(); },

            Escape: () => {
                if (!this.#preparingNextLevel && this.#isGameStarted) {
                    this.#showMainMenu(!this.#gameController.isPaused());
                }
            }
        }, 300);
    }

    /**
     * Shows the Main Menu.
     */
    #showMainMenu() {
        this.#gameController.isPaused() ? this.#gameController.unpause() : this.#gameController.pause();
        const isPaused = this.#gameController.isPaused();

        const titleDOM = document.getElementById('title');
        const startMenuDOM = document.getElementById('start-menu');
        const gamePausedDOM = document.getElementById('game-paused');
        const continueOptionDOM = document.getElementById('continue-option');
        const resumeOptionDOM = document.getElementById('resume-option');
        const statisticsOptionDOM = document.getElementById('statistics-option');
        const footerDOM = document.getElementsByTagName('footer')[0];
        const gameContainer = document.getElementById('game-container');

        gameContainer.style.display = isPaused ? 'none' : 'flex';
        footerDOM.style.display = isPaused ? 'flex' : 'none';
        titleDOM.style.display = isPaused ? 'flex' : 'none';
        continueOptionDOM.style.display = isPaused ? 'none' : 'flex';
        resumeOptionDOM.style.display = isPaused ? 'flex' : 'none';
        if (this.#statistics.length > 0) {
            statisticsOptionDOM.style.display = isPaused ? 'flex' : 'none';
        }
        gamePausedDOM.style.display = isPaused ? 'flex' : 'none';
        if (isPaused) {
            this.#blinkGamePausedTitle();
        }
        startMenuDOM.style.display = isPaused ? 'flex' : 'none';
    }

    /**
     * Displays a "GAME PAUSED" title blink above of the start menu.
     */
    #blinkGamePausedTitle() {
        const gamePausedDOM = document.getElementById('game-paused');
        gamePausedDOM.style.visibility = gamePausedDOM.style.visibility == 'visible' ? 'hidden' : 'visible';

        let blinkTimeoutId = setTimeout(() => {
            this.#blinkGamePausedTitle();
        }, 1000);

        if (!this.#gameController.isPaused()) clearTimeout(blinkTimeoutId);
    }

    /**
     * Shows the Start Menu options and hide the others.
     */
    #showStartOptions() {
        const controlsDOM = document.getElementById('controls');
        const optionsDOM = document.getElementById('options');
        const statisticsDOM = document.getElementById('statistics');
        const startOptionsDOM = document.getElementById('start-options');

        controlsDOM.style.display = 'none';
        optionsDOM.style.display = 'none';
        statisticsDOM.style.display = 'none';
        startOptionsDOM.style.display = 'flex';
    }

    /**
     * Shows the Controls Menu.
     */
    #showControlsMenu() {
        const startOptionsDOM = document.getElementById('start-options');
        const controlsDOM = document.getElementById('controls');

        startOptionsDOM.style.display = 'none';
        controlsDOM.style.display = 'flex';
    }

    /**
     * Shows the Options Menu.
     */
    #showOptionsMenu() {
        const startOptionsDOM = document.getElementById('start-options');
        const optionsDOM = document.getElementById('options');

        startOptionsDOM.style.display = 'none';
        optionsDOM.style.display = 'flex';
    }

    /**
     * Shows the Statistics for each level completed.
     */
    #showStatistics() {
        const startOptionsDOM = document.getElementById('start-options');
        const statisticsDOM = document.getElementById('statistics');

        startOptionsDOM.style.display = 'none';
        statisticsDOM.style.display = 'flex';
    }

    /**
     * Handles if the Key pressed can do something or not. Also checks if the player won after the last move.
     * @param {directions} direction Player direction.
     */
    #keyDirectionHandler(direction) {
        if (this.#gameController.isPaused()) return;

        const won = this.#gameController.move(direction);
        if (won) this.#prepareNextLevel();
    }

    /**
     * Prepares the game for the next level.
     */
    #prepareNextLevel() {
        this.preparingNextLevel(true);
        this.#gameController.pause();
        this.#gameController.resetTimer();
        this.#audioManager.stop();
        this.addLevelStatistic();

        let finishedGame = levels.length === this.currentLevel;

        const canvas = this.#gameController.getCanvas();
        canvas.removeTimeIntervalDraw();
        canvas.showWinDialog(true, finishedGame);

        const sokoban = this;
        setTimeout(function () {
            canvas.showWinDialog(false);

            if (!finishedGame) {
                sokoban.currentLevel += 1;
                sokoban.save();
                sokoban.start(sokoban.currentLevel);
            } else {
                sokoban.save();
                window.location.reload();
            }

            sokoban.preparingNextLevel(false);
        }, 3000);
    }

    /**
     * Sets the game title with rainbow colors. Just for fun :).
     * @param {String} title Game title.
     */
    rainbowTitle(title) {
        if (this.#titleClicks == 20) {
            alert('Why so curious? 🤔\n\nHIGH CONTRAST MODE UNLOCKED 🔓');

            const root = document.querySelector(':root');
            root.style.setProperty('--body-bg', 'black');
            root.style.setProperty('--light-color', 'cyan');
            root.style.setProperty('--hover', 'deeppink');
            root.style.setProperty('--active', 'hotpink');
            root.style.setProperty('--options', 'orange');
            root.style.setProperty('--blend-mode', 'color-burn');
            root.style.setProperty('--win-dialog-bg', 'black');
        } else if (this.#titleClicks < 20) {
            const titleDOM = document.getElementById('title');

            let newTitle = '';
            for (let i = 0; i < title.length; i++) {
                const char = title[i];

                let red = Math.floor(Math.random() * (255 - 0) + 0);
                let green = Math.floor(Math.random() * (255 - 0) + 0);
                let blue = Math.floor(Math.random() * (255 - 0) + 0);

                let newChar = `<span style="color: rgb(${red}, ${green}, ${blue});">${char}</span>`;
                newTitle += newChar;
            }

            titleDOM.innerHTML = `<div>${newTitle}</div>`;
        }

        this.#titleClicks += 1;
    }
}

export default Sokoban;
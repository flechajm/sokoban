import { soundTypes } from './constants.js';
import Howl from '../libs/howler.js';

class AudioManager {
    #bgm;
    #sfx;

    /**
     * Constructor of AudioManager.
     */
    constructor() {
        this.bgmOn = true;
        this.sfxOn = true;

        this.#bgm;
        this.#sfx;
    }

    /**
     * Plays the selected sound.
     * @param {soundTypes} sound Sound to play.
     */
    play(sound) {
        const source = this.#getSource(sound);

        if (sound === 'bgm' && this.bgmOn) {
            this.#setBGM(source);
        } else if (this.sfxOn) {
            this.#setSFX(source);
        }
    }

    /**
     * Stops the BGM and SFX.
     */
    stop() {
        if (this.#bgm != null) this.#bgm.unload();
        if (this.#sfx != null) this.#sfx.unload();
    }

    /**
     * Toggles the BGM between ON and OFF.
     * @returns {Boolean} State of BGM.
     */
    toggleBGM() {
        this.bgmOn = !this.bgmOn;
        this.#bgm?.mute(!this.bgmOn);

        return this.bgmOn;
    }

    /**
     * Toggles the SFX between ON and OFF.
     * @returns {Boolean} State of SFX.
     */
    toggleSFX() {
        this.sfxOn = !this.sfxOn;
        this.#sfx?.mute(!this.bgmOn);

        return this.sfxOn;
    }

    /**
     * Sets and configure the BGM with the selected sound.
     * @param {String} source Sound to set as source.
     */
    #setBGM(source) {
        if (this.#bgm == null || this.#bgm?.state() === 'unloaded') {
            this.#bgm = new Howl({
                src: [source],
                autoplay: false,
                volume: 0.4,
                loop: true,
            });
        }

        this.#bgm.play();
    }

    /**
     * Sets and configure the SFX with the selected sound.
     * @param {String} source Sound to set as source.
     */
    #setSFX(source) {
        this.#sfx?.unload();
        this.#sfx = new Howl({
            src: [source],
            autoplay: false,
            volume: 0.2,
        });

        this.#sfx.play();
    }

    /**
     * Gets the path of the sound.
     * @param {String} sound Sound
     * @returns {String} Sound path.
     */
    #getSource(sound) {
        return './audio/' + sound + '.mp3';
    }
}

export default AudioManager;
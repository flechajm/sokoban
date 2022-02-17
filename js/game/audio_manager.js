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
     * @param {Boolean} playWhenToggle  Sets if the BGM should be play itself when toggle.
     * @returns {Boolean} State of BGM.
     */
    toggleBGM(playWhenToggle = true) {
        this.bgmOn = !this.bgmOn;

        if (!this.bgmOn) {
            this.#bgm?.stop();
        } else if (playWhenToggle) {
            this.#setBGM(this.#getSource(soundTypes.bgm));
        }

        this.#updateDOM('bgm');

        return this.bgmOn;
    }

    /**
     * Toggles the SFX between ON and OFF.
     * @returns {Boolean} State of SFX.
     */
    toggleSFX() {
        this.sfxOn = !this.sfxOn;
        this.#sfx?.mute(!this.bgmOn);

        this.#updateDOM('sfx');

        return this.sfxOn;
    }

    #updateDOM(id) {
        let onOff = id == 'bgm' ? this.bgmOn : this.sfxOn;
        const element = document.getElementById(id);
        const value = element.getElementsByClassName('value')[0];
        value.innerHTML = onOff ? '<div>ON</div><div>🔊</div>' : '<div>OFF</div><div>🔈</div>';
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
        return 'audio/' + sound + '.mp3';
    }
}

export default AudioManager;
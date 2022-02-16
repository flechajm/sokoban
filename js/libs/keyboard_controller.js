class KeyboardController {
    constructor(keys, repeat) {
        this.keys = keys;
        this.repeat = repeat;
        this.timers = {};

        document.onkeydown = event => this.keydown(event);
        document.onkeyup = event => this.keyup(event);
        window.onblur = () => this.blur;
    }

    keydown(event) {
        event.stopPropagation();
        const code = event.code;
        if (!(code in this.keys)) return true;
        if (!(code in this.timers)) {
            this.timers[code] = null;
            this.keys[code]();
            if (this.repeat) this.timers[code] = setInterval(this.keys[code], this.repeat);
        }
        return false;
    }

    keyup(event) {
        const code = event.code;
        if (code in this.timers) {
            if (this.timers[code]) clearInterval(this.timers[code]);
            delete this.timers[code];
        }
    }

    blur() {
        for (let key in this.timers)
            if (this.timers[key]) clearInterval(this.timers[key]);
        this.timers = {};
    }
}

export default KeyboardController;
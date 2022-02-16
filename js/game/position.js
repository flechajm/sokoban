class Position {
    #x
    #y

    /**
     * Constructor of Position.
     * @param {Number} x Position X.
     * @param {Number} y Position Y.
     */
    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }

    getX() {
        return this.#x;
    }

    getY() {
        return this.#y;
    }

    getCoordinates() {
        return [this.#x, this.#y];
    }
}

export default Position;
class LevelStatistic {

    /**
     * Constructor of Level Statistic.
     * @param {Number} level 
     * @param {Date} time 
     * @param {Number} moves 
     */
    constructor(level, time, moves) {
        this.level = level;
        this.time = time;
        this.moves = moves;
    }
}

export default LevelStatistic;
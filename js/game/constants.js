import Position from "./position.js";

const directions = {
    up: 'up',
    right: 'right',
    down: 'down',
    left: 'left',
}

const coordinates = {
    up: new Position(0, -1),
    right: new Position(1, 0),
    down: new Position(0, 1),
    left: new Position(-1, 0),
}

const tileTypes = {
    player: 'player',
    empty: 'empty',
    box: 'box',
    boxGoal: 'boxGoal',
    goal: 'goal',
    onGoal: 'onGoal',
    wall: 'wall',
    background: 'background',
}

const soundTypes = {
    bgm: 'bgm',
    walk: 'footstep',
    push: 'push_box',
    boxGoal: 'box_goal',
}

Object.freeze(directions);
Object.freeze(coordinates);
Object.freeze(tileTypes);
Object.freeze(soundTypes);


export { directions, coordinates, tileTypes, soundTypes };
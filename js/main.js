import Sokoban from './game/sokoban.js';
import { levels } from './game/constants.js';

const sokoban = new Sokoban(levels);
sokoban.load();

window.sokoban = sokoban;
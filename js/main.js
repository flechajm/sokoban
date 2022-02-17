import Sokoban from './game/sokoban.js';
import levels from './game/levels.js';

const sokoban = new Sokoban(levels);
sokoban.load();

document.onreadystatechange = function () {
    var state = document.readyState;
    if (state == 'complete') {
        document.getElementById('loader').style.visibility = "hidden";
    }
}
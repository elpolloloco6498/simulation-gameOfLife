var canvas = document.getElementById( "my_canvas");
var ctx = canvas.getContext("2d");

//variables globales
var size_cells = 10;

var WIDTH = ctx.canvas.width;
var HEIGHT = ctx.canvas.height;
var NB_CELL_X = Math.round(WIDTH / size_cells);
var NB_CELL_Y = Math.round(HEIGHT / size_cells);
var GRID_SIZE_X = NB_CELL_X + 2;
var GRID_SIZE_Y = NB_CELL_Y + 2;

/* GENERATION DE LA GRILLE ET MECANISMES DE JEUX */

function sleep(time_ms) {
    var d1 = new Date();
    var d2 = null;
    
    do {
        d2 = new Date();
    } while(d2-d1 < time_ms)
}

function copy_array(array2copy) {
    var copy = [[]];
    for (var i = 0; i < array2copy.length; i++) {
        copy[i] = array2copy[i].slice(0);
    }
    return copy;
}
    
function one_or_zero() {
    var random_nb = Math.round(Math.random()*10);
    if (random_nb % 2 === 0) {
        return 0;
    }
    else {
        return 1;
    }
    return random_nb;
}

function clearGrid() {// retourne la grille2d initialisée
    /*
    parcourt le tableau 1d pour le remplir
    création d'un tableau 2d et remplissage de celui ci
    */
    var grid = new Array(GRID_SIZE_Y);
    for (var i = 0; i < GRID_SIZE_Y; i++) { //creation tab2d
        grid[i] = new Array(GRID_SIZE_X); // creation d'une bordure pour les conditions aux limites
    }
    
    for (var i = 0; i < GRID_SIZE_Y; i++) {
        for (var j = 0; j < GRID_SIZE_X; j++) {
            grid[i][j] = 0;
        }
    }
    return grid; // retourne le tableau 2d initialisé
}

function initRandomGrid() {// retourne la grille2d initialisée
    /*
    parcourt le tableau 1d pour le remplir
    création d'un tableau 2d et remplissage de celui ci
    */
    var grid = new Array(GRID_SIZE_Y);
    for (var i = 0; i < GRID_SIZE_Y; i++) { //creation tab2d
        grid[i] = new Array(GRID_SIZE_X); // creation d'une bordure pour les conditions aux limites
    }
    
    for (var i = 0; i < GRID_SIZE_Y; i++) {
        for (var j = 0; j < GRID_SIZE_X; j++) {
            if (i === 0 || i === GRID_SIZE_Y - 1) {
                grid[i][j] = 0;
            }
            else if (j == 0 || j === GRID_SIZE_X - 1) {
                grid[i][j] = 0;
            }
            else {
                grid[i][j] = one_or_zero();
            }
        }
    }
    return grid; // retourne le tableau 2d initialisé
}

function updateGrid(grid) {// actualise la grille en appliquant les règles du jeux de la vie
    const grid_copy = copy_array(grid);
    var sum = 0;
    for (var i = 1; i < GRID_SIZE_Y - 1; i++) {
        for (var j = 1; j < GRID_SIZE_X - 1; j++) {
            sum = grid_copy[i][j-1] + grid_copy[i][j+1] + grid_copy[i-1][j-1] + grid_copy[i-1][j] + grid_copy[i-1][j+1] + grid_copy[i+1][j-1] + grid_copy[i+1][j] + grid_copy[i+1][j+1];
            if ((grid_copy[i][j] === 0) && (sum === 3)) {
                grid[i][j] = 1; // naissance
            }
            else if((grid_copy[i][j] === 1) && ((sum === 3) || (sum === 2))) {
                grid[i][j] = 1; // reste en vie
            }
            else {
                grid[i][j] = 0; // mort de la cellule
            }
        }
    }
}

/* FONCTIONS GRAPHIQUES */

function drawCell(x, y) {// affiche une cellule
    ctx.beginPath();
    ctx.rect(x, y, size_cells, size_cells);
    ctx.strokeStyle = "aquamarine";
    ctx.stroke();
}

function drawCell_black(x, y) {// affiche une cellule vivante
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, size_cells, size_cells);
}

function drawEmptyGrid() {// affiche une grille vide
    for (var i = 0; i < NB_CELL_X; i++) {
        for (var j = 0; j < NB_CELL_Y; j++) {
            drawCell(i*size_cells, j*size_cells);
        }
    }
}

function drawGrid(grid) {
    for (var i = 1; i < GRID_SIZE_Y - 1; i++) {
        for (var j = 1; j < GRID_SIZE_X - 1; j++) {
            if (grid[i][j] === 1) {
                drawCell_black((j-1)*size_cells, (i-1)*size_cells);
            }
        }
    }
}

function render(grid) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    if (grid_display) {drawEmptyGrid();}
    drawGrid(grid);
    updateGrid(grid); // refreshs the grid
}
    
/* GAME LOOP */
function gameLoop() {
    
    render(grid);
    //sleep(20);
    request = window.requestAnimationFrame(gameLoop);
}

/* MAIN PROGRAM GOL*/

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
var request;


var grid = initRandomGrid();
var grid_display = true;
    
gameLoop();

    
    
/* EVENTS LISTENERS */
var button_stop = document.getElementById("button_stop_anim");
var button_start = document.getElementById("button_start_anim");
var button_clear = document.getElementById("button_clear");
var button_random = document.getElementById("button_random");
var checkboxGrid = document.getElementById("checkboxGrid");
    
button_stop.addEventListener("click", function () {
    window.cancelAnimationFrame(request);
});
    
button_start.addEventListener("click", function () {
    window.requestAnimationFrame(gameLoop);
});
    
button_start.addEventListener("click", function () {
    grid = clearGrid();
    render(grid);
});
    
button_random.addEventListener("click", function () {
    grid = initRandomGrid();
    render(grid);
    window.cancelAnimationFrame(request);
});
    
checkboxGrid.addEventListener("click", function () {
    grid_display = checkboxGrid.checked;
    render(grid);
});

var canvas = document.getElementById( "my_canvas");
var ctx = canvas.getContext("2d");
var rect = canvas.getBoundingClientRect();
var page = document.querySelector("body");

//variables globales
var size_cells = 20;
var padding = 1;
var margin = 0.25;

var WIN_WIDTH = window.screen.width;
var WIN_HEIGHT = window.screen.height;
var WIDTH = ctx.canvas.width;
var HEIGHT = ctx.canvas.height;
var NB_CELL_X = Math.round(WIDTH / size_cells);
var NB_CELL_Y = Math.round(HEIGHT / size_cells);
var GRID_SIZE_X = NB_CELL_X + padding * 2;
var GRID_SIZE_Y = NB_CELL_Y + padding * 2;

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

//MODIF
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
            if (i < padding || i > GRID_SIZE_Y  - padding - 1) {
                grid[i][j] = 0;
            }
            else if (j < padding || j > GRID_SIZE_X  - padding - 1) {
                grid[i][j] = 0;
            }
            else {
                grid[i][j] = one_or_zero();
            }
        }
    }
    return grid; // retourne le tableau 2d initialisé
}

//MODIF
function updateGrid(grid) {// actualise la grille en appliquant les règles du jeux de la vie
    const grid_copy = copy_array(grid);
    var sum = 0;
    for (var i = padding; i < GRID_SIZE_Y - padding; i++) {
        for (var j = padding; j < GRID_SIZE_X - padding; j++) {
            
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

//MODIF
function drawGrid(grid) {
    for (var i = padding; i < GRID_SIZE_Y - padding; i++) {
        for (var j = padding; j < GRID_SIZE_X - padding; j++) {
            if (grid[i][j] === 1) {
                drawCell_black((j-padding)*size_cells, (i-padding)*size_cells);
            }
        }
    }
}

function render(grid) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    if (grid_display) {drawEmptyGrid();}
    drawGrid(grid);
}
    
function addCell(x, y) {
    // fait la division entière de la position et renvoie l'index de la case à placée
    var col = Math.trunc(x/size_cells) + padding;
    var row = Math.trunc(y/size_cells) + padding
    
    if (grid[row][col] === 0) {
        grid[row][col] = 1;
    }
}
    
function removeCell(x, y) {
    // fait la division entière de la position et renvoie l'index de la case à placée
    var col = Math.trunc(x/size_cells) + padding;
    var row = Math.trunc(y/size_cells) + padding
    if (grid[row][col] === 1) {
        grid[row][col] = 0;
    }
    else {
        grid[row][col] = 1;
    }
}
    
/* GAME LOOP */
function gameLoop() {
    
    render(grid);
    updateGrid(grid);
    sleep(30);
    request = window.requestAnimationFrame(gameLoop);
}

/* MAIN PROGRAM GOL*/

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
var request;

var grid_display = true;
var grid = initRandomGrid();
render(grid);

    
/* EVENTS LISTENERS */
var button_stop = document.getElementById("button_stop_anim");
var button_step = document.getElementById("button_step");
var button_start = document.getElementById("button_start_anim");
var button_clear = document.getElementById("button_clear");
var button_random = document.getElementById("button_random");
var checkboxGrid = document.getElementById("checkboxGrid");
    
var x = 0;
var y = 0;
var mouseIsDown = false;
    
button_stop.addEventListener("click", function () {
    window.cancelAnimationFrame(request);
});
    
button_step.addEventListener("click", function () {
    updateGrid(grid);
    render(grid);
});
    
button_start.addEventListener("click", function () {
    window.requestAnimationFrame(gameLoop);
});
    
button_clear.addEventListener("click", function () {
    window.cancelAnimationFrame(request);
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
    
canvas.addEventListener("mousedown", function (event) {
    mouseIsDown = true;
    x = event.clientX - rect.left + page.scrollLeft;
    y = event.clientY - rect.top + page.scrollTop;
    removeCell(x, y);
    render(grid);
});
    
canvas.addEventListener("mouseup", function () {
    mouseIsDown = false;
});

canvas.addEventListener("mousemove", function (event) {
    if (!mouseIsDown) return;
    x = event.clientX - rect.left + page.scrollLeft;
    y = event.clientY - rect.top + page.scrollTop;
    addCell(x, y);
    render(grid);
});
    
// MOBILE EVENTS LISTENERS
canvas.addEventListener("touchstart", function (event) {
    mouseIsDown = true;
    x = event.touches[0].clientX - rect.left + page.scrollLeft;
    y = event.touches[0].clientY - rect.top + page.scrollTop;
    removeCell(x, y);
    render(grid); 
});
    
canvas.addEventListener("touchend", function () {
    mouseIsDown = false;
});

canvas.addEventListener("touchmove", function (event) {
    if (!mouseIsDown) return;
    x = event.touches[0].clientX - rect.left + page.scrollLeft;
    y = event.touches[0].clientY - rect.top + page.scrollTop;
    //console.log("x: "+x,"y: "+y);
    addCell(x, y);
    render(grid);
});
// END MOBILE EVENTS

// WINDOW RESIZE

window.addEventListener("resize", function(){
    cancelAnimationFrame(request);
    
    WIN_WIDTH = window.screen.width;
    WIN_HEIGHT = window.screen.height;
    
    canvas.width = (WIN_WIDTH - margin * WIN_WIDTH) * devicePixelRatio;
    canvas.height = (WIN_HEIGHT - margin * WIN_HEIGHT) * devicePixelRatio;
    rect = canvas.getBoundingClientRect(); //position de depart du canvas par rapport au bord gauche supérieur de l'écran
    
    WIDTH = ctx.canvas.width;
    HEIGHT = ctx.canvas.height;
    NB_CELL_X = Math.round(WIDTH / size_cells);
    NB_CELL_Y = Math.round(HEIGHT / size_cells);
    GRID_SIZE_X = NB_CELL_X + padding * 2;
    GRID_SIZE_Y = NB_CELL_Y + padding * 2;
    
    
    grid = initRandomGrid();
    render(grid);
});

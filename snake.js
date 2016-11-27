var canvas;
var interval;
var ctx;
var ANIMSPEED = 100;
var WIDTH = 600;
var HEIGHT = 400;
//snake creation
var fieldsize = 20;//field segment size in px
var startsize = 5;//snake start length
var startx = 0;
var starty = 0;//snake starting coordinates;
var kierunek = 6;//snake starting movement direction(numerical keys 2,4,6,8);
var noapples = 20;//number of "apples"
var maxlng = startsize;
var minlng = startsize;
var appleseaten = 0;
var snake = new Array();
var apples = new Array();
function coord(x, y) {
    this.x = x;
    this.y = y;
    this.compare =
            function compare(o) {
                if ((this.x == o.x) && (this.y == o.y)) {
                    return true;
                } else {
                    return false;
                }
            }
    return true;
}
function createsnake() {
    for (var i = 0; i <= startsize - 1; i++) {
        snake.push(new coord(startx + i * fieldsize, starty));
    }
}
function createapples() {
    var fieldxsize = (WIDTH / fieldsize);
    var fieldysize = (HEIGHT / fieldsize);//wprowadzic modulo celem unikniecia problemu przy niepodzielnosci
    for (var i = 0; i < noapples; i++) {
        var tmpx = (Math.floor((Math.random() * fieldxsize) + 1)) * fieldsize;
        var tmpy = (Math.floor((Math.random() * fieldysize) + 1)) * fieldsize;
        apples.push(new coord(tmpx, tmpy));
    }
}
function addapple() {
    var fieldxsize = (WIDTH / fieldsize);
    var fieldysize = (HEIGHT / fieldsize);
    var tmpx = (Math.floor((Math.random() * fieldxsize) + 1)) * fieldsize;
    var tmpy = (Math.floor((Math.random() * fieldysize) + 1)) * fieldsize;
    apples.push(new coord(tmpx, tmpy));
}
function init() {
    canvas = document.getElementById("canvas2");
    ctx = canvas.getContext("2d");
    createsnake();
    createapples();
    interval = setInterval(mainLoop, ANIMSPEED);
}
function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}
function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}
function movesnake() {
    var length = snake.length;
    var tmpx = snake[length - 1].x;
    var tmpy = snake[length - 1].y;
    switch (kierunek) {
        case 6:
            snake.shift();
            snake.push(new coord(tmpx + fieldsize, tmpy));
            break;
        case 4:
            snake.shift();
            snake.push(new coord(tmpx - fieldsize, tmpy));
            break;
        case 2:
            snake.shift();
            snake.push(new coord(tmpx, tmpy + fieldsize));
            break;
        case 8:
            snake.shift();
            snake.push(new coord(tmpx, tmpy - fieldsize));
            break;
    }
}
function randommove() {//snake random movement(demo)
    var rnd = Math.floor((Math.random() * 100) + 1);
    if (rnd <= 10) {
        switch (kierunek) {
            case 6:
                (rnd % 2) ? kierunek = 2 : kierunek = 8;
                //kierunek=2;
                break;
            case 2:
                (rnd % 2) ? kierunek = 4 : kierunek = 6;
                break;
            case 4:
                (rnd % 2) ? kierunek = 2 : kierunek = 8;
                break;
            case 8:
                (rnd % 2) ? kierunek = 4 : kierunek = 6;
                break;
        }
    }
}
function kolizje() {//collision detection
    var lng = snake.length;
    var tmpx = snake[lng - 1].x;
    var tmpy = snake[lng - 1].y;
    if (tmpx + fieldsize > WIDTH) {
        return 0;
    }
    if (tmpx < 0) {
        return 0;
    }
    if (tmpy + fieldsize > HEIGHT) {
        return 0;
    }
    if (tmpy < 0) {
        return 0;
    }
    for (var i = 0; i < lng - 1; i++) {
        if (snake[lng - 1].compare(snake[i])) {
            return 0;
        }
    }
    for (var i = 0; i <= apples.length - 1; i++) {
        if (snake[lng - 1].compare(apples[i])) {
            snake.unshift(new coord(snake[0].x - fieldsize, snake[0].y - fieldsize));
            apples.splice(i, 1);
            addapple();
            appleseaten++;
            if (snake.length > maxlng)
                maxlng = snake.length;
        }
    }
    return 1;
}
function shadeColor(color, shade) {
    var colorInt = parseInt(color.substring(1), 16);

    var R = (colorInt & 0xFF0000) >> 16;
    var G = (colorInt & 0x00FF00) >> 8;
    var B = (colorInt & 0x0000FF) >> 0;

    R = R + Math.floor((shade / 255) * R);
    G = G + Math.floor((shade / 255) * G);
    B = B + Math.floor((shade / 255) * B);

    var newColorInt = (R << 16) + (G << 8) + (B);
    var newColorStr = "#" + newColorInt.toString(16);

    return newColorStr;
}
function drawGrid() {
    ctx.strokeStyle = '#aaaaaa';
    for (var x = 0; x < WIDTH; x += fieldsize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);
        ctx.stroke();
    }
    for (var y = 0; y < HEIGHT; y += fieldsize) {
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
        ctx.stroke();
    }
}
function wcisk(evt) {//snake controlls
    switch (evt.keyCode) {
        case 38://up
            if (kierunek != 2) {
                kierunek = 8;
            }
            break;
        case 40://down
            if (kierunek != 8) {
                kierunek = 2;
            }
            break;
        case 37://left
            if (kierunek != 6) {
                kierunek = 4;
            }
            break;
        case 39://right
            if (kierunek != 4) {
                kierunek = 6;
            }
            break;
    }
}
function mainLoop() {
    draw();
    if (!kolizje()) {
        gameOver();
    } else {
        movesnake();
    }
}
function draw() {
    var length = snake.length;
    clear();
    ctx.fillStyle = "#FAF7F8";
    ctx.fillStyle = "#444444";
    drawGrid();
    ctx.font = "5px Arial";
    for (var i = 0; i <= snake.length - 1; i++) {
        if (i == snake.length - 1) {
            ctx.fillStyle = "#ff0000";
        } else {
            //ctx.fillStyle = "#333333";//"#"+((1<<24)*Math.random()|0).toString(16) random color using bitwise shift
            ctx.fillStyle = shadeColor("#333333", i * 20)
        }
        rect(snake[i].x, snake[i].y, fieldsize, fieldsize);
        ctx.fillStyle = "#ffffff";
        ctx.fillText("n:" + i, snake[i].x + fieldsize / 2, snake[i].y + fieldsize / 2);
    }
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("score: " + appleseaten, 10, 20);
    for (var i = 0; i <= apples.length - 1; i++) {
        ctx.fillStyle = "#00ff00";
        rect(apples[i].x, apples[i].y, fieldsize, fieldsize);
    }
}
function gameOver() {
    clear();
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("Game Over", WIDTH / 3, HEIGHT / 4);
    ctx.fillText("Score: " + appleseaten, WIDTH / 3, HEIGHT / 3);
    ctx.fillText("Reload to start again", WIDTH / 3, HEIGHT / 2);
    window.clearInterval(interval);
    var highscore = getCookie("highscore");
    if (highscore != null && highscore != "")
    {
        //alert("Welcome again " + highscore);
        if (highscore < appleseaten) {
            setCookie("highscore", appleseaten, 360);
        }
    } else {
        setCookie("highscore", appleseaten, 360);
    }
}
window.addEventListener('keydown', wcisk, true);
document.addEventListener('DOMContentLoaded', function () {
    init();
});
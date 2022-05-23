import {Sprite, Line, Game} from "./Game.js";

var reqAnim = null;
var game = null;
var canvas = null;
var header = null;

//Wait for document to be ready
document.addEventListener("DOMContentLoaded", function() 
{
    setupHeaderGame();

    $("#navbar").load("nav.html");
    
    //Do not show overlay animation if user navigated to the page using the Back button or reloading the page
    if (String(window.performance.getEntriesByType("navigation")[0].type) === "back_forward" ||
    String(window.performance.getEntriesByType("navigation")[0].type) === "reload") 
    {
        landingElem = document.getElementById('landingElem');
        landingElem.remove();
        return;
    }
    
    overlay_animation();
});

//Add a listener when the browser is resized
window.addEventListener("resize", function() 
{
    game.stopGame(window);

    setupHeaderGame();
});

function getRandomNumberInRange(min, max)
{
    return Math.floor(Math.random() * (max - min) + min);
}

function setupHeaderGame()
{
    canvas = document.getElementById('game');

    //Delete placeholder canvas
    canvas.remove();

    //Recreate canvas to accomadate resized header
    canvas = document.createElement("canvas");
    canvas.setAttribute("id", "game");
    // canvas.style.backgroundColor = "white";

    header = document.getElementsByTagName('header')[0];
    header.appendChild(canvas);

    game = new Game(canvas, header.clientHeight, header.clientWidth);

    canvas.addEventListener("click", event=>{clickOnHeaderCanvas(game)});

    game.addConstantLine("ground", {line: new Line('black', 5), startX: 0, startY: canvas.height, endX: canvas.width, endY: canvas.height, incrementX: 0, incrementY: 0});
    game.addSprite("player", {sprite: new Sprite('../images/sprite/spriteV2.png',16, 24, 4, ['idle', 'run'], 2), state: 'idle', canvasX: 50, canvasY: header.clientHeight - 53});
    
    let cloud1 = new Sprite('../images/sprite/cloud1.png', 333, 144, 1,['static'], 0.25);
    let cloud2 = new Sprite('../images/sprite/cloud2.png', 601, 293, 1, ['static'], 0.1);
    let cloud3 = new Sprite('../images/sprite/cloud3.png', 421, 195, 1, ['static'], 0.15);

    let clouds = [cloud1, cloud2, cloud3];

    game.addConstantSprite("cloud1", {sprite: cloud1, canvasX: 10, canvasY: 10, incrementX: 0, incrementY: 0});
    game.addConstantSprite("cloud2", {sprite: cloud2, canvasX: 150, canvasY: 15, incrementX: 0, incrementY: 0});
    game.addConstantSprite("cloud3", {sprite: cloud3, canvasX: header.clientWidth - 100, canvasY: 25, incrementX: 0, incrementY: 0});

    //Draw more clouds randomly
    for(let i = 4; i < 11; i ++)
    {
        let randCloudIndex = getRandomNumberInRange(0, 2);
        let randX = getRandomNumberInRange(0, header.clientWidth);
        let randY = getRandomNumberInRange(0, 50);
        let randIncrement = getRandomNumberInRange(5, 20);
        game.addConstantSprite("cloud" + i, {sprite: clouds[randCloudIndex], canvasX: randX, canvasY: randY, incrementX: randIncrement, incrementY: 0});
    }

    game.startGame(window);
}

function clickOnHeaderCanvas(game)
{
    console.log("Mouse Click");

    let maxJumpHeight = header.clientHeight - 96;
    let currentHeight = header.clientHeight - 53;

    console.log(currentHeight, maxJumpHeight);

    // let jumpFunc = function()
    // {
    //     currentHeight -= Math.sqrt(currentHeight);
    //     game.updateSprite("player", {state: 'run', canvasX: 50, canvasY: currentHeight});

    //     while(currentHeight > maxJumpHeight)
    //     {
    //         console.log(currentHeight, maxJumpHeight);
    //         clearInterval(jumpInterval);
    //     }
    // };

    // let jumpInterval = setInterval(jumpFunc, 50);
}

//Add a listener when there is a click on the overlay
document.getElementById('landingElem').addEventListener("click", function closeOverlay()
{
    let landingElem = document.getElementById('landingElem');
    window.cancelAnimationFrame(reqAnim);
    landingElem.remove();
});

function overlay_animation()
{
    var canvas = document.getElementById('overlay_anim');

    var ctx = canvas.getContext('2d');

    //Draw ground
    let ground = new Line('white', 5);
    ground.drawLine(0, canvas.height, canvas.width, canvas.height, ctx);

    let sprite1 = new Sprite('../images/sprite/spriteV2.png',16, 24, 4, ['idle', 'run'], 2);
    let cloud1 = new Sprite('../images/sprite/cloud1.png', 333, 144, 1,['static'], 0.25);
    let cloud2 = new Sprite('../images/sprite/cloud2.png', 601, 293, 1, ['static'], 0.1);
    let cloud3 = new Sprite('../images/sprite/cloud3.png', 421, 195, 1, ['static'], 0.15);

    sprite1.setCurrentState('run');
    cloud1.setCurrentState('static');
    let frameCount = 0;
    let sX = 0;
    let c1X = 10;
    let c2X = 150;
    let c3X = 200;

    //Animate sprite
    var step = function()
    {
        frameCount ++;
        if(frameCount < 15)
        {
            reqAnim = window.requestAnimationFrame(step);
            return;
        }

        if(sX >= canvas.width)
        {
            sX = 0;
        }

        if(c1X <= -144 * 0.25)
        {
            c1X = canvas.width;
        }

        if(c2X <= -293 * 0.1)
        {
            c2X = canvas.width;
        }

        if (c3X <= -421 * 0.15)
        {
            c3X = canvas.width;
        }

        frameCount = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height - 5);
        sprite1.drawFrame({canvasX: sX, canvasY: canvas.height - 53, ctx: ctx});
        cloud1.drawFrame({canvasX: c1X, canvasY: 15, ctx: ctx});
        cloud1.drawFrame({canvasX: 10, canvasY: 10, ctx: ctx});
        cloud2.drawFrame({canvasX: c2X, canvasY: 10, ctx: ctx});
        cloud2.drawFrame({canvasX: 150, canvasY: 15, ctx: ctx});
        cloud3.drawFrame({canvasX: c3X, canvasY: 30, ctx: ctx});
        cloud3.drawFrame({canvasX: 200, canvasY: 25, ctx: ctx});

        sX += 10;
        c1X -= 2;
        c2X -= 5;
        c3X -= 3;

        reqAnim = window.requestAnimationFrame(step);
    }

    reqAnim = window.requestAnimationFrame(step);
}
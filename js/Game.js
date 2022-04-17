export class Game
{
    constantSprites = {};
    constantRects = {};
    constantLines = {};

    sprites = {};
    rects = {};

    anim;

    constructor(canvas, height, width)
    {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scaleRatio = canvas.width / canvas.height;

        this.height = height;
        this.width = width;

        // Make it visually fill the positioned parent
        canvas.style.width  = width;
        canvas.style.height = height;
        // Set the internal size to match
        canvas.width  = width;
        canvas.height = height;
    }

    addConstantSprite(name, {sprite, canvasX, canvasY, incrementX, incrementY})
    {
        this.constantSprites[name] = {sprite, canvasX, canvasY, incrementX, incrementY};
    }

    updateConstantSprite(name, {canvasX, canvasY, incrementX, incrementY})
    {
        this.constantSprites[name].canvasX = canvasX;
        this.constantSprites[name].canvasY = canvasY;
        this.constantSprites[name].incrementX = incrementX;
        this.constantSprites[name].incrementY = incrementY;
    }

    addSprite(name, {sprite, state, canvasX, canvasY})
    {
        this.sprites[name] = {sprite, state, canvasX, canvasY};
        this.sprites[name].sprite.setCurrentState(state);
    }

    updateSprite(name, {state, canvasX, canvasY})
    {
        this.sprites[name].spritecurrentState = state;
        this.sprites[name].canvasX = canvasX;
        this.sprites[name].canvasY = canvasY;
    }

    addConstantRect(name, rect)
    {
        this.constantRects[name] = rect;
    }

    addConstantLine(name, {line, startX, startY, endX, endY, incrementX, incrementY})
    {
        this.constantLines[name] = {line: line, startX: startX, startY: startY, endX: endX, endY: endY, incrementX: incrementX, incrementY: incrementY};
    }

    removeConstantSprite(name)
    {
        delete this.constantSprites[name];
    }

    startGame(window)
    {
        let frameCount = 0;

        var game = this;

        var step = function()
        {
            frameCount ++;
            if(frameCount < 15)
            {
                game.anim = window.requestAnimationFrame(step);
                return;
            }

            frameCount = 0;

            game.ctx.clearRect(0, 0, game.width, game.height);

            for(let name in game.constantLines)
            {
                game.constantLines[name].line.drawLine(game.constantLines[name].startX, game.constantLines[name].startY, game.constantLines[name].endX, game.constantLines[name].endY, game.ctx);         
            }

            //Loop constant sprites that go beyond the edge
            for(let constantSprite in game.constantSprites)
            {
                let newX = game.constantSprites[constantSprite].canvasX - game.constantSprites[constantSprite].incrementX;
                
                if(newX < 0 - game.constantSprites[constantSprite].sprite.width * game.constantSprites[constantSprite].sprite.scale)                
                    game.constantSprites[constantSprite].canvasX = game.width;
                 
                else
                    game.constantSprites[constantSprite].canvasX = newX;
                

                game.constantSprites[constantSprite].sprite.drawFrame({canvasX: game.constantSprites[constantSprite].canvasX, canvasY: game.constantSprites[constantSprite].canvasY, ctx: game.ctx});
            }

            for(let s in game.sprites)
            {
                game.sprites[s].sprite.drawFrame({canvasX: game.sprites[s].canvasX, canvasY: game.sprites[s].canvasY, ctx: game.ctx});
            }
            
            game.anim = window.requestAnimationFrame(step);
        };

        this.anim = window.requestAnimationFrame(step);
    }

    stopGame(window)
    {
        window.cancelAnimationFrame(this.anim);
    }
}

export class Sprite
{
    constructor(src, width, height, numFrames, states, scale = 1)
    {
        this.img = new Image();
        this.img.src = src;
        this.width =  width;
        this.height = height;
        this.numFrames = numFrames;
        this.states = states;
        //Set the default current state of the sprite to the 1st state
        this.currentState = 0;
        this.currentFrame = 0;

        //Scale is optional and will default to 1 if not set
        this.scale = scale;
        this.scaledWidth = scale * width;
        this.scaledHeight = scale * height;
    }

    setCurrentState(state)
    {
        this.currentState = this.states.indexOf(state);
        //When switching states reset frame index
        this.currentFrame = 0;
    }

    drawFrame({canvasX, canvasY, ctx})
    {
        // console.log("numFrames: ", this.numFrames);
        //Draw the next frame in the animation
        if(this.currentFrame == this.numFrames)
        {
            this.currentFrame = 0;
        }

        ctx.drawImage(this.img, this.currentFrame * this.width, 
            this.currentState * this.height, this.width, this.height,
            canvasX, canvasY, this.scaledWidth, this.scaledHeight);

        
        this.currentFrame ++;
    }
}

export class Line
{
    constructor(color, thickness)
    {
        this.color = color;
        this.thickness = thickness;
    }

    drawLine(startX, startY, endX, endY, ctx)
    {
        //Set line stroke color and line width
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.thickness;

        //Draw line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
}

class Rectangle
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;
    }

    drawRectangle(startX, startY, ctx)
    {
        ctx.rect(startX, startY, this.width, this.height);
        ctx.stroke();
    }
}
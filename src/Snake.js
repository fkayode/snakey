import './Snake.css';

import React, { useRef, useEffect, useState, useCallback } from 'react'

// todo: add indication when player loses (animation? sad face?)

// add speeds / levels (easy med hard)

const Directions = {
    Right: 39,
    Left: 37,
    Up: 38,
    Down: 40
}


// apple width and height (also same for snake parts)
const width = 20
const height = 20
let previousPath = {}
const snakeTails = [{ x: -width, y: 0 }]
const canvasWidth = 400;
let mouthPos = { x: 0, y: 0 }

// below are an array of the possible posiotions the apple can be (within the borders)
const possibleX = [...Array(canvasWidth).keys()].filter(v => v % width == 0 && v > width)
const possibleY = [...Array(canvasWidth).keys()].filter(v => v % height == 0 && v > height)

function isEqual(pos1, pos2) {
    if (pos1.x == pos2.x && pos1.y == pos2.y) {
        console.log("found a hit!")
        return true
    }
    else return false
}

function Snake() {
    // init data
    const canvasRef = useRef(null)
    const [snakeLength, setSnakeLength] = useState(0); // initialize snake length to zero
    const [snakePos, setSnakePos] = useState([0, 200]); // set snake position to [0,0]
    const [applePos, setApplePos] = useState({ x: 200, y: 200 }); // set apple position to [100,00]
    const [path, setPath] = useState(Directions.Right); // the current direction of the snake
    const [game, setGame] = useState(0); // is game running? bool? start as false
    const [hit, setHit] = useState(0); // if snake hits border or itself. bool
    const [maxScore, setMaxScore] = useState(0); // initialize snake length to zero


    const eatApple = () => {
        // increase snake tail
        snakeTails.push({});
        setSnakeLength(s => s + 1);
        // change apple position
        const randX = possibleX[Math.floor(Math.random() * possibleX.length)];
        const randY = possibleY[Math.floor(Math.random() * possibleY.length)];
        setApplePos({ x: randX, y: randY });
    }

    // draws the apple on the canvas
    const placeApple = (ctx) => {
        ctx.beginPath()
        ctx.arc(applePos.x + (width / 2), applePos.y + (width / 2), width / 2, 0, 2 * Math.PI)
        ctx.fillStyle = "red";
        ctx.fill()
    }


    // checks if new position will cause a collision.
    // returns true if snake will hit its tail and false if not
    const willSnakeCollide = (newPos) => {
        const newTail = snakeTails.slice()
        // check for hits
        for (const section in newTail) {
            if (isEqual(newTail[section], newPos)) {
                setHit(1)
                return true;
                break;
            }
        }
        return false;
    }

    // draws a section of the snake
    const drawSection = (ctx, pos, w, h, color) => {
        ctx.beginPath()
        ctx.arc(pos.x + (width / 2), pos.y + (w / 2), w / 2, 0, 2 * Math.PI)
        // ctx.rect(pos.x, pos.y, w, h);
        ctx.fillStyle = color;
        ctx.fill()
    }


    // draws the snake + its tails
    const drawTails = (ctx, newPos) => {
        // do not draw if hit
        const potentialHit = willSnakeCollide(newPos)
        if (hit || potentialHit) {
            return;
        }

        // clear canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // draw apple on canvas
        placeApple(ctx)

        // draw tail
        let square = {}
        for (const i in snakeTails) {
            // console.log("loop:",i)
            square = snakeTails[i]
            if (square) {
                drawSection(ctx, square, width, height, "lightgreen")
            }
        }
        // draw head
        drawSection(ctx, newPos, width, height, "green")
        // draw mouth
        // drawSection(ctx,mouthPos,10,10,"blue")


        // update snake tail start position
        snakeTails.unshift(newPos)
        snakeTails.pop()
    }


    const moveSnake = useCallback((ctx, path) => {
        let pos = [0, 0]
        let sp = snakePos
        let xOffset = 0
        let yOffset = 0
        if (hit) {
            return;
        }

        let pathIsSet = 0;

        // console.log("Moving snake Path from to", previousPath, path)
        while (!pathIsSet) {
            switch (path) {
                case Directions.Right:
                    if (previousPath != Directions.Left) {
                        pos = [width, 0]
                        xOffset = width
                        yOffset = height / 2
                        pathIsSet = 1;

                    }
                    else { path = previousPath }
                    break
                case Directions.Left:
                    if (previousPath != Directions.Right) {
                        pos = [-width, 0]
                        xOffset = 0
                        yOffset = height / 2
                        pathIsSet = 1;
                    }
                    else { path = previousPath }
                    break
                case Directions.Up:
                    if (previousPath != Directions.Down) {
                        pos = [0, -width]

                        xOffset = width / 2
                        yOffset = 0
                        pathIsSet = 1;
                    }
                    else { path = previousPath }
                    break
                case Directions.Down:
                    if (previousPath != Directions.Up) {
                        pos = [0, width]
                        xOffset = width / 2
                        yOffset = height
                        pathIsSet = 1;

                    }
                    else { path = previousPath }
                    break
                default:
                    break
            }
        }
        previousPath = path
        const newPos = sp.map((v, i) => v + pos[i])

        mouthPos = { x: (newPos[0] + xOffset), y: (newPos[1] + yOffset) }

        // check if we are at the border
        if (mouthPos.x > canvasWidth || mouthPos.x < 0 || mouthPos.y > canvasWidth || mouthPos.y < 0) {
            console.log("at border!!!!")
            setHit(1)
            return
        }

        // is apple inside?
        if (newPos[0] == applePos.x && newPos[1] == applePos.y) {
            eatApple();
        }

        drawTails(ctx, { x: newPos[0], y: newPos[1] })
        setSnakePos(newPos)

    }, [path, snakePos, snakeLength])



    function restart() {
        console.log("restarting", snakeTails.length)
        snakeTails.splice(0, snakeTails.length, { x: -width, y: 0 })
        mouthPos = { x: 0, y: 200 }
        setGame(0)
        setSnakeLength(0)
        setSnakePos([0, 200])
        setApplePos({ x: 200, y: 200 })
        setPath(Directions.Right)
        setHit(0)
        setGame(1)

    };

    const changePath = (event) => {
        const key = event.keyCode

        if (game && Object.values(Directions).indexOf(key) > -1) {
            setPath(key)
        }
    }


    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        //Our first draw
        context.fillStyle = '#000000'
        window.addEventListener('keydown', changePath);
        if (hit) {
            setMaxScore(Math.max(maxScore, snakeLength))
            setGame(0)

        } else {
            if (game) {
                setTimeout(() => {
                    moveSnake(context, path);
                }, 100)
            }
        }

        return () => {
            window.removeEventListener('keydown', changePath);

        };
    }, [snakePos, game, hit])

    return (

        <div className="Snake" >

            <div>
                Current score: {snakeLength}  &emsp;
                Max Score: {maxScore}
            </div>
            <div>



                <div className="game-board">
                    <canvas id="canvas" ref={canvasRef} width={canvasWidth} height={canvasWidth} />
                    {!game &&
                        <button className="btn"
                            style={{
                                position: "absolute",
                                left: "150px",
                                top: "175px"
                            }}
                            onClick={restart}>Start New Game</button>

                    }
                </div>
            </div>
        </div>
    );
}

export default Snake;

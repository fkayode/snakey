import './Snake.css';
import React, { useRef, useEffect, useState, useCallback } from 'react'

const Directions = {
    Right: 39,
    Left: 37,
    Up: 38,
    Down: 40
}
// const body=[{x:0,y:0,w:-1,h:0}]
const width =20
const height =20
function Snake() {
    const canvasRef = useRef(null)
    const [snakeLength, setSnakeLength] = useState(1);
    const [W, setW] = useState(-1);
    const [H, setH] = useState(1);
    const [snakePos, setSnakePos] = useState([0, 0]);
    const [path, setPath] = useState(Directions.Right);

    const draw = (ctx, pos, length, w, h) => {
        // console.log("drawing snake pos", snakePos)
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // const pos = snakePos
        // for (const square in length){
            // const add = square
            ctx.beginPath()
        ctx.rect(pos[0], pos[1], width, height);
        ctx.fillStyle = "pink";
        ctx.fill()
        let range = [...Array(length).keys()]
        // for (const square in range){
            for (const square in body){
        //    const square=2

          const bx = pos[0] +(20*w*square)
          const by = pos[1] +(20*h*square)
        ctx.beginPath()
        ctx.rect(bx, by, width, height);
        ctx.fillStyle = "purple";
        ctx.fill()
        }
        
    }
    

    const moveSnake = useCallback((ctx) => {
        let pos = [0, 0]
        let w =-1
        let h =0
        let sp = snakePos
        if (sp[0] > 300 || sp[0] < 0 || sp[1] > 300 || sp[1] < 0) {
            setSnakePos([1, 1])
            setPath(Directions.Right)
            return
        }
        switch (path) {
            case Directions.Right:
                
                w= -1
                h=(0)
                pos = [5, 0]
                break
            case Directions.Left:
                pos = [-5, 0]
                w= 1
                h=(0)
                break
            case Directions.Up:
                pos = [0, -5]
                h= 1
                w=(0)
                break
            case Directions.Down:
                pos = [0, 5]
                h= -1
                w=(0)
                break
            default:
                break
        }
        // console.log("using snake pos", sp)
        const newPos = sp.map((v, i) => v + pos[i])
        // console.log("snake pos should be", pos,newPos)
        body.push({x:newPos[0],y:newPos[1],w:w,h:h}) 
        draw(ctx, newPos, snakeLength, w,h)
        setSnakePos(newPos)
    }, [path, snakePos, snakeLength])
    // componentDidMount()
    useEffect(() => {
        const changePath = (event) => {
            const key = event.keyCode
            console.log("pressed", key)
            
            if (Object.values(Directions).indexOf(key) > -1) {
                setSnakeLength(s=> s+ 1)
                setPath(key)
                
            }
        }
// console.log("rerender")
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        //Our first draw
        context.fillStyle = '#000000'
        //context.fillRect(0, 0, context.canvas.width, context.canvas.height)
        window.addEventListener('keydown', changePath);
        //Our draw come here
        //   const interval = 

        
        setTimeout(() => {
            moveSnake(context);
        }, 100)
        

        return () => {
            window.removeEventListener('keydown', changePath);
            // context.fillRect(0, 0, context.canvas.width, context.canvas.height)
            // clearInterval(interval);
        };
    }, [snakePos])

    return (

        <div className="Snake" >

            <p>
                Welcome to Snake app {snakeLength}
            </p>

            <canvas class="board" ref={canvasRef} width="300" height="300" />
        </div>
    );
}

export default Snake;

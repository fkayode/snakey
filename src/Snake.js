import './Snake.css';
import React, { useRef, useEffect, useState, useCallback } from 'react'


// todo: convert to jsx

// todo: add new game start menu

// todo: stop right at edge please
// todo: add indication when player loses (animation? sad face?)

// todo: remove yellow in corners 
// todo: larger gameboard
// todo: make apple look like an apple
// make snake look like a snake??
// todo: start apple in middle and apple in front

const Directions = {
    Right: 39,
    Left: 37,
    Up: 38,
    Down: 40
}


// apple width and height (also same for snake parts)
const width =20
const height =20
let previousPath = {}
const snakeTails=[{x:-width,y:0}]
const canvasWidth = 300;
// below are an array of the possible posiotions the apple can be (within the borders)
const possibleX = [...Array(canvasWidth).keys()].filter(v => v%width==0 && v>width)
const possibleY = [...Array(canvasWidth).keys()].filter(v => v%height==0&& v>height)

function isEqual(pos1,pos2) {
    if(pos1.x==pos2.x && pos1.y==pos2.y){
    console.log("found a hit!" )
    return true
    }
    else return false
 }

function Snake() {
    // init data
    const canvasRef = useRef(null)
    const [snakeLength, setSnakeLength] = useState(0); // initialize snake length to zero
    const [snakePos, setSnakePos] = useState([0, 0]); // set snake position to [0,0]
    const [applePos, setApplePos] = useState({x:100,y:100}); // set apple position to [100,00]
    const [path, setPath] = useState(Directions.Right); // the current direction of the snake
    const [game, setGame] = useState(0); // is game running? bool? start as false
    const [hit, setHit] = useState(0); // if snake hits border or itself. bool
    const [maxScore, setMaxScore] = useState(0); // initialize snake length to zero
    
    
    
    const changeApplePos = (ctx)=>{
        const randX= possibleX[Math.floor(Math.random()*possibleX.length)];
        const randY= possibleY[Math.floor(Math.random()*possibleY.length)];
        setApplePos({x:randX, y:randY})
    }

    // draws the apple on the canvas
    const placeApple = (ctx) => {
        // draw apple
        ctx.beginPath()
        ctx.rect(applePos.x,applePos.y, width, height);
        ctx.fillStyle = "green";
        ctx.fill()
        // draw apple x y
          ctx.beginPath()
          ctx.rect(applePos.x,applePos.y, 5, 5);
          ctx.fillStyle = "yellow";
          ctx.fill()
    }

    
    // const gameOver = () => {
      
    //             setGame(0)
    //             // setHit(1)
        
          
    // }

    // checks if new position will cause a collision.
    // returns true if snake will hit its tail and false if not
    const willSnakeCollide = (newPos) => {
        const newHead= {x:newPos[0],y:newPos[1]}
        const newTail=snakeTails.slice()
          // check for hits
        for(const section in newTail){
            if (isEqual(newTail[section],newHead)){
                // setGame(0)
                setHit(1)
        
                return true;
          
                
                
                break;
            }
           
        }
  
        return false;
    }

    




    // draws the snake + its tails
    const drawTails = (ctx, newPos, length, w, h) => {
        // console.log("drawing snake pos", snakePos)
        // do not draw if hit
        // checkForHit(newPos);
        const potentialHit = willSnakeCollide(newPos)
        if (hit  || potentialHit) {
       
            return;   
        }

        // clear canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // const st =snakeTails //.slice(0,snakeLength)

        // draw apple on canvas
        placeApple(ctx)

        
    
        
        
        
         
        // draw tail
        let square ={}
        for (const i in snakeTails){
            // console.log("loop:",i)
            square = snakeTails[i]
            if (square){
                // console.log(i, square)
                // console.log("drawing tail with ", square.x+(10*w), square.y+(10*h),width, height)
                ctx.beginPath()
                ctx.rect(square.x, square.y,width, height);
                // ctx.rect(square.x+(w*(i+1)), square.y+(h*(i+1)),width, height);
                ctx.fillStyle = i==0?"purple":"red";
                ctx.fill()}
            
        }
        // draw head
        ctx.beginPath()
        ctx.rect(newPos[0], newPos[1], width, height);
        ctx.fillStyle = "pink";
        ctx.fill()
        // draw head x+y
        ctx.beginPath()
        ctx.rect(newPos[0], newPos[1], 5, 5);
        ctx.fillStyle = "yellow";
        ctx.fill() 
          
        // update snake tail start position
        snakeTails.unshift({x:newPos[0] ,y:newPos[1]})
        snakeTails.pop()
        // console.log("tals end",snakeTails)
    
    }
    

    const moveSnake = useCallback((ctx) => {
        let pos = [0, 0]
        let w =-1
        let h =0
        let sp = snakePos
        if (hit) {
            return;
        }
        if (sp[0] > canvasWidth || sp[0] < 0 || sp[1] > canvasWidth || sp[1] < 0) {
            // setSnakePos([0, 0])
            setHit(1)
            
            // setPath(Directions.Right)
            return
        }
        console.log("Path from to", previousPath, path)
        switch (path) {
            case Directions.Right:
                w= -1
                h=(0)
                pos = [width, 0]
                if (previousPath == Directions.Left){setHit(1);}
                break
            case Directions.Left:
                pos = [-width, 0]
                w= 1
                h=(0)
                if (previousPath == Directions.Right){setHit(1);}
                break
            case Directions.Up:
                pos = [0, -width]
                h= 1
                w=(0)
                if (previousPath == Directions.Down){setHit(1);}
                break
            case Directions.Down:
                pos = [0, width]
                h= -1
                w=(0)
                if (previousPath == Directions.Up){setHit(1);}
                break
            default:
                break
        }
        previousPath=path
        // console.log("using snake pos", sp)
        const newPos = sp.map((v, i) => v + pos[i])

        // is apple inside?
        if(newPos[0]==applePos.x && newPos[1]==applePos.y){
            snakeTails.push({})
            setSnakeLength(s=> s+1)
            changeApplePos(ctx);
            // setGame(0)
        }

        drawTails(ctx, newPos, snakeLength, w,h)
        // draw(ctx, newPos, snakeLength, w,h)
               
        setSnakePos(newPos)
        
    }, [path, snakePos, snakeLength])
    // componentDidMount()

    function restart(){
        if(hit){}
        setGame(0)
        console.log("restarting")
        snakeTails.length=1
        setSnakeLength(0)
        setSnakePos([0, 0])
        setPath(Directions.Right)  
        setHit(0)
        setGame(1)
    };

    useEffect(() => {
        const changePath = (event) => {
            const key = event.keyCode
            console.log("pressed", key)
            if (game && Object.values(Directions).indexOf(key) > -1) {
                setPath(key)
            }
        }

        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        // context.scale(3, 3);
        //Our first draw
        context.fillStyle = '#000000'
        window.addEventListener('keydown', changePath);
        if (hit) {
            setMaxScore(Math.max(maxScore,snakeLength))
            setGame(0)

        }else{if(game){setTimeout(() => {
            moveSnake(context);
        }, 150)}}

        return () => {
            window.removeEventListener('keydown', changePath);

        };
    }, [snakePos, game, hit])

    return (

        <div className="Snake" >
<div><p>
                Welcome to Snake app 
            </p></div>

<div>
    Current score: {snakeLength}  ||  
    Max Score: {maxScore}
</div>
            
            <div>
            <button onClick={restart}>Start New Game</button>
            </div>
            

            <canvas class="board" ref={canvasRef} width={canvasWidth} height={canvasWidth} />
        </div>
    );
}

export default Snake;

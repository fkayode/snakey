import './Snake.css';
import React, { useRef, useEffect, useState, useCallback } from 'react'


// todo: convert to jsx

const Directions = {
    Right: 39,
    Left: 37,
    Up: 38,
    Down: 40
}
const body=[{x:0,y:0,w:-1,h:0}]
const width =20
const height =20
let previousPath = {}
const snakeTails=[{x:-width,y:0}]
const possibleX = [...Array(300).keys()].filter(v => v%width==0 && v>width)
const possibleY = [...Array(300).keys()].filter(v => v%height==0&& v>height)

function Snake() {
    const canvasRef = useRef(null)
    const [snakeLength, setSnakeLength] = useState(0);
    const [snakePos, setSnakePos] = useState([0, 0]);
    const [applePos, setapplePos] = useState({x:100,y:100});
    const [path, setPath] = useState(Directions.Right);
    const [game, setGame] = useState(0);
    const [hit, setHit] = useState(0);
   
    const newApplePos = (ctx)=>{
        const randX= possibleX[Math.floor(Math.random()*possibleX.length)];
        const randY= possibleY[Math.floor(Math.random()*possibleY.length)];
        setapplePos({x:randX, y:randY})
    }


    const drawTails = (ctx, pos, length, w, h) => {
        // console.log("drawing snake pos", snakePos)
        if (hit) {
            return;   
        }
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const st =snakeTails //.slice(0,snakeLength)

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

        // draw head
        ctx.beginPath()
        ctx.rect(pos[0], pos[1], width, height);
        ctx.fillStyle = "pink";
        ctx.fill()
        // draw head x+y
        ctx.beginPath()
        ctx.rect(pos[0], pos[1], 5, 5);
        ctx.fillStyle = "yellow";
        ctx.fill() 
    
        const head= {x:pos[0],y:pos[1]}
         const oldhead= {x:snakePos[0],y:snakePos[1]}        
         console.log("SLEEP, old pos", oldhead)
        console.log("SLEEP new pos,", head)
        console.log("SLEEP snake tails head", snakeTails[0]) 
        function isEqual(a,b) {
            console.log("compare", a, b)
           if(a.x==b.x){
           if(a.y==b.y) { console.log("found!" )
           return true
           }
           } 
           else return false
          }
        for(const tail in snakeTails){
            if (isEqual(snakeTails[tail],head)){
                setGame(0)
                setHit(1)
                // setGame(0)
                
                
                break;
            }
        }
        
         
        // draw tail
        let square ={}
        for (const i in st){
            // console.log("loop:",i)
            square = st[i]
            if (square){
                // console.log(i, square)
                // console.log("drawing tail with ", square.x+(10*w), square.y+(10*h),width, height)
                ctx.beginPath()
                ctx.rect(square.x, square.y,width, height);
                // ctx.rect(square.x+(w*(i+1)), square.y+(h*(i+1)),width, height);
                ctx.fillStyle = i==0?"purple":"red";
                ctx.fill()}
            
        }
            
        
        
        // update snake tail start position
        snakeTails.unshift({x:pos[0] ,y:pos[1]})
        snakeTails.pop()
        console.log("tals end",st)

       


        
        
        
    }
    

    const moveSnake = useCallback((ctx) => {
        let pos = [0, 0]
        let w =-1
        let h =0
        let sp = snakePos
        if (hit) {
            return;
        }
        if (sp[0] > 300 || sp[0] < 0 || sp[1] > 300 || sp[1] < 0) {
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

        // const head= {x:newPos[0],y:newPos[1]}
        // const oldhead= {x:sp[0],y:sp[1]}
        
        // let indexFound= snakeTails.indexOf({head})
        // console.log(indexFound)
        // if(indexFound>0) {
        //     // setGame(0)
        //     // snakeTails=[]
        //     // setSnakeLength(0)
        //     setGame(0)

        // }

      

        // if(pos[0]==snakeTails[0].x && pos[1]==snakeTails[0].y){
        //     console.log("wrong way")
        //     snakeTails =[]
        //     setSnakeLength(1)
        //     // newApplePos(ctx);
        //     setGame(0)
        // }

        // mouth.x = newPos[0] 
        // + width //right or 0
        // + 0 // left?
        // +
        // console.log("snake pos should be", pos,newPos)
        // body.push({x:newPos[0],y:newPos[1],w:w,h:h}) 

        // is apple inside?
        if(newPos[0]==applePos.x && newPos[1]==applePos.y){
            snakeTails.push({})
            setSnakeLength(s=> s+1)
            newApplePos(ctx);
            // setGame(0)
        }

        drawTails(ctx, newPos, snakeLength, w,h)
        // draw(ctx, newPos, snakeLength, w,h)
        
        
        setSnakePos(newPos)

        

        

        
    }, [path, snakePos, snakeLength])
    // componentDidMount()
    useEffect(() => {
        const changePath = (event) => {
            const key = event.keyCode
            console.log("pressed", key)
            if(key == 32){
                if(hit) {
            snakeTails.length=1
            setSnakeLength(0)
            setSnakePos([0, 0])
            setPath(Directions.Right)  
                    setHit(0)}
                setGame(g=>!g)
            }
            
            if (game && Object.values(Directions).indexOf(key) > -1) {
                // setSnakeLength(s=> s+ 1)
                setPath(key)
                // snakeTails.push({})
                
            }
        }


// console.log("rerender", snakeTails)
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        // context.scale(3, 3);
        //Our first draw
        context.fillStyle = '#000000'
        //context.fillRect(0, 0, context.canvas.width, context.canvas.height)
        window.addEventListener('keydown', changePath);
        //Our draw come here
        //   const interval = 
        if (hit) {
            setGame(0)
            // snakeTails.length=0
            // setSnakeLength(0)     
        }else{if(game){setTimeout(() => {
            moveSnake(context);

            //check if ate apple
        
        }, 150)}}

        

        return () => {
            window.removeEventListener('keydown', changePath);

            
            // context.fillStyle = 'red';
// context.fillRect(10, 10, 8, 20);

// Reset current transformation matrix to the identity matrix
// context.setTransform(1, 0, 0, 1, 0, 0);


            // context.fillRect(0, 0, context.canvas.width, context.canvas.height)
            // clearInterval(interval);
        };
    }, [snakePos, game, hit])

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

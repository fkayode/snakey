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
const snakeTails=[]
const possibleX = [...Array(300).keys()].filter(v => v%width==0 && v>width)
const possibleY = [...Array(300).keys()].filter(v => v%height==0&& v>height)

function Snake() {
    const canvasRef = useRef(null)
    const [snakeLength, setSnakeLength] = useState(0);
    const [snakePos, setSnakePos] = useState([0, 0]);
    const [applePos, setapplePos] = useState({x:100,y:100});
    const [path, setPath] = useState(Directions.Right);
    const [game, setGame] = useState(0);
   
    const newApplePos = (ctx)=>{
        const randX= possibleX[Math.floor(Math.random()*possibleX.length)];
        const randY= possibleY[Math.floor(Math.random()*possibleY.length)];
        setapplePos({x:randX, y:randY})
    }


    const drawTails = (ctx, pos, length, w, h) => {
        // console.log("drawing snake pos", snakePos)
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        const st =snakeTails //.slice(0,snakeLength)

         // draw apple
        
         ctx.beginPath()
         ctx.rect(applePos.x,applePos.y, width, height);
         ctx.fillStyle = "green";
         ctx.fill()
         // draw x+y
           ctx.beginPath()
           ctx.rect(applePos.x,applePos.y, 5, 5);
           ctx.fillStyle = "yellow";
           ctx.fill()
        
        // draw head
        ctx.beginPath()
        ctx.rect(pos[0], pos[1], width, height);
        ctx.fillStyle = "pink";
        ctx.fill()

        // draw x+y
        ctx.beginPath()
        ctx.rect(pos[0], pos[1], 5, 5);
        ctx.fillStyle = "yellow";
        ctx.fill()
    
        // update 
        
        // draw tail
        let range = [...Array(length).keys()]
        // console.log("RANGE:", range)
    
       
        //draw
        // console.log("tals start",st)
        // console.log("tals start",st.slice(), st.at(-1))
        let square ={}
        for (const i in st){
            // console.log("loop:",i)
            square = st[i]
            if (square){
                console.log(i, square)
                console.log("drawing tail with ", square.x+(10*w), square.y+(10*h),width, height)
                ctx.beginPath()
                ctx.rect(square.x, square.y,width, height);

                // ctx.rect(square.x+(w*(i+1)), square.y+(h*(i+1)),width, height);
                ctx.fillStyle = i==0?"purple":"red";
                ctx.fill()}
            
        }
            
        //   const bx = pos[0] +(20*w*square)
        //   const by = pos[1] +(20*h*square)
      
        // snakeTails.pop()
        
        
        // snakeTails[1]=({x:pos[0]+ (20*w),y:pos[1]+ (20*h)})
        // console.log(pos[0], pos[1])
        
        
        // for (const i in range){
        //     if(i>0){
        //         // console.log(i)
        //         snakeTails[i].x =20*i //snakeTails[i-1].x -50//+(20*w)
        //         snakeTails[i].y =snakeTails[i-1].y //+(20*h)
        //     }
        // }
        snakeTails.unshift({x:pos[0] ,y:pos[1]})
        
        // snakeTails.unshift({x:pos[0]+(width*w) ,y:pos[1]+(width*h)})
        // snakeTails.push({x:pos[0] +(width*w),y:pos[1]+(height*h)})
        snakeTails.pop()
        
        console.log("tals end",st)

       


        
        
        
    }
    

    const moveSnake = useCallback((ctx) => {
        let pos = [0, 0]
        let w =-1
        let h =0
        let sp = snakePos
        let mouth = {x:0,y:0}
        if (sp[0] > 300 || sp[0] < 0 || sp[1] > 300 || sp[1] < 0) {
            setSnakePos([0, 0])
            
            setPath(Directions.Right)
            return
        }
        switch (path) {
            case Directions.Right:
                
                w= -1
                h=(0)
                pos = [width, 0]
                


                break
            case Directions.Left:
                pos = [-width, 0]
                w= 1
                h=(0)
                break
            case Directions.Up:
                pos = [0, -width]
                h= 1
                w=(0)
                break
            case Directions.Down:
                pos = [0, width]
                h= -1
                w=(0)
                break
            default:
                break
        }
        // console.log("using snake pos", sp)

        
        const newPos = sp.map((v, i) => v + pos[i])

        // mouth.x = newPos[0] 
        // + width //right or 0
        // + 0 // left?
        // +
        // console.log("snake pos should be", pos,newPos)
        body.push({x:newPos[0],y:newPos[1],w:w,h:h}) 

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
                setGame(g=>!g)
            }
            
            if (Object.values(Directions).indexOf(key) > -1) {
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

        if(game){setTimeout(() => {
            moveSnake(context);

            //check if ate apple
        
        }, 150)}
        
        
        

        return () => {
            window.removeEventListener('keydown', changePath);

            
            // context.fillStyle = 'red';
// context.fillRect(10, 10, 8, 20);

// Reset current transformation matrix to the identity matrix
// context.setTransform(1, 0, 0, 1, 0, 0);


            // context.fillRect(0, 0, context.canvas.width, context.canvas.height)
            // clearInterval(interval);
        };
    }, [snakePos, game])

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

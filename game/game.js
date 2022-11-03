const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp=document.getElementById('up');
const btnLeft=document.getElementById('left');
const btnRight=document.getElementById('right');
const btnDown=document.getElementById('down');

let canvasSize;
let elementSize;
let level=0;
let lives=3;
const playerPosition={
    x:undefined,
    y:undefined
};
const giftPosition={
    x:undefined,
    y:undefined
};
let enemiesPositions=[];

window.addEventListener('load',setCanvasSize);
window.addEventListener('resize',setCanvasSize);
function setCanvasSize(){

    if(window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth *0.7;
    }else{
        canvasSize=window.innerHeight *0.7;
    }

    canvas.setAttribute('width', canvasSize );
    canvas.setAttribute('height', canvasSize );
    elementSize =canvasSize/10;
    startGame();
}

function startGame(){
    //console.log({elementSize,canvasSize})
    game.font=elementSize+'px Verdana'; 
    game.textAlign='end';
    
    const map =maps[level];
    if(!map){
        gameWin();
        return;
    }
    const mapRows=map.trim().split('\n');
    const mapRowsCols= mapRows.map(row => row.trim().split(''))

    game.clearRect(0,0,canvasSize,canvasSize);
    enemiesPositions=[];
    mapRowsCols.forEach((row,rowI) => {
        row.forEach((col,colI) =>{
            const emoji=emojis[col];
            const posX=elementSize*(colI+1)
            const posY=elementSize*(rowI+1)
            if(col == 'O'){
                if(!playerPosition.x && !playerPosition.y){
                    playerPosition.x=posX;
                    playerPosition.y=posY;
                    console.log({playerPosition})
                }
            }else if(col=='I'){
                giftPosition.x=posX;
                giftPosition.y=posY;
            }else if(col == 'X'){
                enemiesPositions.push({x:posX,y:posY});
            }

            game.fillText(emoji,posX,posY);            
        });
        
        
    });
    
    // for(let row=1;row<=10;row++){
    //     for(let col=1;col<= 10;col++){
    //game.fillText(emojis[mapRowsCols[row-1][col-1]],elementSize*col,elementSize*row);
    //     }
    // } 
    //game.fillRect(0,0,100,100);
   // game.clearRect(50,50,50,50);
    // game.font ='25px Verdana';
    // game.fillStyle ='purple';
    // game.textAlign='center';
    // game.fillText('Platzi',5,25);
    movePlayer();
}

function movePlayer(){
    if(playerPosition.x<elementSize){
        playerPosition.x=elementSize
    }
    if(playerPosition.y<elementSize){
        playerPosition.y=elementSize
    }
    if(playerPosition.x>elementSize*10){
        playerPosition.x=elementSize*10;
    }
    if(playerPosition.y>elementSize*10){
        playerPosition.y=elementSize*10
    }
    const giftColisionX=playerPosition.x.toFixed(3)==giftPosition.x.toFixed(3);
    const giftColisiony=playerPosition.y.toFixed(3)==giftPosition.y.toFixed(3);
    const giftColisions= giftColisionX && giftColisiony;
    if(giftColisions){
        levelWin();
    } 
    const enemyCollison=enemiesPositions.find(enemy=>{
        const enemyCollisonX=enemy.x.toFixed(3) ==playerPosition.x.toFixed(3);
        const enemyCollisonY=enemy.y.toFixed(3) ==playerPosition.y.toFixed(3);
        return enemyCollisonX && enemyCollisonY;
    })
    if (enemyCollison){
        levelFail();
    }
    game.fillText(emojis['PLAYER'],playerPosition.x,
    playerPosition.y);

}
function levelFail(){
    // lives-=1;
    // if(lives<=0){
    //     console.log('GAME OVER')
    // }
    // return;
    playerPosition.x=undefined;
    playerPosition.y=undefined;
}
function levelWin(){
    console.log('new level')
    level++
    startGame();
}
function gameWin(){
    console.log('Acabaste El juego')
    
}
window.addEventListener('keydown',moveByKeys);
btnUp.addEventListener('click',moveUp);
btnLeft.addEventListener('click',moveLeft);
btnRight.addEventListener('click',moveRight);
btnDown.addEventListener('click',moveDown);

function moveByKeys(event){
    if(event.key == 'ArrowUp') moveUp();
    else if(event.key == 'ArrowLeft') moveLeft();
    else if (event.key == 'ArrowRight') moveRight();
    else if(event.key == 'ArrowDown') moveDown();
}
function moveUp(){
 //   console.log('I want to move up')
        playerPosition.y -=elementSize;
        startGame();
}
function moveLeft(){
    //console.log('I want to move Left');
        playerPosition.x -=elementSize;
        startGame();
}
function moveRight(){
   // console.log('I want to move right')
        playerPosition.x += elementSize;
        startGame();
}
    
function moveDown(){
    //console.log('I want to move down')
        playerPosition.y +=elementSize;
        startGame();
}
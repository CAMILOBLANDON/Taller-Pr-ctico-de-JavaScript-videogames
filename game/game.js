const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp=document.getElementById('up');
const btnLeft=document.getElementById('left');
const btnRight=document.getElementById('right');
const btnDown=document.getElementById('down');
const livesHtml=document.getElementById('lives')
const levelHtml=document.getElementById('level')
const timeHtml=document.getElementById('time')
const recordView=document.getElementById('record')
const result=document.getElementById('result')

let canvasSize;
let elementSize;
let level=0;
let lives=3;

let timeStart;
let timePlayer;
let timeInterval;

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
function fixNumbre(n){
    return Number(n.toFixed(2));
}
function setCanvasSize(){

    if(window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth *0.7;
    }else{
        canvasSize=window.innerHeight *0.7;
    }
    canvasSize= Number(canvasSize.toFixed(0));
    canvas.setAttribute('width', canvasSize );
    canvas.setAttribute('height', canvasSize );
    elementSize =canvasSize/10;
    playerPosition.x=undefined;
    playerPosition.y=undefined;
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

    if(!timeStart){
        timeStart=Date.now();
        timeInterval=setInterval(showTime,100);
        showRecord();
    }

    const mapRows=map.trim().split('\n');
    const mapRowsCols= mapRows.map(row => row.trim().split(''))
    showLives();
    showLevel();
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
    lives-=1;
    
    if(lives<=0){
        lives=3;
        level =0;
        timeStart=undefined;
    }
    playerPosition.x=undefined;
    playerPosition.y=undefined;
    
    startGame();
}

function levelWin(){
    console.log('new level')
    level++
    startGame();
}

function gameWin(){
    console.log('Acabaste El juego');
    clearInterval(timeInterval);
    
    const recordTime = localStorage.getItem('record_time');
    const playerTime =Date.now() - timeStart;
    
    if(recordTime){   
        if(recordTime >= playerTime){
            localStorage.setItem('record_time',playerTime);
            result.innerHTML='SUPERASTE EL RECORD';
        }else{
            result.innerHTML='lo siento, no superaste el records :(';
        }
    }else{
        localStorage.setItem('record_time',playerTime);
    }
    console.log({recordTime,playerTime});
    
}

function showLives(){
    const heartsArray=Array(lives).fill(emojis['HEART']);
    livesHtml.innerHTML='';
    heartsArray.forEach(heart=>livesHtml.append(heart))
    // livesHtml.innerHTML=heartsArray;
}

function showLevel(){
    levelHtml.innerHTML=level+1;
}

function showTime(){
    timeHtml.innerHTML=Date.now()- timeStart;
}
function showRecord(){
    recordView.innerHTML = localStorage.getItem('record_time');
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
    else if(event.key == 'w') moveUp();
    else if(event.key == 'a') moveLeft();
    else if (event.key == 'd') moveRight();
    else if(event.key == 's') moveDown();
    else if(event.key == 'W') moveUp();
    else if(event.key == 'A') moveLeft();
    else if (event.key == 'D') moveRight();
    else if(event.key == 'S') moveDown();
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
title = "Block Shoot";

description = ` 
`;

characters = [
  `
bc
bcpl
cPllyY
cPllyY
bcpl
bc
`
];

const G = {
	WIDTH: 200,
	HEIGHT: 100,
  PLAYER_SPEED: 0.5,
  PLAYER_SIZE: 5,
  BULLET_SPEED: 0.8,
  BULLET_FRAG_SPEED: 1,
  BLOCK_SIZE: 7
};

options = {

  isPlayingBgm: true,
  theme: "dark",
  viewSize: {x: G.WIDTH, y: G.HEIGHT}
};

let colors = ["light_black","red","green","yellow","blue","purple","cyan"];
let lastTick;
let spawnRate = 3; //in seconds
let block_speed = 0.2;
let bullet;
let blockArr;
let bulletFragArr;
let player;

function update() {

  if (!ticks) {
    blockArr = [];
    bulletFragArr= [];
    bullet = null;
    lastTick = 0;
    player = {pos: vec(10,10), dir: 1};
  }

  if(ticks - lastTick == 60 * spawnRate){
    lastTick = ticks;
    block_speed+= 0.01* difficulty;
    generateBlocks();
  }

  color("black");
  char("a",player.pos);
  if(player.pos.y == 9 || player.pos.y == 90){
    player.dir *= -1;
  }
  player.pos.y += player.dir * G.PLAYER_SPEED;

  if(input.isJustPressed && bullet!=null){
    explodeBullet();
  }

  if(input.isJustPressed && bullet == null){
    bullet = {pos: vec(player.pos.x,player.pos.y)};
  }

  if(bullet!=null){
    color("light_yellow");  
    bullet.pos.x+= G.BULLET_SPEED;
    box(bullet.pos,2);
  }

  blockArr.forEach( (b) => {

    b.vec.x-= block_speed;
    color("light_cyan");
    box(b.vec,G.BLOCK_SIZE);
    if(b.vec.x < -2 ){
      end();
    }
  });

  handleCollisions();
}


function handleCollisions(){

  remove(bulletFragArr,(frag) => {

    frag.pos.addWithAngle(frag.angle,G.BULLET_FRAG_SPEED);
    color("light_yellow");
    if(box(frag.pos,2).isColliding.rect.light_cyan && isInBounds(frag.pos)){
      return true;
    }
    return false;
  });

  remove(blockArr, (b) => {
    
    color(colors[b.color-1]);
    if(box(b.vec,G.BLOCK_SIZE).isColliding.rect.light_yellow){
      b.color--;
    }
    if(b.color == 0){
      addScore(b.maxColor,b.vec);
      return true;
    }
    color("black");
    text(b.color.toString(),b.vec);
    return false;
  });

}


function generateBlocks(){

  let generatedSquares = new Set();
        let interval = [rndi(5,50),rndi(55,90)];
        let num = rndi(0,8);
        for(var i = 0; i< interval.length;i++){
            let y = interval[i];
            while(!generatedSquares.has(num)){ 

                let currColor = rndi(1,8);
                generatedSquares.add(num);
                let row = Math.floor(num/3);
                let col = num %3;
                let pos = vec(200+col*G.BLOCK_SIZE,y+row*G.BLOCK_SIZE);
                let block = {vec: pos, maxColor: currColor, color: currColor};
                blockArr.push(block);              
                num = rndi(1,8);
            }
            generatedSquares.clear();
        }
}

function explodeBullet(){

  play("powerUp");
  for(let a = 0;a<360;a+= 24){
    bulletFragArr.push({pos: vec(bullet.pos.x,bullet.pos.y), angle: a});
  }
  bullet = null;
}

function isInBounds(vec){
  return (vec.x > 0 && vec.x < G.WIDTH && vec.y > 0 && vec.y < G.HEIGHT);
}

addEventListener("load", onLoad);
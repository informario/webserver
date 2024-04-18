const shipSpeed=2;
const enemySpeed=2;

let ship = {
    x:240,
    y:240,
    moveUp:function(){
      if (this.llegoBorde()==false){
        this.y-=shipSpeed;
      }
    },
    moveDown:function(){
      if (this.llegoBorde()==false){
        this.y+=shipSpeed;
      }
    },
    moveLeft:function(){
      if (this.llegoBorde()==false){
        this.x-=shipSpeed;
      }
    },
    moveRight:function(){
      if (this.llegoBorde()==false){
        this.x+=shipSpeed;
      }
    },
    llegoBorde:function(){
      if(this.x<2){
        this.x=2;
        return true;
      }
      if(this.x>481){
        this.x=481;
        return true;
      }
      if(this.y<2){
        this.y=2;
        return true;
      }
      if(this.y>481){
        this.y=481;
        return true;
      }
      return false;
    }
  };
  class enemy {
    constructor(){
      this.vecx=Math.random() * (2) -1;
      this.vecy=Math.pow((1.0-Math.pow(this.vecx,2)),0.5);
      if(Math.random()>=.5){
        this.vecy=-this.vecy;
      }
      let rnd = Math.random()*479 + 2;
      if(this.vecx>.5){
        this.x=2;
        this.y=rnd;
      }
      else if(this.vecx<=-.5){
        this.x=481;
        this.y=rnd;
      }
      else if(this.vecy>.5){
        this.y=2;
        this.x=rnd;
      }
      else if(this.vecy<=-.5){
        this.y=481;
        this.x=rnd;
      }
      this.vecx*=enemySpeed;
      this.vecy*=enemySpeed;
    }
    moveFoward(){
      this.x+=this.vecx;
      this.y+=this.vecy;
    }
    llegoBorde(){
      if(this.x<2){
        this.x=2;
        return "left";
      }
      if(this.x>481){
        this.x=481;
        return "right";
      }
      if(this.y<2){
        this.y=2;
        return "up";
      }
      if(this.y>481){
        this.y=481;
        return "down";
      }
      return "false";
    }
  };
  let root = document.documentElement;
  let keyboard=[false,false,false,false];
  //              w     s     a     d
  let e=[new enemy, new enemy, new enemy, new enemy];
  let score=0;

  root.addEventListener("keydown", e => {
    switch (e.key) {
      case "w":
        keyboard[0]=true;
      break;
      case "s":
        keyboard[1]=true;
      break;
      case "a":
        keyboard[2]=true;
      break;
      case "d":
        keyboard[3]=true;
      break;
    }  
  });
  root.addEventListener("keyup", e => {
    switch (e.key) {
      case "w":
        keyboard[0]=false;
      break;
      case "s":
        keyboard[1]=false;
      break;
      case "a":
        keyboard[2]=false;
      break;
      case "d":
        keyboard[3]=false;
      break;
    }  
  });

  function detectorDeColisiones(obj1, obj2){
    if(obj1.x>obj2.x-20&&obj1.x<obj2.x+20&&obj1.y>obj2.y-20&&obj1.y<obj2.y+20) return true;
    else return false;
  }
  function gameloop(){
    if(keyboard[0]==true) ship.moveUp();
    if(keyboard[1]==true) ship.moveDown();
    if(keyboard[2]==true) ship.moveLeft();
    if(keyboard[3]==true) ship.moveRight();
    root.style.setProperty('--x-ship', ship.x + "px");
    root.style.setProperty('--y-ship', ship.y + "px");
    for(var i=0; i<4; i++){
        e[i].moveFoward();
        root.style.setProperty('--x-enemy'+i, e[i].x + "px");
        root.style.setProperty('--y-enemy'+i, e[i].y + "px");
        let borde=e[i].llegoBorde();
        if(borde!="false"){
          score++;
          document.getElementById('output').innerHTML = score;
        }
        if(borde=="up"||borde=="down"){
            e[i].vecy=-e[i].vecy;
        }
        if(borde=="left"||borde=="right"){
            e[i].vecx=-e[i].vecx;
        }
        if(detectorDeColisiones(e[i], ship)){
            alert("Perdiste");
            delete e[i];
            e[i]=new enemy;
            score=0;
            document.getElementById('output').innerHTML = score;
            keyboard=[false,false,false,false];
            
        }
    }
    setTimeout(gameloop, 1);
  }
  gameloop();

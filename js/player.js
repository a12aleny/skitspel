var maxXspeed=6;
//var accerleration=1;
var jumpPower = 17;
var gravity=1;

var slow =0.1;
var airSlow = slow*3;//DONT TOUCH
var groundSlow = slow*6;//DONT TOUCH

var player=function (id,name, rect, acceleration, maxXspeed, bullet_speed, bullet_damage, korvcooldown){
  this.korvcooldown = korvcooldown;
  this.eventEmitter;
  this.damage = bullet_damage;
  this.bullet_speed = bullet_speed;
  this.score = 0;
  this.id=id;
  this.acceleration = acceleration;
  this.maxXspeed = maxXspeed;
  this.name=name;
  this.xvel=0;
  this.yvel=0;
  this.tickrightcountertest=0;
  this.hp=100;
  this.coolDown=0;
  this.isStanding=false;
  this.rect=rect;
  this.color=randomColor();
  this.keyMap={left:false,up:false,right:false,down:false};
  
  this.input=function (keyMap,multiplicator){
  if (keyMap.left&&this.xvel>-this.maxXspeed)this.xvel-=(this.acceleration*multiplicator);
  if (keyMap.right&&this.xvel<this.maxXspeed)this.xvel+=(this.acceleration*multiplicator);

  
  if (keyMap.up&&this.isStanding)this.yvel=-jumpPower;
  };
  
  
  this.update=function(objects, spawns, multiplicator){
      
      this.coolDown-=multiplicator*(1000/60);
      var frameXVel = this.xvel*multiplicator;
      var frameYvel = this.yvel*multiplicator;
      
      this.input(this.keyMap,1);

//       this.rect.x=Math.floor(this.rect.x);
//       this.rect.y=Math.floor(this.rect.y);
      this.isStanding=false;
      
      //collision

      var biggestvel= Math.abs(frameXVel)>Math.abs(frameYvel)?Math.floor(Math.abs(frameXVel)):Math.floor(Math.abs(frameYvel));
      for(var ix=0;ix<biggestvel;ix++){


	this.rect.x+=frameXVel/biggestvel;
	this.rect.y+=frameYvel/biggestvel;

	
      for(var i=0;i<objects.length;i++){
	
	objects[i].x=Math.floor(objects[i].x);
	objects[i].y=Math.floor(objects[i].y);
	
	var side=0;
	
	var flooredRect={x:Math.floor(this.rect.x),y:Math.floor(this.rect.y),width:this.rect.width,height:this.rect.height};
	
	while ((side=collision(flooredRect,objects[i]))!=0&&objects[i].id!=this.id){
	  if (side===1){
	     this.rect.y++;
	     flooredRect.y++;
	     this.yvel=0;
	     frameYvel=0;
	  }
	  else if (side===2){
	     this.rect.x--;
	     flooredRect.x--;
	     this.xvel=0;
	     frameXVel=0;
	  }
	  else if (side===3){
	     this.rect.x++;
	     flooredRect.x++;
	     this.xvel=0;
	     frameXVel=0;
	  }
	  else if (side===4){
	    flooredRect.y--;
	     this.rect.y--;
	  }
	}
	}
      }
	
      for(var i=0;i<objects.length;i++){
	if (onGround(this.rect,objects[i])&&this.id!=objects[i].id&&this.yvel>=0){
	  this.isStanding=true;
	  this.yvel=0;
	}
      }
      // slow
      if(!this.isStanding){
	this.yvel+=gravity*multiplicator;
	if (Math.abs(this.xvel)>=airSlow*multiplicator)this.xvel-=(this.xvel/Math.abs(this.xvel)*airSlow*multiplicator);
	else this.xvel=0;
      }
      else {
      	if (Math.abs(this.xvel)>=groundSlow*multiplicator)
	  this.xvel-=(this.xvel/Math.abs(this.xvel)*groundSlow*multiplicator);
	else
	  this.xvel=0;
      }
      if (this.hp<=0)  this.onDead(spawns);
  };
  
  this.onHit=function (blt){
    this.eventEmitter.emit('hit',{pos:{x:blt.rect.x,y:blt.rect.y},color:this.color});
    this.hp-=blt.damage;
  };
  
  this.onDead=function (spawns){
    if (typeof spawns !== 'undefined'){
    var i = Math.floor((Math.random() * (spawns.length)));
    spawn = spawns[i]
    }
    else{
        spawn = {'x':200, 'y':200};
    }
    this.eventEmitter.emit('death',{pos:{x:this.rect.x+this.rect.width/2,y:this.rect.y+this.rect.height/2},color:this.color});
    this.rect={width:30,height:50,x:spawn.x,y:spawn.y};
    this.hp=100;
  };
};
  
//rect = {x:x,y:y,width:width,height: height} default width= 30, default height=50
function collision(rectA,rectB){
if (rectA.x < rectB.x + rectB.width &&
   rectA.x + rectA.width > rectB.x &&
   rectA.y < rectB.y + rectB.height &&
   rectA.height + rectA.y > rectB.y){
  return detectSide(rectA,rectB);
  }
  return 0;
}
//top=1 left=2 right=3 bot=4
function detectSide(rectA,rectB){
  var wy = (rectA.width + rectB.width) * ((rectA.y+rectA.height/2) - (rectB.y+rectB.height/2));
  var hx = (rectA.height + rectB.height) * ((rectA.x+rectA.width/2) - (rectB.x+rectB.width/2));

  if (wy > hx)
      if (wy > - hx)
	  return 1;
      else
	  return 2;
  else
      if (wy > -hx)
	  return 3;
      else
	 return 4;
}

function onGround(playerRect,otherObjects){
  return (collision({x:playerRect.x+2,y:playerRect.y+playerRect.height,width:playerRect.width-4,height:1},otherObjects)!=0)?true:false;
}

function randomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

module.exports.player=player;

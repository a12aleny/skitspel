var maxXspeed=6;
var accerleration=1;
var jumpPower = 15;
var gravity=1;

var slow =0.1;
var airSlow= slow*3;//DONT TOUCH
var groundSlow=slow*6;//DONT TOUCH

var player=function (id,name,rect){
  this.id=id;
  this.xvel=0;
  this.yvel=0;
  this.hp=100;
  this.isStanding=false;
  this.rect=rect;
  this.keyMap;
  this.tickrightcountertest=0;
  
  this.input=function (keyMap,multiplicator){
  if (keyMap.left&&this.xvel>-maxXspeed)this.xvel-=(accerleration*multiplicator);
  if (keyMap.right&&this.xvel<maxXspeed)this.xvel+=(accerleration*multiplicator);
  if (keyMap.up&&this.isStanding)this.yvel=-jumpPower;
  };
  
  this.lurp=function(pos){
    this.rect.x-=(this.rect.x-pos.x)/2;
    this.rect.y-=(this.rect.y-pos.y)/2;
  }
  
  this.update=function(objects,multiplicator){
      
      var frameXVel = this.xvel*multiplicator;
      var frameYvel = this.yvel*multiplicator;
      
      this.input(this.keyMap,multiplicator);

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

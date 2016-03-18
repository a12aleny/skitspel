
var bullet=require('./bullet.js');
var player=require('./player.js').player;
var helper=require('./helpFunctions.js');
var events = require('events');
var fs = require('fs');

function Game (io,room,mapPath){

this.eventEmitter=new events.EventEmitter();
this.mapName=mapPath;
this.io=io;
this.room=room;

this.players=[];
this.bullets=[];

this.lastPlayerState=[];
this.currentPlayerStates=[];
this.minimalplayers=[];

this.newTime;
this.lastFrameTime;
this.oldTime;
this.fpsTimer=0;
this.fpsTicker=0;
this.accumilator=0;
this.wishedFrameRate=1000/45;
fs.readFile('./maps/'+this.mapName+".map",this.initilize.bind(this));
this.eventEmitter.on("death",function(data){
  this.io.to(this.room).emit('addParticle',{pos:data.pos,color:data.color,amount:200});
}.bind(this));
this.eventEmitter.on("hit",function(data){
  this.io.to(this.room).emit('addParticle',{pos:data.pos,color:data.color,amount:7});
}.bind(this));
}

Game.prototype.initilize=function(err,data){

  if (err){
    this.mapInfo={color:"#FFFFFF",map:[{"id":0,"x":-100,"y":-10,"width":100,"height":620},{"id":0,"x":-10,"y":-30,"width":980,"height":30},{"id":0,"x":960,"y":-10,"width":50,"height":560},{"id":0,"x":-10,"y":540,"width":980,"height":50}]};
  }
  else{
    this.mapInfo=JSON.parse(data);
  }
  this.io.to(this.room).emit('map',this.mapInfo);
  this.collisionRectangles=[];
  this.collisionRectangles=this.mapInfo.map.concat();//FEL GÖR OM
  this.mapLenght=this.collisionRectangles.length;
  
  this.Start(this);
};

Game.prototype.Start= function (that){
setInterval(this.Update.bind(that),1000/45);
};

Game.prototype.Update=function (){
  this.newTime = new Date().getTime();
  this.lastFrameTime = isNaN(this.newTime-this.oldTime)?0:this.newTime-this.oldTime;
  this.oldTime=this.newTime;
  var multiplicator= isNaN(this.lastFrameTime/this.wishedFrameRate)?1: this.lastFrameTime/this.wishedFrameRate;
  
  this.fpsTimer+=this.lastFrameTime;
  this.fpsTicker++;
  
  if(this.fpsTimer>1000){
    console.log("room " + this.room + ' had '+ this.fpsTicker +' frames last second.');
    this.fpsTicker=0;
    this.fpsTimer=0;
  }
  
    
  this.collisionRectangles.splice(this.mapLenght,this.collisionRectangles.length-this.mapLenght);

  for (var i =0;i<this.players.length;i++){
    for (var i2 =0;i2<this.players.length;i2++){    //get collisionRectangles
      this.collisionRectangles[this.mapLenght+i2]={id:this.players[i2].id, x:this.players[i2].rect.x,y:this.players[i2].rect.y,width: this.players[i2].rect.width,height: this.players[i2].rect.height};
    }
    //Update Player and make a smaller object
  this.accumilator+=this.lastFrameTime;
  while(this.accumilator>this.wishedFrameRate){
      this.players[i].update(this.collisionRectangles,1);
    this.accumilator-=this.wishedFrameRate;
}

    this.currentPlayerStates[i]={id:this.players[i].id,x:Math.floor(this.players[i].rect.x),y:Math.floor(this.players[i].rect.y), xvel:this.players[i].xvel, yvel:this.players[i].yvel};
}
for (var i=0;i<this.bullets.length;i++){
  this.bullets[i].update(multiplicator,this.collisionRectangles);
  if (this.bullets[i].remove){
    if(this.bullets[i].hitId!=-1){
      for(var i2=0;i2<this.players.length;i2++){
	if (this.players[i2].id===this.bullets[i].hitId)this.players[i2].onHit(this.bullets[i]);
      }
    }
    this.io.to(this.room).emit('addParticle',{pos:{x:this.bullets[i].rect.x,y:this.bullets[i].rect.y},color:"#000000",amount:7});
    this.io.to(this.room).emit('rmBullet',this.bullets[i]);
    this.bullets.splice(i,1);
  }
}
this.sendFrame();
};

var countFps=function(){

  
};

Game.prototype.sendFrame=function(){
  var minimalplayers=[];
  for (var i =0;i<this.currentPlayerStates.length;i++){
    if (this.lastPlayerState[i]!=null){
      if (!(this.currentPlayerStates[i].id===this.lastPlayerState[i].id&&this.currentPlayerStates[i].x===this.lastPlayerState[i].x&&this.currentPlayerStates[i].y===this.lastPlayerState[i].y)){
	  minimalplayers[minimalplayers.length]=this.currentPlayerStates[i];
      }
    }
  }
  this.lastPlayerState=this.currentPlayerStates.slice(0);
  if (minimalplayers.length>0){
    this.io.sockets.to(this.room).emit('players',minimalplayers);
  }
};
module.exports.Game=Game;

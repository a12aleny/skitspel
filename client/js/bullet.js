var bullet=function (id,playerid,vec2Pos,direction){
  this.speed=8;
  this.id=id;
  this.remove=false;
  this.playerid=playerid;
  this.rect={x:vec2Pos.x,y:vec2Pos.y,width:5,height:5}
  this.direction=direction;
  
  this.update=function(multiplicator){
    var frameSpeed=this.speed*multiplicator;
    this.rect.x+=frameSpeed*direction.x;
	this.rect.y+=frameSpeed*direction.y;
	if (this.rect.x<0||this.rect.x>960||this.rect.y<0||this.rect.y>540) this.remove=true;
	}
};
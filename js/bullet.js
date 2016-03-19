var bullet=function (id,playerid,vec2Pos,direction, damage, speed){
  this.speed=speed;
  this.damage = damage;
  this.id=id;
  this.hitId=0;
  this.remove=false;
  this.playerid=playerid;
  this.rect={x:vec2Pos.x,y:vec2Pos.y,width:5,height:5};
  this.direction=direction;
  
  this.update=function(multiplicator,objects){
    var frameSpeed=this.speed*multiplicator;
    this.rect.x+=frameSpeed*direction.x;
    this.rect.y+=frameSpeed*direction.y;
    for(var i=0;i<objects.length;i++){
    if (collision(this.rect,objects[i])&&objects[i].id!=this.id&&objects[i].id!=this.playerid){
      this.remove=true;
      if (objects[i].id!=0)this.hitId=objects[i].id;
	
    }
    }
}
}
function collision(rectA,rectB){
if (rectA.x < rectB.x + rectB.width &&
   rectA.x + rectA.width > rectB.x &&
   rectA.y < rectB.y + rectB.height &&
   rectA.height + rectA.y > rectB.y)  return true;
  return false;
}
module.exports=bullet;
      

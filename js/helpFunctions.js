var fs = require('fs');
module.exports={
  getABSDistance :function(p1,p2){
  return Math.sqrt(Math.pow(Math.abs(p1.x-p2.x),2)+Math.pow(Math.abs(p1.y-p2.y),2));
},
  getLenght :function(p){
  return Math.sqrt(Math.pow(Math.abs(p.x),2)+Math.pow(Math.abs(p.y),2));
},
  getDistance :function(p1,p2){
  return {x:p1.x-p2.x,y:p1.y-p2.y};
  },
    normalize :function(p){
  return {x:p.x/this.getLenght(p),y:p.y/this.getLenght(p)};
  },
  openMap :function(filePath){
  return fs.readFileSync(filePath);
},
  saveMap :function(filePath){
    var mapRects=[];
    mapRects[0]={"id":0,"x":-10,"y":540,"width":500,"height":50}
    
    data={color:"#FF0000",map:mapRects};
    
    fs.writeFile(filePath, JSON.stringify(data), function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
}); 
  }
};

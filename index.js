var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');
var ID = require('./js/id.js');

var gamePort= 3000;

var game=require('./js/testGame.js');
var bullet=require('./js/bullet.js');
var player=require('./js/player.js').player;
var helper=require('./js/helpFunctions.js');

var g=[];
// helper.saveMap("./maps/testsave");

io.on('connect', function(socket){
  var hisG;
  var minimalServers=[];
  var i;

  for(i = 0;i<g.length;i++){
    minimalServers[i]={room:g[i].room,playerCount:g[i].players.length,map:g[i].mapPath};
  }
  
  if (minimalServers!==undefined){
      socket.emit('servers',minimalServers);
  }
    
  var id=ID.id();
  console.log('a '+id+' connected ');
  
  socket.on('joinGame', function(data){
    var room =data.room;
    var map=data.mapPath;

    if (data.playertype == "sniper"){
        var plr=new player(id, data.name, {width:30,height:50,x:200,y:200}, 1, 4, 15, 100, 2500);
    }
    else if (data.playertype == 'homo'){
        var plr=new player(id, data.name, {width:30,height:50,x:200,y:200}, 1.5, 9, 4, 20, 10);
    }

    for(i=0;i<g.length;i++){
      if (g[i].room === room){
	hisG=g[i];
      }
    }
    if (hisG===undefined){
      hisG=new game.Game(io,room,map);
      g[g.length]=hisG;
      
      }
      socket.join(room,function(){
      plr.eventEmitter=hisG.eventEmitter;
      console.log(id+" joined room:"+room);
      hisG.players[hisG.players.length]=plr;
      //plr.spanws = hisG.mapInfo.spawns;
      console.log(hisG.get_mapInfo());
      socket.emit('onConnect',{id:id,players:hisG.players,fps:hisG.wishedFrameRate});
      io.to(room).emit('addPlayer',plr);
      socket.emit('map',hisG.mapInfo);
      
        var scoreboard = [];
    
        for (var i4 = 0; i4 < hisG.players.length; i4++){
            scoreboard[i4] = {"name":hisG.players[i4].name,"score":hisG.players[i4].score};
        }
        io.to(room).emit('update_scoreboard', scoreboard);
    
      socket.on('input', function(keyMap){
	plr.keyMap=keyMap;
      });
      
      socket.on('push test',function(mousePos)
      {
	if (plr.coolDown<0){
	  var blt=new bullet(ID.id(), plr.id,{x:plr.rect.x+(plr.rect.width/2),y:plr.rect.y+(plr.rect.height/2)},helper.normalize(helper.getDistance(mousePos,{x:plr.rect.x+(plr.rect.width/2),y:plr.rect.y+(plr.rect.height/2)})), plr.damage, plr.bullet_speed);
	  hisG.bullets[hisG.bullets.length]=blt;
	  io.to(room).emit('addBullet',blt);//test
	  plr.coolDown=plr.korvcooldown;
	}
      });

      
      socket.on('disconnect', function(){
      io.to(room).emit('rmPlayer',plr);
      console.log(id+' user disconnected from '+room);
      for (i =0;i<hisG.players.length;i++){
      if (hisG.players[i].id===id){
	hisG.players.splice(i,1);
	console.log(id+" removed"); 
	i--;
      }  
      }
      }); 
    });
  });
});

app.get('/', function (req, res) {
  res.sendFile(__dirname+"/client/index.html");
  console.log("index.html sent");
});

app.get('/js/:name', function (req, res) {
  res.sendFile(__dirname+"/client/js/"+req.params.name);
  console.log(req.params.name+" sent");
});
app.get('/textures/:name', function (req, res) {
  res.sendFile(__dirname+"/client/textures/"+req.params.name);
  console.log(req.params.name+" sent");
});

server.listen(gamePort, function (){
  console.log("listening on" + gamePort);
});

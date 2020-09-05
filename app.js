const express = require('express'),
          app = express(),
       server = require('http').createServer(app),
           io = require('socket.io').listen(server)

var port = process.env.PORT || 4000;

//creating the server connection
server.listen(port,function(){
    console.log('server started at the port no :',port);
});
var users = { };

//creating the socket.io connection 
io.sockets.on('connection',function(socket){
    console.log('socket connection established');

    socket.on('new-user',function(data,callback){
        if(data in users){
            console.log("user name already exists");
            callback(false);
        }
        else{
            callback(true);
            socket.nickname=data;
            users[socket.nickname]=socket;
            updateUsers();
        }
    });
    function updateUsers(){
        io.sockets.emit('usernames',Object.keys(users))
    }
    socket.on('disconnect',function(data){
        if(!socket.nickname) return;
        delete users[socket.nickname];
        updateUsers();
     });
     socket.on('send_message',function(data,callback){
            var msg = data.trim();
            if(msg.substr(0,1) === '@'){

            }
            else{
                io.sockets.emit('message_sent',{msg:msg, name:socket.nickname})
            }
     })
});




//seting the use public folder 
app.use(express.static(__dirname + '/public'));

// setting the type of template engine
app.set('view engine','ejs');

app.get('/',function(req,res){
    res.render('index');
});
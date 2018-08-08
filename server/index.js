var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var sta = require('connect-mongo');
var MongoStore = sta(session);


mongoose.connection.on('connected',function(){
    console.log('MongoDB Connected')
})
mongoose.connect(process.env.MONGODB_URI)

io.on('connection', function (socket) {
  socket.on('login', function (data, next) {
    console.log('LOGIN REQUEST', data)
    const {user, pass} = data;

    User.findOne({username: user, password: pass})

    if(user === 'demi' && pass === 'demi') next({loggedIn: true})
    else next({loggedIn: false})
  });
});

server.listen(1337);
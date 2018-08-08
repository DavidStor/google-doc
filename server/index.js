var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
import {User } from './models/models';


io.on('connection', function (socket) {
  socket.on('login', function (data, next) {
    console.log('LOGIN REQUEST', data)
    const {user, pass} = data;

    User.findOne({username: user, password: pass}).then(doc => {
        if(doc) {
            next({user: doc, err: null});
        } else {
            next({user: null, err: null});  
        }

    }).catch(err => {
        next({err});
    })  
  });

  socket.on('register', function (data, next) {
    console.log('Reg REQUEST', data)
    const {user, pass} = data;

    var newUser = new User({username: user, password: pass}).save((err, doc) => {
        
        if(doc) {
            next({user: doc, err: err});
        } else {
            next({user: null, err: err});  
        }
    })
  });
});

server.listen(1337);
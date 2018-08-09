var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
import {User , Document} from './models/models';


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

  socket.on('createNewDoc', function (data, next) {
    console.log('new Doc REQUEST', data)
    const {user, nameOfDoc} = data;

    var newDoc = new Document({author: user, title: nameOfDoc, collabors: [user], content: '' }).save((err, doc) => {
        if(doc) {
            next({document: doc, err: err});
        } else {
            next({document: null, err: err});  
        }
    })
  });

  socket.on('getDocuments', function (data, next) {
    console.log('new Doc REQUEST', data)
    const {user} = data;
    
    Document.find({collabors: {$in:[user]} }).then(listDocs => next({listDocs}))
  });

  socket.on('createDocument', function(data, next) {
    const {user, name} = data;
    new Document({
    author: user,
    collaborators: [user],
      editDate: Date.now(),
      title: name,
      content: ''
    }).save((err, doc) => next({err, doc}))
  });
});

server.listen(1337);
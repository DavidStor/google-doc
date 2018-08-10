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

  socket.on('getDocuments', function (data, next) {
    console.log('new Doc REQUEST', data);
    const {user} = data;
    
    //look throuh the document that belong to the person

   Document.find({collaborators: {$in:[user]} })
   .populate('author')
   .exec()
   .then(listDocs => {
       console.log('docs', listDocs)
       next({listDocs})
    })
  });

  socket.on('createDocument', function(data, next) {
    const {user, name} = data;

    var newDoc = new Document({
    author: user,
    collaborators: [user],
      editDate: Date.now(),
      title: name,
      content: ''
    });

    newDoc.save((err, doc) => next({err, doc}));

    User.findById(user , function(err, userObj) {
        userObj.documents.push(newDoc)
    });
  });

  socket.on('deleteDocument', function(data ,next) {
      const {docId} = data;
      Document.findOneAndRemove({_id: docId}, function (err) {
          if(err) {
              console.log(err);
          }
      });
  });

  socket.on('addDocumentCollaborator', function(data, next) {
      const {docId , user} = data;
      Document.findById( docId , function(err, doc) {
          doc.collaborators.push(user);
          doc.save();
          next({err});
      });
  });

  socket.on('loadDoc', function (data, next) {
    console.log('load Doc REQUEST', data);
    const {docId} = data;
            /*
        TO-DO after changing the one below u don't have to make this
        */
   Document.findById(docId , function(err, document) {
    next({err, document})
   });
 }); 

  socket.on('saveDoc', function(data, next) {
    const {docId , content} = data;
    Document.findById( docId , function(err, document) {
        document.content = content;
        document.save();
        next({err, document});
    });
  });
  socket.on('join', function(room) {
    socket.join(room);
    /*TO-DO when the user joins emit the edit request so that the socket gets the most
    recent version of the socket 
    */
    });

  socket.on('edit', function({room, content}){
    socket.to(room).emit('change', content)
    });
});

server.listen(1337);
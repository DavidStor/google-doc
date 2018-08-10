'use strict';

var _models = require('./models/models');

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);


io.on('connection', function (socket) {
    socket.on('login', function (data, next) {
        console.log('LOGIN REQUEST', data);
        var user = data.user,
            pass = data.pass;


        _models.User.findOne({ username: user, password: pass }).then(function (doc) {
            if (doc) {
                next({ user: doc, err: null });
            } else {
                next({ user: null, err: null });
            }
        }).catch(function (err) {
            next({ err: err });
        });
    });

    socket.on('register', function (data, next) {
        console.log('Reg REQUEST', data);
        var user = data.user,
            pass = data.pass;


        var newUser = new _models.User({ username: user, password: pass }).save(function (err, doc) {

            if (doc) {
                next({ user: doc, err: err });
            } else {
                next({ user: null, err: err });
            }
        });
    });

    socket.on('getDocuments', function (data, next) {
        console.log('new Doc REQUEST', data);
        var user = data.user;

        //look throuh the document that belong to the person

        _models.Document.find({ collaborators: { $in: [user] } }).populate('author').exec().then(function (listDocs) {
            console.log('docs', listDocs);
            next({ listDocs: listDocs });
        });
    });

    socket.on('createDocument', function (data, next) {
        var user = data.user,
            name = data.name;


        var newDoc = new _models.Document({
            author: user,
            collaborators: [user],
            editDate: Date.now(),
            title: name,
            content: ''
        });

        newDoc.save(function (err, doc) {
            return next({ err: err, doc: doc });
        });

        _models.User.findById(user, function (err, userObj) {
            userObj.documents.push(newDoc);
        });
    });

    socket.on('deleteDocument', function (data, next) {
        var docId = data.docId;

        _models.Document.findOneAndRemove({ _id: docId }, function (err) {
            if (err) {
                console.log(err);
            }
        });
    });

    socket.on('addDocumentCollaborator', function (data, next) {
        var docId = data.docId,
            user = data.user;

        _models.Document.findById(docId, function (err, doc) {
            doc.collaborators.push(user);
            doc.save();
            next({ err: err });
        });
    });

    socket.on('loadDoc', function (data, next) {
        console.log('load Doc REQUEST', data);
        var docId = data.docId;
        /*
        TO-DO after changing the one below u don't have to make this
        */

        _models.Document.findById(docId, function (err, document) {
            next({ err: err, document: document });
        });
    });

    socket.on('saveDoc', function (data, next) {
        var docId = data.docId,
            content = data.content;

        _models.Document.findById(docId, function (err, document) {
            document.content = content;
            document.save();
            next({ err: err, document: document });
        });
    });
    socket.on('join', function (room) {
        socket.join(room);
        /*TO-DO when the user joins emit the edit request so that the socket gets the most
        recent version of the socket 
        */
    });

    socket.on('edit', function (_ref) {
        var room = _ref.room,
            content = _ref.content;

        socket.to(room).emit('change', content);
    });
});

server.listen(1337);
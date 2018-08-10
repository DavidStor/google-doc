'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  documents: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Document'
  }]
});

var documentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  collaborators: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  title: String,
  content: String,
  editDate: Date
});

var User = exports.User = mongoose.model('User', userSchema);
var Document = exports.Document = mongoose.model('Document', documentSchema);
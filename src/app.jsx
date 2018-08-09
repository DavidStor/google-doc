import React, {Component, View} from 'react';
import io from 'socket.io-client';
//import Editor from './editor';
import LoginForm from './pages/LoginForm';
import RegistrationForm from './pages/RegistrationForm';
import DocumentList from './pages/DocumentList';
import DocumentEdit from './pages/Document';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      login: '',
      password: '',
      mode: 'login',
      user: null
    }
    this.socket = io('http://localhost:1337');
    this.socket.on('connect', function(){console.log('ws connect')});
    this.socket.on('disconnect', function(){console.log('ws disconnect')});
  }

  // onLogin() {
  //   this.socket.emit('login', {user: this.state.login, pass: this.state.password}, function(result){
  //     console.log('login result:', result);
  //     if(result.err == null && result.user) {
  //       this.setState({user: result.user});
  //       //fix the result.user and figure out what it is and what is result
  //     }
  //   });
  // }

  // onRegister() {
  //   this.socket.emit('register', {user: this.state.login, pass: this.state.password}, function(result){
  //     console.log('reg result:', result);
  //     if(result.err == null && result.user) {
  //       this.setState({user: result.user});
  //     }
  //   });
  // }

  render() {
    if(this.state.mode ==  "docList") {
      return (
        <div style={{height: "100%"}}><DocumentList  user={this.state.user} socket={this.socket} app={this}/></div>
      )
    } else if (this.state.mode == "editor") {
      return (
      <div style={{height: "100%"}}> <DocumentEdit doc={this.state.currentViewDock} socket={this.socket} app={this}/></div>
      )
    } else if(this.state.mode == "login") {
      return (
        <div style={{height: "100%"}}><LoginForm socket={this.socket} app={this}/></div>
      )
    } else if(this.state.mode == "register") {
      return (
        <div style={{height: "100%"}}><RegistrationForm socket={this.socket} app={this}/></div>
      )
    }
  }
}

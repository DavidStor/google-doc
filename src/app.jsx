import React, {Component, View} from 'react';
import io from 'socket.io-client';
//import Editor from './editor';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      login: '',
      password: '',
      mode: 'login',
      user: null
    }
  }

  componentDidMount() {
    this.socket = io('http://localhost:1337');
    this.socket.on('connect', function(){console.log('ws connect')});
    this.socket.on('disconnect', function(){console.log('ws disconnect')});

  }

  onLogin() {
    this.socket.emit('login', {user: this.state.login, pass: this.state.password}, function(result){
      console.log('login result:', result);
      if(result.err == null && result.user) {
        this.setState({user: result.user});
      }
    });
  }

  onRegister() {
    this.socket.emit('register', {user: this.state.login, pass: this.state.password}, function(result){
      console.log('reg result:', result);
      if(result.err == null && result.user) {
        this.setState({user: result.user});
      }
    });
  }

  render() {
    //this.props.app.setSTATE9()
    if(this.state.user) {
      return ( <Editor user={this.state.user} socket={this.socket} app={this}/>)
    } else if(this.state.mode == "login") {
    return (
    
      <div>
      <input value={this.state.login} onChange={(e) => this.setState({login: e.target.value})}></input>
      <input value={this.state.password} onChange={(e) => this.setState({password: e.target.value})}></input>
      <button onClick={() => this.onLogin()}>login</button>
      <button onClick={() => this.setState({mode: "register"})}>Reg</button>
      </div>
    );
  } else if(this.state.mode == "register") {
return (
    <div>
    <input value={this.state.login} onChange={(e) => this.setState({login: e.target.value})}></input>
    <input value={this.state.password} onChange={(e) => this.setState({password: e.target.value})}></input>
    <button onClick={() => this.onLogin()}>login</button>
    <button onClick={() => this.setState({mode: "login"})}>login</button>
    </div>)
  }

  }
}

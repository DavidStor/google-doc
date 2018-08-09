import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';

import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: ''
    };
  }

  handleLogin() {
    let {login, password} = this.state;
    this.props.socket.emit('login', {user: login, pass: password}, (result) => {
      console.log('login result:', result);
      if(result.err == null && result.user) {
        this.props.app.setState({user: result.user, mode: "docList"});
      }
    });
  };

  redirectRegistration() {
    this.props.app.setState({mode: "register"});
  }

  render() {
    return (
      <div style={{height: "100%", width: "100%", backgroundColor: "#eee",  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
        {/* <AppBar title="Login"/> */}
          <Paper zDepth={2}>
            <AppBar title="Login" style={{backgroundColor: "#536dfe", fontFamily: "Trebuchet MS"}}/>
            <div style={{padding: "30px"}}>
          <TextField
            hintText="Username"
            onChange={(e) => this.setState({login: e.target.value})}
            style={{fontFamily: "Trebuchet MS"}}
          />
        <br/>
          <TextField
            hintText="Password"
            type="password"
            onChange={(e) => this.setState({password: e.target.value})}
            style={{fontFamily: "Trebuchet MS"}}
          />
          <br/>
          <div style={{display: "flex", justifyContent: "center"}}>
            <FlatButton style={{margin: 10, fontFamily: "Trebuchet MS", color: "#536dfe"}} label="GO" onClick={() => this.handleLogin()}/>
          </div>
          <div>
            <a onClick={() => this.props.app.setState({mode: "register"})} style={{display: "flex", justifyContent: "center", color: "#536dfe"}}>Don't have an account yet?</a>
          </div>
        </div>
        </Paper>
      </div>
    );
  }
}

export default LoginForm;

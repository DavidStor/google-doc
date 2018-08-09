import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import {indigoA200} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: ''
    };
  }
  handleRegistration() {
    let {login, password} = this.state;
    this.props.socket.emit('register', {user: login, pass: password}, (result) => {
      console.log('register result:', result.err);
      if(result.err == null && result.user) {
        this.props.app.setState({user: result.user, mode: "docList"});
      }
    });
  };

  redirectLogin() {
    this.props.app.setState({mode: "login"});
  }

  render() {
    return (
      <div style={{height: "100%", width: "100%", backgroundColor: "#eee",  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
          <Paper zDepth={2}>
            <AppBar title="Register" style={{backgroundColor: "#ed2f07", fontFamily: "Trebuchet MS"}}/>
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
            style={{fontFamily: "Trebuchet MS", borderColor: "blue"}}
          />
          <br/>
          <div style={{display: "flex", justifyContent: "center"}}>
            <FlatButton style={{margin: 10, fontFamily: "Trebuchet MS", color: "#ed2f07"}} label="CREATE" onClick={() => this.handleRegistration()}/>
          </div>
          <div>
            <a onClick={() => this.props.app.setState({mode: "login"})} style={{display: "flex", justifyContent: "center", color: "#ed2f07"}}>Already have an account?</a>
          </div>
          </div>
        </Paper>
      </div>
    );
  }
}

export default RegistrationForm;

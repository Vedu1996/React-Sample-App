import React, { Component } from 'react'
import { login, resetPassword } from '../helpers/auth'
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import  getDB from '../config/constants'
import App from '../app/App'
function setErrorMsg(error) {
  return {
    loginMessage: error
  }
}

@observer
export default class Login extends Component {
  state = { loginMessage: null }
  @observable dbLogin=false;
  @observable canLogIn=false;
  @action signIn(username, password) {
    if(username&&password){
        getDB().ref('users/'+username)
            .once('value')
            .then((snapshot)=>{
                console.log(snapshot.val());
                ((snapshot.val()===null)||(snapshot.val().password!==password))?
                this.canLogIn=false
                :this.canLogIn=true;
            });

    }
    else{
        console.log('Empty UNPW');
    }
  }
  @action handleSubmit = (e) => {
      console.log(this.dbLogin);
    e.preventDefault()
    if(!this.dbLogin){
        login(this.email.value, this.pw.value)
          .catch((error) => {
              this.setState(setErrorMsg('Invalid username/password.'))
            })
    }
    else{
        this.signIn(this.email.value,this.pw.value)
        this.forceUpdate();
    }
  }
  resetPassword = () => {
    resetPassword(this.email.value)
      .then(() => this.setState(setErrorMsg(`Password reset email sent to ${this.email.value}.`)))
      .catch((error) => this.setState(setErrorMsg(`Email address not found.`)))
  }
  render () {
      return this.canLogIn?
       <App />
      : (
      <div className="col-sm-6 col-sm-offset-3">
        <h1> Login </h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input className="form-control" ref={(email) => this.email = email} placeholder="Email"/>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Password" ref={(pw) => this.pw = pw} />
          </div>
          {
            this.state.loginMessage &&
            <div className="alert alert-danger" role="alert">
              <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
              <span className="sr-only">Error:</span>
              &nbsp;{this.state.loginMessage} <a href="#" onClick={this.resetPassword} className="alert-link">Forgot Password?</a>
            </div>
          }
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        {/* <input type='checkbox' onClick = {this.handleCheck.bind(this)} checked={this.getDBLoginFlag}/>Login with DB credentials */}
      </div>
    )
  }
  @action handleCheck(){
     this.dbLogin=!this.dbLogin;
  }
  @computed get getDBLoginFlag(){
      return this.dbLogin;
  }
  componentWillUnmount(){
      this.dbLogin=false;
  }
}

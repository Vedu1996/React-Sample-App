import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import  getDB from '../config/constants';
import App from '../app/App'

const Welcome = ({user, onSignOut})=> {
  // This is a dumb "stateless" component
  return (
    <div>
      Welcome <strong>{user.username}</strong>!
      <a href="javascript:;" onClick={onSignOut}>Sign out</a>
    </div>
  )
}

class LoginForm extends React.Component {

  // Using a class based component here because we're accessing DOM refs

  handleSignIn(e) {
    e.preventDefault()
    let username = this.refs.username.value
    let password = this.refs.password.value
    this.props.onSignIn(username, password)
  }

  render() {
    alert(process.env.NODE_ENV);
    return (
      <form onSubmit={this.handleSignIn.bind(this)}>
        <h3>Sign in</h3>
        <input type="text" ref="username" placeholder="enter you username" />
        <input type="password" ref="password" placeholder="enter password" />
        <input type="submit" value="Login" />
      </form>
    )
  }

}


@observer
class Login extends Component {
    constructor(){
        super();
    }
    @observable canLogIn;
    @observable user;
    @computed get getUser(){
        return this.user.slice()
    }
    componentWillUpdate(){
        this.user=[];
    }
    @action signIn(username, password) {
      if(username&&password){
          getDB().ref('users/'+username)
              .once('value')
              .then((snapshot)=>{
                  console.log(snapshot.val());
                  ((snapshot.val()===null)||(snapshot.val().password!==password))?
                  this.canLogIn=false
                  :this.canLogIn=true;
                  console.log(this.canLogIn);
                  if(snapshot.val())
                  this.user=Object.values(snapshot.val());
              })
              .then(()=>{
                  console.log(this.user.slice());
              });
      }
      else{
          console.log('Empty UNPW');
      }
    }
    render() {
        console.log('render fired');
        return (
            <div>
        {
          (this.canLogIn) ?
          <App />
          :
            <LoginForm
             onSignIn={this.signIn.bind(this)}
            />
        }
      </div>
        );
    }
    @action signOut(){
      this.canLogIn=false;

    }
    // @observable usersArray = [];
    // @action setUserName(event){
    //     this.userName = event.target.value;
    // }
    // @action setPassword(event){
    //     this.password = event.target.value;
    // }
    // @computed get getUserName(){
    //     return this.userName;
    // }
    // @computed get getUsersFromDb(){
    //      getDB().ref('users/')
    //     .once('value')
    //     .then((snapshot)=>{
    //         console.log(snapshot.val());
    //         (snapshot.val()!==null)?
    //         this.usersArray=Object.values(snapshot.val()).slice()
    //         :this.usersArray=snapshot.val()
    //     }
    //     );
    // }
    // componentWillMount(){
    //     this.getUsersFromDb;
    // }
    // @action onClickHandler(event){
    //
    //     if(this.userName && this.password)
    //     {getDB().ref('users/'+this.userName)
    //         .once('value')
    //         .then((snapshot)=>{
    //             console.log(snapshot.val());
    //             ((snapshot.val()===null)||(snapshot.val().password!==this.password))?
    //             this.canLogIn=false
    //             :this.canLogIn=true;
    //             console.log(this.canLogIn);
    //         });
    //         }
    //     else
    //             {console.log('Empty UNPW');
    //             event.preventDefault();}
    //     // this.userNameTB.value = '';
    //     // this.passwordTB.value = '';
    //     // this.userName = '';
    //     // this.password = '';
    //     // this.getUsersFromDb;
    //     return this.canLogIn;
    // }
}

export default Login;

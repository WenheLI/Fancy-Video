import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import Login from "./components/LoginPage";
import MainPage from "./components/MainPage";
import VideoPage from "./components/VideoPage";

class App extends Component {

   state = {session: '', username: ''};
   
   changeState = (session, username) => {
       this.setState({session, username});
   }

   render() {
    return (
        <div>
            <Route exact path="/" render={
                () => <Login changeState={this.changeState} />
            } />
            <Route  exact path="/main" render={
                () => <MainPage session={this.state.session} username={this.state.username}/>
            }/>
            <Route path="/video/:vid" render={
                () => <VideoPage session={this.state.session} username={this.state.username}/>
            }/>
        </div>
    );
  }
}

export default App;

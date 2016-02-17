require('normalize.css');
require('styles/App.css');

import React from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import ChatLog from './ChatLog';
import ActiveUsers from './ActiveUsers';
import FacebookLogin from 'react-facebook-login';

import API from '../api';

var AppComponent = React.createClass({
  getInitialState: function () {
    return {
      activeUsers: [],

      messageLog: [],

      isLoggedIn: false,

      currentUser: {}
    }
  },


  fetchUsers: function () {
    API.fetchUsers()
      .then(function (json) {
        this.setState({
          activeUsers: json
        });
      }.bind(this));
  },

  fetchUser: function () {
    return API.fetchUser(this.state.currentUser)
      .then(function (json) {
        this.setState({currentUser: json});
      }.bind(this));
  },

  fetchMessages: function () {
    API.fetchMessages(this.state.currentUser)
      .then(function (log) {
        this.setState({
          messageLog: log
        });
      }.bind(this));
  },

  componentWillMount: function () {
    this.fetchUsers();
    setInterval(this.fetchUsers, 3000);

  },

  onSubmit: function (body) {
    var messageLog = this.state.messageLog;
    messageLog.unshift({
      participant: this.state.currentUser,
      date: new Date() + '',
      body: body,
      id: false
    });

    this.setState({
      messageLog: messageLog
    });

    API.sendMessage(body, this.state.currentUser)
  },

  logout: function () {
    this.setState({
      isLoggedIn: false
    },function () {
      FB.logout();
    });
  },

  renderChat: function () {
    var currentUser = this.state.currentUser;
    var chatMessages = this.state.messageLog.map(function (message) {
      var alignRight = (currentUser.fb_id === message.participant.fb_id);

      return (<ChatMessage
        user={message.participant}
        body={message.body}
        date={message.date}
        delivered={message.id}
        key={message.id}
        alignRight={alignRight}
      />)
    });

    return (
      <div className="chat-view">
        <div>Hello, {this.state.currentUser.first_name} | <a href="#" onClick={this.logout}>Logout</a></div>
        <ActiveUsers list={this.state.activeUsers}/>
        <ChatLog>
          {chatMessages}
        </ChatLog>
        <ChatInput onSubmit={this.onSubmit}/>
      </div>
    );
  },

  responseFacebook: function (response) {
    console.log(response);

    var fb_id = response.id;
    var name = response.name.split(' ');
    var first_name = name[0];
    var last_name = name[1];

    this.setState({
      isLoggedIn: true,
      currentUser: {
        fb_id: fb_id,
        first_name: first_name,
        last_name: last_name
      }
    }, this.onLoginComplete);


  },


  onLoginComplete: function () {
    this.fetchUser().then(function () {
      this.fetchMessages();
      setInterval(this.fetchMessages, 2000);
    }.bind(this));
  },


  renderLogin: function () {
    return (
      <div className="login-view">

        <FacebookLogin
          appId="1030499273678445"
          autoLoad={true}
          callback={this.responseFacebook} />

      </div>
    );
  },




  render: function () {
    return (
      <div className="app">
        { this.state.isLoggedIn ? this.renderChat() : this.renderLogin() }
      </div>
    );
  }
});


export default AppComponent;

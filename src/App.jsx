import React, { Component } from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state =
      {
        currentUser: { name: 'Bob' },
        messages: [
          {
            id: '1',
            username: 'Bob',
            content: 'Has anyone seen my marbles?',
          },
          {
            id: '2',
            username: 'Anonymous',
            content: 'No, I think you lost them. You lost your marbles Bob. You lost them for good.'
          }
        ],
        nextMsg: ''
      };
    this.handleChange = this.handleChange.bind(this);
    this.handleEnterPress = this.handleEnterPress.bind(this);
  }

  handleChange(event) {
    const nextMsg = event.target.value;
    this.setState({ nextMsg });
  }

  handleEnterPress(event) {
    const keyPressed = event.key;
    if (keyPressed === 'Enter') {
      const newMsg = {
        id: Math.random(),
        username: this.state.currentUser.name,
        content: this.state.nextMsg,
      }
      this.setState({
        messages: this.state.messages.concat([newMsg])
      });
      const strMsg = JSON.stringify(newMsg);
      this.wss.send(strMsg);
    }
  }

  componentDidMount() {
    this.wss = new WebSocket('ws://0.0.0.0:3001/')
    this.wss.onopen = function (event) {
      console.log('Connected to server');
    }

    console.log('componentDidMount <App />');
    setTimeout(() => {
      console.log('Simulating incoming message');
      // Add a new message to the list of messages in the data store
      const newMessage = { id: 3, username: 'Michelle', content: 'Hello there!' };
      const messages = this.state.messages.concat(newMessage)
      // Update the state of the app component.
      // Calling setState will trigger a call to render() in App and all child components.
      this.setState({ messages: messages })
    }, 3000);
  }

  render() {
    console.log(this.state.nextMsg);
    return (
      <div>
        <div>
          <MessageList messages={this.state.messages} />
        </div>
        <div>
          <ChatBar
            username={this.state.currentUser.name}
            handleChange={this.handleChange}
            handleEnterPress={this.handleEnterPress}
          />
        </div>

      </div>
    );
  }
}


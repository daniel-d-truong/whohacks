import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import MeetingBox from './components/meetingBox.js';
import ChatBox from './components/chatBox.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
          integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
          crossorigin="anonymous"
        />

        <div className="App-header">
          
          {/* this is the flex div */}
          <div className = "gridding">
            <div className="grid_card first">
              <MeetingBox />
            </div>
            <div className = "grid_card">
              <ChatBox />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

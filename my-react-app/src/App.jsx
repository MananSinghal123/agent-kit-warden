import React from 'react';
import ChatBox from './components/ChatBox';
import './App.css';  // Add this import

function App() {
    return (
        <div className="App">
            <h1>Chat with CLI Agent</h1>
            <ChatBox />
        </div>
    );
}

export default App;
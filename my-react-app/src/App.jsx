import React from 'react';
import ChatBox from './components/ChatBox';
import './styles/App.css';

function App() {
    return (
        <div className="App">
            <h1>Chat with CLI Agent</h1>
            <ChatBox />
        </div>
    );
}

export default App;
import React, { useState } from 'react';
import './ChatBox.css';
const InputBox = ({ onSendMessage }) => {
    const [input, setInput] = useState('');

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <form className="input-box" onSubmit={handleSubmit}>
            <input
                type="text"
                value={input}
                onChange={handleChange}
                placeholder="Type a message..."
            />
            <button type="submit">Send</button>
        </form>
    );
};

export default InputBox;
import './App.css';
import { useState } from 'react';

const sendTextMessage = async (msg) => {
  try {
    const response = await fetch('http://localhost:8080', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: `My question to chatgpt: ${msg}` }),
    });
    if (!response.ok) {
      throw new Error(`HTTP POST error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    console.log('POST success');
  } catch (error) {
    console.error(`Error with POST request: ${error}`);
  }
}

function App() {
  const [textBarValue, setTextBarValue] = useState('');
  
  const handleKeyPressed = (KeyboardEvent) => {
    if (KeyboardEvent.key === 'Enter') {
      sendTextMessage(textBarValue)
    }
  }

  const handleTextState = (e) => {
    setTextBarValue(e.target.value);
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="text-bar" >
          <input 
          type='text' 
          onChange={handleTextState}
          onKeyDown={handleKeyPressed}>
          </input>
          <button onClick={() => {sendTextMessage(textBarValue)}}>Send</button>
        </div>
      </header>
    </div>
  );
}

export default App;

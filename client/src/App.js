import './App.css';
import { useState, useRef, useEffect } from 'react';

function App() {
  const [textBarValue, setTextBarValue] = useState('');
  const [messageHistory, setMessageHistory] = useState([]);
  const messageDisplayRef = useRef(null);
  
  const sendTextMessage = async (msg) => {
    if (msg === '') return
    try {
      const response = await fetch('http://localhost:8080', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: msg }),
      });
      if (!response.ok) {
        throw new Error(`HTTP POST error! Status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let streamData = '';
      while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          streamData += decoder.decode(value);
          if (messageHistory.length >= 6) {
            setMessageHistory([...messageHistory.slice(2), msg, streamData])
          } else {
            setMessageHistory([...messageHistory, msg, streamData])
          }
      }
      
      setTextBarValue('');
    } catch (error) {
      console.error(`Error with POST request: ${error}`);
    }
  }

  useEffect(() => {
    if (messageDisplayRef.current) {
      messageDisplayRef.current.scrollTop = messageDisplayRef.current.scrollHeight;
    }
  }, [messageHistory]);

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
      <div className='App-body'>
        <h1>Chat with GPT</h1>
        <div className='message-display scrollable' ref={messageDisplayRef}>
          <ul>
            {messageHistory.map((msg, i) => (
              <li className={`${i % 2 === 0 ? "message right" : "message left"}`} 
              key={i}>{msg}</li>
            )
            )}
          </ul>
        </div>
        <div className="text-bar" >
          <input 
          type='text' 
          onChange={handleTextState}
          onKeyDown={handleKeyPressed}
          value={textBarValue}
          >
          </input>
          <button onClick={() => {sendTextMessage(textBarValue)}}>Send</button>
        </div>
      </div>
      
    </div>
  );
}

export default App;

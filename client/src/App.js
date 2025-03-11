import './App.css';

const apiCall = async () => {
  try {
    const response = await fetch('http://localhost:8080');
    if (!response.ok) {
      throw new Error(`HTTP GET error! Status: ${response.status}`);
    }
    const data = await response.json(); 
    console.log(data);
    console.log('GET success!!');
  } catch (error) {
    console.error(`Error with GET request: ${error}`);
  }
};

const sendTextMessage = async () => {
  try {
    const response = await fetch('http://localhost:8080', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: 'My question to chatgpt' }),
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
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={apiCall}>Make API Call</button>
        <input 
        type='text' 
        onKeyDown={(KeyboardEvent) => {
          if (KeyboardEvent.key === 'Enter') {
            sendTextMessage()
          }
        }}></input>
      </header>
    </div>
  );
}

export default App;

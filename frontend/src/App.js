// App.js

import React, { useState } from 'react';
import { environment } from "./environment";
import './App.css';

function App() {
  const env = environment;
  const [geminikey, setGeminikey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getResponse = async () => {
    setLoading(true);

    try {
      setError(null); // Clear previous errors
      const formData = new FormData();
      formData.append('gemini_api_key', geminikey);
      formData.append('prompt', prompt);

      const response = await fetch(env.fastAPIUrl, {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'include',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();

      // Update state with the response from the backend
      const newPrompt = { user: prompt, bot: responseData.response };
      setResponses([newPrompt]); // Clear previous responses and set the new one
    } catch (error) {
      setError(`Error fetching data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>LLM Chatbot</h1>
      </header>

      <div id="container">
        <div>
          <h4>Enter your key:</h4>
        </div>
        <div id="keyContainer">
          <input
            type="password"
            placeholder="Enter the Geminikey"
            value={geminikey}
            onChange={(e) => setGeminikey(e.target.value)}
          />
        </div>
        <div>
          <h4>Enter your prompt:</h4>
        </div>
        <div id="inputContainer">
          <input
            type="text"
            placeholder="Enter the prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{ height: '100px', marginBottom: '10px' }}
          />
          <div id="responseContainer">
            <h2>Response</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {responses.map((response, index) => (
              <div key={index}>
                <p>
                  <strong>User:</strong> {response.user}
                </p>
                <p>
                  <strong>Bot:</strong> <pre>{response.bot}</pre>
                </p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={getResponse} style={{ backgroundColor: loading ? 'lightgrey' : 'blue', color: 'white' }}>
          {loading ? 'Loading...' : 'Get Response'}
        </button>
      </div>
    </div>
  );
}

export default App; // Export App as the default

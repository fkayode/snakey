import logo from './logo.svg';
import './App.css';
import "./Snake.js"
import Snake from './Snake.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
    
        <Snake />
      </header>
    </div>
  );
}

export default App;

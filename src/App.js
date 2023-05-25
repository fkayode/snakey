import logo from './logo.svg';
import apple from './apple.png';
import bite from './bitten.png';
import './App.css';
import "./Snake.js"
import Snake from './Snake.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="header">Snakey Wakey</div>
        <div className="logo"> <img src={bite} className="apple apple-bitten" />
        <img src={apple} className="apple apple-full"  /></div>
       
       
        
    
       
      </header>
      <Snake />
    </div>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import Hangman from './components/Hangman';
import {useSpring, animated} from 'react-spring'

function App() {
  const props = useSpring({opacity: 1, from: {opacity: 0},Duration:200})
  return (
    <div className="App">
      <Hangman/>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <p style={props}> Welcome to Word of Fortune! Let's Play!
        <animated.div style={props}>I will fade in</animated.div>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

import './App.css';

import Homepage from './components/Homepage/Homepage';
import ErrorRoute from './components/ErrorRoute/ErrorRoute';

// import Hangman from './components/Hangman';

// import {useSpring, animated} from 'react-spring'

// React Router Dom
import {BrowserRouter, Switch, Route} from 'react-router-dom'


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path = '/' component = {Homepage} />
          <Route component = {ErrorRoute} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

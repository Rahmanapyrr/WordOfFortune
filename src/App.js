/** Holds all route information */

import './App.css';

import Homepage from './components/Homepage/Homepage';
import ErrorRoute from './components/ErrorRoute/ErrorRoute';
import Profile from './components/Profile/Profile';

// import Hangman from './components/Hangman';

// React Router Dom
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import SinglePlayer from './components/SinglePlayer/SinglePlayer';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path = '/' component = {Homepage} />
          <Route exact path = '/profile/:uid' component = {Profile} />
          <Route exact path = '/singleplayer' component = {SinglePlayer} />
          <Route component = {ErrorRoute} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

/** Holds all route information */

import './App.css';

import Homepage from './components/Homepage/Homepage';
import ErrorRoute from './components/ErrorRoute/ErrorRoute';
import Profile from './components/Profile/Profile';
import Custom from './components/Custom/Custom';
import Game from './components/SpaceWords/space'

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
          <Route exact path = '/custom' component = {Custom} />
          <Route exact path = '/space' component = {Game}/>
          <Route component = {ErrorRoute} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

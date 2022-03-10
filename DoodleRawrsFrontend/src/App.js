import './App.css';
import Mint from './mint/Mint'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {NavDropdown, Navbar, Nav} from 'react-bootstrap';
import "animate.css/animate.min.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import  Rainbow from './img/rainbow.svg';

import ScrollAnimation from 'react-animate-on-scroll';


export default function App() {
  return (
    <Router>
      <div>
        <div className='nav'>
        <div class="crop-container">
        <img
              src={Rainbow}
              className='rainbow'
              alt="website logo"
            />
        </div>
          <div className='left'>
            <p>
              <span style={{color: '#F6AFCE'}}>D</span>
              <span style={{color: '#FDC998'}}>O</span>
              <span style={{color: '#FAE882'}}>O</span>
              <span style={{color: '#BCDFBC'}}>D</span>
              <span style={{color: '#A0DDF9'}}>L</span>
              <span style={{color: '#C7C4E2'}}>E</span>
              <span style={{color: '#F6AFCE'}}>R</span>
              <span style={{color: '#FDC998'}}>A</span>
              <span style={{color: '#FAE882'}}>W</span>
              <span style={{color: '#BCDFBC'}}>R</span>
              <span style={{color: '#A0DDF9'}}>S</span>
            </p>
          </div>
        </div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/">
            <Mint />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TopBar from './components/TopBar/TopBar.js';
import Country from './components/Country/Country.js';
import CountryInput from './components/Country/CountryInput.js';
import axios from 'axios';
import { FaGlobe } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
const countries = require('../data/borders.json');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.country = React.createRef();
    this.countryInput = React.createRef();
    this.input = React.createRef();
    this.guesses = React.createRef();
    this.countries= []

    this.state = {
      input: "",
      gameStatus: 0,
    }
  };

  componentDidMount() {
    this.getCountries();
    this.getLocalStorage();
  }

  getCountries() {
    for (var i = 0; i < countries.length; i++) {
      this.countries.push(countries[i].name);
    }
  }

  getLocalStorage() {
    var guesses = this.guesses.current.querySelectorAll('div');
    var storedGuesses = JSON.parse(localStorage.getItem('guesses'));
    var gameStatus = localStorage.getItem('gameStatus');
    if (gameStatus != null && gameStatus != 'null') {
      this.setState({ gameStatus: gameStatus });
    }
    if (storedGuesses != null && storedGuesses != 'null') {
      for (var i = 0; i < storedGuesses.length; i++) {
        guesses[i].textContent = storedGuesses[i];
      }
    }
  }

  setLocalStorage(input, progress, gameStatus) {
    localStorage.setItem('progress', progress);
    localStorage.setItem('gameStatus', gameStatus);
    var storedGuesses = JSON.parse(localStorage.getItem('guesses'));
    if (storedGuesses == null || storedGuesses == 'null') {
      localStorage.setItem('guesses', JSON.stringify([input.toUpperCase()]));
    } else {
      storedGuesses.push(input.toUpperCase())
      localStorage.setItem('guesses', JSON.stringify(storedGuesses));
    }
  }

  handleLoss() {
    var country = "COUNTRY GOES HERE"
    axios.post('/getAnswer').then((res) => {
      country = res.data.country;
      toast.error('Answer: ' + country, {
        duration: 5000,
        position: 'top-center',
        style: {},
      });
      this.setState({ gameStatus: -1 })
      localStorage.setItem('gameStatus', -1);
    }).catch((error) => {
      alert(error);
    });
  }

  inCountryList(guess) {
    var valid = false;
    for (var i = 0; i < countries.length; i++) {
      if (countries[i].name.toLowerCase() == guess.toLowerCase()) {
        var valid = true;
        break;
      }
    }
    return valid;
  }

  handleGuess() {
    var conditions = this.country.current.progress < 6 && !this.country.current.inProgress && this.state.gameStatus == 0
    if (conditions && !this.inCountryList(this.state.input)) {
      toast('Not in country list', {
        duration: 1000,
        position: 'top-center',
        style: {},
      });
    } else if (conditions && this.inCountryList(this.state.input)) {
      axios.post('/checkGuess', { guess: this.state.input }, {}).then((res) => {
        var result = res.data.result;
        var input = this.state.input;
        if (result == "VALID") {
          this.countryInput.current.clearInput();
          this.country.current.advance(1, (progress) => {
            var guesses = this.guesses.current.querySelectorAll('div');
            guesses[progress - 1].textContent = input.toUpperCase();
            this.setLocalStorage(input, progress, 0);
            if (progress == 6) this.handleLoss(); //lost
            this.country.current.inProgress = false;
          });
        } else if (result == "CORRECT") { //won
          toast.success('Correct!', {
            duration: 2000,
            position: 'top-center',
            style: {},
          });
          this.countryInput.current.clearInput();
          this.country.current.advance(6 - this.country.current.progress, (progress) => {
            var guesses = this.guesses.current.querySelectorAll('div');
            guesses[progress - 1].textContent = input.toUpperCase();
            this.setLocalStorage(input, progress, 1);
            this.setState({gameStatus: 1});
            this.country.current.inProgress = false;
          });
        }
      })
      .catch((error) => {
        alert(error);
      });
    }
  }

  render() {
    return (
      <div className="main">
        <TopBar/>
        <Toaster />
        <Country
          ref={this.country}
        />
        <div className="flex flex-col items-center pt-3">
          <div ref={this.guesses} className="grid grid-cols-7 gap-1 text-center">
            <div className='guessdiv'></div>
            <div className='guessdiv'></div>
            <div className='guessdiv'></div>
            <div className='guessdiv'></div>
            <div className='guessdiv'></div>
            <div className='guessdiv'></div>
          </div>
          <CountryInput
            ref={this.countryInput}
            options={this.countries}
            onChange={(value) => {
              this.setState({input: value})
            }}
            onEnter={()=>this.handleGuess()}
          />
          <button onClick={()=>this.handleGuess()} type="submit" className="btnguess">
            <FaGlobe
              className="btnicon"
            />Enter answer
          </button>
        </div>
      </div>
    )
  }

}
ReactDOM.render(<App />, document.getElementById('root'));

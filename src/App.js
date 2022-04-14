import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TopBar from './components/TopBar/TopBar.js';
import Country from './components/Country/Country.js';
import CountryInput from './components/Country/CountryInput.js';
import axios from 'axios';
import { FaGlobe } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import { DateTime } from "luxon";

const haversine = require('haversine-distance');
const longlats = require('../data/longlats.json');
const countries = require('../data/borders.json');
class App extends React.Component {
  constructor(props) {
    super(props);

    this.country = React.createRef();
    this.countryInput = React.createRef();
    this.input = React.createRef();
    this.guesses = React.createRef();
    this.countries = [];
    this.answer = "";

    this.state = {
      input: "",
      gameStatus: 0,
    }
  };

  componentDidMount() {
    this.getCountries();
    this.getLocalStorage();

    window.addEventListener('focus', () => {
      axios.post('/getAnswer').then((res) => {
        if (this.answer != res.data.country) {
          window.location.reload();
        }
      }).catch((error) => {
        alert(error);
      });
    }, false);
  }

  getCountries() {
    for (var i = 0; i < countries.length; i++) {
      this.countries.push(countries[i].name);
    }
    axios.post('/getAnswer').then((res) => {
      this.answer = res.data.country;
    }).catch((error) => {
      alert(error);
    });
  }

  getLocalStorage() {
    var utc = DateTime.utc();
    var dateStr = utc.year + "-" + utc.month + "-" + utc.day
    var guesses = this.guesses.current.querySelectorAll('div');
    var data = JSON.parse(localStorage.getItem('data'));
    if (data != null && data != "null" && data != undefined && data[dateStr] != undefined) {
      var gameStatus = data[dateStr].gameStatus;
      var storedGuesses = data[dateStr].guesses;
      if (gameStatus != null && gameStatus != 'null') {
        this.setState({ gameStatus: gameStatus });
      }
      if (storedGuesses != null && storedGuesses != 'null') {
        for (var i = 0; i < storedGuesses.length; i++) {
          guesses[i].textContent = storedGuesses[i];
        }
      }
    }
  }

  setLocalStorage(input, progress, gameStatus) {
    var utc = DateTime.utc();
    var dateStr = utc.year + "-" + utc.month + "-" + utc.day
    var obj = {progress: progress, gameStatus: gameStatus, guesses: null};
    var data = JSON.parse(localStorage.getItem("data"))
    if (data == null || data == "null") {
      data = {};
      data[dateStr] = {};
    } else if (data[dateStr] == undefined) {
      data[dateStr] = {};
    } 
    var storedGuesses = data[dateStr].guesses;
    var newGuesses = [];
    if (storedGuesses == undefined) {
      newGuesses = [input];
    } else {
      storedGuesses.push(input)
      newGuesses = storedGuesses;
    }
    obj.guesses = newGuesses;
    data[dateStr] = obj;
    localStorage.setItem("data", JSON.stringify(data));
  }

  handleLoss() {
    toast.error('Answer: ' + this.answer, {
      duration: 5000,
      position: 'top-center',
      style: {},
    });
    this.setState({ gameStatus: -1 })
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
    var input = this.state.input;
    if (conditions && !this.inCountryList(input)) {
      toast('Not in country list', {
        duration: 1000,
        position: 'top-center',
        style: {},
      });
    } else if (conditions && this.inCountryList(input)) {
      var circ = 40075;
      var rawDistance = haversine(longlats[this.answer.toLowerCase()], longlats[input.toLowerCase()])
      var distance = Math.round(rawDistance / 1000) + "km" + " - " + Math.round((((circ / 2) - Math.round(rawDistance / 1000)) / (circ / 2)) * 100) + "%";
      this.setState({ input: "" });
      if (input.toLowerCase() != this.answer.toLowerCase()) {
        this.countryInput.current.clearInput();
        this.country.current.advance(1, (progress) => {
          var guesses = this.guesses.current.querySelectorAll('div');
          guesses[progress - 1].textContent = input.toUpperCase() + " - " + distance;
          if (progress == 6) { //lost
            this.setLocalStorage(input.toUpperCase() + " - " + distance, progress, -1);
            this.handleLoss();
          } else {
            this.setLocalStorage(input.toUpperCase() + " - " + distance, progress, 0);
          }
          this.country.current.inProgress = false;
        });
      } else if (input.toLowerCase() == this.answer.toLowerCase()) { //won
        toast.success('Correct!', {
          duration: 2000,
          position: 'top-center',
          style: {},
        });
        this.countryInput.current.clearInput();
        this.country.current.advance(6 - this.country.current.progress, (progress) => {
          var guesses = this.guesses.current.querySelectorAll('div');
          guesses[progress - 1].textContent = input.toUpperCase() + " - " + distance;
          this.setLocalStorage(input.toUpperCase() + " - " + distance, progress, 1);
          this.setState({ gameStatus: 1 });
          this.country.current.inProgress = false;
        });
      }
    }
  }

  render() {
    return (
      <div className="main flex items-center flex-col">
        <TopBar/>
        <Toaster />
        <Country
          ref={this.country}
        />
        <div className="flex flex-col items-center pt-3 max-w-[75%] w-full">
          <div ref={this.guesses} className="px-[10%] grid grid-cols-9 gap-1 text-center">
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

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

    this.state = {}
  };

  componentDidMount() {
    this.getCountries();
  }

  getCountries() {
    for (var i = 0; i < countries.length; i++) {
      this.countries.push(countries[i].name);
    }
    console.log(this.countries)
  }

  handleGuess() {
    axios.post('/checkGuess', {guess: this.state.input}, {}).then((res) => {
      var result = res.data.result;
      if (result == "VALID") {
        var input = this.state.input;
        this.countryInput.current.clearInput();
        this.country.current.advance((progress) => {
          var guesses = this.guesses.current.querySelectorAll('div');
          guesses[Math.round(progress)-1].textContent = input.toUpperCase();
        });
      } else if (result == "CORRECT") {
        toast('Correct!', {
          duration: 2000,
          position: 'top-center',
          style: {},
          icon: '✅',
        });
        var input = this.state.input;
        this.countryInput.current.clearInput();
        this.country.current.completeAnimation((progress) => {
          var guesses = this.guesses.current.querySelectorAll('div');
          guesses[Math.round(progress)-1].textContent = input.toUpperCase();
        });
      } else {
        toast('Not in country list', {
          duration: 1000,
          position: 'top-center',
          style: {},
        });
      }
    })
    .catch((error) => {
      alert(error)
    })

  }
  handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      this.handleGuess()
    }
  }
  render() {
    return (
      <div className="main">
        <TopBar/>
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

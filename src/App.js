import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TopBar from './components/TopBar/TopBar.js';
import Country from './components/Country/Country.js';
import axios from 'axios';
import { FaGlobe } from "react-icons/fa";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.country = React.createRef();
    this.input = React.createRef();
    this.guesses = React.createRef();

    this.state = {
      input: "",
    }
  };

  handleGuess() {
    axios.post('/checkGuess', {guess: this.state.input}, {}).then((res) => {
      var result = res.data.result;
      if (result == "VALID") {
        var input = this.state.input;
        this.setState({input: ""});
        this.country.current.advance((progress) => {
          var guesses = this.guesses.current.querySelectorAll('div');
          guesses[Math.round(progress)-1].textContent = input.toUpperCase();
        });
      } else if (result == "CORRECT") {
        alert(result);
        var input = this.state.input;
        this.setState({input: ""});
        this.country.current.completeAnimation((progress) => {
          var guesses = this.guesses.current.querySelectorAll('div');
          guesses[Math.round(progress)-1].textContent = input.toUpperCase();
        });
      } else {
        alert("Not in country list");
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
          <input value={this.state.input} onChange={(evt)=>this.setState({input: evt.target.value})} maxLength="56" minLength="2" type="text" className="input" onKeyPress={this.handleKeyPress} placeholder="Enter Country"></input>
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

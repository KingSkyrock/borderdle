import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TopBar from './components/TopBar/TopBar.js';
import Country from './components/Country/Country.js';
import axios from 'axios';
import { Twemoji } from "@teuteuf/react-emoji-render";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.country = React.createRef();
    this.input = React.createRef();
    this.guesses = React.createRef();

    this.state = {
      paths: [],
      input: "",
    }
  };

  componentDidMount() {
    axios.post('/getCountryPath').then((res) => {
      console.log(res.data.paths)
    })
    .catch((error) => {
      alert(error)
    })
  }

  testFunction() {
    axios.post('/getCountryPath').then((res) => {
      console.log(res.data.paths)
    })
    .catch((error) => {
      alert(error)
    })
  }

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
      } else {
        alert("Not in country list");
      }
    })
    .catch((error) => {
      alert(error)
    })

  }

  render() {
    return (
      <div className="w-full h-full bg-cover bg-[#1d8543]">
        <TopBar/>
        <Country
          ref={this.country}
          paths={this.state.paths}
        />
        <div className="flex flex-col items-center pt-3">
          <div ref={this.guesses} className="grid grid-cols-7 gap-1 text-center">
            <div className='px-[228px] col-span-7 h-8 bg-[#85e4a8] dark:bg-slate-600 rounded'></div>
            <div className='px-[228px] col-span-7 h-8 bg-[#85e4a8] dark:bg-slate-600 rounded'></div>
            <div className='px-[228px] col-span-7 h-8 bg-[#85e4a8] dark:bg-slate-600 rounded'></div>
            <div className='px-[228px] col-span-7 h-8 bg-[#85e4a8] dark:bg-slate-600 rounded'></div>
            <div className='px-[228px] col-span-7 h-8 bg-[#85e4a8] dark:bg-slate-600 rounded'></div>
            <div className='px-[228px] col-span-7 h-8 bg-[#85e4a8] dark:bg-slate-600 rounded'></div>
          </div>
          <input value={this.state.input} onChange={(evt)=>this.setState({input: evt.target.value})} maxLength="56" minLength="2" type="text" className="outline-none border-2 border-neutral-100 focus:border-neutral-300 mt-3 w-[464px] h-8 bg-[#3fb66b] dark:bg-slate-600 rounded text-neutral-100 text-lg text-center	placeholder:text-center placeholder:text-green-100 placeholder:text-lg" placeholder="Enter Country"></input>
          <button onClick={()=>this.handleGuess()} type="submit" className="px-[140px] text-neutral-200 rounded font-bold p-1 flex items-center justify-center border-2 uppercase my-0.5 bg-[#126130] hover:bg-[#0f5328] active:bg-[#147236] text-xl">
            <Twemoji
              text="🌐"
              options={{ className: "inline-block" }}
              className="flex items-center justify-center pr-1"
            />Enter answer
          </button>
          <button onClick={()=>this.testFunction()}>sawds</button>
        </div>
      </div>
    )
  }

}
ReactDOM.render(<App />, document.getElementById('root'));

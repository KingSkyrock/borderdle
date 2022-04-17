import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import TopBar from './components/Header/TopBar.js';
import Country from './components/Country/Country.js';
import CountryInput from './components/Country/CountryInput.js';
import axios from 'axios';
import { FaGlobe } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import { DateTime } from "luxon";
import ReactTooltip from 'react-tooltip';
import InfoBtn from "./components/Header/InfoBtn.js";
import SettingsBtn from "./components/Header/SettingsBtn.js";
import GithubBtn from "./components/Header/GithubBtn.js"
import StatsBtn from "./components/Header/StatsBtn.js";
import { Twemoji } from 'react-emoji-render';
import CountUp from 'react-countup';

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
      arrows: ["", "", "", "", "", "", ""],
      percent: [0, 0, 0, 0, 0, 0, 0],
      gameStatus: 0,
      shownGuesses: 0,
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
    var data = JSON.parse(localStorage.getItem('data'));
    if (data != null && data != "null" && data != undefined && data[dateStr] != undefined) {
      var gameStatus = data[dateStr].gameStatus;
      var storedGuesses = data[dateStr].guesses;
      if (gameStatus != null && gameStatus != 'null') {
        this.setState({ gameStatus: gameStatus });
      }
      if (storedGuesses != null && storedGuesses != 'null') {
        for (var i = 0; i < storedGuesses.length; i++) {
          this.displayGuess(i + 1, storedGuesses[i])
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
  
  bearing(a, b) {
    var lat1 = a[1] * Math.PI / 180;
    var lng1 = a[0] * Math.PI / 180;
    var lat2 = b[1] * Math.PI / 180;
    var lng2 = b[0] * Math.PI / 180;
    var distLng = (lng2 - lng1)
    var distLat = Math.log(Math.tan(Math.PI / 4 + lat2 / 2) / Math.tan(Math.PI / 4 + lat1 / 2));
    if (Math.abs(distLng) > Math.PI) distLng = -(2 * Math.PI - distLng);
    var theta = Math.atan2(distLng, distLat) * 180 / Math.PI;
    while (theta < 0) {
      theta += 360;
    }
    return theta;
  }

  compass(bearing) {
    if (bearing <= 67.5 && bearing > 22.5) {
      return "↗️"
    } else if (bearing <= 112.5 && bearing > 67.5) {
      return "➡️"
    } else if (bearing <= 157.5 && bearing > 112.5) {
      return "↘️"
    } else if (bearing <= 202.5 && bearing > 157.5) {
      return "⬇️"
    } else if (bearing <= 247.5 && bearing > 202.5) {
      return "↙️"
    } else if (bearing <= 292.5 && bearing > 247.5) {
      return "⬅️"
    } else if (bearing <= 337.5 && bearing > 292.5) {
      return "↖️"
    } else if (bearing <= 360 && bearing > 337.5 || bearing <= 22.5 && bearing >= 0) {
      return "⬆️"
    }
  }

  handleLoss() {
    toast.error('Answer: ' + this.answer, {
      duration: 5000,
      position: 'top-center',
      style: {},
    });
    this.setState({ gameStatus: -1 })
  }

  handleGuess() {
    var conditions = this.country.current.progress < 7 && !this.country.current.inProgress && this.state.gameStatus == 0
    var input = this.state.input;
    if (conditions && !this.inCountryList(input)) {
      toast('Not in country list', {
        duration: 1000,
        position: 'top-center',
        style: {},
      });
    } else if (conditions && this.inCountryList(input)) {
      var circ = 40075;
      var rawDistance = haversine(longlats[this.answer.toLowerCase()], longlats[input.toLowerCase()]);
      var bearing = this.bearing(longlats[input.toLowerCase()], longlats[this.answer.toLowerCase()]);
      var direction = this.compass(bearing);
      var distance = Math.round(rawDistance / 1000) + "km" + " - " + Math.round((((circ / 2) - Math.round(rawDistance / 1000)) / (circ / 2)) * 100) + " - " + direction + " - " + Math.round(bearing);
      this.setState({ input: "" });
      if (input.toLowerCase() != this.answer.toLowerCase()) {
        this.countryInput.current.clearInput();
        this.country.current.advance(1, (progress) => {
          this.displayGuess(progress, input.toUpperCase() + " - " + distance)
          if (progress == 7) { //lost
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
          this.displayGuess(progress, input.toUpperCase() + " - " + distance)
          this.setLocalStorage(input.toUpperCase() + " - " + distance, progress, 1);
          this.setState({ gameStatus: 1 });
          this.country.current.inProgress = false;
        });
      }
    }
  }

  displayGuess(progress, info) {
    this.setState({shownGuesses: progress}, () => {
      var guesses = this.guesses.current.querySelectorAll('.guessdiv');
      guesses[progress - 1].querySelector('.name').textContent = info.split(" - ")[0];
      guesses[progress - 1].querySelector('.distance').textContent = info.split(" - ")[1];
      guesses[progress - 1].querySelector('.bearing').textContent = info.split(" - ")[4] + "°";
      var arrows = this.state.arrows;
      var percent = this.state.percent;
      arrows[progress - 1] = info.split(" - ")[3];
      percent[progress - 1] = parseInt(info.split(" - ")[2]);
      this.setState({ arrows: arrows, percent: percent})
    })
  }

  render() {
    return (
      <div className="main">
        <div className="w-full max-w-lg flex flex-col">
          <header className="border-b-2 px-3 border-gray-200 flex">
            <GithubBtn/>
            <InfoBtn/>
            <h1 className="lgw">
              Bord<span className="text-dle">le</span>
            </h1>
            <StatsBtn/>
            <SettingsBtn/>
          </header>
          <Toaster />
          <div className='game'>
            <Country ref={this.country}/>
            <div ref={this.guesses} className="grid grid-cols-7 gap-1 text-center">
              <div className='guessdiv'>
                {this.state.shownGuesses > 0 &&
                  <>
                    <span className='name'></span>
                    <span className='distance'></span>
                    <span className='percent'><CountUp end={this.state.percent[0]}/>%</span>
                    <span data-tip data-for='t1' className='direction'><Twemoji className="directionEmoji" svg text={this.state.arrows[0]} /></span>
                    <ReactTooltip id='t1'>
                      <span className='bearing'></span>
                    </ReactTooltip>
                  </>
                }
              </div>
              <div className='guessdiv'>
                {this.state.shownGuesses > 1 &&
                  <>
                    <span className='name'></span>
                    <span className='distance'></span>
                    <span className='percent'><CountUp end={this.state.percent[1]} />%</span>
                    <span data-tip data-for='t1' className='direction'><Twemoji className="directionEmoji" svg text={this.state.arrows[1]} /></span>
                    <ReactTooltip id='t1'>
                      <span className='bearing'></span>
                    </ReactTooltip>
                  </>
                }
              </div>
              <div className='guessdiv'>
                {this.state.shownGuesses > 2 &&
                  <>
                    <span className='name'></span>
                    <span className='distance'></span>
                    <span className='percent'><CountUp end={this.state.percent[2]} />%</span>
                    <span data-tip data-for='t2' className='direction'><Twemoji className="directionEmoji" svg text={this.state.arrows[2]} /></span>
                    <ReactTooltip id='t2'>
                      <span className='bearing'></span>
                    </ReactTooltip>
                  </>
                }
              </div>
              <div className='guessdiv'>
                {this.state.shownGuesses > 3 &&
                  <>
                    <span className='name'></span>
                    <span className='distance'></span>
                    <span className='percent'><CountUp end={this.state.percent[3]} />%</span>
                    <span data-tip data-for='t4' className='direction'><Twemoji className="directionEmoji" svg text={this.state.arrows[3]} /></span>
                    <ReactTooltip id='t4'>
                      <span className='bearing'></span>
                    </ReactTooltip>
                  </>
                }
              </div>
              <div className='guessdiv'>
                {this.state.shownGuesses > 4 &&
                  <>
                    <span className='name'></span>
                    <span className='distance'></span>
                    <span className='percent'><CountUp end={this.state.percent[4]} />%</span>
                    <span data-tip data-for='t5' className='direction'><Twemoji className="directionEmoji" svg text={this.state.arrows[4]} /></span>
                    <ReactTooltip id='t5'>
                      <span className='bearing'></span>
                    </ReactTooltip>
                  </>
                }
              </div>
              <div className='guessdiv'>
                {this.state.shownGuesses > 5 &&
                  <>
                    <span className='name'></span>
                    <span className='distance'></span>
                    <span className='percent'><CountUp end={this.state.percent[5]} />%</span>
                    <span data-tip data-for='t6' className='direction'><Twemoji className="directionEmoji" svg text={this.state.arrows[5]} /></span>
                    <ReactTooltip id='t6'>
                      <span className='bearing'></span>
                    </ReactTooltip>
                  </>
                }
              </div>
              <div className='guessdiv'>
                {this.state.shownGuesses > 6 &&
                  <>
                    <span className='name'></span>
                    <span className='distance'></span>
                    <span className='percent'><CountUp end={this.state.percent[6]} />%</span>
                    <span data-tip data-for='t7' className='direction'><Twemoji className="directionEmoji" svg text={this.state.arrows[6]} /></span>
                    <ReactTooltip id='t7'>
                      <span className='bearing'></span>
                    </ReactTooltip>
                  </>
                }
              </div>
            </div>
            <div className="mt-2">
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
        </div>
    </div>
    )
  }

}
ReactDOM.render(<App />, document.getElementById('root'));

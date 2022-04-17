import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import TopBar from './components/Header/TopBar.js';
import Country from './components/Country/Country.js';
import CountryInput from './components/Country/CountryInput.js';
import GuessContainer from './components/Country/GuessContainer.js';
import axios from 'axios';
import { FaGlobe } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import { DateTime } from "luxon";
import InfoBtn from "./components/Header/InfoBtn.js";
import SettingsBtn from "./components/Header/SettingsBtn.js";
import GithubBtn from "./components/Header/GithubBtn.js"
import StatsBtn from "./components/Header/StatsBtn.js";

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
      names: ["", "", "", "", "", "", ""],
      distances: ["", "", "", "", "", "", ""],
      percent: [0, 0, 0, 0, 0, 0, 0],
      arrows: ["", "", "", "", "", "", ""],
      bearings: ["", "", "", "", "", "", ""],
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
      var names = this.state.names;
      var distances = this.state.distances;
      var percent = this.state.percent;
      var arrows = this.state.arrows;
      var bearings = this.state.bearings;
      names[progress - 1] = info.split(" - ")[0];
      distances[progress - 1] = info.split(" - ")[1];
      percent[progress - 1] = parseInt(info.split(" - ")[2]);
      arrows[progress - 1] = info.split(" - ")[3];
      bearings[progress - 1] = info.split(" - ")[4] + "°";
      
      this.setState({ names: names, distances: distances, percent: percent, arrows: arrows, bearings: bearings })
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
              {[0,1,2,3,4,5,6].map(n => {
                return (
                  <GuessContainer
                    shown={this.state.shownGuesses > n}
                    num={n}
                    percent={this.state.percent[n]}
                    arrow={this.state.arrows[n]}
                    name={this.state.names[n]}
                    distance={this.state.distances[n]}
                    bearing={this.state.bearings[n]}
                  />
                )
              })}
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

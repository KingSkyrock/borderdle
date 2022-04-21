import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
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
import { Twemoji } from 'react-emoji-render';

const haversine = require('haversine-distance');
const longlats = require('../data/longlats.json');
const countries = require('../data/borders.json');
const data = require('../data/data.json');
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
    for (let i = 0; i < countries.length; i++) {
      this.countries.push(countries[i].name);
    }
    axios.post('/getAnswer').then((res) => {
      this.answer = res.data.country;
    }).catch((error) => {
      alert(error);
    });
  }

  getLocalStorage() {
    let utc = DateTime.utc();
    let dateStr = utc.year + "-" + utc.month + "-" + utc.day
    let data = JSON.parse(localStorage.getItem('data'));
    if (data != null && data != "null" && data != undefined && data[dateStr] != undefined) {
      let gameStatus = data[dateStr].gameStatus;
      let storedGuesses = data[dateStr].guesses;
      if (gameStatus != null && gameStatus != 'null') {
        this.setState({ gameStatus: gameStatus });
      }
      if (storedGuesses != null && storedGuesses != 'null') {
        for (let i = 0; i < storedGuesses.length; i++) {
          this.displayGuess(i + 1, storedGuesses[i])
        }
      }
    }
  }

  setLocalStorage(input, progress, gameStatus) {
    const utc = DateTime.utc();
    const dateStr = utc.year + "-" + utc.month + "-" + utc.day
    let obj = {progress: progress, gameStatus: gameStatus, guesses: null};
    let data = JSON.parse(localStorage.getItem("data"))
    if (data == null || data == "null") {
      data = {};
      data[dateStr] = {};
    } else if (data[dateStr] == undefined) {
      data[dateStr] = {};
    } 
    let storedGuesses = data[dateStr].guesses;
    let newGuesses = [];
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
    let valid = false;
    for (let i = 0; i < countries.length; i++) {
      if (countries[i].name.toLowerCase() == guess.toLowerCase()) {
        valid = true;
        break;
      }
    }
    return valid;
  }
  
  bearing(a, b) {
    const lat1 = a[1] * Math.PI / 180;
    const lng1 = a[0] * Math.PI / 180;
    const lat2 = b[1] * Math.PI / 180;
    const lng2 = b[0] * Math.PI / 180;
    let distLng = (lng2 - lng1)
    const distLat = Math.log(Math.tan(Math.PI / 4 + lat2 / 2) / Math.tan(Math.PI / 4 + lat1 / 2));
    if (Math.abs(distLng) > Math.PI) distLng = -(2 * Math.PI - distLng);
    let theta = Math.atan2(distLng, distLat) * 180 / Math.PI;
    while (theta < 0) {
      theta += 360;
    }
    return theta;
  }

  compass(bearing, emoji) {
    bearing = parseInt(bearing);
    if (bearing <= 67.5 && bearing > 22.5) {
      return emoji ? "↗️" : "2197"
    } else if (bearing <= 112.5 && bearing > 67.5) {
      return emoji ? "➡️" : "27a1"
    } else if (bearing <= 157.5 && bearing > 112.5) {
      return emoji ? "↘️" : "2198"
    } else if (bearing <= 202.5 && bearing > 157.5) {
      return emoji ? "⬇️" : "2b07"
    } else if (bearing <= 247.5 && bearing > 202.5) {
      return emoji ? "↙️" : "2199"
    } else if (bearing <= 292.5 && bearing > 247.5) {
      return emoji ? "⬅️" : "2b05"
    } else if (bearing <= 337.5 && bearing > 292.5) {
      return emoji ? "↖️" : "2196"
    } else if (bearing <= 360 && bearing > 337.5 || bearing <= 22.5 && bearing >= 0) {
      return emoji ? "⬆️" : "2b06"
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

  getSquares(percent) {
    let squares = new Array(5);
    let greenCount = Math.floor(percent / 20);
    let yellowCount = percent - greenCount * 20 >= 10 ? 1 : 0;
    squares.fill("🟩", 0, greenCount);
    squares.fill("🟨", greenCount, greenCount + yellowCount);
    squares.fill("⬛", greenCount + yellowCount);
    return squares.join("");
  }

  handleShare() {
    let text = `🌐 Bordle ${data.num + 1} ${this.state.shownGuesses}/7 🌐
${this.state.shownGuesses > 0 ? this.getSquares(this.state.percent[0]) + this.compass(this.state.bearings[0], true) : ""}
${this.state.shownGuesses > 1 ? this.getSquares(this.state.percent[1]) + this.compass(this.state.bearings[1], true) : ""}
${this.state.shownGuesses > 2 ? this.getSquares(this.state.percent[2]) + this.compass(this.state.bearings[2], true) : ""}
${this.state.shownGuesses > 3 ? this.getSquares(this.state.percent[3]) + this.compass(this.state.bearings[3], true) : ""}
${this.state.shownGuesses > 4 ? this.getSquares(this.state.percent[4]) + this.compass(this.state.bearings[4], true) : ""}
${this.state.shownGuesses > 5 ? this.getSquares(this.state.percent[5]) + this.compass(this.state.bearings[5], true) : ""}
${this.state.shownGuesses > 6 ? this.getSquares(this.state.percent[6]) + this.compass(this.state.bearings[6], true) : ""}`.trim() + "\nWEBSITE";
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard.', {
        duration: 2000,
        position: 'top-center',
        style: {},
      });
    }, () => {
      var textArea = document.createElement("textarea");
      textArea.value = text;

      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      textArea.style.display = "none";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand('copy');

        toast.success('Copied to clipboard.', {
          duration: 2000,
          position: 'top-center',
          style: {},
        });
      } catch (err) {
        alert("you bad");
      }
    });
  }

  handleGuess() {
    const conditions = this.country.current.progress < 7 && !this.country.current.inProgress && this.state.gameStatus == 0
    const input = this.state.input;
    if (conditions && !this.inCountryList(input)) {
      toast('Not in country list', {
        duration: 1000,
        position: 'top-center',
        style: {},
      });
    } else if (conditions && this.inCountryList(input)) {
      const circ = 40075;
      const rawDistance = haversine(longlats[this.answer.toLowerCase()], longlats[input.toLowerCase()]);
      const bearing = this.bearing(longlats[input.toLowerCase()], longlats[this.answer.toLowerCase()]);
      const direction = this.compass(bearing, false);
      const distance = Math.round(rawDistance / 1000) + "km" + " - " + Math.round((((circ / 2) - Math.round(rawDistance / 1000)) / (circ / 2)) * 100) + " - " + direction + " - " + Math.round(bearing);
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
      let names = this.state.names;
      let distances = this.state.distances;
      let percent = this.state.percent;
      let arrows = this.state.arrows;
      let bearings = this.state.bearings;
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
        <div className="inmain">
          <header className="header">
           <GithubBtn/>
            <InfoBtn/>
            <h1 className="headle">
              Bord<span className="text-dle">le</span>
            </h1>
            <StatsBtn/>
            <SettingsBtn/>
          </header>
          <Toaster />
          <div className='game'>
            <Country ref={this.country}/>
            <div ref={this.guesses} className="guessrow">
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
              {(this.state.gameStatus ? true : false) &&
                <>
                  <button onClick={()=>this.handleShare()} className="sharebutton">share</button>
                </>
              }
              <CountryInput
                ref={this.countryInput}
                options={this.countries}
                onChange={(value) => {
                  this.setState({input: value})
                }}
                gameStatus={this.state.gameStatus}
                onEnter={()=>this.handleGuess()}
              />
              {(this.state.gameStatus ? false : true) &&
                <>
                  <button onClick={() => this.handleGuess()} className="btnguess">
                    <FaGlobe
                      className="btnicon"
                    />Enter answer
                  </button>
                </>
              }
            </div>
          </div>
          <footer className="footer footertext">
            <Twemoji
              text="❤️"
              className="footer mr-1"
            />
            <span className="footerdle">BOR<span className="text-dle mr-[0.125rem]">DLE</span>?</span>
              <a
                className="pl-1"
                href="https://www.ko-fi.com/underscorelior"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-max">
                  <Twemoji
                    text="- Buy us a coffe! ☕"
                    className='footer footerkofi'
                  />
                </div>
              </a>
          </footer>
        </div>
    </div>
    )
  }

}
ReactDOM.render(<App />, document.getElementById('root'));

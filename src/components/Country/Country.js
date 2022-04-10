import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import JsxParser from 'react-jsx-parser';
import { gsap } from 'gsap'
import axios from 'axios';
class Path {
  constructor(border, tl) {
    this.border = border
    this.tl = tl

    this.border.setAttribute('stroke-dasharray', this.border.getTotalLength());
    this.border.setAttribute('stroke-dashoffset', this.border.getTotalLength());
    this.tl.to(this.border, {
      strokeDashoffset: 0,
      duration: 6,
      ease: "none",
    });
    this.tl.pause()
  }

}

class Timer {
  timerId; start; remaining; callback;
  constructor(callback, delay) {
    this.remaining = delay;
    this.callback = callback;
    this.resume();
  }
  pause() {
    window.clearTimeout(this.timerId);
    this.timerId = null;
    this.remaining -= Date.now() - this.start;
  };

  resume() {
    if (this.timerId) return;

    this.start = Date.now();
    this.timerId = window.setTimeout(this.callback, this.remaining);
  };
}
export default class Country extends React.Component {

  constructor(props) {
    super(props);
    this.progress = 0;
    this.inProgress = false;
    this.timer = null;
    this.duration = 6000;
    this.pathArray = [];
    this.svg = React.createRef();

    this.state = {
      paths: ""
    }
  };

  componentDidMount() {
    axios.post('/getCountryPath').then((res) => {
      this.setState({paths: res.data.paths}, ()=> {
        var borders = document.querySelector('.jsx-parser').querySelector('svg').querySelector('g').querySelectorAll('path');
        for (var i = 0; i < borders.length; i++) {
          this.pathArray.push(new Path(borders[i], gsap.timeline()))
        }
        //gsap.ticker.lagSmoothing(false)
        window.addEventListener('blur', () => {
          if (this.timer != null) {
            this.timer.pause();
            for (var i = 0; i < this.pathArray.length; i++) {
              this.pathArray[i].tl.pause();
            }
          }
        }, false);

        window.addEventListener('focus', () => {
          if (this.timer != null) {
            this.timer.resume();
            for (var i = 0; i < this.pathArray.length; i++) {
              this.pathArray[i].tl.resume();
            }
          }
        }, false);

        if (localStorage.getItem('gameStatus') == 1) {
          this.advance(6 - this.progress, (progress) => {
            this.inProgress = false;
          });
        } else {
          this.advance(localStorage.getItem('progress'), () => {
            this.inProgress = false;
          });
        }
      })
    })
    .catch((error) => {
      alert(error)
    })
  }

  advance(multiplier, callback = (progress) => { }) {
    if (this.progress < 6 && this.timer == null && multiplier > 0) {
      this.inProgress = true;
      for (var i = 0; i < this.pathArray.length; i++) {
        this.pathArray[i].tl.resume();
      }
      callback(this.progress + 1);
      this.timer = new Timer(()=> {
        for (var i = 0; i < this.pathArray.length; i++) {
          this.pathArray[i].tl.pause();
        }
        this.progress += 1*multiplier;
        this.timer = null;
       }, this.duration / 6 * multiplier)
     }
  }

  render() {
    return (
      <div className="flex flex-col items-center pt-3">
        <JsxParser
          className={'jsx-parser'}
          jsx={this.state.paths+"</g></svg>"}
          disableKeyGeneration={true}
        />
      </div>
    )
  }
}

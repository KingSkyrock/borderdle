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

export default class Country extends React.Component {

  constructor(props) {
    super(props);
    this.progress = 0;
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
      })
    })
    .catch((error) => {
      alert(error)
    })

    gsap.ticker.lagSmoothing(false)
  }

  advance(multiplier, callback=(progress)=>{}) {
    if (this.progress < 6 && this.timer == null) {
      for (var i = 0; i < this.pathArray.length; i++) {
        this.pathArray[i].tl.resume();
      }
      callback(this.progress + 1);
      this.timer = setTimeout(()=> {
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

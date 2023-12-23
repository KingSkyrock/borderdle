import React, { Component } from "react";
import parse from "html-react-parser";
import { gsap } from "gsap";
import axios from "axios";
import { DateTime } from "luxon";
import paths from "../../../data/paths.json";
class Path {
  constructor(border, tl) {
    this.border = border;
    this.tl = tl;

    this.border.setAttribute("stroke-dasharray", this.border.getTotalLength());
    this.border.setAttribute("stroke-dashoffset", this.border.getTotalLength());
    this.tl.to(this.border, {
      strokeDashoffset: 0,
      duration: 6,
      ease: "none",
    });
    this.tl.pause();
  }
}

class Timer {
  timerId;
  start;
  remaining;
  callback;
  constructor(callback, delay) {
    this.remaining = delay;
    this.callback = callback;
    this.resume();
  }
  pause() {
    window.clearTimeout(this.timerId);
    this.timerId = null;
    this.remaining -= Date.now() - this.start;
  }

  resume() {
    if (this.timerId) return;

    this.start = Date.now();
    this.timerId = window.setTimeout(this.callback, this.remaining);
  }
}
export default class Country extends Component {
  constructor(props) {
    super(props);
    this.progress = 0;
    this.inProgress = false;
    this.timer = null;
    this.duration = 6000;
    this.pathArray = [];
    this.svg = React.createRef();
    this.state = {
      paths: "",
    };
  }

  componentDidMount() {
    axios
      .post("/getAnswer")
      .then((res) => {
        this.getSVG(res.data.country);
      })
      .catch((error) => {
        alert(error);
      });
  }

  getSVG(country) {
    let svg =
      "<svg ref={this.svg} className='pb-1' xmlns='http://www.w3.org/2000/svg' version='1.0' width='208px' height='208px' viewBox='0 0 1024.000000 1024.000000'><g id='border' transform='translate(0.000000,1024.000000) scale(0.100000,-0.100000)' fill='none' stroke='#1e293b' strokeWidth='100px'>";
    let rwanda =
      "<svg ref={this.svg} className='pb-1' xmlns='http://www.w3.org/2000/svg' version='1.0' width='208px' height='208px' viewBox='0 0 350.000000 308.000000'><g id='border' fill='none' stroke='#1e293b' strokeWidth='3px'>";
    let timor =
      "<svg ref={this.svg} className='pb-1' xmlns='http://www.w3.org/2000/svg' version='1.0' width='208px' height='208px' viewBox='0 0 1024.000000 1024.000000'><g id='border' fill='none' stroke='#1e293b' strokeWidth='10px'>";
    let austria =
      "<svg ref={this.svg} className='pb-1' xmlns='http://www.w3.org/2000/svg' version='1.0' width='208px' height='208px' viewBox='0 0 1980.000000 1013.000000'><g id='border' fill='none' stroke='#1e293b' strokeWidth='19px'>";
    let malaysia =
      "<svg ref={this.svg} class='pb-1' xmlns='http://www.w3.org/2000/svg' version='1.0' width='416px' height='208px' viewBox='0 0 1024.000000 1024.000000' transform='scale(2, 2)'><g id='border' fill='none' stroke='#1e293b' strokeWidth='5px'>";
    let serbia =
      "<svg ref={this.svg} class='pb-1' xmlns='http://www.w3.org/2000/svg' version='1.0' width='208px' height='208px' viewBox='0 0 1024.000000 1024.000000'><g id='border' fill='none' stroke='#1e293b' strokeWidth='9px'>";
    let indonesia =
      "<svg ref={this.svg} class='pb-1' xmlns='http://www.w3.org/2000/svg' version='1.0' width='416px' height='208px' viewBox='0 0 1280.000000 1280.000000' transform='scale(2, 2)'><g id='border' fill='none' stroke='#1e293b' strokeWidth='5px'>";
    let cameroon =
      "<svg ref={this.svg} className='pb-1' xmlns='http://www.w3.org/2000/svg' version='1.0' width='208px' height='208px' viewBox='0 0 1280.000000 1280.000000'><g id='border' fill='none' stroke='#1e293b' strokeWidth='11px'>";
    let bahamas =
      "<svg ref={this.svg} className='pb-1' xmlns='http://www.w3.org/2000/svg' version='1.0' width='208px' height='208px' viewBox='0 0 1024.000000 1024.000000'><g id='border' fill='none' stroke='#1e293b' strokeWidth='6px'>";

    if (country.toLowerCase() == "rwanda") {
      svg = rwanda;
    } else if (country.toLowerCase() == "timor-leste") {
      svg = timor;
    } else if (country.toLowerCase() == "austria") {
      svg = austria;
    } else if (country.toLowerCase() == "malaysia") {
      svg = malaysia;
    } else if (country.toLowerCase() == "serbia") {
      svg = serbia;
    } else if (country.toLowerCase() == "indonesia") {
      svg = indonesia;
    } else if (country.toLowerCase() == "cameroon") {
      svg = cameroon;
    } else if (country.toLowerCase() == "bahamas") {
      svg = bahamas;
    }

    this.setState({ paths: svg + paths[country.toLowerCase()] }, () => {
      let borders = document
        .querySelector(".jsx-parser")
        .querySelector("svg")
        .querySelector("g")
        .querySelectorAll("path");
      for (let i = 0; i < borders.length; i++) {
        this.pathArray.push(new Path(borders[i], gsap.timeline()));
      }
      //gsap.ticker.lagSmoothing(false)
      window.addEventListener(
        "blur",
        () => {
          if (this.timer != null) {
            this.timer.pause();
            for (let i = 0; i < this.pathArray.length; i++) {
              this.pathArray[i].tl.pause();
            }
          }
        },
        false
      );

      window.addEventListener(
        "focus",
        () => {
          if (this.timer != null) {
            this.timer.resume();
            for (let i = 0; i < this.pathArray.length; i++) {
              this.pathArray[i].tl.resume();
            }
          }
        },
        false
      );
      this.readLocalStorage();
    });
  }

  readLocalStorage() {
    let utc = DateTime.utc();
    let dateStr = utc.year + "-" + utc.month + "-" + utc.day;
    let data = JSON.parse(localStorage.getItem("data"));
    if (
      data != null &&
      data != "null" &&
      data != undefined &&
      data[dateStr] != undefined
    ) {
      if (data[dateStr].gameStatus == 1) {
        this.advance(6 - this.progress, (progress) => {
          this.inProgress = false;
        });
      } else if (data[dateStr].progress) {
        this.advance(data[dateStr].progress, () => {
          this.inProgress = false;
        });
      }
    }
  }

  advance(multiplier, callback = (progress) => {}) {
    if (this.progress < 6 && this.timer == null && multiplier > 0) {
      this.inProgress = true;
      for (let i = 0; i < this.pathArray.length; i++) {
        this.pathArray[i].tl.resume();
      }
      callback(this.progress + 1);
      this.timer = new Timer(() => {
        for (let i = 0; i < this.pathArray.length; i++) {
          this.pathArray[i].tl.pause();
        }
        this.progress += 1 * multiplier;
        this.timer = null;
      }, (this.duration / 6) * multiplier);
    } else if (this.progress == 6 && this.timer == null) {
      callback(7);
    }
  }

  render() {
    return (
      <div className="flex flex-col items-center pt-3 jsx-parser">
        {parse(this.state.paths + "</g></svg>")}
      </div>
    );
  }
}
import React from "react";
import PropTypes from "prop-types";
import { Twemoji } from "react-emoji-render";
import CountUp from "react-countup";
import { Tooltip } from "react-tooltip";
import "../../index.css";

export default class GuessContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="guessdiv">
        {this.props.shown && (
          <>
            <span className="name">{this.props.name}</span>
            <span className="distance">{this.props.distance}</span>
            <span className="percent">
              <CountUp end={this.props.percent} />%
            </span>
            <span
              data-tip
              data-for={"t" + this.props.num}
              className="direction"
            >
              <img
                className="diremoji"
                src={`http://twemoji.maxcdn.com/2/svg/${this.props.arrow}.svg`}
                alt={`${this.props.arrow}`}
              />
            </span>
            <Tooltip id={"t" + this.props.num}>
              <span className="bearing">{this.props.bearing}</span>
            </Tooltip>
          </>
        )}
      </div>
    );
  }
}

GuessContainer.propTypes = {
  shown: PropTypes.bool.isRequired,
  num: PropTypes.number.isRequired,
  percent: PropTypes.number.isRequired,
  arrow: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  distance: PropTypes.string.isRequired,
  bearing: PropTypes.string.isRequired,
};

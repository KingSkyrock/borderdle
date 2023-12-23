import React from "react";
import PropTypes from "prop-types";
import CountUp from "react-countup";
import { Tooltip } from "react-tooltip";
import "../../index.css";

export default class GuessContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="col-span-8 h-8 bg-[#85e4a8] rounded flex text-xl w-full items-center">
        {this.props.shown && (
          <div className="font-semibold text-xl flex flex-row w-full">
            <span className="text-ellipsis overflow-hidden whitespace-nowrap border-[1.5px] rounded bg-[#2aa557] h-8 w-full mr-[2px]">
              {this.props.name}
            </span>
            <span className="border-[1.5px] rounded bg-[#2aa557] h-8 w-[176px] mr-[2px]">
              {this.props.distance}
            </span>
            <span className="flex items-center justify-center border-[1.5px] h-8 animate-reveal rounded bg-[#2aa557] w-[104px] mr-[2px] text-center">
              <CountUp end={this.props.percent} />%
            </span>
            <span
              data-tip
              data-for={"t" + this.props.num}
              className="border-[1.5px] rounded h-8 bg-[#2aa557] w-[64px] flex items-center justify-center"
            >
              <img
                className="h-4 w-4 flex items-center justify-center m-0"
                src={`http://twemoji.maxcdn.com/2/svg/${this.props.arrow}.svg`}
                alt={`${this.props.arrow}`}
              />
            </span>
            <Tooltip id={"t" + this.props.num}>
              <span className="bearing">{this.props.bearing}</span>
            </Tooltip>
          </div>
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

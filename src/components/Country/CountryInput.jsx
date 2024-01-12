import React from "react";
import PropTypes from "prop-types";

export default class CountryInput extends React.Component {
  constructor(props) {
    super(props);

    this.container = React.createRef();
    this.input = React.createRef();

    this.state = {
      input: "",
      shown: [],
      showing: false,
    };
  }

  componentDidMount() {
    document.addEventListener("mousedown", (evt) =>
      this.handleClickOutside(evt)
    );
    this.input.current.addEventListener("keydown", (evt) => {
      if (evt.key == "Enter") {
        this.props.onEnter();
      }
    });
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", (evt) =>
      this.handleClickOutside(evt)
    );
    this.input.current.removeEventListener("keydown", (evt) => {
      if (evt.key == "Enter") {
        this.props.onEnter();
      }
    });
  }

  handleClickOutside(evt) {
    if (
      !this.props.gameStatus &&
      this.container &&
      !this.container.current.contains(evt.target)
    ) {
      this.setState({ showing: false });
    }
  }

  handleChange(value) {
    this.props.onChange(value);
    let arrayStartsWith = [];
    let arrayIncludes = [];
    for (let i = 0; i < this.props.options.length; i++) {
      if (this.props.options[i].toLowerCase().startsWith(value.toLowerCase())) {
        arrayStartsWith.push(this.props.options[i]);
      } else if (
        this.props.options[i].toLowerCase().includes(value.toLowerCase())
      ) {
        arrayIncludes.push(this.props.options[i]);
      }
    }

    this.setState({ shown: arrayStartsWith.concat(arrayIncludes) });
  }

  clearInput() {
    this.setState({ input: "", shown: [] });
  }

  render() {
    if (this.props.gameStatus) {
      return <></>;
    }
    return (
      <div
        className="flex-auto relative"
        ref={this.container}
        onFocus={() => this.setState({ showing: true })}
      >
        <input
          ref={this.input}
          value={this.state.input}
          onChange={(evt) => {
            this.setState({ input: evt.target.value });
            this.handleChange(evt.target.value);
          }}
          maxLength="32"
          minLength="4"
          type="text"
          className="outline-none border-2 border-neutral-100 focus:border-neutral-300 h-8 bg-[#3fb66b] rounded text-neutral-100 text-lg text-center placeholder:text-center placeholder:text-green-100 placeholder:text-lg w-full"
          placeholder="Enter Country"
        ></input>
        <div className="absolute left-0 top-full right-0 z-50 flex-col items-center justify-center max-h-48 w-full overflow-y-auto scroll-smooth divide-x-2 rounded ">
          {this.state.input &&
            this.state.showing &&
            this.state.shown.map((a, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    this.setState({ input: a, showing: false });
                    this.handleChange(a);
                  }}
                  className="bg-[#1c6337] text-base w-full h-8 border-[1.5px] shadow-md border-green-900 flex items-center justify-center text-neutral-100 max-h-[35%] select-none"
                >
                  {a}
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

CountryInput.propTypes = {
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onEnter: PropTypes.func.isRequired,
  gameStatus: PropTypes.number.isRequired,
};

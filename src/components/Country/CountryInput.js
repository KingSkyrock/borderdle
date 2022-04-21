import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class CountryInput extends React.Component {
  constructor(props) {
    super(props);

    this.container = React.createRef();
    this.input = React.createRef();

    this.state = {
      input: "",
      shown: [],
      showing: false,
    }
  };
  
  componentDidMount() {
    document.addEventListener("mousedown", (evt) => this.handleClickOutside(evt));
    this.input.current.addEventListener("keydown", (evt) => {
      if (evt.key == 'Enter') {
        this.props.onEnter();
      }
    });
  }

  componentDidUnmount() {
    document.removeEventListener("mousedown", (evt) => this.handleClickOutside(evt));
    this.input.current.removeEventListener("keydown", (evt) => {
      if (evt.key == 'Enter') {
        this.props.onEnter();
      }
    });
  }

  handleClickOutside(evt) {
    if (!this.props.gameStatus && this.container && !this.container.current.contains(evt.target)) {
      this.setState({showing: false})
    }
  }

  handleChange(value) {
    this.props.onChange(value);
    let arrayStartsWith = [];
    let arrayIncludes = [];
    for (let i = 0; i < this.props.options.length; i++) {
      if (this.props.options[i].toLowerCase().startsWith(value.toLowerCase())) {
        arrayStartsWith.push(this.props.options[i])
      } else if (this.props.options[i].toLowerCase().includes(value.toLowerCase())) {
        arrayIncludes.push(this.props.options[i])
      }
    }

    this.setState({shown: arrayStartsWith.concat(arrayIncludes)})
  }

  clearInput() {
    this.setState({input: "", shown: []})
  }

  render() {
    if (this.props.gameStatus) {
      return (<></>)
    }
    return (
      <div className='inputdiv' ref={this.container} onFocus={()=>this.setState({showing: true})}>
        <input ref={this.input} value={this.state.input} onChange={(evt)=>{this.setState({input: evt.target.value}); this.handleChange(evt.target.value)}} maxLength="32" minLength="4" type="text" className="input" placeholder="Enter Country"></input>
        <div className='autocompletediv '>
        {this.state.input && this.state.showing && this.state.shown.map(a=>{
          return <div onClick={()=>{this.setState({input: a, showing: false}); this.handleChange(a)}} className='autocomplete'>{a}</div>
        })}</div>
      </div>
    )
  }
}

CountryInput.propTypes = {
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onEnter: PropTypes.func.isRequired,
  gameStatus: PropTypes.number.isRequired,
};

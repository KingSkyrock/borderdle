import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class CountryInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: "",
      shown: [],
    }
  };

  handleChange(value) {
    this.props.onChange(value);
    var arrayStartsWith = [];
    var arrayIncludes = [];
    for (var i = 0; i < this.props.options.length; i++) {
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
    return (
      <div className="relative inline-block">
        <input value={this.state.input} onChange={(evt)=>{this.setState({input: evt.target.value}); this.handleChange(evt.target.value)}} maxLength="56" minLength="2" type="text" className="outline-none border-2 border-neutral-100 focus:border-neutral-300 mt-3 w-[464px] h-8 bg-[#3fb66b] dark:bg-slate-600 rounded text-neutral-100 text-lg text-center	placeholder:text-center placeholder:text-green-100 placeholder:text-lg" placeholder="Enter Country"></input>
      {this.state.shown.map(a=>{
        return <div onClick={()=>{this.setState({input: a}); this.handleChange(a)}}>{a}</div>
      })}
      </div>
    )
  }
}

CountryInput.propTypes = {
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

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
    document.addEventListener("mousedown", (evt)=>this.handleClickOutside(evt));
    this.input.current.addEventListener("keydown", (evt) => {
      if (evt.key == 'Enter') {
        this.props.onEnter();
      }
    });
  }

  handleClickOutside(evt) {
    if (this.container && !this.container.current.contains(evt.target)) {
      this.setState({showing: false})
    }
  }

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
      <div ref={this.container} onFocus={()=>this.setState({showing: true})}>
        <input ref={this.input} value={this.state.input} onChange={(evt)=>{this.setState({input: evt.target.value}); this.handleChange(evt.target.value)}} maxLength="56" minLength="2" type="text" className="outline-none border-2 border-neutral-100 focus:border-neutral-300 mt-3 w-[464px] h-8 bg-[#3fb66b] dark:bg-slate-600 rounded text-neutral-100 text-lg text-center	placeholder:text-center placeholder:text-green-100 placeholder:text-lg" placeholder="Enter Country"></input>
      {this.state.input && this.state.showing && this.state.shown.map(a=>{
        return <div onClick={()=>{this.setState({input: a, showing: false}); this.handleChange(a)}}>{a}</div>
      })}
      </div>
    )
  }
}

CountryInput.propTypes = {
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onEnter: PropTypes.func
};

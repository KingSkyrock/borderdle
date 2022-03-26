import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TopBar from './components/TopBar/TopBar.js';
import Country from './components/Country/Country.js';
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  };

  render() {
    return (
      <div className="w-full h-full bg-cover bg-[#1d8543]">
        <TopBar/>
        <Country
          name="placeholder"
        />
      </div>
    )
  }

}
ReactDOM.render(<App />, document.getElementById('root'));

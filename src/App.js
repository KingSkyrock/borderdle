import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TopBar from './components/TopBar';
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  };

  render() {
    return (
      <div className="w-screen h-screen bg-cover bg-[#1d8543]">
        <TopBar/>
      </div>
    )
  }

}
ReactDOM.render(<App />, document.getElementById('root'));
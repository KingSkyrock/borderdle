import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  };

  render() {
    return (
      <div>
        Yes
      </div>
    )
  }

}
ReactDOM.render(<App />, document.getElementById('root'));
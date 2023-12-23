import React from "react";
import { BsFillBarChartFill } from "react-icons/bs";
import ReactModal from "react-modal";
import { ImCross } from "react-icons/im";
import toast, { Toaster } from 'react-hot-toast';

const modalSize = {
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    paddingTop: "35px",
    paddingLeft: "45px",
    paddingRight: "45px",
    border: "0px",
    height: "50%",
    width: "35%",
    maxWidth: "700px",
    minWidth: "350px",
    backgroundColor: "#1d8543",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};
export default class StatsBtn extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      gamesPlayed: null,
      gamesWon: null,
      avgGuesses: null,
      guessDistribution: null
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal() {
    let data = JSON.parse(localStorage.getItem("data"));
    if (
      data != null &&
      data != "null" &&
      data != undefined
    ) {
      let numGames = Object.keys(data).length;
      let totalGuesses = 0;
      let gamesWon = 0;
      let guessDistribution = [0, 0, 0, 0, 0, 0, 0]
      for (let game of Object.values(data)) {
        if (game.gameStatus == 1) {
          totalGuesses += game.progress
          gamesWon++;
          guessDistribution[game.progress - 1]++;
        }
      }
      this.setState({
        showModal: true,
        gamesPlayed: numGames,
        gamesWon: gamesWon,
        avgGuesses: Math.round(totalGuesses / numGames * 100)/100,
        guessDistribution: guessDistribution
      });
    } else {
      toast.error("Play a game first to see your statistics!", { duration: 1000, position: 'top-center', style: {} });
    }
  }

  getBarPercentages() {
    let arr = [0, 0, 0, 0, 0, 0, 0]
    if (this.state.guessDistribution) {
      let max = Math.max(...this.state.guessDistribution)
      if (max) {
        for (let i in arr) {
          arr[i] = this.state.guessDistribution[i] / max
        }
      }
    }
    return arr;
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <>
        <button
          className="text-2xl text-neutral-200 mr-3"
          aria-label="Statistics"
          onClick={this.handleOpenModal}
        >
          <BsFillBarChartFill />
        </button>
        <ReactModal
          isOpen={this.state.showModal}
          onRequestClose={this.handleCloseModal}
          shouldCloseOnOverlayClick={true}
          style={modalSize}
        >
          <div>
            <h1 className="modalmaintext">
              <span className="ml-[1.25rem]">Player Statistics</span>{" "}
              <button
                className="closebutton"
                aria-label="Close"
                onClick={this.handleCloseModal}
              >
                <ImCross />
              </button>
            </h1>
            <h3 className="modaltext">Games played: {this.state.gamesPlayed}</h3>
            <h3 className="modaltext">Games won: {this.state.gamesWon}</h3>
            <h3 className="modaltext">Average number of guesses: {this.state.avgGuesses}</h3>
            <h3 className="modaltext">Guess distribution: {this.getBarPercentages()}</h3>
            <div>
              1: <div className="statsbar"></div><br />
              2: <div className="statsbar"></div><br />
              3: <div className="statsbar"></div><br />
              4: <div className="statsbar"></div><br />
              5: <div className="statsbar"></div><br />
              6: <div className="statsbar"></div><br />
              7: <div className="statsbar"></div><br />
            </div>
          </div>
        </ReactModal>
      </>
    );
  }
}
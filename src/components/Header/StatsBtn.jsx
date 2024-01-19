import React from "react";
import { BsFillBarChartFill } from "react-icons/bs/index";
import ReactModal from "react-modal";
import { ImCross } from "react-icons/im/index";
import toast, { Toaster } from "react-hot-toast";

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
      guessDistribution: null,
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal() {
    let data = JSON.parse(localStorage.getItem("data"));
    if (data != null && data != "null" && data != undefined) {
      let numGames = Object.keys(data).length;
      let totalGuesses = 0;
      let gamesWon = 0;
      let guessDistribution = [0, 0, 0, 0, 0, 0, 0];
      for (let game of Object.values(data)) {
        if (game.gameStatus == 1) {
          totalGuesses += game.progress;
          gamesWon++;
          guessDistribution[game.progress - 1]++;
        }
      }
      this.setState({
        showModal: true,
        gamesPlayed: numGames,
        gamesWon: gamesWon,
        avgGuesses: Math.round((totalGuesses / numGames) * 100) / 100,
        guessDistribution: guessDistribution,
      });
    } else {
      toast.error("Play a game first to see your statistics!", {
        duration: 1000,
        position: "top-center",
        style: {},
      });
    }
  }

  getBarPercentages() {
    let arr = [0, 0, 0, 0, 0, 0, 0];
    if (this.state.guessDistribution) {
      let max = Math.max(...this.state.guessDistribution);
      if (max) {
        for (let i in arr) {
          arr[i] = this.state.guessDistribution[i] / max;
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
          className="text-2xl text-neutral-200 ml-3"
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
            <div className="flex w-full flex-col mx-auto max-w-[75%] text-xl modaltext pb-6">
              <h3>Games played: {this.state.gamesPlayed}</h3>
              <h3>Games won: {this.state.gamesWon}</h3>
              <h3>Average number of guesses: {this.state.avgGuesses}</h3>
            </div>
            <div className="flex w-full max-w-[75%] flex-col mx-auto">
              <h3 className="modaltext text-center font-bold text-3xl">
                Guess Distribution
              </h3>
              <span className="statsbarspan">
                1{" "}
                <div
                  style={{
                    width: this.getBarPercentages()[0] * 100 + "%",
                    content:
                      this.state.guessDistribution != null
                        ? this.state.guessDistribution[0]
                        : "0",
                  }}
                  className="statsbar"
                >
                  {this.state.guessDistribution != null
                    ? this.state.guessDistribution[0]
                    : "0"}
                </div>
              </span>
              <span className="statsbarspan">
                2{" "}
                <div
                  style={{
                    width: this.getBarPercentages()[1] * 100 + "%",
                    content:
                      this.state.guessDistribution != null
                        ? this.state.guessDistribution[1]
                        : "0",
                  }}
                  className="statsbar"
                >
                  {" "}
                  {this.state.guessDistribution != null
                    ? this.state.guessDistribution[1]
                    : "0"}
                </div>
              </span>
              <span className="statsbarspan">
                3{" "}
                <div
                  style={{
                    width: this.getBarPercentages()[2] * 100 + "%",
                    content:
                      this.state.guessDistribution != null
                        ? this.state.guessDistribution[2]
                        : "0",
                  }}
                  className="statsbar"
                >
                  {" "}
                  {this.state.guessDistribution != null
                    ? this.state.guessDistribution[2]
                    : "0"}
                </div>
              </span>
              <span className="statsbarspan">
                4{" "}
                <div
                  style={{
                    width: this.getBarPercentages()[3] * 100 + "%",
                    content:
                      this.state.guessDistribution != null
                        ? this.state.guessDistribution[3]
                        : "0",
                  }}
                  className="statsbar"
                >
                  {" "}
                  {this.state.guessDistribution != null
                    ? this.state.guessDistribution[3]
                    : "0"}
                </div>
              </span>
              <span className="statsbarspan">
                5{" "}
                <div
                  style={{
                    width: this.getBarPercentages()[4] * 100 + "%",
                    content:
                      this.state.guessDistribution != null
                        ? this.state.guessDistribution[4]
                        : "0",
                  }}
                  className="statsbar"
                >
                  {" "}
                  {this.state.guessDistribution != null
                    ? this.state.guessDistribution[4]
                    : "0"}
                </div>
              </span>
              <span className="statsbarspan">
                6{" "}
                <div
                  style={{
                    width: this.getBarPercentages()[5] * 100 + "%",
                    content:
                      this.state.guessDistribution != null
                        ? this.state.guessDistribution[5]
                        : "0",
                  }}
                  className="statsbar"
                >
                  {" "}
                  {this.state.guessDistribution != null
                    ? this.state.guessDistribution[5]
                    : "0"}
                </div>
              </span>
              <span className="statsbarspan">
                7{" "}
                <div
                  style={{
                    width: this.getBarPercentages()[6] * 100 + "%",
                    content:
                      this.state.guessDistribution != null
                        ? this.state.guessDistribution[6]
                        : "0",
                  }}
                  className="statsbar"
                >
                  {" "}
                  {this.state.guessDistribution != null
                    ? this.state.guessDistribution[6]
                    : "0"}
                </div>
              </span>
            </div>
          </div>
        </ReactModal>
      </>
    );
  }
}

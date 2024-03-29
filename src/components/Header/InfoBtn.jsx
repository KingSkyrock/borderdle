import React from "react";
import ReactModal from "react-modal";
import { FaQuestion } from "react-icons/fa/index";
import { ImCross } from "react-icons/im/index";

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
    zIndex: "100",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: "100",
  },
};
export default class InfoBtn extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <>
        <button
          className="text-2xl text-neutral-200 mr-3"
          aria-label="Information"
          onClick={this.handleOpenModal}
        >
          <FaQuestion />
        </button>
        <ReactModal
          isOpen={this.state.showModal}
          onRequestClose={this.handleCloseModal}
          shouldCloseOnOverlayClick={true}
          style={modalSize}
        >
          <div>
            <header className="modalmaintext">
              <span className="ml-[1.25rem]">How to play</span>{" "}
              <button
                className="closebutton"
                aria-label="Close"
                onClick={this.handleCloseModal}
              >
                <ImCross />
              </button>
            </header>
            <h3 className="modaltext pt-2">
              Welcome!{" "}
              <span className="tracking-wide font-bold">
                BORDER<span className="text-dle">DLE</span>
              </span>{" "}
              is a country quiz game inspired by Wordle and Worldle.
            </h3>
            <h3 className="modaltext pt-2">
              Find the correct country in 7 guesses!
            </h3>
            <h3 className="modaltext">
              You begin with an empty canvas but with each guess, a larger part
              of the country's border gets revealed.
            </h3>
            <h3 className="modaltext">
              The goal is to try to guess the correct country as early as
              possible.
            </h3>
            <h3 className="modaltext">
              The full outline of the country will be revealed after your 6th
              guess, leaving you one last chance to get it right.
            </h3>
            <h3 className="modaltext">
              Each guess must be a valid country name, validated by the
              autocomplete popup. Hit the enter button to submit your answer.
            </h3>
          </div>
        </ReactModal>
      </>
    );
  }
}

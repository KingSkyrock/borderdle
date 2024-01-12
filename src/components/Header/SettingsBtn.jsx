import React from "react";
import ReactModal from "react-modal";
import { IoMdSettings } from "react-icons/io/index";
import { ImCross } from "react-icons/im/index";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";

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
export default class SettingsBtn extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      unit: "km",
      rotate: false,
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  loadSettings() {
    if (localStorage.getItem("unit")) {
      this.state.unit = localStorage.getItem("unit");
    } else {
      localStorage.setItem("unit", this.state.unit);
    }

    if (localStorage.getItem("rotate")) {
      this.state.rotate = localStorage.getItem("rotate") === "true";
    } else {
      localStorage.setItem("rotate", this.state.rotate === "true");
    }
  }

  handleOpenModal() {
    this.setState({ showModal: true });
    this.loadSettings();
  }

  handleCloseModal() {
    this.setState({ showModal: false });
    this.loadSettings();
  }

  handleUnitChange(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.setState({ unit: evt.target.value }, () => {
      this.props.onUnitChange(1, this.state.unit);
    });
    localStorage.setItem("unit", evt.target.value);
  }

  handleRotateChange(evt) {
    if (this.props.gameProgress > 0) {
      toast.error("You can't change this setting while playing, sorry!");
      return;
    }
    const rotateValue = evt.target.checked;
    this.setState({ rotate: rotateValue }, () => {
      this.props.onUnitChange(2, this.state.rotate);
    });
    localStorage.setItem("rotate", rotateValue.toString());
  }

  render() {
    return (
      <>
        <button
          className="text-3xl text-neutral-200 ml-3"
          aria-label="Settings"
          onClick={this.handleOpenModal}
        >
          <IoMdSettings />
        </button>
        <ReactModal
          isOpen={this.state.showModal}
          onRequestClose={this.handleCloseModal}
          shouldCloseOnOverlayClick={true}
          style={modalSize}
        >
          <div>
            <h1 className="modalmaintext">
              <span className="ml-[1.25rem]">Settings</span>{" "}
              <button
                className="closebutton"
                aria-label="Close"
                onClick={this.handleCloseModal}
              >
                <ImCross />
              </button>
            </h1>
            <button></button>
            <div className="flex justify-start items-start">
              <div>
                <span className="modalselectdiv">
                  <select
                    onChange={(evt) => this.handleUnitChange(evt)}
                    className="modalselect"
                    value={this.state.unit}
                  >
                    <option value="mi">Miles</option>
                    <option value="km">KM</option>
                  </select>
                  <span className="pl-2 text-[1.05rem] leading-4 sm:text-lg">
                    Unit of Measurement
                  </span>
                </span>
              </div>
            </div>
            <div className="pt-[7.5%]">
              <h3 className="text-2xl text-neutral-200 font-medium tracking-wide pb-2">
                Difficulty Settings{" "}
              </h3>

              <div className="flex justify-start flex-col items-start">
                <div className="flex flex-row items-center modaltext text-neutral-100">
                  <input
                    type="checkbox"
                    id="rotate"
                    className="w-5 h-5"
                    checked={this.state.rotate}
                    onChange={(evt) => this.handleRotateChange(evt)}
                  />
                  <span className="pl-2 text-[1.05rem] leading-4 sm:text-lg">
                    Border Rotation
                  </span>
                </div>
                {/* <div className="flex flex-row items-center modaltext text-neutral-100">
                  <input type="checkbox" id="no-dist" className="w-5 h-5" />
                  <span className="pl-2 text-[1.05rem] leading-4 sm:text-lg">
                    Disable Distances
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </ReactModal>
      </>
    );
  }
}

SettingsBtn.propTypes = {
  onUnitChange: PropTypes.func.isRequired,
};

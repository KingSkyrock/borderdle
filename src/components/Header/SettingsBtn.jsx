import React from 'react';
import ReactModal from 'react-modal';
import { IoMdSettings } from "react-icons/io";
import { ImCross } from "react-icons/im";
import PropTypes from 'prop-types';

const modalSize ={
	content:{
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		transform: 'translate(-50%, -50%)',
		paddingTop: '35px',
		paddingLeft: '45px',
		paddingRight: '45px',
		border: '0px',
		height: '100%',
		width: '35%',
		maxWidth: '700px',
		minWidth: '350px',
		backgroundColor: '#1d8543',
	},
	overlay: {
	   background: '#1d8543',
	}
}
export default class SettingsBtn extends React.Component {
	constructor () {
	  super();
	  this.state = {
		  showModal: false,
      unit: "km"
	  };
	  
	  this.handleOpenModal = this.handleOpenModal.bind(this);
	  this.handleCloseModal = this.handleCloseModal.bind(this);
	}
	
	handleOpenModal () {
	  this.setState({ showModal: true });
	}
	
	handleCloseModal () {
	  this.setState({ showModal: false });
	}

  handleUnitChange (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.setState({ unit: evt.target.value }, () => {
      this.props.onUnitChange(this.state.unit);
    });
  }
	 
	render () {
	  return (
		<>
		<button className='text-3xl text-neutral-200 ml-3' aria-label="Settings" onClick={this.handleOpenModal}><IoMdSettings/></button>
			<ReactModal 
			isOpen={this.state.showModal}
			onRequestClose={this.handleCloseModal}
			shouldCloseOnOverlayClick={true}
			style={modalSize}>
				<div>
          <h1 className='modalmaintext'>Settings <button className='text-xl text-neutral-200 ml-3 mt-2 float-right' aria-label="Close" onClick={this.handleCloseModal}><ImCross /></button></h1>
          <button></button>
					<div className="flex justify-start items-start">
						<div>						
							<span className="pt-4 modaltext flex flex-row items-center text-neutral-300"><input type="checkbox" className="modalswitch"/> Dark Mode</span>
							<span className="modalselectdiv">
								<select onChange={(evt) => this.handleUnitChange(evt)} className="modalselect" value={this.state.unit}>
									<option value="mi">Miles</option>
									<option value="km">KM</option>
								</select>	
								<span className="pl-2 text-[1.05rem] leading-4 sm:text-lg">Unit of Measurement</span>
							</span>
						</div>
					</div>
					<div className="pt-[7.5%]">
						<h3 className='text-2xl text-neutral-200 font-medium tracking-wide'>Difficulty Settings </h3><span className="text-md text-neutral-50 italic">Features coming soon!</span>
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
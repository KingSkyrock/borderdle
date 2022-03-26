import React from 'react';
import ReactModal from 'react-modal';
import { Twemoji } from "@teuteuf/react-emoji-render";
import { BsQuestionSquare } from "react-icons/bs";

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
		height: '70%',
		width: '35%',
		minWidth: '350px',
		borderRadius: '25px',
		boxShadow: '0px 10px 20px 5px rgba(0, 0, 0, 0.3)',
		backgroundColor: '1d8543'
	},
	overlay: {
	   background: 'rgba(0, 0, 0,  0.3)'
	}
}
export default class InfoBtn extends React.Component {
	constructor () {
	  super();
	  this.state = {
		showModal: false
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
	
	render () {
	  return (
		<>
		  <button onClick={this.handleOpenModal}><BsQuestionSquare/></button>{/*<Twemoji text="❓"/>*/}
		  <ReactModal 
			 isOpen={this.state.showModal}
			 onRequestClose={this.handleCloseModal}
           	 shouldCloseOnOverlayClick={true}
			 style={modalSize}
		  >
			<div>
				<h3 className='modaltext'>How to play <span className='tracking-wide text-bold'>BORDER<span className='text-[#195234]'>DLE</span></span></h3>
			</div>
		  </ReactModal>
		</>
	  );
	}
  }
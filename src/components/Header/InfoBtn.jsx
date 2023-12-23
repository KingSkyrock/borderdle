import React from 'react';
import ReactModal from 'react-modal';
import { FaQuestion } from "react-icons/fa";

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
		  <button className='text-2xl text-neutral-200 mr-3' aria-label="Information" onClick={this.handleOpenModal}><FaQuestion/></button>
		  <ReactModal 
			 isOpen={this.state.showModal}
			 onRequestClose={this.handleCloseModal}
           	 shouldCloseOnOverlayClick={true}
			 style={modalSize}
		  >
			<div>
				<h1 className='modalmaintext'>How to play</h1>
				<h3 className='modaltext pt-2'>Guess the <span className='tracking-wide font-bold'>BORDER<span className='text-dle'>DLE</span></span> in 7 guesses!</h3>
				<h3 className='modaltext'>Each guess must be a valid country name. Hit the enter button to submit your answer.</h3>
				<h3 className='modaltext'>After each guess, more of the country's border will be revealed.</h3>
				<h3 className='modaltext'></h3>
			</div>
		  </ReactModal>
		</>
	  );
	}
  }
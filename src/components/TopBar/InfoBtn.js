import React from 'react';
import ReactModal from 'react-modal';
import { Twemoji } from "@teuteuf/react-emoji-render";
import { BsQuestionSquare } from "react-icons/bs";

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
			 contentLabel="How to play"
			 overlayElement="<div>HELLO</div>"
		  >
			<button onClick={this.handleCloseModal}>Close Modal</button>
		  </ReactModal>
		</>
	  );
	}
  }
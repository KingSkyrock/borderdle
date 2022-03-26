import React from 'react';
import ReactModal from 'react-modal';
import { Twemoji } from "@teuteuf/react-emoji-render";

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
		<div>
		  <button onClick={this.handleOpenModal}><Twemoji text="❓"/></button>
		  <ReactModal 
			 isOpen={this.state.showModal}
			 contentLabel="How to play"
		  >
			<button onClick={this.handleCloseModal}>Close Modal</button>
		  </ReactModal>
		</div>
	  );
	}
  }
import React from 'react';
import { FaGithub } from "react-icons/fa";

export default class GithubBtn extends React.Component {
	render () {
	  return (
		<>
		  <button className='text-3xl text-neutral-200 mr-3' aria-label="Github Repository"><a aria-label="Github Repository" href="https://github.com/KingSkyrock/Borderdle" target="_blank" rel="noopener noreferrer"><FaGithub/></a></button>
		</>
	  );
	}
  }
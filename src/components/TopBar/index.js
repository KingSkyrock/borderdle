import React from "React";
import { BsQuestionSquare } from "react-icons/bs";
const TopBar = () => {
  return (
	<div className="lgw flex justify-center">
		<div className="flex flex-row w-fit border-b-2 px-3 border-[#195234] ">
			<BsQuestionSquare size="48"/>
			<h3 className="tracking-wide">BORDER<span className="lgc">DLE</span></h3>
		</div>
	</div>
  );
};

export default TopBar;
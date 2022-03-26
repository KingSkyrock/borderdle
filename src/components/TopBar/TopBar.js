import React from "React";
import InfoBtn from "./InfoBtn.js";
const TopBar = () => {
  return (
	<div className="flex justify-center">
		<div className="flex flex-row justify-center w-fit border-b-2 px-3 pb-2 border-[#195234]">
			<div className="flex flex-row content-center pr-12 justify-center">
				<span className="text-3xl"><InfoBtn/></span>
			</div>
			<h3 className="lgw tracking-wide">Border<span className="text-[#195234]">DLE</span></h3>
		</div>
	</div>
  );
};

export default TopBar;
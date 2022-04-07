import React from "React";
import InfoBtn from "./InfoBtn.js";
import SettingsBtn from "./SettingsBtn";
import StatsBtn from "./StatsBtn";
const TopBar = () => {
  return (
	<div className="flex justify-center">
		<div className="flex flex-row justify-center w-fit border-b-4 px-3 pb-2 border-green-200">
			<div className="flex flex-row content-center pr-12 justify-center">
				<span className="text-3xl flex pt-2 items-center"><InfoBtn/></span>
			</div>
			<h3 className="lgw tracking-wide px-16">Border<span className="text-dle">DLE</span></h3>
			<div className="pl-12 flex flex-row content-center justify-center">
				<span className="text-3xl flex pt-2 items-center"><SettingsBtn/></span>
			</div>
		</div>
	</div>
  );
};

export default TopBar;
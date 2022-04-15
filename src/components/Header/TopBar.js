import React from "React";
import InfoBtn from "./components/TopBar/InfoBtn.js.js";
import SettingsBtn from "./components/TopBar/SettingsBtn";
import StatsBtn from "./components/TopBar/StatsBtn";
const TopBar = () => {
  return (
	<div className="w-full max-w-lg flex flex-col">
		<div className="border-b-2 px-3 border-gray-200 flex">
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
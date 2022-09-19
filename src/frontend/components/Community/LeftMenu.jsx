import React from "react";
import { MdPermMedia, MdSettings, MdSpaceDashboard } from 'react-icons/md';
import { GiToken } from 'react-icons/gi';
import { useLocation, NavLink } from "react-router-dom";
import { ImUsers, IoIosVideocam } from 'react-icons/all';

export function DashboardLeftMenu() {
  const location = useLocation();

  const getNavLinkClass = path => {
    return location.pathname === path;
  };

  const MenuItem = ({ children, title, link }) => (
    <NavLink to={link} className="left-nav flex items-center text-sm py-4 px-3 h-14 overflow-hidden text-ellipsis whitespace-nowrap
      hover:text-gray-900 transition duration-300 ease-in-out rounded-lg"
    >
      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center
      stroke-0 text-center xl:p-2.5 shadow-gray-300/50 shadow-md">
        {children}
      </div>
      <span>{title}</span>
    </NavLink>
  );

  return (
    <ul>
      <li className="relative">
        <MenuItem title={"Dashboard"} link={"/my/dashboard"}>
          <MdSpaceDashboard color={getNavLinkClass("/my/dashboard") ? "white" : ""} />
        </MenuItem>
      </li>
      <li className="relative">
        <MenuItem title={"NFT Collection"} link={"/my/nft"}>
          <MdPermMedia color={getNavLinkClass("/my/nft") ? "white" : ""} />
        </MenuItem>
      </li>
      <li className="relative">
        <MenuItem title={"Fungible Token"} link={"/my/token"}>
          <GiToken color={getNavLinkClass("/my/token") ? "white" : ""} />
        </MenuItem>
      </li>
      <li className="relative">
        <MenuItem title={"Video Streaming"} link={"/my/video"}>
          <IoIosVideocam color={getNavLinkClass("/my/video") ? "white" : ""} />
        </MenuItem>
      </li>
      <li className="relative">
        <MenuItem title={"Members"} link={"/my/members"}>
          <ImUsers color={getNavLinkClass("/my/members") ? "white" : ""} />
        </MenuItem>
      </li>
      <li className="relative">
        <MenuItem title={"Settings"} link={"/my/settings"}>
          <MdSettings color={getNavLinkClass("/my/settings") ? "white" : ""} />
        </MenuItem>
      </li>
    </ul>
  );
}

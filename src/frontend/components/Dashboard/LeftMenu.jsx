import React from "react";
import { MdSpaceDashboard } from 'react-icons/md';
import { GiToken } from 'react-icons/gi';
import { useLocation, NavLink } from "react-router-dom";

export function DashboardLeftMenu() {
  const location = useLocation();

  const getNavLinkClass = path => {
    return location.pathname === path;
  };

  const MenuItem = ({ children, title, link }) => (
    <NavLink to={link} className="left-nav flex items-center text-sm py-4 px-3 h-14 overflow-hidden text-ellipsis whitespace-nowrap
      hover:text-gray-900 hover:bg-gray-100
      transition duration-300 ease-in-out rounded-lg"
    >
      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center
      stroke-0 text-center xl:p-2.5 shadow-gray-300/40 shadow-md">
        {children}
      </div>
      <span>{title}</span>
    </NavLink>
  );

  return (
    <ul>
      <li className="relative">
        <MenuItem title={"Dashboard"} link={"/community/dashboard"}>
          <MdSpaceDashboard color={getNavLinkClass("/community/dashboard") ? "white" : ""} />
        </MenuItem>
      </li>
      <li className="relative">
        <MenuItem title={"NFT Collection"} link={"/community/nft"}>
          <MdSpaceDashboard color={getNavLinkClass("/community/nft") ? "white" : ""} />
        </MenuItem>
      </li>
      <li className="relative">
        <MenuItem title={"Fungible Token"} link={"/community/token"}>
          <GiToken color={getNavLinkClass("/community/token") ? "white" : ""} />
        </MenuItem>
      </li>
    </ul>
  );
}

import React, { useEffect, useState } from "react";
import { ConnectKitButton } from 'connectkit';
import logoWhite from '../assets/images/logo/logo-white.png';
import logoColor from '../assets/images/logo/logo.png';
import { Container, Link, NavLink, ScrollLink } from '../assets/css/common.style';
import { animateScroll } from "react-scroll";
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentCommunity } from '../store/communitySlice';
import { EditCommunity } from './Community/EditCommunity';
import { useAccount } from 'wagmi';
import { Popup } from './Popup';
import { communityTypes } from '../utils/settings';
import { Option, Select } from '@material-tailwind/react';
import { IoChevronDownSharp, MdKeyboardArrowLeft } from 'react-icons/all';
import { MdKeyboardArrowRight } from 'react-icons/md';

export const Header = ({ isInner, reloadCommunityList }) => {
  const dispatch = useDispatch();
  const { isConnected } = useAccount();
  const [scroll, setScroll] = useState(false);
  const [communityPopupVisible, setCommunityPopupVisible] = useState(false);
  const communityList = useSelector(state => state.community.list);
  const currentCommunity = useSelector(state => state.community.current);

  useEffect(() => {
    // Change header bg on scroll
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 80);
    });
  }, []);

  useEffect(() => {
    console.log('header currentCommunity', currentCommunity)
  }, [currentCommunity]);

  const closePopupCallback = () => {
    selectCommunity(localStorage.getItem("communityId"));
  };

  const toggleHome = () => {
    animateScroll.scrollToTop();
  };

  const selectCommunity = (communityId) => {
    communityList.map(item => {
      if (item.id.toString() === communityId) {
        dispatch(setCurrentCommunity({
          community: item
        }));
      }
    });

    // save in local storage
    localStorage.setItem("communityId", communityId);
  }

  const handleTxStart = async () => {
    setCommunityPopupVisible(false);
  }

  const handleSuccessCreate = async () => {
    reloadCommunityList(true);
    console.log('reloadCommunityList')
  }

  return (
    <div
      className={`ud-header fixed top-0 left-0 z-40 w-full flex items-center
      ${scroll ? "black-type bg-white/70 shadow filter-blur" : "bg-transparent"}`}
    >
      <Container>
        <div className="flex -mx-4 items-center justify-between relative">
          <div className="px-4 w-60 max-w-full">
            <Link to={"/"} className="navbar-logo w-full block py-5">
              <img
                src={scroll ? logoColor : logoWhite}
                alt="logo"
                className="w-full header-logo"
              />
            </Link>
          </div>
          <div className="flex px-4 justify-between items-center w-full">
            <div>
              <button
                id="navbarToggler"
                className="block absolute right-4 top-1/2 -translate-y-1/2 lg:hidden focus:ring-2 ring-primary px-3 py-[6px] rounded-lg"
              >
                <span className="relative w-[30px] h-[2px] my-[6px] block bg-white" />
                <span className="relative w-[30px] h-[2px] my-[6px] block bg-white" />
                <span className="relative w-[30px] h-[2px] my-[6px] block bg-white" />
              </button>
              <nav
                id="navbarCollapse"
                className="absolute py-5 lg:py-0 lg:px-4 xl:px-6 bg-white lg:bg-transparent shadow-lg rounded-lg max-w-[250px] w-full
                  lg:max-w-full lg:w-full right-4 top-full hidden lg:block lg:static lg:shadow-none lg:ml-4"
              >
                {!isInner ? (
                  <ul className="lg:flex">
                    <li className="relative group">
                      <ScrollLink to="/" onClick={toggleHome} dark={scroll ? "true" : undefined}>Home</ScrollLink>
                    </li>
                    <li className="relative group">
                      <ScrollLink to={"about"} dark={scroll ? "true" : undefined} smooth={true}>About</ScrollLink>
                    </li>
                    <li className="relative group">
                      <ScrollLink to={"pricing"} dark={scroll ? "true" : undefined} smooth={true}>Pricing</ScrollLink>
                    </li>
                    <li className="relative group">
                      <ScrollLink to={"team"} dark={scroll ? "true" : undefined} smooth={true}>Team</ScrollLink>
                    </li>
                    <li className="relative group">
                      <ScrollLink to={"contact"} dark={scroll ? "true" : undefined} smooth={true}>Contact</ScrollLink>
                    </li>
                  </ul>
                ) : (
                  <ul className="lg:flex">
                    <li className="relative">
                      <NavLink to={"/"} dark={scroll ? "true" : undefined}>
                        <MdKeyboardArrowLeft className="text-lg align-bottom mr-1 inline-block" />
                        Home
                      </NavLink>
                      <span className="text-white opacity-40">/</span>
                    </li>
                    <li className="relative ml-4 mt-4 pt-0.5">
                      {communityList.length > 0 && currentCommunity ? (
                        // <Select variant="static"
                        //         arrow={<IoChevronDownSharp className="text-white" />}
                        //         className={"text-white !border-none text-base"}
                        //         value={currentCommunity.id}
                        //         onChange={val => val === "new" ? setCommunityPopupVisible(true) : selectCommunity(val.id)}>
                        //   {communityList.map(item => (
                        //     <Option value={item.id} key={item.id}>
                        //       {item.name}
                        //     </Option>
                        //   ))}
                        // </Select>
                        <select
                          className={`py-2 px-2 bg-transparent text-white focus:outline-none`}
                          value={currentCommunity.id}
                          onChange={e => {
                            e.target.value.length ? selectCommunity(e.target.value) : setCommunityPopupVisible(true)
                          }}>
                          {communityList.map(item => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                          <option value={""}>+ New Community</option>
                        </select>
                      ) : (
                        <div className="text-white pt-2 pl-4 opacity-50">New Community</div>
                      )}
                    </li>
                  </ul>
                )}
              </nav>
            </div>
            <div className="sm:flex justify-end hidden pr-16 lg:pr-0">
              {isConnected && !isInner && (
                <NavLink to={"/my/dashboard"} dark={scroll ? "true" : undefined}>My Dashboard</NavLink>
              )}

              <div className={`${isConnected && !isInner && "pt-4"} ml-2`}>
                <ConnectKitButton />
              </div>
            </div>
          </div>
        </div>
      </Container>


      <Popup title="Create New Community"
             size="sm"
             isVisible={communityPopupVisible}
             setIsVisible={setCommunityPopupVisible}
             closeCallback={closePopupCallback}>
        <div>
          <EditCommunity
            handleTxStart={() => handleTxStart()}
            handleSuccess={() => handleSuccessCreate()}
          />
        </div>
      </Popup>
    </div>
  );
}

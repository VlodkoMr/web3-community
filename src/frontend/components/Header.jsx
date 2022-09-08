import React, { useEffect, useState } from "react";
import { ConnectKitButton } from 'connectkit';
import logoWhite from '../assets/images/logo/logo-white.png';
import logoColor from '../assets/images/logo/logo.png';
import { Container, Link, NavLink, ScrollLink } from '../assets/css/common.style';
import { animateScroll } from "react-scroll";
import { useAccount } from "wagmi";
import { Dropdown, Modal } from "flowbite-react";
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentCommunity } from '../store/communitySlice';
import { EditCommunity } from './Community/EditCommunity';
import { loadCommunityList } from '../utils/requests';

export const Header = ({ contract, isInner }) => {
  const dispatch = useDispatch();
  const [scroll, setScroll] = useState(false);
  const [communityPopupVisible, setCommunityPopupVisible] = useState(false);
  const { isConnected } = useAccount();
  const { address } = useAccount();
  const communityList = useSelector(state => state.community.list);
  const currentCommunity = useSelector(state => state.community.current);

  useEffect(() => {
    // Change header bg on scroll
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 80);
    });
  }, []);

  const toggleHome = () => {
    animateScroll.scrollToTop();
  };

  const selectCommunity = (community) => {
    dispatch(setCurrentCommunity({
      community: community
    }));

    // save in local storage
    localStorage.setItem("communityId", community.id);
  }

  const handleTxStart = async () => {
    setCommunityPopupVisible(false);
  }

  const handleSuccessCreate = async () => {
    loadCommunityList(contract, dispatch, address, true);
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
                      <NavLink to={"/"} dark={scroll ? "true" : undefined}>&laquo; Home</NavLink>
                      <span className="text-white opacity-40">/</span>
                    </li>
                    <li className="relative ml-2 mt-4">
                      {communityList.length > 0 && currentCommunity ? (
                        <Dropdown label={currentCommunity.name}>
                          {communityList.map(item => (
                            <Dropdown.Item
                              onClick={() => selectCommunity(item)}
                              key={item.id}>
                              <span className={"whitespace-nowrap"}>
                                {item.name}
                              </span>
                            </Dropdown.Item>
                          ))}
                          <Dropdown.Item onClick={() => setCommunityPopupVisible(true)}>
                            <span className={"whitespace-nowrap"}>
                              + New Community
                            </span>
                          </Dropdown.Item>
                        </Dropdown>
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
                <NavLink to={"/community/dashboard"} dark={scroll ? "true" : undefined}>My Dashboard</NavLink>
              )}

              <div className={`${isConnected && !isInner && "pt-4"} ml-2`}>
                <ConnectKitButton />
              </div>
            </div>
          </div>
        </div>
      </Container>


      <Modal size="md"
             popup={true}
             show={communityPopupVisible}
             onClose={() => setCommunityPopupVisible(false)}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-lg pb-6 text-center w-full">
            Create New Community
          </div>
          <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
            <EditCommunity
              contract={contract}
              handleTxStart={() => handleTxStart()}
              handleSuccess={() => handleSuccessCreate()}
            />
          </div>
        </Modal.Body>
      </Modal>

    </div>
  );
}

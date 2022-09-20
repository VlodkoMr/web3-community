import React from "react";
import { Container } from '../assets/css/common.style';

export const Footer = () => (
  <>
    <footer
      className="bg-black relative z-10 wow fadeInUp"
      data-wow-delay=".15s"
    >

      <div className="border-t border-opacity-40 py-8">
        <Container>
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-2/3 lg:w-1/2 px-4">
              <div className="my-1">
                <div>
                  <small className="text-sm text-[#f3f4fe] opacity-80 block">© All rights reserved</small>
                  <small className="text-sm text-[#f3f4fe]  opacity-30">
                    Made by
                    <a
                      href="https://atomic-lab.io"
                      rel="nofollow noopner"
                      target="_blank"
                      className="text-white ml-1 hover:underline uppercase"
                    >
                      atomic-lab.io
                    </a>
                  </small>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 lg:w-1/2 px-4">
              <div className="flex justify-center md:justify-end mt-2">
                <img
                  src={require("../assets/images/social/discord.png")}
                  alt="logo"
                  className="h-8 mr-2 opacity-90 hover:opacity-100 cursor-pointer"
                />
                <img
                  src={require("../assets/images/social/twitter.png")}
                  alt="logo"
                  className="h-8 mr-2 opacity-90 hover:opacity-100 cursor-pointer"
                />
                <img
                  src={require("../assets/images/social/telegram.png")}
                  alt="logo"
                  className="h-8 opacity-90 hover:opacity-100 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </Container>
      </div>

      <div>
          <span className="absolute top-0 right-0 z-[-1]">
            <img src={require("../assets/images/footer-dots.svg")} alt="..." className={"w-[102px] h-[102px]"}/>
        </span>
      </div>
    </footer>
  </>
);

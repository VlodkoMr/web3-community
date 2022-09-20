import React from "react";
import giftIcon from "../../assets/images/home/gift.svg";
import moveIcon from "../../assets/images/home/move.svg";
import appsIcon from "../../assets/images/home/apps.svg";
import layersIcon from "../../assets/images/home/layers.svg";

export function Feature({ title, text, icon }) {
  const iconsMap = {
    'gift': giftIcon,
    'move': moveIcon,
    'apps': appsIcon,
    'layers': layersIcon,
  };

  return (
    <div className="w-full md:w-1/2 lg:w-1/4 px-4">
      <div className="bg-white mb-12 group wow fadeInUp" data-wow-delay=".1s">
        <div
          className="w-[70px] h-[70px] flex items-center justify-center bg-primary rounded-2xl mb-8 relative z-10"
        >
          <span
            className="w-[70px] h-[70px] flex items-center justify-center bg-primary bg-opacity-20 rounded-2xl
              mb-8 absolute z-[-1] top-0 left-0 rotate-[25deg] group-hover:rotate-45 duration-300"
          />
          <img src={iconsMap[icon]} alt="" className="w-[35px] h-[35px]"/>
        </div>
        <h4 className="font-bold text-xl text-dark mb-3">
          {title}
        </h4>
        <p className="text-body-color mb-8 lg:mb-11">
          {text}
        </p>
        {/*<a*/}
        {/*  href="#"*/}
        {/*  className="font-medium text-base text-body-color hover:text-primary"*/}
        {/*>*/}
        {/*  Learn More*/}
        {/*</a>*/}
      </div>
    </div>
  );
}

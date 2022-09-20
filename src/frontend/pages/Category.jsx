import React from "react";
import {Header} from "../components/Header";
import {Footer} from "../components/Footer";
import {Link} from 'react-router-dom';
import {Wrapper} from "../assets/css/common.style";

export const Category = () => (
  <div className="flex flex-col h-screen relative">
    <Header/>
    <div id="home" className="relative h-[80px] bg-primary mb-6"/>

    <Wrapper>
      ...
    </Wrapper>
    {/*<div*/}
    {/*  id="home"*/}
    {/*  className="relative h-full mb-auto pt-[120px] md:pt-[130px] lg:pt-[160px]"*/}
    {/*>*/}
    {/*  <div className="container text-white font-medium text-center">*/}
    {/*    <h1 className="text-3xl mb-2">Categories</h1>*/}

    {/*    ...*/}
    {/*  </div>*/}
    {/*</div>*/}

    <Footer/>
  </div>
);

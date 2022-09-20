import React from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Link } from 'react-router-dom';
import { MdKeyboardArrowRight } from 'react-icons/md';

export const Error404 = () => (
  <div className="flex flex-col h-screen relative">
    <Header/>

    <div
      id="home"
      className="relative h-full mb-auto pt-[120px] md:pt-[130px] lg:pt-[160px] bg-primary"
    >
      <div className="container text-white font-medium text-center">
        <h1 className="text-3xl mb-2">404: Page not found</h1>
        <Link className={"underline"} to="/">Return to Homepage
          <MdKeyboardArrowRight className="text-lg align-bottom ml-1 inline-block"/>
        </Link>
      </div>
    </div>

    <Footer/>
  </div>
);

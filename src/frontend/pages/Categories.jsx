import React from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Link } from 'react-router-dom';
import { MdKeyboardArrowRight } from 'react-icons/md';

export const Categories = () => (
  <div className="flex flex-col h-screen relative">
    <Header />

    <div
      id="home"
      className="relative h-full mb-auto pt-[120px] md:pt-[130px] lg:pt-[160px]"
    >
      <div className="container text-white font-medium text-center">
        <h1 className="text-3xl mb-2">Categories</h1>

        ...
      </div>
    </div>

    <Footer />
  </div>
);

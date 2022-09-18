import React from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Btn, ScrollLink } from '../assets/css/common.style';
import { Feature } from '../components/Home/Feature';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { ConnectKitButton } from 'connectkit';
import { MdKeyboardArrowRight } from 'react-icons/md';

const dashboardURL = "/my/dashboard";

export const Home = () => {
  const navigate = useNavigate();
  const { isConnected } = useAccount({
    onConnect() {
      navigate(dashboardURL);
    }
  });

  const redirectOrConnect = (isConnected, show) => {
    if (isConnected) {
      navigate(dashboardURL);
    } else {
      show();
    }
  }

  return (
    <>
      <Header />

      <div
        id="home"
        className="relative pt-[120px] md:pt-[130px] lg:pt-[160px] bg-primary"
      >
        <div className="container">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full px-4">
              <div
                className="hero-content text-center max-w-[780px] mx-auto wow fadeInUp"
                data-wow-delay=".2s"
              >
                <h1
                  className="text-white font-bold text-3xl sm:text-4xl md:text-[45px] leading-snug
                  sm:leading-snug md:leading-snug mb-8"
                >
                  Your WEB3 Community
                </h1>
                <p
                  className="text-base sm:text-lg sm:leading-relaxed md:text-xl md:leading-relaxed mx-auto
                  mb-10 text-[#e4e4e4] max-w-[600px]"
                >
                  Take advantage of web3 in a few clicks: create NFT collection,
                  fungible token, share news and stream video to your audience!
                </p>
                <ul className="flex flex-wrap items-center justify-center mb-10">
                  <li>
                    <ConnectKitButton.Custom>
                      {({ isConnected, show }) => (
                        <Btn onClick={() => redirectOrConnect(isConnected, show)}>Create Community</Btn>
                      )}
                    </ConnectKitButton.Custom>
                  </li>
                  <li>
                    <ScrollLink to={"features"} smooth={true}>
                      <span className=" px-6">All Features
                      <MdKeyboardArrowRight className="text-lg align-bottom ml-1 inline-block" />
                      </span>
                    </ScrollLink>
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-full px-4">
              <div
                className="mx-auto max-w-[845px] relative z-10 wow fadeInUp"
                data-wow-delay=".25s"
              >
                <div className="mt-16">
                  <img
                    src={require("../assets/images/hero/hero-image.jpg")}
                    alt="hero"
                    className="max-w-full mx-auto rounded-t-xl rounded-tr-xl"
                  />
                </div>
                <div className="absolute z-[-1] bottom-0 -left-9">
                  <img src={require("../assets/images/home/dots-about.svg")} alt="->"
                       className={"w-[134px] h-[106px]"} />
                </div>
                <div className="absolute z-[-1] -top-6 -right-6">
                  <img src={require("../assets/images/home/dots-about.svg")} alt="->"
                       className={"w-[134px] h-[106px]"} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="pt-20 lg:pt-[120px] pb-8 lg:pb-[70px]" id="features">
        <div className="container">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4">
              <div className="mb-12 lg:mb-20 max-w-[620px]">
              <span className="font-semibold text-lg text-primary mb-2 block">
                Features
              </span>
                <h2
                  className="font-bold text-3xl sm:text-4xl md:text-[42px] text-dark mb-4"
                >
                  Main Features Of Play
                </h2>
                <p
                  className="text-lg sm:text-xl leading-relaxed sm:leading-relaxed text-body-color"
                >
                  There are many variations of passages of Lorem Ipsum available
                  but the majority have suffered alteration in some form.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap -mx-4">
            <Feature title="Free and Open-Source"
                     text="Lorem Ipsum is simply dummy text of the printing and industry."
                     icon="gift"
            />
            <Feature title="Multipurpose Template"
                     text="Lorem Ipsum is simply dummy text of the printing and industry."
                     icon="move"
            />
            <Feature title="Multipurpose Template"
                     text="Lorem Ipsum is simply dummy text of the printing and industry."
                     icon="apps"
            />
            <Feature title="Multipurpose Template"
                     text="Lorem Ipsum is simply dummy text of the printing and industry."
                     icon="layers"
            />
          </div>
        </div>
      </section>

      <section
        id="about"
        className="pt-20 lg:pt-[120px] pb-20 lg:pb-[120px] bg-[#f3f4fe]"
      >
        <div className="container">
          <div className="bg-white wow fadeInUp" data-wow-delay=".2s">
            <div className="flex flex-wrap -mx-4">
              <div className="w-full px-4">
                <div
                  className="lg:flex items-center justify-between border overflow-hidden"
                >
                  <div
                    className="lg:max-w-[565px] xl:max-w-[640px] w-full py-12 px-7 sm:px-12 md:p-16 lg:py-9 lg:px-16 xl:p-[70px]">
                  <span className="font-semibold text-lg text-primary mb-2 block">
                    About Us
                  </span>
                    <h2 className="font-bold text-3xl sm:text-4xl 2xl:text-[40px] sm:leading-snug text-dark mb-6">
                      Brilliant Toolkit to Build Nextgen Website Faster.
                    </h2>
                    <p className="text-base text-body-color mb-9 leading-relaxed">
                      The main ‘thrust' is to focus on educating attendees on how
                      to best protect highly vulnerable business applications with
                      interactive panel discussions and roundtables led by subject
                      matter experts.
                    </p>
                    <p className="text-base text-body-color mb-9 leading-relaxed">
                      The main ‘thrust' is to focus on educating attendees on how
                      to best protect highly vulnerable business applications with
                      interactive panel.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="relative inline-block z-10">
                      <img
                        src={require("../assets/images/about/about-image.svg")}
                        alt="image"
                        className="mx-auto lg:ml-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*<section*/}
      {/*  id="pricing"*/}
      {/*  className="*/}
      {/*  bg-white*/}
      {/*  pt-20*/}
      {/*  lg:pt-[120px]*/}
      {/*  pb-12*/}
      {/*  lg:pb-[90px]*/}
      {/*  relative*/}
      {/*  z-20*/}
      {/*  overflow-hidden*/}
      {/*"*/}
      {/*>*/}
      {/*  <div className="container">*/}
      {/*    <div className="flex flex-wrap -mx-4">*/}
      {/*      <div className="w-full px-4">*/}
      {/*        <div className="text-center mx-auto mb-[60px] lg:mb-20 max-w-[620px]">*/}
      {/*        <span className="font-semibold text-lg text-primary mb-2 block">*/}
      {/*          Pricing Table*/}
      {/*        </span>*/}
      {/*          <h2*/}
      {/*            className="*/}
      {/*            font-bold*/}
      {/*            text-3xl*/}
      {/*            sm:text-4xl*/}
      {/*            md:text-[40px]*/}
      {/*            text-dark*/}
      {/*            mb-4*/}
      {/*          "*/}
      {/*          >*/}
      {/*            Our Pricing Plan*/}
      {/*          </h2>*/}
      {/*          <p*/}
      {/*            className="*/}
      {/*            text-lg*/}
      {/*            sm:text-xl*/}
      {/*            leading-relaxed*/}
      {/*            sm:leading-relaxed*/}
      {/*            text-body-color*/}
      {/*          "*/}
      {/*          >*/}
      {/*            There are many variations of passages of Lorem Ipsum available*/}
      {/*            but the majority have suffered alteration in some form.*/}
      {/*          </p>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    </div>*/}

      {/*    <div className="flex flex-wrap items-center justify-center">*/}
      {/*      <div className="w-full md:w-1/2 lg:w-1/3">*/}
      {/*        <div*/}
      {/*          className="*/}
      {/*          bg-white*/}
      {/*          rounded-xl*/}
      {/*          relative*/}
      {/*          z-10*/}
      {/*          overflow-hidden*/}
      {/*          border border-primary border-opacity-20*/}
      {/*          shadow-pricing*/}
      {/*          py-10*/}
      {/*          px-8*/}
      {/*          sm:p-12*/}
      {/*          lg:py-10 lg:px-6*/}
      {/*          xl:p-12*/}
      {/*          mb-10*/}
      {/*          text-center*/}
      {/*          wow*/}
      {/*          fadeInUp*/}
      {/*        "*/}
      {/*          data-wow-delay=".15s*/}
      {/*        "*/}
      {/*        >*/}
      {/*        <span*/}
      {/*          className="text-dark font-medium text-base uppercase block mb-2"*/}
      {/*        >*/}
      {/*          STARTING FROM*/}
      {/*        </span>*/}
      {/*          <h2 className="font-semibold text-primary mb-9 text-[28px]">*/}
      {/*            $ 19.99/mo*/}
      {/*          </h2>*/}

      {/*          <div className="mb-10">*/}
      {/*            <p*/}
      {/*              className="*/}
      {/*              text-base*/}
      {/*              font-medium*/}
      {/*              text-body-color*/}
      {/*              leading-loose*/}
      {/*              mb-1*/}
      {/*            "*/}
      {/*            >*/}
      {/*              1 User*/}
      {/*            </p>*/}
      {/*            <p*/}
      {/*              className="*/}
      {/*              text-base*/}
      {/*              font-medium*/}
      {/*              text-body-color*/}
      {/*              leading-loose*/}
      {/*              mb-1*/}
      {/*            "*/}
      {/*            >*/}
      {/*              All UI components*/}
      {/*            </p>*/}
      {/*            <p*/}
      {/*              className="*/}
      {/*              text-base*/}
      {/*              font-medium*/}
      {/*              text-body-color*/}
      {/*              leading-loose*/}
      {/*              mb-1*/}
      {/*            "*/}
      {/*            >*/}
      {/*              Lifetime access*/}
      {/*            </p>*/}
      {/*            <p*/}
      {/*              className="*/}
      {/*              text-base*/}
      {/*              font-medium*/}
      {/*              text-body-color*/}
      {/*              leading-loose*/}
      {/*              mb-1*/}
      {/*            "*/}
      {/*            >*/}
      {/*              Free updates*/}
      {/*            </p>*/}
      {/*            <p*/}
      {/*              className="*/}
      {/*              text-base*/}
      {/*              font-medium*/}
      {/*              text-body-color*/}
      {/*              leading-loose*/}
      {/*              mb-1*/}
      {/*            "*/}
      {/*            >*/}
      {/*              Use on 1 (one) project*/}
      {/*            </p>*/}
      {/*            <p*/}
      {/*              className="*/}
      {/*              text-base*/}
      {/*              font-medium*/}
      {/*              text-body-color*/}
      {/*              leading-loose*/}
      {/*              mb-1*/}
      {/*            "*/}
      {/*            >*/}
      {/*              3 Months support*/}
      {/*            </p>*/}
      {/*          </div>*/}
      {/*          <div className="w-full">*/}
      {/*            <a*/}
      {/*              href="#"*/}
      {/*              className="*/}
      {/*              inline-block*/}
      {/*              text-base*/}
      {/*              font-medium*/}
      {/*              text-primary*/}
      {/*              bg-transparent*/}
      {/*              border border-[#D4DEFF]*/}
      {/*              rounded-full*/}
      {/*              text-center*/}
      {/*              py-4*/}
      {/*              px-11*/}
      {/*              hover:text-white hover:bg-primary hover:border-primary*/}
      {/*              transition*/}
      {/*              duration-300*/}
      {/*              ease-in-out*/}
      {/*            "*/}
      {/*            >*/}
      {/*              Purchase Now*/}
      {/*            </a>*/}
      {/*          </div>*/}
      {/*          <span*/}
      {/*            className="*/}
      {/*            absolute*/}
      {/*            left-0*/}
      {/*            bottom-0*/}
      {/*            z-[-1]*/}
      {/*            w-14*/}
      {/*            h-14*/}
      {/*            rounded-tr-full*/}
      {/*            block*/}
      {/*            bg-primary*/}
      {/*          "*/}
      {/*          >*/}
      {/*        </span>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*      <div className="w-full md:w-1/2 lg:w-1/3">*/}
      {/*        <div*/}
      {/*          className="*/}
      {/*          bg-primary bg-gradient-to-b*/}
      {/*          from-primary*/}
      {/*          to-[#179BEE]*/}
      {/*          rounded-xl*/}
      {/*          relative*/}
      {/*          z-10*/}
      {/*          overflow-hidden*/}
      {/*          shadow-pricing*/}
      {/*          py-10*/}
      {/*          px-8*/}
      {/*          sm:p-12*/}
      {/*          lg:py-10 lg:px-6*/}
      {/*          xl:p-12*/}
      {/*          mb-10*/}
      {/*          text-center*/}
      {/*          wow*/}
      {/*          fadeInUp*/}
      {/*        "*/}
      {/*          data-wow-delay=".1s*/}
      {/*        "*/}
      {/*        >*/}
      {/*        <span*/}
      {/*          className="*/}
      {/*            inline-block*/}
      {/*            py-2*/}
      {/*            px-6*/}
      {/*            border border-white*/}
      {/*            rounded-full*/}
      {/*            text-base*/}
      {/*            font-semibold*/}
      {/*            text-primary*/}
      {/*            bg-white*/}
      {/*            uppercase*/}
      {/*            mb-5*/}
      {/*          "*/}
      {/*        >*/}
      {/*          POPULAR*/}
      {/*        </span>*/}
      {/*          <span*/}
      {/*            className="text-white font-medium text-base uppercase block mb-2"*/}
      {/*          >*/}
      {/*          STARTING FROM*/}
      {/*        </span>*/}
      {/*          <h2 className="font-semibold text-white mb-9 text-[28px]">*/}
      {/*            $ 19.99/mo*/}
      {/*          </h2>*/}

      {/*          <div className="mb-10">*/}
      {/*            <p className="text-base font-medium text-white leading-loose mb-1">*/}
      {/*              5 User*/}
      {/*            </p>*/}
      {/*            <p className="text-base font-medium text-white leading-loose mb-1">*/}
      {/*              All UI components*/}
      {/*            </p>*/}
      {/*            <p className="text-base font-medium text-white leading-loose mb-1">*/}
      {/*              Lifetime access*/}
      {/*            </p>*/}
      {/*            <p className="text-base font-medium text-white leading-loose mb-1">*/}
      {/*              Free updates*/}
      {/*            </p>*/}
      {/*            <p className="text-base font-medium text-white leading-loose mb-1">*/}
      {/*              Use on 1 (one) project*/}
      {/*            </p>*/}
      {/*            <p className="text-base font-medium text-white leading-loose mb-1">*/}
      {/*              4 Months support*/}
      {/*            </p>*/}
      {/*          </div>*/}
      {/*          <div className="w-full">*/}
      {/*            <a*/}
      {/*              href="#"*/}
      {/*              className="*/}
      {/*              inline-block*/}
      {/*              text-base*/}
      {/*              font-medium*/}
      {/*              text-dark*/}
      {/*              bg-white*/}
      {/*              border border-white*/}
      {/*              rounded-full*/}
      {/*              text-center*/}
      {/*              py-4*/}
      {/*              px-11*/}
      {/*              hover:text-white hover:bg-dark hover:border-dark*/}
      {/*              transition*/}
      {/*              duration-300*/}
      {/*              ease-in-out*/}
      {/*            "*/}
      {/*            >*/}
      {/*              Purchase Now*/}
      {/*            </a>*/}
      {/*          </div>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*      <div className="w-full md:w-1/2 lg:w-1/3">*/}
      {/*        <div*/}
      {/*          className="*/}
      {/*          bg-white*/}
      {/*          rounded-xl*/}
      {/*          relative*/}
      {/*          z-10*/}
      {/*          overflow-hidden*/}
      {/*          border border-primary border-opacity-20*/}
      {/*          shadow-pricing*/}
      {/*          py-10*/}
      {/*          px-8*/}
      {/*          sm:p-12*/}
      {/*          lg:py-10 lg:px-6*/}
      {/*          xl:p-12*/}
      {/*          mb-10*/}
      {/*          text-center*/}
      {/*          wow*/}
      {/*          fadeInUp*/}
      {/*        "*/}
      {/*          data-wow-delay=".15s*/}
      {/*        "*/}
      {/*        >*/}
      {/*        <span*/}
      {/*          className="text-dark font-medium text-base uppercase block mb-2"*/}
      {/*        >*/}
      {/*          STARTING FROM*/}
      {/*        </span>*/}
      {/*          <h2 className="font-semibold text-primary mb-9 text-[28px]">*/}
      {/*            $ 70.99/mo*/}
      {/*          </h2>*/}

      {/*          <div className="mb-10">*/}
      {/*            <p*/}
      {/*              className="*/}
      {/*              text-base*/}
      {/*              font-medium*/}
      {/*              text-body-color*/}
      {/*              leading-loose*/}
      {/*              mb-1*/}
      {/*            "*/}
      {/*            >*/}
      {/*              1 User*/}
      {/*            </p>*/}
      {/*            <p*/}
      {/*              className="*/}
      {/*              text-base*/}
      {/*              font-medium*/}
      {/*              text-body-color*/}
      {/*              leading-loose*/}
      {/*              mb-1*/}
      {/*            "*/}
      {/*            >*/}
      {/*              All UI components*/}
      {/*            </p>*/}
      {/*            <p*/}
      {/*              className="*/}
      {/*              text-base*/}
      {/*              font-medium*/}
      {/*              text-body-color*/}
      {/*              leading-loose*/}
      {/*              mb-1*/}
      {/*            "*/}
      {/*            >*/}
      {/*              Lifetime access*/}
      {/*            </p>*/}
      {/*            <p*/}
      {/*              className="*/}
      {/*              text-base*/}
      {/*              font-medium*/}
      {/*              text-body-color*/}
      {/*              leading-loose*/}
      {/*              mb-1*/}
      {/*            "*/}
      {/*            >*/}
      {/*              Free updates*/}
      {/*            </p>*/}
      {/*            <p*/}
      {/*              className="*/}
      {/*              text-base*/}
      {/*              font-medium*/}
      {/*              text-body-color*/}
      {/*              leading-loose*/}
      {/*              mb-1*/}
      {/*            "*/}
      {/*            >*/}
      {/*              Use on unlimited project*/}
      {/*            </p>*/}
      {/*            <p*/}
      {/*              className="*/}
      {/*              text-base*/}
      {/*              font-medium*/}
      {/*              text-body-color*/}
      {/*              leading-loose*/}
      {/*              mb-1*/}
      {/*            "*/}
      {/*            >*/}
      {/*              4 Months support*/}
      {/*            </p>*/}
      {/*          </div>*/}
      {/*          <div className="w-full">*/}
      {/*            <a*/}
      {/*              href="#"*/}
      {/*              className="*/}
      {/*              inline-block*/}
      {/*              text-base*/}
      {/*              font-medium*/}
      {/*              text-primary*/}
      {/*              bg-transparent*/}
      {/*              border border-[#D4DEFF]*/}
      {/*              rounded-full*/}
      {/*              text-center*/}
      {/*              py-4*/}
      {/*              px-11*/}
      {/*              hover:text-white hover:bg-primary hover:border-primary*/}
      {/*              transition*/}
      {/*              duration-300*/}
      {/*              ease-in-out*/}
      {/*            "*/}
      {/*            >*/}
      {/*              Purchase Now*/}
      {/*            </a>*/}
      {/*          </div>*/}

      {/*          <span*/}
      {/*            className="*/}
      {/*            absolute*/}
      {/*            right-0*/}
      {/*            top-0*/}
      {/*            z-[-1]*/}
      {/*            w-14*/}
      {/*            h-14*/}
      {/*            rounded-bl-full*/}
      {/*            block*/}
      {/*            bg-secondary*/}
      {/*          "*/}
      {/*          >*/}
      {/*        </span>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</section>*/}

      <section id="testimonials" className="pt-20 md:py-[80px]">
        <div className="container px-4">
          <div className="flex flex-wrap">
            <div className="w-full mx-4">
              <div className="text-center mx-auto mb-[60px] lg:mb-20 max-w-[620px]">
              <span className="font-semibold text-lg text-primary mb-2 block">
                Testimonials
              </span>
                <h2
                  className="
                  font-bold
                  text-3xl
                  sm:text-4xl
                  md:text-[42px]
                  text-dark
                  mb-4
                "
                >
                  What our Client Say
                </h2>
                <p
                  className="
                  text-lg
                  sm:text-xl
                  leading-relaxed
                  sm:leading-relaxed
                  text-body-color
                "
                >
                  There are many variations of passages of Lorem Ipsum available
                  but the majority have suffered alteration in some form.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 lg:w-1/3 px-4">
              <div
                className="
                ud-single-testimonial
                p-8
                bg-white
                mb-12
                shadow-testimonial
                wow
                fadeInUp
              "
                data-wow-delay=".1s
              "
              >
                <div className="ud-testimonial-ratings flex items-center mb-3">
                <span className="text-[#fbb040] mr-1">
                  <svg
                    width="18"
                    height="16"
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path
                      d="M9.09815 0.360596L11.1054 6.06493H17.601L12.3459 9.5904L14.3532 15.2947L9.09815 11.7693L3.84309 15.2947L5.85035 9.5904L0.595291 6.06493H7.0909L9.09815 0.360596Z"
                    />
                  </svg>
                </span>
                  <span className="text-[#fbb040] mr-1">
                  <svg
                    width="18"
                    height="16"
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path
                      d="M9.09815 0.360596L11.1054 6.06493H17.601L12.3459 9.5904L14.3532 15.2947L9.09815 11.7693L3.84309 15.2947L5.85035 9.5904L0.595291 6.06493H7.0909L9.09815 0.360596Z"
                    />
                  </svg>
                </span>
                  <span className="text-[#fbb040] mr-1">
                  <svg
                    width="18"
                    height="16"
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path
                      d="M9.09815 0.360596L11.1054 6.06493H17.601L12.3459 9.5904L14.3532 15.2947L9.09815 11.7693L3.84309 15.2947L5.85035 9.5904L0.595291 6.06493H7.0909L9.09815 0.360596Z"
                    />
                  </svg>
                </span>
                  <span className="text-[#fbb040] mr-1">
                  <svg
                    width="18"
                    height="16"
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path
                      d="M9.09815 0.360596L11.1054 6.06493H17.601L12.3459 9.5904L14.3532 15.2947L9.09815 11.7693L3.84309 15.2947L5.85035 9.5904L0.595291 6.06493H7.0909L9.09815 0.360596Z"
                    />
                  </svg>
                </span>
                  <span className="text-[#fbb040] mr-1">
                  <svg
                    width="18"
                    height="16"
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path
                      d="M9.09815 0.360596L11.1054 6.06493H17.601L12.3459 9.5904L14.3532 15.2947L9.09815 11.7693L3.84309 15.2947L5.85035 9.5904L0.595291 6.06493H7.0909L9.09815 0.360596Z"
                    />
                  </svg>
                </span>
                </div>
                <div className="ud-testimonial-content mb-6">
                  <p className="text-base tracking-wide text-body-color">
                    “Our members are so impressed. It's intuitive. It's clean.
                    It's distraction free. If you're building a community.
                  </p>
                </div>
                <div className="ud-testimonial-info flex items-center">
                  <div
                    className="
                    ud-testimonial-image
                    w-[50px]
                    h-[50px]
                    rounded-full
                    overflow-hidden
                    mr-5
                  "
                  >
                    <img
                      src={require("../assets/images/testimonials/author-01.png")}
                      alt="author"
                    />
                  </div>
                  <div className="ud-testimonial-meta">
                    <h4 className="text-sm font-semibold">Sabo Masties</h4>
                    <p className="text-[#969696] text-xs">Founder @ Rolex</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3 px-4">
              <div
                className="
                ud-single-testimonial
                p-8
                bg-white
                mb-12
                shadow-testimonial
                wow
                fadeInUp
              "
                data-wow-delay=".15s
              "
              >
                <div className="ud-testimonial-ratings flex items-center mb-3">
                <span className="text-[#fbb040] mr-1">
                  <svg
                    width="18"
                    height="16"
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path
                      d="M9.09815 0.360596L11.1054 6.06493H17.601L12.3459 9.5904L14.3532 15.2947L9.09815 11.7693L3.84309 15.2947L5.85035 9.5904L0.595291 6.06493H7.0909L9.09815 0.360596Z"
                    />
                  </svg>
                </span>
                  <span className="text-[#fbb040] mr-1">
                  <svg
                    width="18"
                    height="16"
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path
                      d="M9.09815 0.360596L11.1054 6.06493H17.601L12.3459 9.5904L14.3532 15.2947L9.09815 11.7693L3.84309 15.2947L5.85035 9.5904L0.595291 6.06493H7.0909L9.09815 0.360596Z"
                    />
                  </svg>
                </span>
                  <span className="text-[#fbb040] mr-1">
                  <svg
                    width="18"
                    height="16"
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path
                      d="M9.09815 0.360596L11.1054 6.06493H17.601L12.3459 9.5904L14.3532 15.2947L9.09815 11.7693L3.84309 15.2947L5.85035 9.5904L0.595291 6.06493H7.0909L9.09815 0.360596Z"
                    />
                  </svg>
                </span>
                  <span className="text-[#fbb040] mr-1">
                  <svg
                    width="18"
                    height="16"
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path
                      d="M9.09815 0.360596L11.1054 6.06493H17.601L12.3459 9.5904L14.3532 15.2947L9.09815 11.7693L3.84309 15.2947L5.85035 9.5904L0.595291 6.06493H7.0909L9.09815 0.360596Z"
                    />
                  </svg>
                </span>
                  <span className="text-[#fbb040] mr-1">
                  <svg
                    width="18"
                    height="16"
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path
                      d="M9.09815 0.360596L11.1054 6.06493H17.601L12.3459 9.5904L14.3532 15.2947L9.09815 11.7693L3.84309 15.2947L5.85035 9.5904L0.595291 6.06493H7.0909L9.09815 0.360596Z"
                    />
                  </svg>
                </span>
                </div>
                <div className="ud-testimonial-content mb-6">
                  <p className="text-base tracking-wide text-body-color">
                    “Our members are so impressed. It's intuitive. It's clean.
                    It's distraction free. If you're building a community.
                  </p>
                </div>
                <div className="ud-testimonial-info flex items-center">
                  <div
                    className="
                    ud-testimonial-image
                    w-[50px]
                    h-[50px]
                    rounded-full
                    overflow-hidden
                    mr-5
                  "
                  >
                    <img
                      src={require("../assets/images/testimonials/author-02.png")}
                      alt="author"
                    />
                  </div>
                  <div className="ud-testimonial-meta">
                    <h4 className="text-sm font-semibold">Margin Gesmu</h4>
                    <p className="text-[#969696] text-xs">Founder @ UI Hunter</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3 px-4">
              <div
                className="
                ud-single-testimonial
                p-8
                bg-white
                mb-12
                shadow-testimonial
                wow
                fadeInUp
              "
                data-wow-delay=".2s
              "
              >
                <div className="ud-testimonial-ratings flex items-center mb-3">
                <span className="text-[#fbb040] mr-1">
                  <svg
                    width="18"
                    height="16"
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path
                      d="M9.09815 0.360596L11.1054 6.06493H17.601L12.3459 9.5904L14.3532 15.2947L9.09815 11.7693L3.84309 15.2947L5.85035 9.5904L0.595291 6.06493H7.0909L9.09815 0.360596Z"
                    />
                  </svg>
                </span>
                  <span className="text-[#fbb040] mr-1">
                  <svg
                    width="18"
                    height="16"
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path
                      d="M9.09815 0.360596L11.1054 6.06493H17.601L12.3459 9.5904L14.3532 15.2947L9.09815 11.7693L3.84309 15.2947L5.85035 9.5904L0.595291 6.06493H7.0909L9.09815 0.360596Z"
                    />
                  </svg>
                </span>
                  <span className="text-[#fbb040] mr-1">
                  <svg
                    width="18"
                    height="16"
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path
                      d="M9.09815 0.360596L11.1054 6.06493H17.601L12.3459 9.5904L14.3532 15.2947L9.09815 11.7693L3.84309 15.2947L5.85035 9.5904L0.595291 6.06493H7.0909L9.09815 0.360596Z"
                    />
                  </svg>
                </span>
                  <span className="text-[#fbb040] mr-1">
                  <svg
                    width="18"
                    height="16"
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path
                      d="M9.09815 0.360596L11.1054 6.06493H17.601L12.3459 9.5904L14.3532 15.2947L9.09815 11.7693L3.84309 15.2947L5.85035 9.5904L0.595291 6.06493H7.0909L9.09815 0.360596Z"
                    />
                  </svg>
                </span>
                  <span className="text-[#fbb040] mr-1">
                  <svg
                    width="18"
                    height="16"
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path
                      d="M9.09815 0.360596L11.1054 6.06493H17.601L12.3459 9.5904L14.3532 15.2947L9.09815 11.7693L3.84309 15.2947L5.85035 9.5904L0.595291 6.06493H7.0909L9.09815 0.360596Z"
                    />
                  </svg>
                </span>
                </div>
                <div className="ud-testimonial-content mb-6">
                  <p className="text-base tracking-wide text-body-color">
                    “Our members are so impressed. It's intuitive. It's clean.
                    It's distraction free. If you're building a community.
                  </p>
                </div>
                <div className="ud-testimonial-info flex items-center">
                  <div
                    className="
                    ud-testimonial-image
                    w-[50px]
                    h-[50px]
                    rounded-full
                    overflow-hidden
                    mr-5
                  "
                  >
                    <img
                      src={require("../assets/images/testimonials/author-03.png")}
                      alt="author"
                    />
                  </div>
                  <div className="ud-testimonial-meta">
                    <h4 className="text-sm font-semibold">William Smith</h4>
                    <p className="text-[#969696] text-xs">Founder @ Trorex</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="
        bg-[#f3f4ff]
        pt-20
        lg:pt-[120px]
        pb-12
        lg:pb-[90px]
        relative
        z-20
        overflow-hidden
      "
      >
        <div className="container">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4">
              <div className="text-center mx-auto mb-[60px] lg:mb-20 max-w-[620px]">
              <span className="font-semibold text-lg text-primary mb-2 block">
                FAQ
              </span>
                <h2
                  className="
                  font-bold
                  text-3xl
                  sm:text-4xl
                  md:text-[42px]
                  text-dark
                  mb-4
                "
                >
                  Any Questions? Answered
                </h2>
                <p
                  className="
                  text-lg
                  sm:text-xl
                  leading-relaxed
                  sm:leading-relaxed
                  text-body-color
                "
                >
                  There are many variations of passages of Lorem Ipsum available
                  but the majority have suffered alteration in some form.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap -mx-4">
            <div className="w-full lg:w-1/2 px-4">
              <div
                className="
                single-faq
                w-full
                bg-white
                border border-[#F3F4FE]
                rounded-lg
                p-5
                sm:p-8
                mb-8
                wow
                fadeInUp
              "
                data-wow-delay=".1s
              "
              >
                <button className="faq-btn flex items-center w-full text-left">
                  <div
                    className="
                    w-full
                    max-w-[40px]
                    h-10
                    flex
                    items-center
                    justify-center
                    rounded-lg
                    bg-primary
                    text-primary
                    bg-opacity-5
                    mr-5
                  "
                  >
                    <svg
                      width="17"
                      height="10"
                      viewBox="0 0 17 10"
                      className="fill-current icon"
                    >
                      <path
                        d="M7.28687 8.43257L7.28679 8.43265L7.29496 8.43985C7.62576 8.73124 8.02464 8.86001 8.41472 8.86001C8.83092 8.86001 9.22376 8.69083 9.53447 8.41713L9.53454 8.41721L9.54184 8.41052L15.7631 2.70784L15.7691 2.70231L15.7749 2.69659C16.0981 2.38028 16.1985 1.80579 15.7981 1.41393C15.4803 1.1028 14.9167 1.00854 14.5249 1.38489L8.41472 7.00806L2.29995 1.38063L2.29151 1.37286L2.28271 1.36548C1.93092 1.07036 1.38469 1.06804 1.03129 1.41393L1.01755 1.42738L1.00488 1.44184C0.69687 1.79355 0.695778 2.34549 1.0545 2.69659L1.05999 2.70196L1.06565 2.70717L7.28687 8.43257Z"
                        fill="#3056D3"
                        stroke="#3056D3"
                      />
                    </svg>
                  </div>
                  <div className="w-full">
                    <h4 className="text-base sm:text-lg font-semibold text-black">
                      How to use TailGrids?
                    </h4>
                  </div>
                </button>
                <div className="faq-content pl-[62px] hidden">
                  <p className="text-base text-body-color leading-relaxed py-3">
                    It takes 2-3 weeks to get your first blog post ready. That
                    includes the in-depth research & creation of your monthly
                    content marketing strategy that we do before writing your
                    first blog post, Ipsum available .
                  </p>
                </div>
              </div>
              <div
                className="
                single-faq
                w-full
                bg-white
                border border-[#F3F4FE]
                rounded-lg
                p-5
                sm:p-8
                mb-8
                wow
                fadeInUp
              "
                data-wow-delay=".15s
              "
              >
                <button className="faq-btn flex items-center w-full text-left">
                  <div
                    className="
                    w-full
                    max-w-[40px]
                    h-10
                    flex
                    items-center
                    justify-center
                    rounded-lg
                    bg-primary
                    text-primary
                    bg-opacity-5
                    mr-5
                  "
                  >
                    <svg
                      width="17"
                      height="10"
                      viewBox="0 0 17 10"
                      className="fill-current icon"
                    >
                      <path
                        d="M7.28687 8.43257L7.28679 8.43265L7.29496 8.43985C7.62576 8.73124 8.02464 8.86001 8.41472 8.86001C8.83092 8.86001 9.22376 8.69083 9.53447 8.41713L9.53454 8.41721L9.54184 8.41052L15.7631 2.70784L15.7691 2.70231L15.7749 2.69659C16.0981 2.38028 16.1985 1.80579 15.7981 1.41393C15.4803 1.1028 14.9167 1.00854 14.5249 1.38489L8.41472 7.00806L2.29995 1.38063L2.29151 1.37286L2.28271 1.36548C1.93092 1.07036 1.38469 1.06804 1.03129 1.41393L1.01755 1.42738L1.00488 1.44184C0.69687 1.79355 0.695778 2.34549 1.0545 2.69659L1.05999 2.70196L1.06565 2.70717L7.28687 8.43257Z"
                        fill="#3056D3"
                        stroke="#3056D3"
                      />
                    </svg>
                  </div>
                  <div className="w-full">
                    <h4 className="text-base sm:text-lg font-semibold text-black">
                      How to download icons from LineIcons?
                    </h4>
                  </div>
                </button>
                <div className="faq-content pl-[62px] hidden">
                  <p className="text-base text-body-color leading-relaxed py-3">
                    It takes 2-3 weeks to get your first blog post ready. That
                    includes the in-depth research & creation of your monthly
                    content marketing strategy that we do before writing your
                    first blog post, Ipsum available .
                  </p>
                </div>
              </div>
              <div
                className="
                single-faq
                w-full
                bg-white
                border border-[#F3F4FE]
                rounded-lg
                p-5
                sm:p-8
                mb-8
                wow
                fadeInUp
              "
                data-wow-delay=".2s
              "
              >
                <button className="faq-btn flex items-center w-full text-left">
                  <div
                    className="
                    w-full
                    max-w-[40px]
                    h-10
                    flex
                    items-center
                    justify-center
                    rounded-lg
                    bg-primary
                    text-primary
                    bg-opacity-5
                    mr-5
                  "
                  >
                    <svg
                      width="17"
                      height="10"
                      viewBox="0 0 17 10"
                      className="fill-current icon"
                    >
                      <path
                        d="M7.28687 8.43257L7.28679 8.43265L7.29496 8.43985C7.62576 8.73124 8.02464 8.86001 8.41472 8.86001C8.83092 8.86001 9.22376 8.69083 9.53447 8.41713L9.53454 8.41721L9.54184 8.41052L15.7631 2.70784L15.7691 2.70231L15.7749 2.69659C16.0981 2.38028 16.1985 1.80579 15.7981 1.41393C15.4803 1.1028 14.9167 1.00854 14.5249 1.38489L8.41472 7.00806L2.29995 1.38063L2.29151 1.37286L2.28271 1.36548C1.93092 1.07036 1.38469 1.06804 1.03129 1.41393L1.01755 1.42738L1.00488 1.44184C0.69687 1.79355 0.695778 2.34549 1.0545 2.69659L1.05999 2.70196L1.06565 2.70717L7.28687 8.43257Z"
                        fill="#3056D3"
                        stroke="#3056D3"
                      />
                    </svg>
                  </div>
                  <div className="w-full">
                    <h4 className="text-base sm:text-lg font-semibold text-black">
                      Is GrayGrids part of UIdeck?
                    </h4>
                  </div>
                </button>
                <div className="faq-content pl-[62px] hidden">
                  <p className="text-base text-body-color leading-relaxed py-3">
                    It takes 2-3 weeks to get your first blog post ready. That
                    includes the in-depth research & creation of your monthly
                    content marketing strategy that we do before writing your
                    first blog post, Ipsum available .
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 px-4">
              <div
                className="
                single-faq
                w-full
                bg-white
                border border-[#F3F4FE]
                rounded-lg
                p-5
                sm:p-8
                mb-8
                wow
                fadeInUp
              "
                data-wow-delay=".1s
              "
              >
                <button className="faq-btn flex items-center w-full text-left">
                  <div
                    className="
                    w-full
                    max-w-[40px]
                    h-10
                    flex
                    items-center
                    justify-center
                    rounded-lg
                    bg-primary
                    text-primary
                    bg-opacity-5
                    mr-5
                  "
                  >
                    <svg
                      width="17"
                      height="10"
                      viewBox="0 0 17 10"
                      className="fill-current icon"
                    >
                      <path
                        d="M7.28687 8.43257L7.28679 8.43265L7.29496 8.43985C7.62576 8.73124 8.02464 8.86001 8.41472 8.86001C8.83092 8.86001 9.22376 8.69083 9.53447 8.41713L9.53454 8.41721L9.54184 8.41052L15.7631 2.70784L15.7691 2.70231L15.7749 2.69659C16.0981 2.38028 16.1985 1.80579 15.7981 1.41393C15.4803 1.1028 14.9167 1.00854 14.5249 1.38489L8.41472 7.00806L2.29995 1.38063L2.29151 1.37286L2.28271 1.36548C1.93092 1.07036 1.38469 1.06804 1.03129 1.41393L1.01755 1.42738L1.00488 1.44184C0.69687 1.79355 0.695778 2.34549 1.0545 2.69659L1.05999 2.70196L1.06565 2.70717L7.28687 8.43257Z"
                        fill="#3056D3"
                        stroke="#3056D3"
                      />
                    </svg>
                  </div>
                  <div className="w-full">
                    <h4 className="text-base sm:text-lg font-semibold text-black">
                      Can I use this template for commercial project?
                    </h4>
                  </div>
                </button>
                <div className="faq-content pl-[62px] hidden">
                  <p className="text-base text-body-color leading-relaxed py-3">
                    It takes 2-3 weeks to get your first blog post ready. That
                    includes the in-depth research & creation of your monthly
                    content marketing strategy that we do before writing your
                    first blog post, Ipsum available .
                  </p>
                </div>
              </div>
              <div
                className="
                single-faq
                w-full
                bg-white
                border border-[#F3F4FE]
                rounded-lg
                p-5
                sm:p-8
                mb-8
                wow
                fadeInUp
              "
                data-wow-delay=".15s
              "
              >
                <button className="faq-btn flex items-center w-full text-left">
                  <div
                    className="
                    w-full
                    max-w-[40px]
                    h-10
                    flex
                    items-center
                    justify-center
                    rounded-lg
                    bg-primary
                    text-primary
                    bg-opacity-5
                    mr-5
                  "
                  >
                    <svg
                      width="17"
                      height="10"
                      viewBox="0 0 17 10"
                      className="fill-current icon"
                    >
                      <path
                        d="M7.28687 8.43257L7.28679 8.43265L7.29496 8.43985C7.62576 8.73124 8.02464 8.86001 8.41472 8.86001C8.83092 8.86001 9.22376 8.69083 9.53447 8.41713L9.53454 8.41721L9.54184 8.41052L15.7631 2.70784L15.7691 2.70231L15.7749 2.69659C16.0981 2.38028 16.1985 1.80579 15.7981 1.41393C15.4803 1.1028 14.9167 1.00854 14.5249 1.38489L8.41472 7.00806L2.29995 1.38063L2.29151 1.37286L2.28271 1.36548C1.93092 1.07036 1.38469 1.06804 1.03129 1.41393L1.01755 1.42738L1.00488 1.44184C0.69687 1.79355 0.695778 2.34549 1.0545 2.69659L1.05999 2.70196L1.06565 2.70717L7.28687 8.43257Z"
                        fill="#3056D3"
                        stroke="#3056D3"
                      />
                    </svg>
                  </div>
                  <div className="w-full">
                    <h4 className="text-base sm:text-lg font-semibold text-black">
                      Do you have plan to releasing Play Pro?
                    </h4>
                  </div>
                </button>
                <div className="faq-content pl-[62px] hidden">
                  <p className="text-base text-body-color leading-relaxed py-3">
                    It takes 2-3 weeks to get your first blog post ready. That
                    includes the in-depth research & creation of your monthly
                    content marketing strategy that we do before writing your
                    first blog post, Ipsum available .
                  </p>
                </div>
              </div>
              <div
                className="
                single-faq
                w-full
                bg-white
                border border-[#F3F4FE]
                rounded-lg
                p-5
                sm:p-8
                mb-8
                wow
                fadeInUp
              "
                data-wow-delay=".2s
              "
              >
                <button className="faq-btn flex items-center w-full text-left">
                  <div
                    className="
                    w-full
                    max-w-[40px]
                    h-10
                    flex
                    items-center
                    justify-center
                    rounded-lg
                    bg-primary
                    text-primary
                    bg-opacity-5
                    mr-5
                  "
                  >
                    <svg
                      width="17"
                      height="10"
                      viewBox="0 0 17 10"
                      className="fill-current icon"
                    >
                      <path
                        d="M7.28687 8.43257L7.28679 8.43265L7.29496 8.43985C7.62576 8.73124 8.02464 8.86001 8.41472 8.86001C8.83092 8.86001 9.22376 8.69083 9.53447 8.41713L9.53454 8.41721L9.54184 8.41052L15.7631 2.70784L15.7691 2.70231L15.7749 2.69659C16.0981 2.38028 16.1985 1.80579 15.7981 1.41393C15.4803 1.1028 14.9167 1.00854 14.5249 1.38489L8.41472 7.00806L2.29995 1.38063L2.29151 1.37286L2.28271 1.36548C1.93092 1.07036 1.38469 1.06804 1.03129 1.41393L1.01755 1.42738L1.00488 1.44184C0.69687 1.79355 0.695778 2.34549 1.0545 2.69659L1.05999 2.70196L1.06565 2.70717L7.28687 8.43257Z"
                        fill="#3056D3"
                        stroke="#3056D3"
                      />
                    </svg>
                  </div>
                  <div className="w-full">
                    <h4 className="text-base sm:text-lg font-semibold text-black">
                      Where and how to host this template?
                    </h4>
                  </div>
                </button>
                <div className="faq-content pl-[62px] hidden">
                  <p className="text-base text-body-color leading-relaxed py-3">
                    It takes 2-3 weeks to get your first blog post ready. That
                    includes the in-depth research & creation of your monthly
                    content marketing strategy that we do before writing your
                    first blog post, Ipsum available .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 z-[-1]">
          <svg
            width="1440"
            height="886"
            viewBox="0 0 1440 886"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.5"
              d="M193.307 -273.321L1480.87 1014.24L1121.85 1373.26C1121.85 1373.26 731.745 983.231 478.513 729.927C225.976 477.317 -165.714 85.6993 -165.714 85.6993L193.307 -273.321Z"
              fill="url(#paint0_linear)"
            />
            <defs>
              <linearGradient
                id="paint0_linear"
                x1="1308.65"
                y1="1142.58"
                x2="602.827"
                y2="-418.681"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#3056D3" stopOpacity="0.36" />
                <stop offset="1" stopColor="#F5F2FD" stopOpacity="0" />
                <stop offset="1" stopColor="#F5F2FD" stopOpacity="0.096144" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      <section id="team" className="pt-20 lg:pt-[120px] pb-10 lg:pb-20">
        <div className="container">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4">
              <div className="text-center mx-auto mb-[60px] max-w-[620px]">
              <span className="font-semibold text-lg text-primary mb-2 block">
                Our Team
              </span>
                <h2
                  className="
                  font-bold
                  text-3xl
                  sm:text-4xl
                  md:text-[42px]
                  text-dark
                  mb-4
                "
                >
                  Meet Our Team
                </h2>
                <p
                  className="
                  text-lg
                  sm:text-xl
                  leading-relaxed
                  sm:leading-relaxed
                  text-body-color
                "
                >
                  There are many variations of passages of Lorem Ipsum available
                  but the majority have suffered alteration in some form.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center -mx-4">
            <div className="w-full sm:w-1/2 lg:w-1/4 px-4">
              <div className="mb-10 wow fadeInUp" data-wow-delay=".1s">
                <div
                  className="
                  relative
                  w-[170px]
                  h-170px]
                  rounded-full
                  z-10
                  mx-auto
                  mb-6
                "
                >
                  <img
                    src={require("../assets/images/team/team-01.png")}
                    alt="image"
                    className="w-full rounded-full"
                  />
                  <span className="absolute top-0 left-0 z-[-1]">
                  <svg
                    width="71"
                    height="82"
                    viewBox="0 0 71 82"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="1.29337"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 1.29337 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 12.6747 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 24.0575 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 35.4379 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 46.8197 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 68.807 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9443"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 57.9443 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="69.3249"
                      r="1.29337"
                      transform="rotate(-90 1.29337 69.3249)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="69.3249"
                      r="1.29337"
                      transform="rotate(-90 12.6747 69.3249)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="69.3249"
                      r="1.29337"
                      transform="rotate(-90 24.0575 69.3249)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="69.3249"
                      r="1.29337"
                      transform="rotate(-90 35.4379 69.3249)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="69.325"
                      r="1.29337"
                      transform="rotate(-90 46.8197 69.325)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="69.325"
                      r="1.29337"
                      transform="rotate(-90 68.807 69.325)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9433"
                      cy="69.325"
                      r="1.29337"
                      transform="rotate(-90 57.9433 69.325)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="57.9433"
                      r="1.29337"
                      transform="rotate(-90 1.29337 57.9433)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="24.0568"
                      r="1.29337"
                      transform="rotate(-90 1.29337 24.0568)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="57.9433"
                      r="1.29337"
                      transform="rotate(-90 12.6747 57.9433)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="24.0568"
                      r="1.29337"
                      transform="rotate(-90 12.6747 24.0568)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="57.9433"
                      r="1.29337"
                      transform="rotate(-90 24.0575 57.9433)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="24.0568"
                      r="1.29337"
                      transform="rotate(-90 24.0575 24.0568)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="57.9433"
                      r="1.29337"
                      transform="rotate(-90 35.4379 57.9433)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="24.0568"
                      r="1.29337"
                      transform="rotate(-90 35.4379 24.0568)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="57.9431"
                      r="1.29337"
                      transform="rotate(-90 46.8197 57.9431)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="24.0567"
                      r="1.29337"
                      transform="rotate(-90 46.8197 24.0567)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="57.9431"
                      r="1.29337"
                      transform="rotate(-90 68.807 57.9431)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="24.0567"
                      r="1.29337"
                      transform="rotate(-90 68.807 24.0567)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9433"
                      cy="57.9431"
                      r="1.29337"
                      transform="rotate(-90 57.9433 57.9431)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9443"
                      cy="24.0567"
                      r="1.29337"
                      transform="rotate(-90 57.9443 24.0567)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 1.29337 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 1.29337 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 12.6747 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 12.6747 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 24.0575 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 24.0575 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 35.4379 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 35.4379 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 46.8197 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 46.8197 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 68.807 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 68.807 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9433"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 57.9433 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9443"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 57.9443 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="35.1798"
                      r="1.29337"
                      transform="rotate(-90 1.29337 35.1798)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="1.2933"
                      r="1.29337"
                      transform="rotate(-90 1.29337 1.2933)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="35.1798"
                      r="1.29337"
                      transform="rotate(-90 12.6747 35.1798)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="1.2933"
                      r="1.29337"
                      transform="rotate(-90 12.6747 1.2933)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="35.1798"
                      r="1.29337"
                      transform="rotate(-90 24.0575 35.1798)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="1.29336"
                      r="1.29337"
                      transform="rotate(-90 24.0575 1.29336)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="35.1798"
                      r="1.29337"
                      transform="rotate(-90 35.4379 35.1798)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="1.29336"
                      r="1.29337"
                      transform="rotate(-90 35.4379 1.29336)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="35.18"
                      r="1.29337"
                      transform="rotate(-90 46.8197 35.18)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="1.29354"
                      r="1.29337"
                      transform="rotate(-90 46.8197 1.29354)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="35.18"
                      r="1.29337"
                      transform="rotate(-90 68.807 35.18)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="1.29354"
                      r="1.29337"
                      transform="rotate(-90 68.807 1.29354)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9443"
                      cy="35.18"
                      r="1.29337"
                      transform="rotate(-90 57.9443 35.18)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9443"
                      cy="1.29354"
                      r="1.29337"
                      transform="rotate(-90 57.9443 1.29354)"
                      fill="#3056D3"
                    />
                  </svg>
                </span>
                  <span className="absolute right-0 bottom-0">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.5 21.5L0.505701 21.5C0.767606 10.023 10.023 0.767604 21.5 0.505697L21.5 21.5Z"
                      stroke="#13C296"
                    />
                  </svg>
                </span>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-lg text-dark mb-2">
                    Adveen Desuza
                  </h4>
                  <p className="font-medium text-sm text-body-color mb-5">
                    UI Designer
                  </p>
                  <div className="flex items-center justify-center">
                    <a
                      href="#"
                      className="
                      text-[#cdced6]
                      hover:text-primary
                      w-8
                      h-8
                      mx-2
                      flex
                      items-center
                      justify-center
                    "
                    >
                      <svg
                        width="10"
                        height="18"
                        viewBox="0 0 10 18"
                        className="fill-current"
                      >
                        <path
                          d="M9.29878 7.2H7.74898H7.19548V6.61935V4.81936V4.23871H7.74898H8.91133C9.21575 4.23871 9.46483 4.00645 9.46483 3.65806V0.580645C9.46483 0.26129 9.24343 0 8.91133 0H6.89106C4.70474 0 3.18262 1.62581 3.18262 4.03548V6.56129V7.14194H2.62912H0.747223C0.359774 7.14194 0 7.46129 0 7.92581V10.0161C0 10.4226 0.304424 10.8 0.747223 10.8H2.57377H3.12727V11.3806V17.2161C3.12727 17.6226 3.43169 18 3.87449 18H6.47593C6.64198 18 6.78036 17.9129 6.89106 17.7968C7.00176 17.6806 7.08478 17.4774 7.08478 17.3032V11.4097V10.829H7.66596H8.91133C9.2711 10.829 9.54785 10.5968 9.6032 10.2484V10.2194V10.1903L9.99065 8.1871C10.0183 7.98387 9.99065 7.75161 9.8246 7.51935C9.76925 7.37419 9.52018 7.22903 9.29878 7.2Z"
                        />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="
                      text-[#cdced6]
                      hover:text-primary
                      w-8
                      h-8
                      mx-2
                      flex
                      items-center
                      justify-center
                    "
                    >
                      <svg
                        width="18"
                        height="14"
                        viewBox="0 0 18 14"
                        className="fill-current"
                      >
                        <path
                          d="M15.9968 2.41096L17.1 1.09589C17.4194 0.739726 17.5065 0.465753 17.5355 0.328767C16.6645 0.821918 15.8516 0.986301 15.329 0.986301H15.1258L15.0097 0.876712C14.3129 0.30137 13.4419 0 12.5129 0C10.4806 0 8.88387 1.58904 8.88387 3.42466C8.88387 3.53425 8.88387 3.69863 8.9129 3.80822L9 4.35616L8.39032 4.32877C4.67419 4.21918 1.62581 1.20548 1.13226 0.684932C0.319355 2.05479 0.783871 3.36986 1.27742 4.19178L2.26452 5.72603L0.696774 4.90411C0.725806 6.05479 1.19032 6.9589 2.09032 7.61644L2.87419 8.16438L2.09032 8.46575C2.58387 9.86301 3.6871 10.4384 4.5 10.6575L5.57419 10.9315L4.55806 11.589C2.93226 12.6849 0.9 12.6027 0 12.5205C1.82903 13.726 4.00645 14 5.51613 14C6.64839 14 7.49032 13.8904 7.69355 13.8082C15.8226 12 16.2 5.15068 16.2 3.78082V3.58904L16.3742 3.47945C17.3613 2.60274 17.7677 2.13699 18 1.86301C17.9129 1.89041 17.7968 1.94521 17.6806 1.9726L15.9968 2.41096Z"
                        />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="
                      text-[#cdced6]
                      hover:text-primary
                      w-8
                      h-8
                      mx-2
                      flex
                      items-center
                      justify-center
                    "
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        className="fill-current"
                      >
                        <path
                          d="M8.90245 12.1939C10.7363 12.1939 12.2229 10.7073 12.2229 8.87352C12.2229 7.0397 10.7363 5.5531 8.90245 5.5531C7.06863 5.5531 5.58203 7.0397 5.58203 8.87352C5.58203 10.7073 7.06863 12.1939 8.90245 12.1939Z"
                        />
                        <path
                          d="M12.5088 0H5.23824C2.34719 0 0 2.34719 0 5.23824V12.4516C0 15.3999 2.34719 17.7471 5.23824 17.7471H12.4516C15.3999 17.7471 17.7471 15.3999 17.7471 12.5088V5.23824C17.7471 2.34719 15.3999 0 12.5088 0ZM8.90215 13.2244C6.46909 13.2244 4.55126 11.2493 4.55126 8.87353C4.55126 6.49771 6.49771 4.52264 8.90215 4.52264C11.278 4.52264 13.2244 6.49771 13.2244 8.87353C13.2244 11.2493 11.3066 13.2244 8.90215 13.2244ZM14.9133 4.92338C14.627 5.23824 14.1976 5.40999 13.711 5.40999C13.2817 5.40999 12.8523 5.23824 12.5088 4.92338C12.1939 4.60851 12.0222 4.20777 12.0222 3.72116C12.0222 3.23454 12.1939 2.86243 12.5088 2.51894C12.8237 2.17545 13.2244 2.0037 13.711 2.0037C14.1404 2.0037 14.5984 2.17545 14.9133 2.49031C15.1995 2.86243 15.3999 3.29179 15.3999 3.74978C15.3712 4.20777 15.1995 4.60851 14.9133 4.92338Z"
                        />
                        <path
                          d="M13.7397 3.03418C13.3676 3.03418 13.0527 3.34905 13.0527 3.72116C13.0527 4.09328 13.3676 4.40815 13.7397 4.40815C14.1118 4.40815 14.4267 4.09328 14.4267 3.72116C14.4267 3.34905 14.1405 3.03418 13.7397 3.03418Z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 px-4">
              <div className="mb-10 wow fadeInUp" data-wow-delay=".15s">
                <div
                  className="
                  relative
                  w-[170px]
                  h-170px]
                  rounded-full
                  z-10
                  mx-auto
                  mb-6
                "
                >
                  <img
                    src={require("../assets/images/team/team-02.png")}
                    alt="image"
                    className="w-full rounded-full"
                  />
                  <span className="absolute top-0 left-0 z-[-1]">
                  <svg
                    width="71"
                    height="82"
                    viewBox="0 0 71 82"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="1.29337"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 1.29337 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 12.6747 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 24.0575 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 35.4379 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 46.8197 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 68.807 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9443"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 57.9443 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="69.3249"
                      r="1.29337"
                      transform="rotate(-90 1.29337 69.3249)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="69.3249"
                      r="1.29337"
                      transform="rotate(-90 12.6747 69.3249)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="69.3249"
                      r="1.29337"
                      transform="rotate(-90 24.0575 69.3249)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="69.3249"
                      r="1.29337"
                      transform="rotate(-90 35.4379 69.3249)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="69.325"
                      r="1.29337"
                      transform="rotate(-90 46.8197 69.325)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="69.325"
                      r="1.29337"
                      transform="rotate(-90 68.807 69.325)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9433"
                      cy="69.325"
                      r="1.29337"
                      transform="rotate(-90 57.9433 69.325)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="57.9433"
                      r="1.29337"
                      transform="rotate(-90 1.29337 57.9433)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="24.0568"
                      r="1.29337"
                      transform="rotate(-90 1.29337 24.0568)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="57.9433"
                      r="1.29337"
                      transform="rotate(-90 12.6747 57.9433)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="24.0568"
                      r="1.29337"
                      transform="rotate(-90 12.6747 24.0568)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="57.9433"
                      r="1.29337"
                      transform="rotate(-90 24.0575 57.9433)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="24.0568"
                      r="1.29337"
                      transform="rotate(-90 24.0575 24.0568)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="57.9433"
                      r="1.29337"
                      transform="rotate(-90 35.4379 57.9433)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="24.0568"
                      r="1.29337"
                      transform="rotate(-90 35.4379 24.0568)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="57.9431"
                      r="1.29337"
                      transform="rotate(-90 46.8197 57.9431)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="24.0567"
                      r="1.29337"
                      transform="rotate(-90 46.8197 24.0567)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="57.9431"
                      r="1.29337"
                      transform="rotate(-90 68.807 57.9431)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="24.0567"
                      r="1.29337"
                      transform="rotate(-90 68.807 24.0567)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9433"
                      cy="57.9431"
                      r="1.29337"
                      transform="rotate(-90 57.9433 57.9431)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9443"
                      cy="24.0567"
                      r="1.29337"
                      transform="rotate(-90 57.9443 24.0567)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 1.29337 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 1.29337 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 12.6747 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 12.6747 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 24.0575 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 24.0575 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 35.4379 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 35.4379 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 46.8197 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 46.8197 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 68.807 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 68.807 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9433"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 57.9433 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9443"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 57.9443 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="35.1798"
                      r="1.29337"
                      transform="rotate(-90 1.29337 35.1798)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="1.2933"
                      r="1.29337"
                      transform="rotate(-90 1.29337 1.2933)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="35.1798"
                      r="1.29337"
                      transform="rotate(-90 12.6747 35.1798)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="1.2933"
                      r="1.29337"
                      transform="rotate(-90 12.6747 1.2933)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="35.1798"
                      r="1.29337"
                      transform="rotate(-90 24.0575 35.1798)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="1.29336"
                      r="1.29337"
                      transform="rotate(-90 24.0575 1.29336)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="35.1798"
                      r="1.29337"
                      transform="rotate(-90 35.4379 35.1798)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="1.29336"
                      r="1.29337"
                      transform="rotate(-90 35.4379 1.29336)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="35.18"
                      r="1.29337"
                      transform="rotate(-90 46.8197 35.18)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="1.29354"
                      r="1.29337"
                      transform="rotate(-90 46.8197 1.29354)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="35.18"
                      r="1.29337"
                      transform="rotate(-90 68.807 35.18)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="1.29354"
                      r="1.29337"
                      transform="rotate(-90 68.807 1.29354)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9443"
                      cy="35.18"
                      r="1.29337"
                      transform="rotate(-90 57.9443 35.18)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9443"
                      cy="1.29354"
                      r="1.29337"
                      transform="rotate(-90 57.9443 1.29354)"
                      fill="#3056D3"
                    />
                  </svg>
                </span>
                  <span className="absolute right-0 bottom-0">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.5 21.5L0.505701 21.5C0.767606 10.023 10.023 0.767604 21.5 0.505697L21.5 21.5Z"
                      stroke="#13C296"
                    />
                  </svg>
                </span>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-lg text-dark mb-2">Jezmin uniya</h4>
                  <p className="font-medium text-sm text-body-color mb-5">
                    Product Designer
                  </p>
                  <div className="flex items-center justify-center">
                    <a
                      href="#"
                      className="
                      text-[#cdced6]
                      hover:text-primary
                      w-8
                      h-8
                      mx-2
                      flex
                      items-center
                      justify-center
                    "
                    >
                      <svg
                        width="10"
                        height="18"
                        viewBox="0 0 10 18"
                        className="fill-current"
                      >
                        <path
                          d="M9.29878 7.2H7.74898H7.19548V6.61935V4.81936V4.23871H7.74898H8.91133C9.21575 4.23871 9.46483 4.00645 9.46483 3.65806V0.580645C9.46483 0.26129 9.24343 0 8.91133 0H6.89106C4.70474 0 3.18262 1.62581 3.18262 4.03548V6.56129V7.14194H2.62912H0.747223C0.359774 7.14194 0 7.46129 0 7.92581V10.0161C0 10.4226 0.304424 10.8 0.747223 10.8H2.57377H3.12727V11.3806V17.2161C3.12727 17.6226 3.43169 18 3.87449 18H6.47593C6.64198 18 6.78036 17.9129 6.89106 17.7968C7.00176 17.6806 7.08478 17.4774 7.08478 17.3032V11.4097V10.829H7.66596H8.91133C9.2711 10.829 9.54785 10.5968 9.6032 10.2484V10.2194V10.1903L9.99065 8.1871C10.0183 7.98387 9.99065 7.75161 9.8246 7.51935C9.76925 7.37419 9.52018 7.22903 9.29878 7.2Z"
                        />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="
                      text-[#cdced6]
                      hover:text-primary
                      w-8
                      h-8
                      mx-2
                      flex
                      items-center
                      justify-center
                    "
                    >
                      <svg
                        width="18"
                        height="14"
                        viewBox="0 0 18 14"
                        className="fill-current"
                      >
                        <path
                          d="M15.9968 2.41096L17.1 1.09589C17.4194 0.739726 17.5065 0.465753 17.5355 0.328767C16.6645 0.821918 15.8516 0.986301 15.329 0.986301H15.1258L15.0097 0.876712C14.3129 0.30137 13.4419 0 12.5129 0C10.4806 0 8.88387 1.58904 8.88387 3.42466C8.88387 3.53425 8.88387 3.69863 8.9129 3.80822L9 4.35616L8.39032 4.32877C4.67419 4.21918 1.62581 1.20548 1.13226 0.684932C0.319355 2.05479 0.783871 3.36986 1.27742 4.19178L2.26452 5.72603L0.696774 4.90411C0.725806 6.05479 1.19032 6.9589 2.09032 7.61644L2.87419 8.16438L2.09032 8.46575C2.58387 9.86301 3.6871 10.4384 4.5 10.6575L5.57419 10.9315L4.55806 11.589C2.93226 12.6849 0.9 12.6027 0 12.5205C1.82903 13.726 4.00645 14 5.51613 14C6.64839 14 7.49032 13.8904 7.69355 13.8082C15.8226 12 16.2 5.15068 16.2 3.78082V3.58904L16.3742 3.47945C17.3613 2.60274 17.7677 2.13699 18 1.86301C17.9129 1.89041 17.7968 1.94521 17.6806 1.9726L15.9968 2.41096Z"
                        />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="
                      text-[#cdced6]
                      hover:text-primary
                      w-8
                      h-8
                      mx-2
                      flex
                      items-center
                      justify-center
                    "
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        className="fill-current"
                      >
                        <path
                          d="M8.90245 12.1939C10.7363 12.1939 12.2229 10.7073 12.2229 8.87352C12.2229 7.0397 10.7363 5.5531 8.90245 5.5531C7.06863 5.5531 5.58203 7.0397 5.58203 8.87352C5.58203 10.7073 7.06863 12.1939 8.90245 12.1939Z"
                        />
                        <path
                          d="M12.5088 0H5.23824C2.34719 0 0 2.34719 0 5.23824V12.4516C0 15.3999 2.34719 17.7471 5.23824 17.7471H12.4516C15.3999 17.7471 17.7471 15.3999 17.7471 12.5088V5.23824C17.7471 2.34719 15.3999 0 12.5088 0ZM8.90215 13.2244C6.46909 13.2244 4.55126 11.2493 4.55126 8.87353C4.55126 6.49771 6.49771 4.52264 8.90215 4.52264C11.278 4.52264 13.2244 6.49771 13.2244 8.87353C13.2244 11.2493 11.3066 13.2244 8.90215 13.2244ZM14.9133 4.92338C14.627 5.23824 14.1976 5.40999 13.711 5.40999C13.2817 5.40999 12.8523 5.23824 12.5088 4.92338C12.1939 4.60851 12.0222 4.20777 12.0222 3.72116C12.0222 3.23454 12.1939 2.86243 12.5088 2.51894C12.8237 2.17545 13.2244 2.0037 13.711 2.0037C14.1404 2.0037 14.5984 2.17545 14.9133 2.49031C15.1995 2.86243 15.3999 3.29179 15.3999 3.74978C15.3712 4.20777 15.1995 4.60851 14.9133 4.92338Z"
                        />
                        <path
                          d="M13.7397 3.03418C13.3676 3.03418 13.0527 3.34905 13.0527 3.72116C13.0527 4.09328 13.3676 4.40815 13.7397 4.40815C14.1118 4.40815 14.4267 4.09328 14.4267 3.72116C14.4267 3.34905 14.1405 3.03418 13.7397 3.03418Z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 px-4">
              <div className="mb-10 wow fadeInUp" data-wow-delay=".2s">
                <div
                  className="
                  relative
                  w-[170px]
                  h-170px]
                  rounded-full
                  z-10
                  mx-auto
                  mb-6
                "
                >
                  <img
                    src={require("../assets/images/team/team-03.png")}
                    alt="image"
                    className="w-full rounded-full"
                  />
                  <span className="absolute top-0 left-0 z-[-1]">
                  <svg
                    width="71"
                    height="82"
                    viewBox="0 0 71 82"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="1.29337"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 1.29337 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 12.6747 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 24.0575 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 35.4379 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 46.8197 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 68.807 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9443"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 57.9443 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="69.3249"
                      r="1.29337"
                      transform="rotate(-90 1.29337 69.3249)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="69.3249"
                      r="1.29337"
                      transform="rotate(-90 12.6747 69.3249)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="69.3249"
                      r="1.29337"
                      transform="rotate(-90 24.0575 69.3249)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="69.3249"
                      r="1.29337"
                      transform="rotate(-90 35.4379 69.3249)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="69.325"
                      r="1.29337"
                      transform="rotate(-90 46.8197 69.325)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="69.325"
                      r="1.29337"
                      transform="rotate(-90 68.807 69.325)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9433"
                      cy="69.325"
                      r="1.29337"
                      transform="rotate(-90 57.9433 69.325)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="57.9433"
                      r="1.29337"
                      transform="rotate(-90 1.29337 57.9433)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="24.0568"
                      r="1.29337"
                      transform="rotate(-90 1.29337 24.0568)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="57.9433"
                      r="1.29337"
                      transform="rotate(-90 12.6747 57.9433)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="24.0568"
                      r="1.29337"
                      transform="rotate(-90 12.6747 24.0568)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="57.9433"
                      r="1.29337"
                      transform="rotate(-90 24.0575 57.9433)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="24.0568"
                      r="1.29337"
                      transform="rotate(-90 24.0575 24.0568)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="57.9433"
                      r="1.29337"
                      transform="rotate(-90 35.4379 57.9433)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="24.0568"
                      r="1.29337"
                      transform="rotate(-90 35.4379 24.0568)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="57.9431"
                      r="1.29337"
                      transform="rotate(-90 46.8197 57.9431)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="24.0567"
                      r="1.29337"
                      transform="rotate(-90 46.8197 24.0567)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="57.9431"
                      r="1.29337"
                      transform="rotate(-90 68.807 57.9431)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="24.0567"
                      r="1.29337"
                      transform="rotate(-90 68.807 24.0567)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9433"
                      cy="57.9431"
                      r="1.29337"
                      transform="rotate(-90 57.9433 57.9431)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9443"
                      cy="24.0567"
                      r="1.29337"
                      transform="rotate(-90 57.9443 24.0567)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 1.29337 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 1.29337 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 12.6747 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 12.6747 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 24.0575 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 24.0575 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 35.4379 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 35.4379 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 46.8197 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 46.8197 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 68.807 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 68.807 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9433"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 57.9433 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9443"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 57.9443 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="35.1798"
                      r="1.29337"
                      transform="rotate(-90 1.29337 35.1798)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="1.2933"
                      r="1.29337"
                      transform="rotate(-90 1.29337 1.2933)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="35.1798"
                      r="1.29337"
                      transform="rotate(-90 12.6747 35.1798)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="1.2933"
                      r="1.29337"
                      transform="rotate(-90 12.6747 1.2933)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="35.1798"
                      r="1.29337"
                      transform="rotate(-90 24.0575 35.1798)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="1.29336"
                      r="1.29337"
                      transform="rotate(-90 24.0575 1.29336)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="35.1798"
                      r="1.29337"
                      transform="rotate(-90 35.4379 35.1798)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="1.29336"
                      r="1.29337"
                      transform="rotate(-90 35.4379 1.29336)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="35.18"
                      r="1.29337"
                      transform="rotate(-90 46.8197 35.18)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="1.29354"
                      r="1.29337"
                      transform="rotate(-90 46.8197 1.29354)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="35.18"
                      r="1.29337"
                      transform="rotate(-90 68.807 35.18)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="1.29354"
                      r="1.29337"
                      transform="rotate(-90 68.807 1.29354)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9443"
                      cy="35.18"
                      r="1.29337"
                      transform="rotate(-90 57.9443 35.18)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9443"
                      cy="1.29354"
                      r="1.29337"
                      transform="rotate(-90 57.9443 1.29354)"
                      fill="#3056D3"
                    />
                  </svg>
                </span>
                  <span className="absolute right-0 bottom-0">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.5 21.5L0.505701 21.5C0.767606 10.023 10.023 0.767604 21.5 0.505697L21.5 21.5Z"
                      stroke="#13C296"
                    />
                  </svg>
                </span>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-lg text-dark mb-2">
                    Andrieo Gloree
                  </h4>
                  <p className="font-medium text-sm text-body-color mb-5">
                    App Developer
                  </p>
                  <div className="flex items-center justify-center">
                    <a
                      href="#"
                      className="
                      text-[#cdced6]
                      hover:text-primary
                      w-8
                      h-8
                      mx-2
                      flex
                      items-center
                      justify-center
                    "
                    >
                      <svg
                        width="10"
                        height="18"
                        viewBox="0 0 10 18"
                        className="fill-current"
                      >
                        <path
                          d="M9.29878 7.2H7.74898H7.19548V6.61935V4.81936V4.23871H7.74898H8.91133C9.21575 4.23871 9.46483 4.00645 9.46483 3.65806V0.580645C9.46483 0.26129 9.24343 0 8.91133 0H6.89106C4.70474 0 3.18262 1.62581 3.18262 4.03548V6.56129V7.14194H2.62912H0.747223C0.359774 7.14194 0 7.46129 0 7.92581V10.0161C0 10.4226 0.304424 10.8 0.747223 10.8H2.57377H3.12727V11.3806V17.2161C3.12727 17.6226 3.43169 18 3.87449 18H6.47593C6.64198 18 6.78036 17.9129 6.89106 17.7968C7.00176 17.6806 7.08478 17.4774 7.08478 17.3032V11.4097V10.829H7.66596H8.91133C9.2711 10.829 9.54785 10.5968 9.6032 10.2484V10.2194V10.1903L9.99065 8.1871C10.0183 7.98387 9.99065 7.75161 9.8246 7.51935C9.76925 7.37419 9.52018 7.22903 9.29878 7.2Z"
                        />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="
                      text-[#cdced6]
                      hover:text-primary
                      w-8
                      h-8
                      mx-2
                      flex
                      items-center
                      justify-center
                    "
                    >
                      <svg
                        width="18"
                        height="14"
                        viewBox="0 0 18 14"
                        className="fill-current"
                      >
                        <path
                          d="M15.9968 2.41096L17.1 1.09589C17.4194 0.739726 17.5065 0.465753 17.5355 0.328767C16.6645 0.821918 15.8516 0.986301 15.329 0.986301H15.1258L15.0097 0.876712C14.3129 0.30137 13.4419 0 12.5129 0C10.4806 0 8.88387 1.58904 8.88387 3.42466C8.88387 3.53425 8.88387 3.69863 8.9129 3.80822L9 4.35616L8.39032 4.32877C4.67419 4.21918 1.62581 1.20548 1.13226 0.684932C0.319355 2.05479 0.783871 3.36986 1.27742 4.19178L2.26452 5.72603L0.696774 4.90411C0.725806 6.05479 1.19032 6.9589 2.09032 7.61644L2.87419 8.16438L2.09032 8.46575C2.58387 9.86301 3.6871 10.4384 4.5 10.6575L5.57419 10.9315L4.55806 11.589C2.93226 12.6849 0.9 12.6027 0 12.5205C1.82903 13.726 4.00645 14 5.51613 14C6.64839 14 7.49032 13.8904 7.69355 13.8082C15.8226 12 16.2 5.15068 16.2 3.78082V3.58904L16.3742 3.47945C17.3613 2.60274 17.7677 2.13699 18 1.86301C17.9129 1.89041 17.7968 1.94521 17.6806 1.9726L15.9968 2.41096Z"
                        />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="
                      text-[#cdced6]
                      hover:text-primary
                      w-8
                      h-8
                      mx-2
                      flex
                      items-center
                      justify-center
                    "
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        className="fill-current"
                      >
                        <path
                          d="M8.90245 12.1939C10.7363 12.1939 12.2229 10.7073 12.2229 8.87352C12.2229 7.0397 10.7363 5.5531 8.90245 5.5531C7.06863 5.5531 5.58203 7.0397 5.58203 8.87352C5.58203 10.7073 7.06863 12.1939 8.90245 12.1939Z"
                        />
                        <path
                          d="M12.5088 0H5.23824C2.34719 0 0 2.34719 0 5.23824V12.4516C0 15.3999 2.34719 17.7471 5.23824 17.7471H12.4516C15.3999 17.7471 17.7471 15.3999 17.7471 12.5088V5.23824C17.7471 2.34719 15.3999 0 12.5088 0ZM8.90215 13.2244C6.46909 13.2244 4.55126 11.2493 4.55126 8.87353C4.55126 6.49771 6.49771 4.52264 8.90215 4.52264C11.278 4.52264 13.2244 6.49771 13.2244 8.87353C13.2244 11.2493 11.3066 13.2244 8.90215 13.2244ZM14.9133 4.92338C14.627 5.23824 14.1976 5.40999 13.711 5.40999C13.2817 5.40999 12.8523 5.23824 12.5088 4.92338C12.1939 4.60851 12.0222 4.20777 12.0222 3.72116C12.0222 3.23454 12.1939 2.86243 12.5088 2.51894C12.8237 2.17545 13.2244 2.0037 13.711 2.0037C14.1404 2.0037 14.5984 2.17545 14.9133 2.49031C15.1995 2.86243 15.3999 3.29179 15.3999 3.74978C15.3712 4.20777 15.1995 4.60851 14.9133 4.92338Z"
                        />
                        <path
                          d="M13.7397 3.03418C13.3676 3.03418 13.0527 3.34905 13.0527 3.72116C13.0527 4.09328 13.3676 4.40815 13.7397 4.40815C14.1118 4.40815 14.4267 4.09328 14.4267 3.72116C14.4267 3.34905 14.1405 3.03418 13.7397 3.03418Z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 px-4">
              <div className="mb-10 wow fadeInUp" data-wow-delay=".25s">
                <div
                  className="
                  relative
                  w-[170px]
                  h-170px]
                  rounded-full
                  z-10
                  mx-auto
                  mb-6
                "
                >
                  <img
                    src={require("../assets/images/team/team-01.png")}
                    alt="image"
                    className="w-full rounded-full"
                  />
                  <span className="absolute top-0 left-0 z-[-1]">
                  <svg
                    width="71"
                    height="82"
                    viewBox="0 0 71 82"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="1.29337"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 1.29337 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 12.6747 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 24.0575 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 35.4379 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 46.8197 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 68.807 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9443"
                      cy="80.7066"
                      r="1.29337"
                      transform="rotate(-90 57.9443 80.7066)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="69.3249"
                      r="1.29337"
                      transform="rotate(-90 1.29337 69.3249)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="69.3249"
                      r="1.29337"
                      transform="rotate(-90 12.6747 69.3249)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="69.3249"
                      r="1.29337"
                      transform="rotate(-90 24.0575 69.3249)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="69.3249"
                      r="1.29337"
                      transform="rotate(-90 35.4379 69.3249)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="69.325"
                      r="1.29337"
                      transform="rotate(-90 46.8197 69.325)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="69.325"
                      r="1.29337"
                      transform="rotate(-90 68.807 69.325)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9433"
                      cy="69.325"
                      r="1.29337"
                      transform="rotate(-90 57.9433 69.325)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="57.9433"
                      r="1.29337"
                      transform="rotate(-90 1.29337 57.9433)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="24.0568"
                      r="1.29337"
                      transform="rotate(-90 1.29337 24.0568)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="57.9433"
                      r="1.29337"
                      transform="rotate(-90 12.6747 57.9433)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="24.0568"
                      r="1.29337"
                      transform="rotate(-90 12.6747 24.0568)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="57.9433"
                      r="1.29337"
                      transform="rotate(-90 24.0575 57.9433)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="24.0568"
                      r="1.29337"
                      transform="rotate(-90 24.0575 24.0568)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="57.9433"
                      r="1.29337"
                      transform="rotate(-90 35.4379 57.9433)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="24.0568"
                      r="1.29337"
                      transform="rotate(-90 35.4379 24.0568)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="57.9431"
                      r="1.29337"
                      transform="rotate(-90 46.8197 57.9431)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="24.0567"
                      r="1.29337"
                      transform="rotate(-90 46.8197 24.0567)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="57.9431"
                      r="1.29337"
                      transform="rotate(-90 68.807 57.9431)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="24.0567"
                      r="1.29337"
                      transform="rotate(-90 68.807 24.0567)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9433"
                      cy="57.9431"
                      r="1.29337"
                      transform="rotate(-90 57.9433 57.9431)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9443"
                      cy="24.0567"
                      r="1.29337"
                      transform="rotate(-90 57.9443 24.0567)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 1.29337 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 1.29337 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 12.6747 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 12.6747 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 24.0575 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 24.0575 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 35.4379 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 35.4379 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 46.8197 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 46.8197 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 68.807 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 68.807 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9433"
                      cy="46.5615"
                      r="1.29337"
                      transform="rotate(-90 57.9433 46.5615)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9443"
                      cy="12.6751"
                      r="1.29337"
                      transform="rotate(-90 57.9443 12.6751)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="35.1798"
                      r="1.29337"
                      transform="rotate(-90 1.29337 35.1798)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.29337"
                      cy="1.2933"
                      r="1.29337"
                      transform="rotate(-90 1.29337 1.2933)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="35.1798"
                      r="1.29337"
                      transform="rotate(-90 12.6747 35.1798)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="12.6747"
                      cy="1.2933"
                      r="1.29337"
                      transform="rotate(-90 12.6747 1.2933)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="35.1798"
                      r="1.29337"
                      transform="rotate(-90 24.0575 35.1798)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="24.0575"
                      cy="1.29336"
                      r="1.29337"
                      transform="rotate(-90 24.0575 1.29336)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="35.1798"
                      r="1.29337"
                      transform="rotate(-90 35.4379 35.1798)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="35.4379"
                      cy="1.29336"
                      r="1.29337"
                      transform="rotate(-90 35.4379 1.29336)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="35.18"
                      r="1.29337"
                      transform="rotate(-90 46.8197 35.18)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="46.8197"
                      cy="1.29354"
                      r="1.29337"
                      transform="rotate(-90 46.8197 1.29354)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="35.18"
                      r="1.29337"
                      transform="rotate(-90 68.807 35.18)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="68.807"
                      cy="1.29354"
                      r="1.29337"
                      transform="rotate(-90 68.807 1.29354)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9443"
                      cy="35.18"
                      r="1.29337"
                      transform="rotate(-90 57.9443 35.18)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="57.9443"
                      cy="1.29354"
                      r="1.29337"
                      transform="rotate(-90 57.9443 1.29354)"
                      fill="#3056D3"
                    />
                  </svg>
                </span>
                  <span className="absolute right-0 bottom-0">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.5 21.5L0.505701 21.5C0.767606 10.023 10.023 0.767604 21.5 0.505697L21.5 21.5Z"
                      stroke="#13C296"
                    />
                  </svg>
                </span>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-lg text-dark mb-2">
                    Jackie Sanders
                  </h4>
                  <p className="font-medium text-sm text-body-color mb-5">
                    Content Writer
                  </p>
                  <div className="flex items-center justify-center">
                    <a
                      href="#"
                      className="
                      text-[#cdced6]
                      hover:text-primary
                      w-8
                      h-8
                      mx-2
                      flex
                      items-center
                      justify-center
                    "
                    >
                      <svg
                        width="10"
                        height="18"
                        viewBox="0 0 10 18"
                        className="fill-current"
                      >
                        <path
                          d="M9.29878 7.2H7.74898H7.19548V6.61935V4.81936V4.23871H7.74898H8.91133C9.21575 4.23871 9.46483 4.00645 9.46483 3.65806V0.580645C9.46483 0.26129 9.24343 0 8.91133 0H6.89106C4.70474 0 3.18262 1.62581 3.18262 4.03548V6.56129V7.14194H2.62912H0.747223C0.359774 7.14194 0 7.46129 0 7.92581V10.0161C0 10.4226 0.304424 10.8 0.747223 10.8H2.57377H3.12727V11.3806V17.2161C3.12727 17.6226 3.43169 18 3.87449 18H6.47593C6.64198 18 6.78036 17.9129 6.89106 17.7968C7.00176 17.6806 7.08478 17.4774 7.08478 17.3032V11.4097V10.829H7.66596H8.91133C9.2711 10.829 9.54785 10.5968 9.6032 10.2484V10.2194V10.1903L9.99065 8.1871C10.0183 7.98387 9.99065 7.75161 9.8246 7.51935C9.76925 7.37419 9.52018 7.22903 9.29878 7.2Z"
                        />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="
                      text-[#cdced6]
                      hover:text-primary
                      w-8
                      h-8
                      mx-2
                      flex
                      items-center
                      justify-center
                    "
                    >
                      <svg
                        width="18"
                        height="14"
                        viewBox="0 0 18 14"
                        className="fill-current"
                      >
                        <path
                          d="M15.9968 2.41096L17.1 1.09589C17.4194 0.739726 17.5065 0.465753 17.5355 0.328767C16.6645 0.821918 15.8516 0.986301 15.329 0.986301H15.1258L15.0097 0.876712C14.3129 0.30137 13.4419 0 12.5129 0C10.4806 0 8.88387 1.58904 8.88387 3.42466C8.88387 3.53425 8.88387 3.69863 8.9129 3.80822L9 4.35616L8.39032 4.32877C4.67419 4.21918 1.62581 1.20548 1.13226 0.684932C0.319355 2.05479 0.783871 3.36986 1.27742 4.19178L2.26452 5.72603L0.696774 4.90411C0.725806 6.05479 1.19032 6.9589 2.09032 7.61644L2.87419 8.16438L2.09032 8.46575C2.58387 9.86301 3.6871 10.4384 4.5 10.6575L5.57419 10.9315L4.55806 11.589C2.93226 12.6849 0.9 12.6027 0 12.5205C1.82903 13.726 4.00645 14 5.51613 14C6.64839 14 7.49032 13.8904 7.69355 13.8082C15.8226 12 16.2 5.15068 16.2 3.78082V3.58904L16.3742 3.47945C17.3613 2.60274 17.7677 2.13699 18 1.86301C17.9129 1.89041 17.7968 1.94521 17.6806 1.9726L15.9968 2.41096Z"
                        />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="
                      text-[#cdced6]
                      hover:text-primary
                      w-8
                      h-8
                      mx-2
                      flex
                      items-center
                      justify-center
                    "
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        className="fill-current"
                      >
                        <path
                          d="M8.90245 12.1939C10.7363 12.1939 12.2229 10.7073 12.2229 8.87352C12.2229 7.0397 10.7363 5.5531 8.90245 5.5531C7.06863 5.5531 5.58203 7.0397 5.58203 8.87352C5.58203 10.7073 7.06863 12.1939 8.90245 12.1939Z"
                        />
                        <path
                          d="M12.5088 0H5.23824C2.34719 0 0 2.34719 0 5.23824V12.4516C0 15.3999 2.34719 17.7471 5.23824 17.7471H12.4516C15.3999 17.7471 17.7471 15.3999 17.7471 12.5088V5.23824C17.7471 2.34719 15.3999 0 12.5088 0ZM8.90215 13.2244C6.46909 13.2244 4.55126 11.2493 4.55126 8.87353C4.55126 6.49771 6.49771 4.52264 8.90215 4.52264C11.278 4.52264 13.2244 6.49771 13.2244 8.87353C13.2244 11.2493 11.3066 13.2244 8.90215 13.2244ZM14.9133 4.92338C14.627 5.23824 14.1976 5.40999 13.711 5.40999C13.2817 5.40999 12.8523 5.23824 12.5088 4.92338C12.1939 4.60851 12.0222 4.20777 12.0222 3.72116C12.0222 3.23454 12.1939 2.86243 12.5088 2.51894C12.8237 2.17545 13.2244 2.0037 13.711 2.0037C14.1404 2.0037 14.5984 2.17545 14.9133 2.49031C15.1995 2.86243 15.3999 3.29179 15.3999 3.74978C15.3712 4.20777 15.1995 4.60851 14.9133 4.92338Z"
                        />
                        <path
                          d="M13.7397 3.03418C13.3676 3.03418 13.0527 3.34905 13.0527 3.72116C13.0527 4.09328 13.3676 4.40815 13.7397 4.40815C14.1118 4.40815 14.4267 4.09328 14.4267 3.72116C14.4267 3.34905 14.1405 3.03418 13.7397 3.03418Z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 md:py-[120px] relative">
        <div
          className="
          absolute
          z-[-1]
          w-full
          h-1/2
          lg:h-[45%]
          xl:h-1/2
          bg-[#f3f4fe]
          top-0
          left-0
        "
        />
        <div className="container px-4">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="px-4 w-full lg:w-7/12 xl:w-8/12">
              <div className="ud-contact-content-wrapper">
                <div className="ud-contact-title mb-12 lg:mb-[150px]">
                <span className="text-dark font-semibold text-base mb-5">
                  CONTACT US
                </span>
                  <h2 className="text-[35px] font-semibold">
                    Let's talk about <br />
                    Love to hear from you!
                  </h2>
                </div>
                <div className="flex flex-wrap justify-between mb-12 lg:mb-0">
                  <div className="flex max-w-full w-[330px] mb-8">
                    <div className="text-[32px] text-primary mr-6">
                      <svg
                        width="29"
                        height="35"
                        viewBox="0 0 29 35"
                        className="fill-current"
                      >
                        <path
                          d="M14.5 0.710938C6.89844 0.710938 0.664062 6.72656 0.664062 14.0547C0.664062 19.9062 9.03125 29.5859 12.6406 33.5234C13.1328 34.0703 13.7891 34.3437 14.5 34.3437C15.2109 34.3437 15.8672 34.0703 16.3594 33.5234C19.9688 29.6406 28.3359 19.9062 28.3359 14.0547C28.3359 6.67188 22.1016 0.710938 14.5 0.710938ZM14.9375 32.2109C14.6641 32.4844 14.2812 32.4844 14.0625 32.2109C11.3828 29.3125 2.57812 19.3594 2.57812 14.0547C2.57812 7.71094 7.9375 2.625 14.5 2.625C21.0625 2.625 26.4219 7.76562 26.4219 14.0547C26.4219 19.3594 17.6172 29.2578 14.9375 32.2109Z"
                        />
                        <path
                          d="M14.5 8.58594C11.2734 8.58594 8.59375 11.2109 8.59375 14.4922C8.59375 17.7188 11.2187 20.3984 14.5 20.3984C17.7812 20.3984 20.4062 17.7734 20.4062 14.4922C20.4062 11.2109 17.7266 8.58594 14.5 8.58594ZM14.5 18.4297C12.3125 18.4297 10.5078 16.625 10.5078 14.4375C10.5078 12.25 12.3125 10.4453 14.5 10.4453C16.6875 10.4453 18.4922 12.25 18.4922 14.4375C18.4922 16.625 16.6875 18.4297 14.5 18.4297Z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold mb-6">Our Location</h5>
                      <p className="text-base text-body-color">
                        401 Broadway, 24th Floor, Orchard Cloud View, London
                      </p>
                    </div>
                  </div>
                  <div className="flex max-w-full w-[330px] mb-8">
                    <div className="text-[32px] text-primary mr-6">
                      <svg
                        width="34"
                        height="25"
                        viewBox="0 0 34 25"
                        className="fill-current"
                      >
                        <path
                          d="M30.5156 0.960938H3.17188C1.42188 0.960938 0 2.38281 0 4.13281V20.9219C0 22.6719 1.42188 24.0938 3.17188 24.0938H30.5156C32.2656 24.0938 33.6875 22.6719 33.6875 20.9219V4.13281C33.6875 2.38281 32.2656 0.960938 30.5156 0.960938ZM30.5156 2.875C30.7891 2.875 31.0078 2.92969 31.2266 3.09375L17.6094 11.3516C17.1172 11.625 16.5703 11.625 16.0781 11.3516L2.46094 3.09375C2.67969 2.98438 2.89844 2.875 3.17188 2.875H30.5156ZM30.5156 22.125H3.17188C2.51562 22.125 1.91406 21.5781 1.91406 20.8672V5.00781L15.0391 12.9922C15.5859 13.3203 16.1875 13.4844 16.7891 13.4844C17.3906 13.4844 17.9922 13.3203 18.5391 12.9922L31.6641 5.00781V20.8672C31.7734 21.5781 31.1719 22.125 30.5156 22.125Z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold mb-6">How Can We Help?</h5>
                      <p className="text-base text-body-color">info@yourdomain.com</p>
                      <p className="text-base text-body-color">
                        contact@yourdomain.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 w-full lg:w-5/12 xl:w-4/12">
              <div
                className="
                shadow-testimonial
                rounded-lg
                bg-white
                py-10
                px-8
                md:p-[60px]
                lg:p-10
                2xl:p-[60px]
                sm:py-12 sm:px-10
                lg:py-12 lg:px-10
                wow
                fadeInUp
              "
                data-wow-delay=".2s
              "
              >
                <h3 className="font-semibold mb-8 text-2xl md:text-[26px]">
                  Send us a Message
                </h3>
                <form>
                  <div className="mb-6">
                    <label htmlFor="fullName" className="block text-xs text-dark"
                    >Full Name*</label
                    >
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Adam Gelius"
                      className="
                      w-full
                      border-0 border-b border-[#f1f1f1]
                      focus:border-primary focus:outline-none
                      py-4
                    "
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-xs text-dark"
                    >Email*</label
                    >
                    <input
                      type="email"
                      name="email"
                      placeholder="example@yourmail.com"
                      className="
                      w-full
                      border-0 border-b border-[#f1f1f1]
                      focus:border-primary focus:outline-none
                      py-4
                    "
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="phone" className="block text-xs text-dark"
                    >Phone*</label
                    >
                    <input
                      type="text"
                      name="phone"
                      placeholder="+885 1254 5211 552"
                      className="
                      w-full
                      border-0 border-b border-[#f1f1f1]
                      focus:border-primary focus:outline-none
                      py-4
                    "
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-xs text-dark"
                    >Message*</label
                    >
                    <textarea
                      name="message"
                      rows="1"
                      placeholder="type your message here"
                      className="
                      w-full
                      border-0 border-b border-[#f1f1f1]
                      focus:border-primary focus:outline-none
                      py-4
                      resize-none
                    "
                    ></textarea>
                  </div>
                  <div className="mb-0">
                    <button
                      type="submit"
                      className="
                      inline-flex
                      items-center
                      justify-center
                      py-4
                      px-6
                      rounded
                      text-white
                      bg-primary
                      text-base
                      font-medium
                      hover:bg-dark
                      transition
                      duration-300
                      ease-in-out
                    "
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

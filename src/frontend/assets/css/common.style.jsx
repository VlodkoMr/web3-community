import styled from "styled-components";
import * as Scroll from "react-scroll";
import { Link as ReactLink, NavLink as ReactNavLink } from "react-router-dom";

export const Wrapper = styled.section.attrs({
  className: `
  relative
  mb-auto
  text-gray-600`,
})``;

export const InnerPageWrapper = styled.section.attrs({
  className: `
  flex 
  flex-col 
  min-h-screen 
  justify-between
  bg-gray-50 
  text-gray-600`,
})``;

export const Btn = styled.button.attrs({
  className: `
    py-4
    px-6
    sm:px-10
    inline-flex
    items-center
    justify-center
    bg-white
    font-medium
    rounded-lg
    transition
    duration-300
    ease-in-out
    text-center text-dark text-base
    hover:text-primary hover:shadow-lg`
})``;

export const Container = styled.div.attrs({
  className: `
    mx-auto
    container`,
})``;

export const Link = styled(ReactLink).attrs((props) => ({
  className: `
    transition
    ease-in-out
    duration-200
    hover:underline
    ${props.font ? "font-" + props.font : "font-semibold"}
    `,
}))``;

export const NavLink = styled(ReactNavLink).attrs((props) => ({
  className: `
    ud-menu-scroll
    text-base 
    text-dark
    flex
    py-2
    px-6
    cursor-pointer
    lg:mr-0 lg:hover:opacity-70 lg:py-6 lg:inline-flex 
    ${props.dark === "true" ? "lg:text-dark" : "lg:text-white hover:text-primary lg:hover:text-white"}
    `,
}))``;

export const ScrollLink = styled(Scroll.Link).attrs((props) => ({
  className: `
    ud-menu-scroll
    text-base 
    text-dark
    flex
    py-2
    px-6
    lg:mr-0
    cursor-pointer
    lg:py-6 lg:inline-flex  lg:hover:opacity-70
    ${props.dark === "true" ? "lg:text-dark" : "lg:text-white hover:text-primary lg:hover:text-white"}
    `,
}))``;

export const InnerBlock = styled.section.attrs({
  className: `
  w-full 
  relative 
  flex 
  break-words 
  bg-white 
  rounded-xl 
  shadow-gray-300/30 
  shadow-lg 
  px-8 
  py-6`,
})``;

export const InnerTransparentBlock = styled.section.attrs({
  className: `
  w-full 
  relative 
  flex 
  flex-col 
  break-words 
  mt-4`,
})``;

InnerBlock.Header = styled.div.attrs({
  className: `
  text-xl 
  font-semibold 
  mb-2
  text-gray-800`,
})``

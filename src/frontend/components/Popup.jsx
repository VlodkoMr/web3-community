import React from "react";
import { Dialog, DialogBody, DialogHeader } from '@material-tailwind/react';
import { MdOutlineClose } from 'react-icons/md';

export function Popup({ children, title, isVisible, setIsVisible, closeCallback, size }) {

  const handleOpenPopup = () => {
    setIsVisible(!isVisible);
    closeCallback?.();
  };

  return (
    <Dialog open={isVisible} handler={handleOpenPopup} size={size}>
      <DialogHeader className={"flex justify-between cursor-pointer px-8 text-xl"}>
        {title}
        <MdOutlineClose onClick={handleOpenPopup}/>
      </DialogHeader>
      <DialogBody divider className={`px-8 py-6 block`}>
        {children}
      </DialogBody>
    </Dialog>
  );
}

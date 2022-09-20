import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { Button } from '@material-tailwind/react';
import { Loader } from '../Loader';
import { MdKeyboardArrowRight } from 'react-icons/md';

export function CommunityLinks() {
  const dispatch = useDispatch();
  const [ isLoading, setIsLoading ] = useState(false);

  const handleSave = () => {
    console.log('handleSave')
  }

  return (
    <>
      <form className="flex flex-col gap-4 relative" onSubmit={handleSave}>
        <div>
          ...
        </div>

        <div className={"flex justify-end"}>
          <Button type="Submit" variant="gradient">
            Create <MdKeyboardArrowRight className="text-lg align-bottom ml-1 inline-block"/>
          </Button>
        </div>

        {isLoading && (
          <div className="bg-white/80 absolute top-0 bottom-0 right-0 left-0 z-10">
            <div className={"w-12 mx-auto mt-10"}>
              <Loader/>
            </div>
          </div>
        )}
      </form>
    </>
  );
}

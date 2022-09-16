import React, { useState } from "react";
import { Label, TextInput, Button, Spinner } from 'flowbite-react';
import { useDispatch } from 'react-redux';

export function CommunityLinks() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    console.log('handleSave')
  }

  return (
    <>
      <form className="flex flex-col gap-4 relative" onSubmit={handleSave}>
        <div>
          <div className="mb-1 block text-left">
            <Label htmlFor="name" value="Community Title" />
            <sup className={"text-red-400"}>*</sup>
          </div>
          {/*<TextInput id="name"*/}
          {/*           type="text"*/}
          {/*           required={true}*/}
          {/*           value={formData.name}*/}
          {/*           onChange={(e) => setFormData({ ...formData, name: e.target.value })}*/}
          {/*/>*/}
        </div>

        <div className={"flex justify-end"}>
          <Button type="Submit" gradientDuoTone="purpleToPink">
            <span className="uppercase">Create &raquo;</span>
          </Button>
        </div>

        {isLoading && (
          <div className="bg-white/80 absolute top-0 bottom-0 right-0 left-0 z-10">
            <div className={"w-12 mx-auto mt-10"}>
              <Spinner size={10} />
            </div>
          </div>
        )}
      </form>
    </>
  );
}

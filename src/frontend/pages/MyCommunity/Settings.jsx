import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useOutletContext } from 'react-router-dom';
import { InnerBlock } from '../../assets/css/common.style';
import { EditCommunity } from '../../components/MyCommunity/EditCommunity';
import { Button, Input } from "@material-tailwind/react";
import { Loader } from "../../components/Loader";
import { MdKeyboardArrowRight } from "react-icons/md";

export const Settings = ({ edit }) => {
  const [ reloadCommunityList ] = useOutletContext();
  const currentCommunity = useSelector(state => state.community.current);
  const [ formData, setFormData ] = useState({
    twitter: edit?.twitter || "",
    facebook: edit?.facebook || "",
    instagram: edit?.instagram || "",
    telegram: edit?.telegram || "",
    youtube: edit?.youtube || "",
    website: edit?.website || ""
  });

  useEffect(() => {
    console.log('currentCommunity', currentCommunity);
  }, [ currentCommunity ]);

  return (
    <div className="flex gap-6">
      <InnerBlock className={"flex-1"}>
        <div className="flex-auto">
          <InnerBlock.Header className="flex justify-between">
            <span>General Settings</span>
          </InnerBlock.Header>
          <div className="mt-8">
            <EditCommunity editCommunity={currentCommunity} handleSuccess={() => reloadCommunityList()}/>
          </div>
        </div>
      </InnerBlock>

      <InnerBlock className={"flex-1"}>
        <div className="flex-auto">
          <InnerBlock.Header className="flex justify-between">
            <span>Community Links</span>
          </InnerBlock.Header>
          <div className="mt-8">

            <div className={"mb-3"}>
              <Input type="text"
                     label="Twitter"
                     required={true}
                     value={formData.twitter}
                     onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              />
            </div>
            <div className={"mb-3"}>
              <Input type="text"
                     label="Facebook"
                     required={true}
                     value={formData.facebook}
                     onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              />
            </div>
            <div className={"mb-3"}>
              <Input type="text"
                     label="Instagram"
                     required={true}
                     value={formData.instagram}
                     onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              />
            </div>
            <div className={"mb-3"}>
              <Input type="text"
                     label="Youtube"
                     required={true}
                     value={formData.youtube}
                     onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
              />
            </div>
            <div className={"mb-3"}>
              <Input type="text"
                     label="Telegram"
                     required={true}
                     value={formData.telegram}
                     onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
              />
            </div>
            <div className={"mb-3"}>
              <Input type="text"
                     label="Website"
                     required={true}
                     value={formData.website}
                     onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
            <div className={"flex justify-end"}>
              <Button type="Submit" variant="gradient" disabled={true}>
                Save
                <MdKeyboardArrowRight className="text-lg align-bottom ml-1 inline-block"/>
              </Button>
            </div>

          </div>
        </div>
      </InnerBlock>
    </div>
  );
}

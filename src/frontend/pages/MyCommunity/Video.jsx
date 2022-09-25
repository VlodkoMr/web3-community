import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { InnerBlock, InnerTransparentBlock } from '../../assets/css/common.style';
import { Button } from "@material-tailwind/react";
import { CreateVideoStream } from "../../components/MyCommunity/Video/CreateVideoStream";
import { Link } from "react-router-dom";
// import { VideoPlayer } from '@livepeer/react';

export const Video = () => {
  const currentCommunity = useSelector(state => state.community.current);
  const [ newStreamPopupVisible, setNewStreamPopupVisible ] = useState(false);
  const [ streams, setStreams ] = useState([]);

  const loadStreamsList = () => {
    fetch(`${process.env.SERVER_URL}/api/stream-list`)
      .then((response) => response.json())
      .then((result) => {
        setStreams(result.data);
        console.log('Success:', result);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    loadStreamsList();
  }, [ currentCommunity ]);


  return (
    <div>
      <InnerTransparentBlock>
        <InnerBlock.Header className="flex justify-between">
          <span>Video Streaming</span>
          <div className="-mt-3 justify-end">
            <Button onClick={() => setNewStreamPopupVisible(true)}>
              Create New Stream
            </Button>
            <a href="https://livepeer.studio/dashboard" className={"ml-3"} target={"_blank"}>
              <Button color={"blue-gray"}>
                Open Livepeer Studio
              </Button>
            </a>
          </div>
        </InnerBlock.Header>
      </InnerTransparentBlock>

      <InnerBlock className={"flex-1"}>
        <div className="flex-auto">

          {streams && streams.length > 0 ? (
            <>
              {streams.map((stream) => (
                <div className="border rounded-lg mb-3 px-8 py-4" key={stream.id}>
                  <Link to={`/my/video/stream/${stream.id}`} className={"flex flex-row"}>
                    <div className={"flex-1 text-sm"}>
                      <h2 className={"block text-lg text-gray-800 font-semibold mb-2 mt-0"}>{stream.name} </h2>
                      <p>Stream Status: {stream.isActive ? "Live Now!" : "Not Live"}</p>
                      <p>Stream Key: {stream.streamKey}</p>
                      <p>Stream Playback Id: {stream.playbackId}</p>
                    </div>
                    <div className={"w-64 text-center small text-right"}>
                      {stream.isActive ? (
                        <>
                          <h2 className="font-semibold text-green-400 pt-2 mb-2"> Now Watching: {stream.name} </h2>
                          {/*<VideoPlayer*/}
                          {/*  playbackId={`${stream.playbackId}`}*/}
                          {/*  className={"w-96 h-64 border-2"}*/}
                          {/*  autoPlay={false}*/}
                          {/*  loop*/}
                          {/*  muted*/}
                          {/*/>*/}
                        </>
                      ) : (
                        <h2 className="font-semibold text-gray-500 pt-2">Not online</h2>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </>
          ) : (
            <span>
            *No Video Streams
            </span>
          )}

        </div>
      </InnerBlock>

      <CreateVideoStream popupVisible={newStreamPopupVisible}
                         setPopupVisible={setNewStreamPopupVisible}
                         currentCommunity={currentCommunity}
                         handleSuccess={() => loadStreamsList()}/>

    </div>
  );
}

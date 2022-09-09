import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const Dashboard = () => {
  const dispatch = useDispatch();
  const currentCommunity = useSelector(state => state.community.current);

  useEffect(() => {
    console.log('currentCommunity');
  }, [currentCommunity]);

  useEffect(() => {
    if (window.contracts) {
      console.log('Dashboard load')
    }
  }, [window.contracts]);

  return (
    <>
      <h3 className="text-2xl font-semibold mb-2">Dashboard</h3>
      <div>
        ...
      </div>
    </>
  );
}

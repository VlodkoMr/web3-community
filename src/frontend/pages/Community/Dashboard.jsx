import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const Dashboard = ({ contract }) => {
  const dispatch = useDispatch();
  const currentCommunity = useSelector(state => state.community.current);

  useEffect(() => {
    console.log('currentCommunity');
  }, [currentCommunity]);

  useEffect(() => {
    if (contract) {
      console.log('Dashboard load')
    }
  }, [contract]);

  return (
    <>
      <h3 className="text-2xl font-semibold mb-2">Dashboard</h3>
      <div>
        ...
      </div>
    </>
  );
}

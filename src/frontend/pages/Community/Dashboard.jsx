import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const Dashboard = ({ contract }) => {
  // const dispatch = useDispatch();
  // const { address } = useAccount();
  // const communityList = useSelector(state => state.community.list);
  const currentCommunity = useSelector(state => state.community.current);

  useEffect(() => {
    console.log('currentCommunity change');
  }, [currentCommunity]);

  useEffect(() => {
    if (contract) {
      console.log('Dashboard load')
    }
  }, [contract]);

  return (
    <>
      dashboard
    </>
  );
}

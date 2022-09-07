import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const FungibleToken = ({ contract }) => {
  const dispatch = useDispatch();
  const currentCommunity = useSelector(state => state.community.current);

  useEffect(() => {
    console.log('currentCommunity');
  }, [currentCommunity]);

  useEffect(() => {
    if (contract) {
      console.log('FungibleToken load')
    }
  }, [contract]);

  return (
    <>
      <h3 className="text-2xl font-semibold mb-2">Fungible Token</h3>
      <div>
        ...
      </div>
    </>
  );
}

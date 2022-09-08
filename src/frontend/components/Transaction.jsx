import React from "react";
import { useWaitForTransaction } from 'wagmi';
import { useDispatch } from 'react-redux';
import { removeTransaction } from '../store/transactionSlice';
import { Spinner } from 'flowbite-react';
import { MdClose, MdOutlineCheckCircleOutline, MdOutlineErrorOutline } from 'react-icons/md';

export const Transaction = ({ tx }) => {
  const dispatch = useDispatch();

  const { isError, isLoading, isSuccess } = useWaitForTransaction({
    hash: tx.hash,
    onSuccess: () => {
      removeTransactionDelay();
    },
    onError: () => {
      removeTransactionDelay();
    }
  });

  const removeTransactionDelay = () => {
    setTimeout(() => {
      closeRemoveTransaction();
    }, 5000);
  }

  const closeRemoveTransaction = () => {
    dispatch(removeTransaction({
      hash: tx.hash
    }));
  }

  const getStatusClass = () => {
    if (isError) {
      return "bg-red-700";
    }
    if (isSuccess) {
      return "bg-green-700";
    }
    return "bg-gray-700";
  }

  return (
    <>
      <div className={`shadow-lg rounded-lg mb-4 px-4 py-3 text-sm flex text-gray-100 border-2 border-white/30 relative ${getStatusClass()}`}>
        <div className="w-8 pt-1 mr-4 opacity-90">
          {isLoading && (
            <div className="w-10">
              <Spinner size="lg" />
            </div>
          )}
          {isError && (
            <MdOutlineErrorOutline color="white" className="w-8 h-8" />
          )}
          {isSuccess && (
            <MdOutlineCheckCircleOutline color="white" className="w-8 h-8" />
          )}
        </div>

        <div className="flex-auto">
          <p>
            Transaction: {tx.hash.slice(0, 7) + '...' + tx.hash.slice(34, 42)}
          </p>
          {tx.description && (
            <p className="font-semibold">{tx.description}</p>
          )}

          <div className="absolute right-3 top-3">
            <MdClose className="w-6 h-6 cursor-pointer opacity-70 hover:opacity-100 transition"
                     onClick={() => closeRemoveTransaction()}
            />
          </div>
        </div>
      </div>
    </>
  );
}

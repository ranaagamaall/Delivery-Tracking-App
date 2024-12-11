// @ts-nocheck
import { useState } from "react";
import location from "../assets/loc.png";
import bostaAr from "../assets/bosta-ar.png";
import { IoSearchOutline } from "react-icons/io5";
import { BiSolidErrorAlt } from "react-icons/bi";
import dayjs from "dayjs";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import TrackingDetails from "../components/TrackingDetails";
import StatusDetails from "../components/StatusDetails";

async function fetchOrderDetails(trackingNumber: number | undefined) {
  try {
    const response = await fetch(
      `https://tracking.bosta.co/shipments/track/${trackingNumber}`
    );
    if (!response.ok) {
      const err = await response.json();

      throw new Error(`${err.error} `);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}
export const OrderPage = () => {
  const [trackingNumber, setTrackingNumber] = useState<number>();
  const [orderNumber, setOrderNumber] = useState<number>();
  const [data, setData] = useState(null);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const handleFetchDetails = async () => {
    setOrderNumber(Number(trackingNumber));
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchOrderDetails(trackingNumber);
      setData(result);
    } catch (err: any) {
      setError(err.message);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-LightPrimary w-screen py-20 relative">
        <div className=" flex justify-between items-center px-10 md:px-14 lg:px-28 xl:px-40">
          <h6>عربى</h6>
          <img src={bostaAr} alt="bosta" className="w-[8rem] " />
        </div>
        <img src={location} alt="location" className="w-[12rem] mx-auto" />
        <h1 className="text-3xl text-black/95 font-bold text-center">
          Track Your Order
        </h1>
        <div className="flex w-[20rem] shadow-md absolute bg-white -bottom-8 left-0 right-0 mx-auto">
          <button
            onClick={handleFetchDetails}
            className="bg-secondary text-white px-5 rounded-s-lg"
            disabled={!trackingNumber}
          >
            <IoSearchOutline className="size-6" />
          </button>
          <input
            type="number"
            placeholder="Enter tracking number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="border ps-6 py-3 w-full mb-4 rounded-lg"
          />
        </div>
      </div>
      <div className="px-10 md:px-14 lg:px-28 xl:px-40">
        {isLoading && <p className="mt-10">Loading...</p>}

        {error && trackingNumber && (
          <p className="text-center mt-28 text-secondary text-3xl capitalize">
            {error}
            <BiSolidErrorAlt className="mx-auto mt-10 size-16" />
          </p>
        )}

        {data?.CurrentStatus ? (
          <>
            <StatusDetails data={data} orderNumber={orderNumber} />
            {data?.TransitEvents ? (
              <div className="my-16">
                <TrackingDetails TransitEvents={data?.TransitEvents} />
              </div>
            ) : null}
          </>
        ) : data?.SupportPhoneNumbers && trackingNumber ? (
          <p className="text-center mt-28 text-LightGray font-bold text-3xl capitalize">
            Order not found{" "}
            <BiSolidErrorAlt className="mx-auto mt-10 size-16" />
          </p>
        ) : null}
      </div>
    </>
  );
};

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

  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isMobile = window.innerWidth < 768;

  const steps = [
    {
      status: "picked up",
      code: "PACKAGE_RECEIVED",
    },
    {
      status: "processing",
      code: "PACKAGE_IN_TRANSIT",
    },
    {
      status: "out for delivery",
      code: "OUT_FOR_DELIVERY",
    },
    {
      status: "delivered",
      code: "PACKAGE_DELIVERED",
    },
  ];

  const handleFetchDetails = async () => {
    setOrderNumber(Number(trackingNumber));
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchOrderDetails(trackingNumber);
      setData(result);
      setActiveStep(
        steps.findIndex((step) => step.code === result?.CurrentStatus?.state)
      );
    } catch (err: any) {
      setError(err.message);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  function calculateRemainingDays(arrivalDate: Date) {
    const now = new Date();
    const arrival = dayjs(arrivalDate);

    return arrival.diff(now, "day");
  }

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
            <div className="mt-16 rounded-md border-2 border-gray-200">
              <div className="p-4">
                <h4 className="text-lg font-semibold text-LightGray">
                  Order #{orderNumber}{" "}
                </h4>
                <h2 className="text-lg font-bold">
                  Arriving By{" "}
                  <span className="text-primary">
                    {dayjs(data?.PromisedDate).format("ddd MMM . D")}
                  </span>
                </h2>
                <p className="font-semibold text-LightGray">
                  Your order is expected to arrive within{" "}
                  {calculateRemainingDays(data?.PromisedDate)} days
                </p>
              </div>
              <hr></hr>
              <div className="p-4">
                <Stepper
                  activeStep={activeStep}
                  alternativeLabel
                  orientation={isMobile ? "vertical" : "horizontal"}
                >
                  {steps.map((step, idx) => (
                    <Step
                      key={step.status}
                      className="[&_svg:is(.Mui-completed,.Mui-active)]:!text-primary  [&_:is(.Mui-completed,.Mui-active)]:!font-bold "
                    >
                      <StepLabel className="flex flex-col capitalize">
                        {step.status}
                        {idx === activeStep && (
                          <p>
                            {dayjs(data?.CurrentStatus.timestamp).format(
                              "ddd MMM . D"
                            )}
                          </p>
                        )}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </div>
            </div>
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

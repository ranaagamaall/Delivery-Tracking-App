import { Box, Step, StepContent, StepLabel, Stepper } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const TrackingDetails = ({ TransitEvents }: any) => {
  const [transitDict, setTransitDict] = useState<Record<string, Array<any>>>(
    {}
  );

  const states = {
    TICKET_CREATED:
      "The order has been created. ,When the merchant is ready, we will receive the shipment",
    PACKAGE_RECEIVED:
      " The order has been received at a warehouse in Bosta and is being prepared",
    OUT_FOR_DELIVERY: "The order is being delivered",
    WAITING_FOR_CUSTOMER_ACTION:
      "The delivery of the order has been postponed because we were unable to contact you by phone",
    NOT_YET_SHIPPED:
      "The has been received but is not yet shipped",
  };

  function stepLabel(step: any) {
    return (
      <span className="bg-gray-300 size-4 ml-1 rounded-full">
        {step.children}
      </span>
    );
  }

  useEffect(() => {
    if (TransitEvents) {
      const transitDictTemp: Record<string, Array<any>> = {};
      TransitEvents.forEach((event: any) => {
        if (!transitDictTemp[event.timestamp.split("T")[0]]) {
          transitDictTemp[event.timestamp.split("T")[0]] = [];
        }
        transitDictTemp[event.timestamp.split("T")[0]].push(event);
      });
      Object.keys(transitDictTemp).forEach((key) => {
        transitDictTemp[key].sort((a, b) =>
          a.timestamp.localeCompare(b.timestamp)
        );
      });
      setTransitDict(transitDictTemp);
    }
  }, [TransitEvents]);

  return (
    <>
      <h3 className="text-3xl mb-4 font-semibold text-LightGray ">
        Tracking details
      </h3>
      <Stepper activeStep={-1} orientation="vertical" alternativeLabel>
        {Object.keys(transitDict)
          .sort((a, b) => a.localeCompare(b))
          .map((key: string, idx: number) => (
            <Step expanded={true}>
              <StepLabel
                StepIconComponent={stepLabel}
                className="!flex-row w-fit items-center gap-3 [&_span]:!mt-0 [&_span]:text-xl [&_span]:text-black "
              >
                {dayjs(key).format("dddd,MMMM DD,YYYY")}
              </StepLabel>
              <StepContent>
                {transitDict[key].map((event: any, idx: number) => (
                  <div
                    key={idx}
                    className="border-2 border-gray-200 p-2 mb-2 rounded-md "
                  >
                    {states[event?.state]}
                    <p className="mt-2 text-LightGray">
                      {dayjs(event.timestamp).format("H:m A")}
                      {event.hub ? <span> • {event.hub}</span> : null}
                      {event.reason ? <span> • {event.reason}</span> : null}
                    </p>
                  </div>
                ))}
              </StepContent>
            </Step>
          ))}
      </Stepper>
    </>
  );
};

export default TrackingDetails;

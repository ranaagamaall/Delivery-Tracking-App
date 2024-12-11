import { Step, StepLabel, Stepper } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

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

const StatusDetails = ({ data, orderNumber }: any) => {
  const [activeStep, setActiveStep] = useState(0);

  const isMobile = window.innerWidth < 768;

  function calculateRemainingDays(arrivalDate: Date) {
    const now = new Date();
    const arrival = dayjs(arrivalDate);

    return arrival.diff(now, "day");
  }

  useEffect(() => {
    if (data) {
      setActiveStep(
        steps.findIndex((step) => step.code === data?.CurrentStatus?.state)
      );
    }
  }, [data]);
  return (
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
                    {dayjs(data?.CurrentStatus.timestamp).format("ddd MMM . D")}
                  </p>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
    </div>
  );
};

export default StatusDetails;

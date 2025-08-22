import React from "react";
export default function MultiStepIndicator({
  steps = [],
  currentStep = 0,
  completedStep = -1,
  className = "",
}) {
  const getStepStatus = (stepIndex) => {
    if (stepIndex <= completedStep) return "completed";
    if (stepIndex === currentStep) return "current";
    return "pending";
  };

  const getStepStyles = (status) => {
    switch (status) {
      case "completed":
        return "bg-smiles-green text-white";
      case "current":
        return "bg-primary-blue text-white";
      case "pending":
      default:
        return "bg-gray-300 text-gray-600";
    }
  };

  const getTextStyles = (status) => {
    switch (status) {
      case "completed":
        return "text-smiles-green";
      case "current":
        return "text-primary-blue";
      case "pending":
      default:
        return "text-gray-500";
    }
  };

  const getConnectorStyles = (stepIndex) => {
    // Connector is green if the next step is completed or current
    return stepIndex <= completedStep ? "bg-smiles-green" : "bg-gray-300";
  };

  if (!steps.length) return null;

  return (
    <div className={`mb-8 ${className}`}>
      {/* Desktop and Tablet View */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-4 w-full max-w-4xl">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              const isLastStep = index === steps.length - 1;

              return (
                <React.Fragment key={index}>
                  {/* Step */}
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${getStepStyles(status)}`}
                    >
                      {status === "completed" ? "✓" : index + 1}
                    </div>
                    <span
                      className={`ml-2 text-sm font-medium ${getTextStyles(status)} whitespace-nowrap`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Connector line (don't show after last step) */}
                  {!isLastStep && (
                    <div
                      className={`flex-1 h-0.5 min-w-8 ${getConnectorStyles(index)}`}
                    ></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Progress description for desktop */}
        {steps[currentStep]?.description && (
          <div className="text-center mt-3">
            <p className="text-xs text-gray-500">
              {steps[currentStep].description}
            </p>
          </div>
        )}
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <div className="flex flex-col space-y-4">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const isLastStep = index === steps.length - 1;

            return (
              <div key={index} className="flex flex-col">
                {/* Step row */}
                <div className="flex items-center">
                  {/* Step indicator */}
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold flex-shrink-0 ${getStepStyles(status)}`}
                  >
                    {status === "completed" ? "✓" : index + 1}
                  </div>

                  {/* Step content */}
                  <div className="ml-3 flex-1">
                    <div
                      className={`text-sm font-medium ${getTextStyles(status)}`}
                    >
                      {step.label}
                    </div>
                    {step.description && (
                      <div className="text-xs text-gray-500 mt-1">
                        {step.description}
                      </div>
                    )}
                  </div>
                </div>

                {/* Vertical connector line */}
                {!isLastStep && (
                  <div className="flex">
                    <div className="w-8 flex justify-center">
                      <div
                        className={`w-0.5 h-6 ${getConnectorStyles(index)}`}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Current step description for mobile */}
        {steps[currentStep]?.description && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-primary-blue">
            <p className="text-sm text-primary-blue font-medium">
              Current Step: {steps[currentStep].label}
            </p>
            <p className="text-xs text-smiles-gentleBlue mt-1">
              {steps[currentStep].description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

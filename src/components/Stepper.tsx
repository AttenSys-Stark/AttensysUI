"use client";
// import { CheckIcon } from "@heroicons/react/20/solid"
type Step = {
  name: string;
  href: string;
  status: "complete" | "current" | "upcoming";
};

const initialSteps: Step[] = [
  { name: "Step 1", href: "#", status: "current" },
  { name: "Step 2", href: "#", status: "upcoming" },
  { name: "Step 3", href: "#", status: "upcoming" },
  { name: "Step 4", href: "#", status: "upcoming" },
  { name: "Step 5", href: "#", status: "upcoming" },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

function updateStepsStatus(steps: Step[], step: number): Step[] {
  return steps.map((s, index) => {
    if (index <= step - 1) {
      return { ...s, status: "complete" };
    } else if (index === step) {
      return { ...s, status: "current" };
    } else {
      return { ...s, status: "upcoming" };
    }
  });
}

type StepperProps = {
  currentStep: number;
};

export default function Stepper({ currentStep }: StepperProps) {
  const steps = updateStepsStatus(initialSteps, currentStep);
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={classNames(
              stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "",
              "relative",
            )}
          >
            {step.status === "complete" ? (
              <>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center"
                >
                  <div className="h-0.5 w-full bg-[#5801A9]" />
                </div>
                <a
                  href="#"
                  className="relative flex size-8 items-center justify-center rounded-full bg-[#9B51E0] text-white"
                >
                  {stepIdx + 1}
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            ) : step.status === "current" ? (
              <>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center"
                >
                  <div className="h-0.5 w-full bg-[#5801A9]" />
                </div>
                <a
                  href="#"
                  aria-current="step"
                  className="relative flex size-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-[#F5F7FA]"
                >
                  {stepIdx + 1}
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            ) : (
              <>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center"
                >
                  <div className="h-0.5 w-full bg-[#5801A9]" />
                </div>
                <a
                  href="#"
                  className="group relative flex size-8 items-center justify-center rounded-full border-2 border-[#5801A9] bg-[#F5F7FA] text-[#5801A9]"
                >
                  {stepIdx + 1}
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

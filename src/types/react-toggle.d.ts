// src/types/react-toggle.d.ts
declare module "react-toggle" {
  import * as React from "react";

  export interface ToggleProps {
    checked?: boolean;
    name?: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
  }

  const Toggle: React.FC<ToggleProps>;

  export default Toggle;
}

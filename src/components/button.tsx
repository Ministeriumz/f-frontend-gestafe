import type { ReactNode } from "react";

import { Button as ShadcnButton } from "@/components/ui/button";

type LegacyButtonProps = React.ComponentProps<typeof ShadcnButton> & {
  icon?: ReactNode;
};

export default function Button({ children, icon, ...props }: LegacyButtonProps) {
  return (
    <ShadcnButton {...props}>
      {children}
      {icon}
    </ShadcnButton>
  );
}

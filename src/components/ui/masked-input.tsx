import React from "react";
import { IMaskInput } from "react-imask";
import { cn } from "@/lib/utils";

interface MaskedInputProps extends Omit<React.ComponentProps<typeof IMaskInput>, "mask"> {
  className?: string;
  mask: string | (string | RegExp)[];
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ className, mask, ...props }, ref) => {
    return (
      <IMaskInput
        ref={ref}
        mask={mask}
        // treat '9' as a digit placeholder (same convention as react-input-mask)
        definitions={{ "9": /[0-9]/ }}
        lazy={true}
        unmask={true}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        {...props}
      />
    );
  },
);

MaskedInput.displayName = "MaskedInput";

export { MaskedInput };

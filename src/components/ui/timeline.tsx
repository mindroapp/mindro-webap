
import * as React from "react";
import { cn } from "@/lib/utils";

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative space-y-4 pl-6", className)}
        {...props}
      >
        <div className="absolute inset-y-0 left-2 w-0.5 bg-gray-100 rounded-full" />
        {children}
      </div>
    );
  }
);
Timeline.displayName = "Timeline";

interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative pb-6", className)}
        {...props}
      >
        <div className="absolute left-[-20px] top-1 h-4 w-4 rounded-full border-2 border-psycho-primary bg-white" />
        <div className="bg-white p-4 rounded-md border shadow-sm">
          {children}
        </div>
      </div>
    );
  }
);
TimelineItem.displayName = "TimelineItem";

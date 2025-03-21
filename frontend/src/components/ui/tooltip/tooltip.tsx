import * as React from "react";

type TooltipContextValue = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  position: { top: number; left: number };
  setPosition: (position: { top: number; left: number }) => void;
};

const TooltipContext = React.createContext<TooltipContextValue | undefined>(
  undefined
);

// povider component
interface TooltipProviderProps {
  children: React.ReactNode;
  delayDuration?: number;
}

const TooltipProvider: React.FC<TooltipProviderProps> = ({
  children,
  delayDuration = 300,
}) => {
  return <>{children}</>;
};

interface TooltipProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  const setOpen = React.useCallback(
    (open: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(open);
      }
      if (onOpenChange) {
        onOpenChange(open);
      }
    },
    [isControlled, onOpenChange]
  );

  const contextValue = React.useMemo(
    () => ({
      isOpen,
      setIsOpen: setOpen,
      position,
      setPosition,
    }),
    [isOpen, setOpen, position]
  );

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
    </TooltipContext.Provider>
  );
};

function useTooltip() {
  const context = React.useContext(TooltipContext);
  if (!context) {
    throw new Error("useTooltip must be used within a TooltipProvider");
  }
  return context;
}

interface TooltipTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  asChild?: boolean;
}

const TooltipTrigger = React.forwardRef<HTMLDivElement, TooltipTriggerProps>(
  ({ children, asChild = false, ...props }, ref) => {
    const { setIsOpen, setPosition } = useTooltip();
    const triggerRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => triggerRef.current!);

    const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + rect.width / 2 + window.scrollX,
        });
        setIsOpen(true);
      }
      props.onMouseEnter?.(event);
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
      setIsOpen(false);
      props.onMouseLeave?.(event);
    };

    return (
      <div
        {...props}
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    );
  }
);
TooltipTrigger.displayName = "TooltipTrigger";

// content component
interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  sideOffset?: number;
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ children, className, sideOffset = 5, ...props }, ref) => {
    const { isOpen, position } = useTooltip();

    if (!isOpen) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={`absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm min-w-max transform -translate-x-1/2 ${
          className || ""
        }`}
        style={{
          top: `${position.top + sideOffset}px`,
          left: `${position.left}px`,
        }}
        {...props}
      >
        {children}
        <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -top-1 left-1/2 -translate-x-1/2" />
      </div>
    );
  }
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

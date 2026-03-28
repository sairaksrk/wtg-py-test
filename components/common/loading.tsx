"use client";

import type { JSX } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useEffect } from "react";

import { cn } from "@/utils/helpers";

interface LoadingProps {
  className?: string;
  fullscreen?: boolean;
}

const defaultProps: LoadingProps = {
  className: "",
  fullscreen: false,
};

function LoadingComponent(props: LoadingProps): JSX.Element {
  return (
    <div>
      <svg
        className={cn(
          `h-14 w-14`,
          "inline fill-primary text-gray-200",
          props.className,
        )}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <circle cx="12" cy="3" r="1">
            <animate
              id="spinner_7Z73"
              begin="0;spinner_tKsu.end-0.5s"
              attributeName="r"
              calcMode="spline"
              dur="0.6s"
              values="1;2;1"
              keySplines=".27,.42,.37,.99;.53,0,.61,.73"
            />
          </circle>
          <circle cx="16.50" cy="4.21" r="1">
            <animate
              id="spinner_Wd87"
              begin="spinner_7Z73.begin+0.1s"
              attributeName="r"
              calcMode="spline"
              dur="0.6s"
              values="1;2;1"
              keySplines=".27,.42,.37,.99;.53,0,.61,.73"
            />
          </circle>
          <circle cx="7.50" cy="4.21" r="1">
            <animate
              id="spinner_tKsu"
              begin="spinner_9Qlc.begin+0.1s"
              attributeName="r"
              calcMode="spline"
              dur="0.6s"
              values="1;2;1"
              keySplines=".27,.42,.37,.99;.53,0,.61,.73"
            />
          </circle>
          <circle cx="19.79" cy="7.50" r="1">
            <animate
              id="spinner_lMMO"
              begin="spinner_Wd87.begin+0.1s"
              attributeName="r"
              calcMode="spline"
              dur="0.6s"
              values="1;2;1"
              keySplines=".27,.42,.37,.99;.53,0,.61,.73"
            />
          </circle>
          <circle cx="4.21" cy="7.50" r="1">
            <animate
              id="spinner_9Qlc"
              begin="spinner_Khxv.begin+0.1s"
              attributeName="r"
              calcMode="spline"
              dur="0.6s"
              values="1;2;1"
              keySplines=".27,.42,.37,.99;.53,0,.61,.73"
            />
          </circle>
          <circle cx="21.00" cy="12.00" r="1">
            <animate
              id="spinner_5L9t"
              begin="spinner_lMMO.begin+0.1s"
              attributeName="r"
              calcMode="spline"
              dur="0.6s"
              values="1;2;1"
              keySplines=".27,.42,.37,.99;.53,0,.61,.73"
            />
          </circle>
          <circle cx="3.00" cy="12.00" r="1">
            <animate
              id="spinner_Khxv"
              begin="spinner_ld6P.begin+0.1s"
              attributeName="r"
              calcMode="spline"
              dur="0.6s"
              values="1;2;1"
              keySplines=".27,.42,.37,.99;.53,0,.61,.73"
            />
          </circle>
          <circle cx="19.79" cy="16.50" r="1">
            <animate
              id="spinner_BfTD"
              begin="spinner_5L9t.begin+0.1s"
              attributeName="r"
              calcMode="spline"
              dur="0.6s"
              values="1;2;1"
              keySplines=".27,.42,.37,.99;.53,0,.61,.73"
            />
          </circle>
          <circle cx="4.21" cy="16.50" r="1">
            <animate
              id="spinner_ld6P"
              begin="spinner_XyBs.begin+0.1s"
              attributeName="r"
              calcMode="spline"
              dur="0.6s"
              values="1;2;1"
              keySplines=".27,.42,.37,.99;.53,0,.61,.73"
            />
          </circle>
          <circle cx="16.50" cy="19.79" r="1">
            <animate
              id="spinner_7gAK"
              begin="spinner_BfTD.begin+0.1s"
              attributeName="r"
              calcMode="spline"
              dur="0.6s"
              values="1;2;1"
              keySplines=".27,.42,.37,.99;.53,0,.61,.73"
            />
          </circle>
          <circle cx="7.50" cy="19.79" r="1">
            <animate
              id="spinner_XyBs"
              begin="spinner_HiSl.begin+0.1s"
              attributeName="r"
              calcMode="spline"
              dur="0.6s"
              values="1;2;1"
              keySplines=".27,.42,.37,.99;.53,0,.61,.73"
            />
          </circle>
          <circle cx="12" cy="21" r="1">
            <animate
              id="spinner_HiSl"
              begin="spinner_7gAK.begin+0.1s"
              attributeName="r"
              calcMode="spline"
              dur="0.6s"
              values="1;2;1"
              keySplines=".27,.42,.37,.99;.53,0,.61,.73"
            />
          </circle>
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="6s"
            values="360 12 12;0 12 12"
            repeatCount="indefinite"
          />
        </g>
      </svg>
    </div>
  );
}

function Loading(props: LoadingProps) {
  props = { ...defaultProps, ...props };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      {!props.fullscreen ? (
        <div className="py-4">
          {/* <div className="flex h-[700px] items-center justify-center"> */}
          <div className="flex h-full items-center justify-center">
            <LoadingComponent {...props} />
          </div>
        </div>
      ) : (
        <DialogPrimitive.Root defaultOpen={true}>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="pointer-events-none fixed inset-0 z-9999 bg-black/50 backdrop-blur-sm" />
            <DialogPrimitive.Content
              className="pointer-events-none fixed top-[50%] left-[50%] z-9999 max-w-lg translate-x-[-50%] translate-y-[-50%] duration-200 focus-visible:outline-0"
              onInteractOutside={(event: any) => {
                event.preventDefault();
              }}
            >
              <DialogPrimitive.Title />
              <DialogPrimitive.Description />
              <LoadingComponent {...props} />
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      )}
    </>
  );
}

export default Loading;

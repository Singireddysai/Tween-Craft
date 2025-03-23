import React from "react";

interface LoaderProps {
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ className = "" }) => {
  return (
    <div className={`w-[90px] h-[14px] shadow-[0_3px_0_#fff] bg-[linear-gradient(#fff_0_0)_50%/2px_100%_no-repeat] grid ${className}`}>
      <div className="before:content-[''] before:grid-area-[1/1] before:bg-[radial-gradient(circle_closest-side,#fff_92%,#0000)_0_0_/_calc(100%/4)_100%] before:clip-path-[inset(0_50%_0_0)] before:animate-[loaderWhite_1s_infinite_linear]
                 after:content-[''] after:grid-area-[1/1] after:bg-[radial-gradient(circle_closest-side,#ff6b6b_92%,#0000)_0_0_/_calc(100%/4)_100%] after:clip-path-[inset(0_0_0_50%)] after:animate-[loaderColor_1s_infinite_linear]">
      </div>
    </div>
  );
};

export default Loader;

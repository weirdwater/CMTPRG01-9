import * as React from "react";

const SvgBlock = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" {...props}>
    <path d="M0 10a10 10 0 1120 0 10 10 0 01-20 0zm16.32-4.9L5.09 16.31A8 8 0 0016.32 5.09zm-1.41-1.42A8 8 0 003.68 14.91L14.91 3.68z" />
  </svg>
);

export default SvgBlock;

import * as React from "react";

const SvgTag = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" {...props}>
    <path d="M0 10V2l2-2h8l10 10-10 10L0 10zm4.5-4a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
  </svg>
);

export default SvgTag;

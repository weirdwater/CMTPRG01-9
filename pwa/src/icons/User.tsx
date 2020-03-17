import * as React from "react";

const SvgUser = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" {...props}>
    <path d="M5 5a5 5 0 0110 0v2A5 5 0 015 7V5zM0 16.68A19.9 19.9 0 0110 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" />
  </svg>
);

export default SvgUser;

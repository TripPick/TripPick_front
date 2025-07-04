/// <reference types="vite/client" />

declare module "*.svg" {
  import * as React from "react";

  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

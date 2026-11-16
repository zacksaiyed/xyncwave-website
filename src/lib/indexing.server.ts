import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { isProductionHost } from "./indexing";

/** Uses the real request URL (not caller-supplied forwarding headers) on the server and the page host in the browser. */
export const currentHostIndexable = createIsomorphicFn()
  .server(() => isProductionHost(new URL(getRequest().url).hostname))
  .client(() => isProductionHost(window.location.hostname));

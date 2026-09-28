import { Link, type LinkComponentProps } from "@tanstack/react-router";

export type AppPath = string;

type SmartLinkProps = Omit<LinkComponentProps<"a">, "to" | "params"> & {
  to: AppPath;
  params?: Record<string, string>;
};

/** Internal navigation wrapper so shared, data-driven components can accept plain paths. */
export function SmartLink({ to, params, ...rest }: SmartLinkProps) {
  const linkProps = { to, ...(params ? { params } : {}), ...rest } as unknown as LinkComponentProps<"a">;
  return <Link {...linkProps} />;
}

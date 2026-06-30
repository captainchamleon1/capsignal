"use client";

import { useEffect, useState } from "react";
import { startApplyUrl } from "@/lib/analytics/paid-click";
import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";

type StartApplyButtonProps = Omit<ComponentProps<typeof Button>, "href"> & {
  hash?: string;
};

export function StartApplyButton({ hash = "apply", children, ...props }: StartApplyButtonProps) {
  const [href, setHref] = useState(`/start#${hash}`);

  useEffect(() => {
    setHref(startApplyUrl(hash));
  }, [hash]);

  return (
    <Button href={href} {...props}>
      {children}
    </Button>
  );
}

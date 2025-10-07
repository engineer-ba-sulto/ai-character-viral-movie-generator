"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

export type Page = "character" | "scene" | "video";

interface PageNavigatorProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  canGoToVideo: boolean;
}

const steps: { page: Page; title: string }[] = [
  { page: "character", title: "1. キャラクター生成" },
  { page: "scene", title: "2. シーン作成" },
  { page: "video", title: "3. 動画作成" },
];

const PageNavigator: React.FC<PageNavigatorProps> = ({
  currentPage,
  onNavigate,
  canGoToVideo,
}) => {
  return (
    <Card className="mb-8">
      <CardContent className="p-3">
        <nav>
          <ol className="flex items-center justify-around gap-2">
            {steps.map((step, index) => {
              const isCurrent = currentPage === step.page;
              const isDisabled =
                isCurrent || (step.page === "video" && !canGoToVideo);

              // バリアントの決定
              let variant: "default" | "outline" | "secondary" = "outline";
              if (isCurrent) {
                variant = "default";
              } else if (step.page === "video" && !canGoToVideo) {
                variant = "secondary";
              }

              return (
                <React.Fragment key={step.page}>
                  <li className="flex-1">
                    <Button
                      onClick={() => onNavigate(step.page)}
                      disabled={isDisabled}
                      variant={variant}
                      size="default"
                      className="w-full text-center font-semibold text-sm md:text-base"
                      aria-current={isCurrent ? "page" : undefined}
                    >
                      {step.title}
                    </Button>
                  </li>
                  {index < steps.length - 1 && (
                    <li className="text-muted-foreground" aria-hidden="true">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </li>
                  )}
                </React.Fragment>
              );
            })}
          </ol>
        </nav>
      </CardContent>
    </Card>
  );
};

export default PageNavigator;

import React from "react";
import { SubtitleProvider } from "@vb/context/subtitleProvider";
import SubtitleList from "@vb/layout/subtitleList";
import Player from "@vb/components/player/player";
import { useRouter } from "next/router";

export default function Subtitle() {
  const router = useRouter();

  if (!router.isReady) {
    return <div>Loading...</div>;
  }

  const { source } = router.query;

  const video = {
    source: (source as string) ?? "",
  };

  return (
    <>
      <SubtitleProvider>
        <div className="flex flex-col md:flex-row">
          <div className="lg:w-2/3 md:w-1/2 mt-5 ml-5">
            <Player videoData={video} width="800" height="500" />
          </div>
          <div className="md:w-1/2 lg:w-1/3">
            <SubtitleList />
          </div>
        </div>
      </SubtitleProvider>
    </>
  );
}

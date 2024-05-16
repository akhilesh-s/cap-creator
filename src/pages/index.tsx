import React, { useState } from "react";
import Player from "@vb/components/player/player";
import SubtitleCreator from "@vb/components/subitles/subtitles";

export default function Home() {
  const [video, setVideo] = useState({
    id: 1,
    description:
      "Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit ain't no bunny anymore! In the typical cartoon tradition he prepares the nasty rodents a comical revenge.\n\nLicensed under the Creative Commons Attribution license\nhttp://www.bigbuckbunny.org",
    source:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "9:56",
    subtitle: "By Blender Foundation",
    thumb: "images/BigBuckBunny.jpg",
    title: "Big Buck Bunny",
    progress: 0,
  });

  return (
    <div className="flex flex-col md:flex-row">
      <div className="lg:w-2/3 md:w-1/2 m-[20px]">
        <Player videoData={video} width="800" height="500" id={video.id} />
        <p className="font-semibold mb-2 text-2xl mt-2 md:text-3xl">
          {video.title}
        </p>
        <p className="mb-2 text-md mt-2 md:text-xl">{video.subtitle}</p>
        <p className="text-gray-700">{video.description}</p>
      </div>
      <div className="md:w-1/2 lg:w-1/3">
        <SubtitleCreator />
      </div>
    </div>
  );
}

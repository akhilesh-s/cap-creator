import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@mui/material";

export default function Home() {
  const [videoLink, setVideoLink] = useState("");
  const route = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (videoLink.trim() === "") {
      return;
    }
    route.push(`/subtitle?source=${encodeURIComponent(videoLink)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Caption Creator
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center justify-center"
      >
        <div className="flex flex-col w-96 items-center justify-center">
          <input
            className="mt-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            placeholder="Paste video link here"
          />
          <button
            className="text-white mt-4 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            type="submit"
          >
            Watch Video
          </button>
          <p className="mt-2 font-semibold text-gray-900 dark:text-white">
            Sample URL
          </p>
          <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
            http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
          </p>
        </div>
      </form>
    </div>
  );
}

/* eslint-disable react-hooks/exhaustive-deps */
import { IVideo } from "@vb/types/video";
import React, { useState, useRef, useEffect } from "react";
import {
  AiFillPlayCircle,
  AiFillPauseCircle,
  AiOutlineFullscreenExit,
  AiOutlineFullscreen,
} from "react-icons/ai";
import {
  BsFillVolumeMuteFill,
  BsFillVolumeUpFill,
  BsFillVolumeDownFill,
} from "react-icons/bs";
import { useSubtitle } from "@vb/context/subtitleProvider";
import { Utils } from "@vb/utils/utils";

interface IVideoPlayer {
  videoData: IVideo;
  width: string;
  height: string;
  id?: number;
  onVideoEnd?: () => void;
}

interface HTMLVideoElementRef extends HTMLVideoElement {
  mozRequestFullScreen?: () => Promise<void>;
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

declare global {
  interface Document {
    mozCancelFullScreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
    webkitExitFullscreen?: () => Promise<void>;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
    webkitFullscreenElement?: Element;
  }
}

const Player = (props: IVideoPlayer): JSX.Element => {
  const { videoData, width, height } = props;
  const videoRef = useRef<HTMLVideoElementRef | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(isMuted ? 0 : 100);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const { subtitles } = useSubtitle();

  const options = [
    { value: 0.5, label: "0.5x" },
    { value: 0.75, label: "0.75x" },
    { value: 1, label: "1x" },
    { value: 1.25, label: "1.25x" },
    { value: 1.5, label: "1.5x" },
    { value: 2, label: "2x" },
  ];

  const handlePlayPause = () => {
    if (videoRef?.current?.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef?.current?.pause();
      setIsPlaying(false);
    }
  };

  const goFullscreen = () => {
    if (!isFullScreen && videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef?.current?.mozRequestFullScreen) {
        videoRef.current.mozRequestFullScreen();
      } else if (videoRef?.current?.webkitRequestFullscreen) {
        videoRef.current?.webkitRequestFullscreen();
      } else if (videoRef?.current?.msRequestFullscreen) {
        videoRef.current?.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      setVolume(100);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleMouseEnter = () => {
    setShowControls(true);
  };

  const handleMouseExit = () => {
    setShowControls(false);
  };

  const handleProgress = (e: React.ChangeEvent<HTMLVideoElement>) => {
    const percentage = e.target.currentTime;

    setProgress(percentage);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPlaying(false);
    const newTime = parseFloat(e.target.value);

    setCurrentTime(newTime);
    if (videoRef.current) videoRef.current.currentTime = newTime;
    setIsPlaying(true);
  };

  const getVolumeIcon = (): JSX.Element => {
    if (isMuted || volume === 0) return <BsFillVolumeMuteFill />;
    if (volume < 50) return <BsFillVolumeDownFill />;
    return <BsFillVolumeUpFill />;
  };

  const handlePlaybackSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSpeed = parseFloat(e.target.value);
    handlePlaybackSpeedChange(selectedSpeed);
  };

  const addCustomSubtitles = () => {
    if (videoRef.current) {
      let track = videoRef.current.textTracks[0];
      if (!track) {
        track = videoRef.current.addTextTrack("subtitles", "English", "en");
        track.mode = "showing";
      } else {
        while (track?.cues?.length && track?.cues?.length > 0) {
          track.removeCue(track?.cues[0]);
        }
      }

      subtitles.forEach((sub) => {
        const start = Utils.parseSubtitleTimeline(sub.start);
        const end = Utils.parseSubtitleTimeline(sub.end);
        if (
          typeof start === "number" &&
          !Number.isNaN(start) &&
          !Number.isNaN(end) &&
          typeof end === "number"
        ) {
          const cue = new VTTCue(start, end, sub.text);
          track.addCue(cue);
        }
      });
    }
  };

  useEffect(() => {
    addCustomSubtitles();
  }, [subtitles]);

  useEffect(() => {
    const videoElement = videoRef?.current;

    if (videoElement) {
      const handleTimeUpdate = () => {
        setCurrentTime(videoElement.currentTime);
        setDuration(videoElement.duration);
      };

      const handleDurationChange = async () => {
        setDuration(videoElement.duration);
      };

      videoElement.addEventListener("timeupdate", handleTimeUpdate);
      videoElement.addEventListener("loadedmetadata", handleDurationChange);

      return () => {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
        videoElement.removeEventListener(
          "loadedmetadata",
          handleDurationChange
        );
      };
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  return (
    <div
      style={{ width: "auto", height: "auto" }}
      className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseExit}
      tabIndex={0}
    >
      <video
        id="video-element"
        ref={videoRef}
        width={width}
        height={height}
        muted={isMuted}
        onTimeUpdate={handleProgress}
        className="cursor-pointer w-full h-full object-cover"
        autoPlay
      >
        <source src={videoData.source} type="video/mp4" />
        <p>Your Browser does not support .mp4 video</p>
      </video>
      {showControls && (
        <div>
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="text-5xl text-white transition duration-300 ease-in-out hover:text-gray-300 focus:outline-none"
              onClick={handlePlayPause}
            >
              {isPlaying ? <AiFillPauseCircle /> : <AiFillPlayCircle />}
            </button>
          </div>
          <div className="flex gap-1 items-center absolute left-0 bottom-0 w-full justify-center mb-2 p-1">
            <input
              id="default-range"
              type="range"
              step={1}
              className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer dark:bg-gray-700"
              max={duration}
              value={progress}
              onChange={handleSliderChange}
            ></input>
            <div className="p-1 text-white">
              <p className="flex flex-nowrap justify-center">
                {formatTime(currentTime)}/{formatTime(duration)}
              </p>
            </div>
            <div className="flex items-center">
              <button className="text-white" onClick={toggleMute}>
                {getVolumeIcon()}
              </button>
            </div>
            <div className="w-auto">
              <input
                type="range"
                max={100}
                step={1}
                className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer dark:bg-gray-700"
                value={volume}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setVolume(value);
                  setIsMuted(value === 0);
                }}
              />
            </div>
            <div className="relative">
              <select
                onChange={handleChange}
                value={playbackSpeed}
                className="rounded bg-slate-600 text-white"
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                className="p-2 text-white transition duration-300 ease-in-out hover:text-gray-300 focus:outline-none"
                onClick={goFullscreen}
              >
                {!isFullScreen ? (
                  <AiOutlineFullscreen />
                ) : (
                  <AiOutlineFullscreenExit />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;

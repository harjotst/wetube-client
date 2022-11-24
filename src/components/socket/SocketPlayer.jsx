import React, { useState, useEffect, useReducer } from "react";

import YouTube from "react-youtube";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

import "../../styles/embed-youtube.css";
import { useSocket } from "../../utils/socket";

const SocketPlayer = ({ initialPlayerState }) => {
  const socket = useSocket();

  const [player, setPlayer] = useState(null);

  const [intervalId, setIntervalId] = useState(null);

  const videoStateReducer = (state, action) => {
    switch (action.type) {
      case "paused":
        return { ...state, paused: action.payload };
      case "time":
        return { ...state, time: action.payload };
      case "duration":
        return { ...state, duration: action.payload };
      case "youtubeId":
        return { ...state, youtubeId: action.payload };
      case "reset":
        return initVideoState(action.payload);
      default:
        throw new Error();
    }
  };

  const initVideoState = (videoData) => {
    const currentTime = new Date().getTime();

    if (!videoData.paused) {
      videoData.time =
        (currentTime - videoData.lastUpdated) / 1000 + videoData.time;
    }

    return {
      youtubeId: videoData.youtubeId,
      paused: videoData.paused,
      time: videoData.time,
      duration: videoData.duration,
    };
  };

  const [{ paused, time, duration, youtubeId }, dispatch] = useReducer(
    videoStateReducer,
    initialPlayerState,
    initVideoState
  );

  useEffect(() => {
    if (player === null) return;

    const interval = setInterval(() => {
      dispatch({ type: "time", payload: player.getCurrentTime() });
    }, 1000);

    setIntervalId(interval);

    return () => {
      clearInterval(intervalId);
      setIntervalId(null);
    };
  }, [player]);

  useEffect(() => {
    if (player) {
      socket.on("play-video", (time) => {
        dispatch({ type: "paused", payload: false });
        player.seekTo(time);
        player.playVideo();
      });

      socket.on("pause-video", (time) => {
        dispatch({ type: "paused", payload: true });
        player.seekTo(time);
        player.pauseVideo();
      });

      socket.on("change-video", (videoData) => {
        dispatch({
          type: "reset",
          payload: {
            youtubeId: videoData.id,
            paused: videoData.paused,
            time: videoData.time,
            duration: videoData.duration,
          },
        });
      });
    }
    return () => {
      socket.off("play-video");
      socket.off("pause-video");
      socket.off("change-video");
    };
  }, [player]);

  const onReady = (event) => {
    if (player !== null) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    setPlayer(event.target);

    event.target.seekTo(time);

    if (paused) {
      event.target.pauseVideo();
    } else {
      event.target.playVideo();
    }
  };

  const play = () => {
    dispatch({ type: "paused", payload: false });
    player.playVideo();
    socket.emit("play-video", time);
  };

  const pause = () => {
    dispatch({ type: "paused", payload: true });
    player.pauseVideo();
    socket.emit("pause-video", time);
  };

  const onChangeTime = (event) => {
    dispatch({ type: "time", payload: event.target.value });
    player.seekTo(event.target.value);

    if (paused) socket.emit("pause-video", event.target.value);
    else socket.emit("play-video", event.target.value);
  };

  const YouTubeTime = ({ current, duration }) => {
    return (
      <span className="pr-2">
        {current > 3600 ? <>{Math.floor(current / 3600)}:</> : null}
        {current > 3600
          ? String(Math.floor(current / 60) % 60).padStart(2, "0")
          : Math.floor(current / 60) % 60}
        :{String(Math.floor(current % 60)).padStart(2, "0")}
        &nbsp;/&nbsp;
        {duration > 3600 ? <>{Math.floor(duration / 3600)}:</> : null}
        {duration > 3600
          ? String(Math.floor(duration / 60) % 60).padStart(2, "0")
          : Math.floor(duration / 60) % 60}
        :{String(Math.floor(duration % 60)).padStart(2, "0")}
      </span>
    );
  };

  return (
    <div className="flex flex-col flex-grow h-full">
      <div className="embed-youtube flex-grow">
        {youtubeId ? (
          <YouTube
            videoId={youtubeId}
            onReady={onReady}
            opts={{ playerVars: { controls: 0, disablekb: 1 } }}
            className="iframe-placeholder pointer-events-none h-full"
          />
        ) : null}
      </div>
      <div id="controls" className="flex flex-row items-center pr-2 border-2">
        <button className="py-1 px-2">
          {paused ? (
            <FontAwesomeIcon icon={faPlay} onClick={play} />
          ) : (
            <FontAwesomeIcon icon={faPause} onClick={pause} />
          )}
        </button>
        <YouTubeTime current={time} duration={duration} />
        <input
          className="flex-grow"
          type="range"
          id="time"
          step={1}
          value={time}
          min="0"
          max={duration}
          onChange={onChangeTime}
        />
      </div>
    </div>
  );
};

export default SocketPlayer;

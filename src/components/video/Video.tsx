import { useEffect, useRef, useState } from "react";
import usePIP from "../../hooks/usePips";
import { VideoLink } from "../../interfaces/interfaces";
import styles from "./video.module.scss";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { useParams } from "react-router-dom";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const Video = (videoLink: VideoLink) => {
  const [isPIPOn, setIsPIPOn] = useState<boolean>(false);
  const [playing, setIsPlaying] = useState<boolean>(true);
  const videoElement = useRef<HTMLVideoElement>(null);
  const { togglePIP } = usePIP(videoElement);
  const { courseId } = useParams();

  useEffect(() => {
    const video = videoElement.current;
    const idLesson = videoLink.videoLink.id;
    const savedProgressJson = localStorage.getItem(`${idLesson}`);
    const savedProgress = savedProgressJson
      ? JSON.parse(savedProgressJson)
      : null;

    if (video && savedProgress) {
      const { currentTimePlaying } = savedProgress;
      video.currentTime = currentTimePlaying;
      const player = videojs("video");
      player.currentTime(currentTimePlaying);
    }

    const handleTimeUpdate = () => {
      if (video) {
        localStorage.setItem(
          `${idLesson}`,
          JSON.stringify({
            currentTimePlaying: video.currentTime,
            courseId,
            idLesson,
          })
        );
      }
    };

    video?.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [courseId, videoLink.videoLink.id]);

  useEffect(() => {
    const player = videojs(videoElement.current ? videoElement.current : "");
    player.src({
      src: videoLink.videoLink.link,
      type: "application/x-mpegURL",
    });
    player.play();
  }, [videoLink.videoLink.link]);

  useEffect(() => {
    const video = videoElement.current;
    if (!video) return;

    const onEnterPIP = () => setIsPIPOn(true);
    const onLeavePIP = () => setIsPIPOn(false);

    video.addEventListener("enterpictureinpicture", onEnterPIP);
    video.addEventListener("leavepictureinpicture", onLeavePIP);

    return () => {
      video.removeEventListener("enterpictureinpicture", onEnterPIP);
      video.removeEventListener("leavepictureinpicture", onLeavePIP);
    };
  }, []);

  const togglePlay = () => {
    const videoEl = videoElement.current;
    if (playing && videoEl) {
      let isPlaying =
        videoEl.currentTime > 0 &&
        !videoEl.paused &&
        !videoEl.ended &&
        videoEl.readyState > videoEl.HAVE_CURRENT_DATA;
      videoEl!.innerHTML = `<source src='${videoLink.videoLink.link}' type='application/x-mpegURL'>`;
      const player = videojs(videoElement.current || "");
      if (!isPlaying) {
        player.play();
      }
    } else {
      const player = videojs(videoElement.current || "");
      player.pause();
    }
    setIsPlaying(!playing);
  };

  //   У функції обробника подій handleKeyDown ми перевіряємо, яку клавішу було натиснуто, і змінюємо швидкість відтворення відео відповідно до того, чи була натиснута стрілка вгору або вниз.
  const handleKeyDown = (event: { keyCode: number }) => {
    if (event.keyCode === 38 && videoElement.current) {
      // Up arrow key
      if (videoElement.current.playbackRate < 4.0) {
        videoElement.current.playbackRate += 0.25;
      }
    } else if (event.keyCode === 40 && videoElement.current) {
      // Down arrow key
      if (videoElement.current.playbackRate > 0.5) {
        videoElement.current.playbackRate -= 0.25;
      }
    }
  };
  return (
    <div className={styles.container}>
      <video
        muted
        data-vjs-player
        onKeyDown={handleKeyDown}
        poster={
          videoLink.videoLink.previewImageLink +
          "/" +
          videoLink.videoLink.order +
          ".webp"
        }
        id={"video"}
        data-setup="{control:false, autoplay:false}"
        loop
        controls
        ref={videoElement}
        className={`video-js ${styles.videoJS}`}
      ></video>
      <div className={styles.controlBlock}>
        <button onClick={togglePlay} id="btn" className={styles.button}>
          Play/Pause
        </button>
        <button onClick={togglePIP} className={styles.button}>
          {isPIPOn ? "Turn off PIP" : "Turn on PIP"}
        </button>
        <div>
          <p>
            To speed up the video press button <ArrowUpOutlined />
          </p>
          <p>
            Reduce video speed press button <ArrowDownOutlined />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Video;

import { useEffect, useState, useRef } from "react";
import "./App.css";

function App() {
    const [playing, setPlaying] = useState(false);
    const [currentVol, setCurrentVolume] = useState(50);
    const [showSlider, setShowSlider] = useState(false);
    const [currentTime, setCurrentTime] = useState("0:00");
    const [totalTime, setTotalTime] = useState();
    const [showControls, setShowControls] = useState(true);
    const videoPlayer = useRef();
    const playButton = useRef();
    const vidContainer = useRef();
    const downloadedBar = useRef();
    const volumeSlider = useRef();
    const progressBar = useRef();
    let timeoutControls = null;
    const handle_play_video = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (videoPlayer.current.paused) {
            setPlaying(true);
            playButton.current.checked = false;
            return videoPlayer.current.play();
        }
        setPlaying(false);
        setShowControls(true);
        playButton.current.checked = true;
        return videoPlayer.current.pause();
    };
    const handle_change_volume = (e) => {
        const val = e.target.value;
        e.target.style.backgroundSize = ((val - 0) * 100) / (100 - 0) + "% 100%";
        setCurrentVolume(val);
        videoPlayer.current.volume = val / 100;
    };

    const updateProgressBar = () => {
        const percentage = (videoPlayer.current.currentTime / videoPlayer.current.duration) * 100;
        if (showControls) {
            progressBar.current.style.width = `${percentage}%`;
        }
        setCurrentTime(fancyTimeFormat(videoPlayer.current.currentTime));
    };
    function fancyTimeFormat(duration) {
        // Hours, minutes and seconds
        var hrs = ~~(duration / 3600);
        var mins = ~~((duration % 3600) / 60);
        var secs = ~~duration % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        var ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }
    const handle_change_progress_bar = (e) => {
        const progressTime =
            (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) * videoPlayer.current.duration;
        videoPlayer.current.currentTime = progressTime;
        downloadedBar.current.style.width = "0%";
    };

    const handle_update_downloaded = () => {
        if (showControls && videoPlayer.current.readyState === 4)
            downloadedBar.current.style.width = `${
                (videoPlayer.current.buffered.end(0) / videoPlayer.current.duration) * 100
            }%`;
    };

    const handle_show_slider = () => {
        setShowSlider(true);
    };

    const handle_volume_button = () => {
        if (videoPlayer.current.volume === 0) {
            videoPlayer.current.volume = ".5";
            volumeSlider.current.style.backgroundSize = ((50 - 0) * 100) / (100 - 0) + "% 100%";
            volumeSlider.current.value = 50;
            return setCurrentVolume(50);
        }
        videoPlayer.current.volume = "0";
        volumeSlider.current.style.backgroundSize = ((0 - 0) * 100) / (100 - 0) + "% 100%";
        volumeSlider.current.value = 0;
        return setCurrentVolume(0);
    };

    const loadedVideo = (e) => {
        e.target.volume = ".5";
        setTotalTime(fancyTimeFormat(e.target.duration));
    };

    const handleFullScreen = () => {
        if (!document.fullscreenElement) {
            vidContainer.current.requestFullscreen();
            return videoPlayer.current.classList.add("vid_fullscreen");
        }
        document.exitFullscreen();
        return videoPlayer.current.classList.remove("vid_fullscreen");
    };

    const handleShowControls = () => {
        if (playing) {
            setShowControls(false);
        }
    };

    const handleFullScreenControls = () => {
        if (document.fullscreenElement) {
            clearTimeout(timeoutControls);
            setShowControls(true);
            timeoutControls = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }
    };
    useEffect(() => {
        function listenForKey(e) {
            if (e.key === "ArrowRight" && playing) {
                videoPlayer.current.currentTime = videoPlayer.current.currentTime + 10;
            }
            if (e.key === "ArrowLeft" && playing) {
                videoPlayer.current.currentTime = videoPlayer.current.currentTime - 10;
            }
        }
        document.addEventListener("keydown", listenForKey);

        return () => document.removeEventListener("keydown", listenForKey);
    }, [playing]);

    useEffect(() => {
        return () => clearTimeout(timeoutControls);
    }, [timeoutControls]);
    return (
        <>
            <div
                id="video_box_container"
                ref={vidContainer}
                onMouseLeave={handleShowControls}
                onMouseEnter={() => {
                    setShowControls(true);
                }}
                onMouseMove={handleFullScreenControls}
            >
                <video
                    id="video_player"
                    style={{ left: "0px", top: "0px" }}
                    poster="https://i.gyazo.com/3aaf3a45ed15dfac0433c8d567796834.jpg"
                    onLoadedData={loadedVideo}
                    onTimeUpdate={updateProgressBar}
                    onClick={handle_play_video}
                    onProgress={handle_update_downloaded}
                    onDoubleClick={handleFullScreen}
                    ref={videoPlayer}
                >
                    <source type="video/mp4" src="/api/video"></source>
                </video>

                <div
                    id="video_contols"
                    style={showControls ? { opacity: 1 } : { opacity: 0 }}
                    onMouseLeave={() => setShowSlider(false)}
                >
                    <div
                        id="progress_bar"
                        className="progress_bar"
                        onClick={handle_change_progress_bar}
                    >
                        <div
                            id="progress_bar_filled"
                            className="progress_bar_filled"
                            ref={progressBar}
                        ></div>
                        <div
                            id="progress_bar_downloaded"
                            className="progress_bar_downloaded"
                            ref={downloadedBar}
                        ></div>
                    </div>
                    <div
                        id="play_button"
                        className="playpause video_buttons"
                        onClick={handle_play_video}
                    >
                        <input
                            type="checkbox"
                            id="playpause-input"
                            defaultChecked={playing ? false : true}
                            ref={playButton}
                        />
                        <label htmlFor="playpause" tabIndex="1">
                            {" "}
                        </label>
                    </div>
                    <div className="volume_container">
                        <img
                            alt="svg of volume button"
                            className="volume_svg"
                            onClick={handle_volume_button}
                            onMouseOver={handle_show_slider}
                            src={
                                currentVol >= 50
                                    ? require("./images/highVol.svg").default
                                    : currentVol > 0
                                    ? require("./images/lowVol.svg").default
                                    : require("./images/noVol.svg").default
                            }
                        ></img>
                        <input
                            id="video_volume_slider"
                            className={`${showSlider ? "show_slider" : ""}`}
                            type="range"
                            min="0"
                            max="100"
                            defaultValue={currentVol}
                            style={{
                                backgroundSize: ((currentVol - 0) * 100) / (100 - 0) + "% 100%",
                            }}
                            step="1"
                            onInput={handle_change_volume}
                            ref={volumeSlider}
                        ></input>
                    </div>

                    <div className="time_container">
                        <span className="time_container_span">
                            {currentTime} / {totalTime}{" "}
                        </span>
                    </div>
                    <button className="video_buttons fullscreen_button" onClick={handleFullScreen}>
                        <i className="fas fa-expand"></i>
                    </button>
                </div>
            </div>
            <div>
                <button className="github-source-button">
                    <a href="https://github.com/EricL132/Custom_video_player" className="no-decor-a"  target="_blank" rel="noreferrer">
                        <i className="fa-brands fa-github">
                            <span className="">Source on Github</span>
                        </i>
                    </a>
                </button>
            </div>
        </>
    );
}

export default App;

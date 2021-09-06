import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [playing, setPlaying] = useState(false)
  const [currentVol, setCurrentVolume] = useState(50)
  const [showSlider, setShowSlider] = useState(false)
  const [currentTime, setCurrentTime] = useState("0:00")
  const [totalTime, setTotalTime] = useState()
  const [showControls, setShowControls] = useState(true)
  let timeoutControls = null;
  const handle_play_video = (e) => {
    e.stopPropagation()
    e.preventDefault();
    const vid = document.getElementById("video_player")
    const check_box = document.getElementById("playpause")
    if (vid.paused) {
      setPlaying(true)
      check_box.checked = false
      return vid.play()
    }
    setPlaying(false)
    setShowControls(true)
    check_box.checked = true
    return vid.pause()
  }
  const handle_change_volume = (e) => {
    const vid = document.getElementById("video_player")
    const val = e.target.value
    e.target.style.backgroundSize = (val - 0) * 100 / (100 - 0) + '% 100%'
    setCurrentVolume(val)
    vid.volume = val / 100
  }

  const updateProgressBar = () => {
    const vid = document.getElementById('video_player')
    const percentage = (vid.currentTime / vid.duration) * 100
    if(showControls){
      document.getElementById("progress_bar_filled").style.width = `${percentage}%`
    }
    setCurrentTime(fancyTimeFormat(vid.currentTime))
  }
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
    const vid = document.getElementById('video_player')
    const progressTime = (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) * vid.duration
    vid.currentTime = progressTime
    document.getElementById("progress_bar_downloaded").style.width = "0%"
  }

  const handle_update_downloaded = () => {
    const vid = document.getElementById('video_player')
    if (showControls && vid.readyState === 4) document.getElementById("progress_bar_downloaded").style.width = `${(vid.buffered.end(0) / vid.duration) * 100}%`
  }

  const handle_show_slider = () => {
    setShowSlider(true)
  }

  const handle_volume_button = () => {
    const vid = document.getElementById('video_player')
    const sliderBar = document.getElementById("video_volume_slider")
    if (vid.volume === 0) {
      vid.volume = ".5"
      sliderBar.style.backgroundSize = (50 - 0) * 100 / (100 - 0) + '% 100%'
      sliderBar.value = 50
      return setCurrentVolume(50)
    }
    vid.volume = "0"
    sliderBar.style.backgroundSize = (0 - 0) * 100 / (100 - 0) + '% 100%'
    sliderBar.value = 0
    return setCurrentVolume(0)
  }

  const loadedVideo = (e) => {
    e.target.volume = ".5"
    setTotalTime(fancyTimeFormat(e.target.duration))
  }

  const handleFullScreen = () => {
    const vidcon = document.getElementById("video_box_container")
    const vid = document.getElementById("video_player")
    if (!document.fullscreenElement) {
      vidcon.requestFullscreen()
      return vid.classList.add("vid_fullscreen")
    }
    document.exitFullscreen()
    return vid.classList.remove("vid_fullscreen")
  }

  const handleShowControls = ()=>{
    if(playing){
      setShowControls(false)
    }
  }

  const handleFullScreenControls = () =>{
    if(document.fullscreenElement){
      clearTimeout(timeoutControls)
      setShowControls(true)
      timeoutControls = setTimeout(()=>{
        setShowControls(false)
      },3000)
    }
  }
  useEffect(()=>{

    function listenForKey(e){
      if(e.key==="ArrowRight" && playing){
        const vid = document.getElementById("video_player")
        vid.currentTime = vid.currentTime + 10
      }
      if(e.key==="ArrowLeft" && playing){
        const vid = document.getElementById("video_player")
        vid.currentTime = vid.currentTime - 10
      }
    }
    document.addEventListener("keydown",listenForKey)

    return ()=> document.removeEventListener('keydown',listenForKey)
  },[playing])
  return (
    <div id="video_box_container" onMouseLeave={handleShowControls} onMouseEnter={()=>{setShowControls(true)}} onMouseMove={handleFullScreenControls}>
      <video id="video_player" style={{ left: "0px", top: "0px" }} poster="https://i.gyazo.com/4a3aa3a16b53d39b84a96becb7e2add3.jpg"  onLoadedData={loadedVideo} onTimeUpdate={updateProgressBar} onClick={handle_play_video} onProgress={handle_update_downloaded}>
        <source type="video/mp4" src="/api/video"></source>
      </video>
    
        <div id="video_contols" style={showControls ? {display:''} : {display:'none'}} onMouseLeave={() => setShowSlider(false)}>
          <div id="progress_bar" className="progress_bar" onClick={handle_change_progress_bar}>
            <div id="progress_bar_filled" className="progress_bar_filled"></div>
            <div id="progress_bar_downloaded" className="progress_bar_downloaded"></div>
          </div>
          <div id="play_button" className="playpause video_buttons" onClick={handle_play_video}>
            <input type="checkbox" id="playpause" defaultChecked={playing ? false : true}/>
            <label htmlFor="playpause" tabIndex="1"> </label>
          </div>
          <img alt="svg of volume button" className="volume_svg" onClick={handle_volume_button} onMouseOver={handle_show_slider} src={currentVol >= 50 ? require("./images/highVol.svg").default : currentVol > 0 ? require("./images/lowVol.svg").default : require("./images/noVol.svg").default}></img>
          <input id="video_volume_slider" className={`${showSlider ? "show_slider" : ""}`} type="range" min="0" max="100" defaultValue={currentVol} style={{backgroundSize:(currentVol - 0) * 100 / (100 - 0) + '% 100%'}} step="1" onInput={handle_change_volume}></input>
          <div className="time_container">
            <span className="time_container_span">{currentTime} / {totalTime} </span>
          </div>
          <button className="video_buttons fullscreen_button" onClick={handleFullScreen}><i className="fas fa-expand"></i></button>
        </div>
    
    </div>
  );
}

export default App;

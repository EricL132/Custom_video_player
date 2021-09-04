import { useState } from 'react';
import './App.css';

function App() {
  const [muted, setMuted] = useState(false)
  const [playing,setPlaying] = useState(false)
  const handle_play_video = () => {
    const vid = document.getElementById("video_player")
    if (vid.paused) {
      setPlaying(true)
      return vid.play()
    }
    setPlaying(false)
    return vid.pause()
  }
  const handle_change_volume = (e) => {
    const vid = document.getElementById("video_player")
    const min = e.target.min
    const max = e.target.max
    const val = e.target.value
    e.target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'
  }

  const updateProgressBar = () =>{
    const vid = document.getElementById('video_player')
    const percentage = (vid.currentTime/vid.duration) * 100
    document.getElementById("progress_bar_filled").style.width = `${percentage}%`
  }

  const handle_change_progress_bar = (e)=>{
    const vid = document.getElementById('video_player')
    const progressTime = (e.nativeEvent.offsetX/e.currentTarget.offsetWidth) * vid.duration
    vid.currentTime = progressTime
    document.getElementById("progress_bar_downloaded").style.width = "0%"
  }

  const handle_update_downloaded = ()=>{
    const vid = document.getElementById('video_player')
    if(vid.readyState===4) document.getElementById("progress_bar_downloaded").style.width = `${(vid.buffered.end(0) / vid.duration) * 100}%`
  }
  return (
    <div id="video_box_container">
      <video id="video_player" style={{width: "1264px", height: "711px", left: "0px", top:"0px"}} autoPlay onTimeUpdate={updateProgressBar} onClick={handle_play_video} onProgress={handle_update_downloaded}>
        <source type="video/mp4" src="/api/video"></source>
      </video>
      <div id="video_contols">
        <div id="progress_bar" className="progress_bar" onClick={handle_change_progress_bar}>
          <div id="progress_bar_filled" className="progress_bar_filled"></div>
          <div id="progress_bar_downloaded" className="progress_bar_downloaded"></div>
        </div>
        {!playing ? <button id="play_button" className="video_buttons" onClick={handle_play_video}><i className="fas fa-play"></i></button> : <button id="play_button" className="video_buttons" onClick={handle_play_video}><i className="fas fa-pause"></i></button>}
        {!muted ? <button className="video_buttons" id="video_volume_button"><i className="fas fa-volume-up"></i></button> : <button className="video_buttons" id="video_volume_button"><i className="fas fa-volume-mute"></i></button>}
        <input id="video_volume_slider" type="range" min="0" max="100" step="1" onInput={handle_change_volume}></input>
      </div>
    </div>
  );
}

export default App;

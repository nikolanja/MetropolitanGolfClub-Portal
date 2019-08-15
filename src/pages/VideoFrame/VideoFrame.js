import React, { Component } from 'react';
// import { DefaultPlayer as Video } from 'react-html5video';
import 'react-html5video/dist/styles.css';
import './index.scss';
import ReactPlayer from 'react-player'

export default class VideoFrame extends Component 
{
    render() {
        
        return (
            <div className="video-content">
                <ReactPlayer
					playsinline
					url='https://mgsc.wistia.com/medias/pz3gsic8ej'
					// url='https://www.youtube.com/watch?v=ygVxTTKWvdA'
					config={{
						wistia: {
							playerVars: { 
								autoPlay: false,
								videoFoam: true,
								autoSize: true
							}
						},
						youtube: {
							playerVars: {
								autoPlay: false,
								controls: true
							}
						}
					}}
					width="100%"
					height="100%"
					/>
            </div>
        );
    }
}

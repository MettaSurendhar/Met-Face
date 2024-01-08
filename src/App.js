/* eslint-disable no-unused-vars */
import './App.css';

import React, { useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import Webcam from 'react-webcam';
import { drawMesh } from './utilities';

function App() {
	// Set up references
	const webcamRef = useRef(null);
	const canvasRef = useRef(null);

	// Load facemesh
	const runFacemesh = async () => {
		const net = await facemesh.load({
			inputResolution: { width: 640, height: 480 },
			scale: 0.8,
		});
		setInterval(() => {
			detect(net);
		}, 100);
	};

	// Detect function
	const detect = async (net) => {
		if (
			typeof webcamRef.current !== 'undefined' &&
			webcamRef.current !== null &&
			webcamRef.current.video.readyState === 4
		) {
			// Get video properties
			const video = webcamRef.current.video;
			const videoWidth = webcamRef.current.video.videoWidth;
			const videoHeight = webcamRef.current.video.videoHeight;
			// Set video height and width
			webcamRef.current.video.width = videoWidth;
			webcamRef.current.video.height = videoHeight;
			// Set canvas height and width
			canvasRef.current.width = videoWidth;
			canvasRef.current.height = videoHeight;
			// Make detection
			const face = await net.estimateFaces(video);
			// Get canvas context for drawing
			const ctx = canvasRef.current.getContext('2d');
			drawMesh(face, ctx);
		}
	};

	runFacemesh();

	return (
		<div className='App'>
			<h1
				style={{
					margin: 0,
					padding: 0,
					paddingTop: '8vh',
				}}
			>
				MET - FACE DETECTOR
			</h1>
			<header className='App-header'>
				<Webcam
					ref={webcamRef}
					style={{
						position: 'absolute',
						marginLeft: 'auto',
						marginRight: 'auto',
						left: 0,
						right: 0,
						textAlign: 'center',
						zIndex: 9,
						width: '640px',
						height: '480px',
					}}
				/>
				<canvas
					ref={canvasRef}
					style={{
						position: 'absolute',
						marginLeft: 'auto',
						marginRight: 'auto',
						left: 0,
						right: 0,
						textAlign: 'center',
						zIndex: 9,
						width: '640px',
						height: '480px',
					}}
				/>
			</header>
		</div>
	);
}

export default App;

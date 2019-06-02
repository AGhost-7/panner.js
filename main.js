import './style.scss'

function pan(input, output, ratio) {
	for(let sample = 0; sample < input.length; sample++) {
		output[sample] = input[sample] * ratio
	}
}

function clamp(value, start, end) {
	return Math.max(Math.min(end, value), start)
}

async function initializeAudioContext(panSetting) {
	const stream = await navigator.mediaDevices.getUserMedia({
		audio: true,
		video: false
	})

	const context = new AudioContext()
	const source = context.createMediaStreamSource(stream)
	const bufferSize = 512
	const inputChannels = 1
	const outputChannels = 2
	const processor = context.createScriptProcessor(
		bufferSize,
		inputChannels,
		outputChannels
	)
	processor.onaudioprocess = (event) => {
		const {inputBuffer, outputBuffer} = event
		pan(
			inputBuffer.getChannelData(0),
			outputBuffer.getChannelData(0),
			panSetting.left
		)
		pan(
			inputBuffer.getChannelData(0),
			outputBuffer.getChannelData(1),
			panSetting.right
		)
	}
	source.connect(processor)
	processor.connect(context.destination)
}

function initializeScrollbar(panSetting) {
	const scrollbar = document.querySelector('.scrollbar')
	const draggable = document.querySelector('.draggable')

	const relativeLeftPosition = (event) => {
		const rect = scrollbar.getBoundingClientRect()
		return event.clientX - rect.left
	}

	let dragging = false
	let lastPosition = null
	let draggablePosition = 108
	draggable.onmousedown = (event) => {
		dragging = true
		lastPosition = relativeLeftPosition(event)
	}
	window.onmouseup = () => {
		dragging = false
	}
	draggable.onmousemove = (event) => {
		if (dragging) {
			const relativeMouse = relativeLeftPosition(event)
			const change = relativeMouse - lastPosition
			draggablePosition = clamp(change + draggablePosition, 0, 216)
			lastPosition = relativeMouse
			draggable.style.left = draggablePosition
			const percentage = draggablePosition / 216
			panSetting.right = percentage * 2
			panSetting.left = 2.0 - percentage * 2
			console.log('percentage:', percentage, 'left:', panSetting.left, 'right:', panSetting.right)
		}
	}
}

(async () => {
	const panSetting = {
		left: 1.0,
		right: 1.0
	}
	await initializeAudioContext(panSetting)
	initializeScrollbar(panSetting)
})()

# Panner.js
An experiment with the web audio API. The goal was to build something which
records audio, performs a _custom_ transformation, and plays it back in
realtime.

## Issues so far
It looks like this isn't very well suited for doing realtime audio processing.
The latency is too high in a browser.

## Running
All you need is:
```bash
yarn
yarn dev
```

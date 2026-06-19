function setupMoviePlayer(videoId, buttonId, mediaUrl) {
  const video = document.getElementById(videoId);
  const button = document.getElementById(buttonId);
  const Hls = window.Hls;

  if (!video || !button || !mediaUrl) {
    return;
  }

  let ready = false;

  const attachMedia = () => {
    if (ready) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = mediaUrl;
      ready = true;
      return;
    }

    if (Hls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(mediaUrl);
      hls.attachMedia(video);
      ready = true;
    }
  };

  const play = () => {
    attachMedia();
    button.classList.add('hidden');
    const promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(() => {
        button.classList.remove('hidden');
      });
    }
  };

  button.addEventListener('click', play);
  video.addEventListener('click', () => {
    if (video.paused) {
      play();
    }
  });
  video.addEventListener('play', () => {
    button.classList.add('hidden');
  });
  video.addEventListener('pause', () => {
    if (!video.ended) {
      button.classList.remove('hidden');
    }
  });
}

window.setupMoviePlayer = setupMoviePlayer;

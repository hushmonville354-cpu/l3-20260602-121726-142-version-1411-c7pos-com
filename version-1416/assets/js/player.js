(function () {
  var video = document.querySelector('[data-video-player]');
  var cover = document.querySelector('[data-video-cover]');
  if (!video) return;

  var src = video.getAttribute('data-src');
  var ready = false;
  var hlsInstance = null;

  function attach() {
    if (ready || !src) return;
    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90
      });
      hlsInstance.loadSource(src);
      hlsInstance.attachMedia(video);
    } else {
      video.src = src;
    }
    ready = true;
  }

  function play() {
    attach();
    if (cover) cover.classList.add('hidden');
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  if (cover) {
    cover.addEventListener('click', play);
  }

  video.addEventListener('click', function () {
    if (!ready) play();
  });

  video.addEventListener('play', function () {
    if (cover) cover.classList.add('hidden');
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) hlsInstance.destroy();
  });
})();

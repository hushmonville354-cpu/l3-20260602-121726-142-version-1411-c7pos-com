import { H as Hls } from './hls-vendor-dru42stk.js';

function setMessage(box, message) {
  const messageNode = box.querySelector('[data-player-message]');
  if (messageNode) {
    messageNode.textContent = message || '';
  }
}

function attachHls(video, sourceUrl, box) {
  if (!sourceUrl) {
    setMessage(box, '当前影片缺少播放源。');
    return Promise.resolve(false);
  }

  if (video.dataset.playerReady === 'true') {
    return Promise.resolve(true);
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = sourceUrl;
    video.dataset.playerReady = 'true';
    return Promise.resolve(true);
  }

  if (Hls && Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });

    video.__hlsInstance = hls;
    hls.loadSource(sourceUrl);
    hls.attachMedia(video);

    return new Promise(function (resolve) {
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.dataset.playerReady = 'true';
        setMessage(box, '');
        resolve(true);
      });

      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          setMessage(box, '视频加载失败，请刷新页面或稍后再试。');
          resolve(false);
        }
      });
    });
  }

  setMessage(box, '当前浏览器不支持 HLS 播放。');
  return Promise.resolve(false);
}

async function startPlayer(box) {
  const video = box.querySelector('video[data-hls-src]');
  const startButton = box.querySelector('[data-player-start]');

  if (!video) {
    return;
  }

  setMessage(box, '正在加载播放源...');
  const ready = await attachHls(video, video.dataset.hlsSrc, box);

  if (!ready) {
    return;
  }

  try {
    await video.play();
    if (startButton) {
      startButton.classList.add('is-hidden');
    }
    setMessage(box, '');
  } catch (error) {
    setMessage(box, '浏览器阻止了自动播放，请再次点击播放器开始播放。');
  }
}

function initPlayers() {
  document.querySelectorAll('[data-player-box]').forEach(function (box) {
    const startButton = box.querySelector('[data-player-start]');
    const video = box.querySelector('video[data-hls-src]');

    if (startButton) {
      startButton.addEventListener('click', function () {
        startPlayer(box);
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.dataset.playerReady !== 'true') {
          startPlayer(box);
        }
      });
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPlayers);
} else {
  initPlayers();
}

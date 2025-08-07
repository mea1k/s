const video = document.createElement('video');
video.src = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm';
video.muted = false;
video.controls = true;
video.style.position = 'fixed';
video.style.top = '0';
video.style.left = '0';
video.style.width = '100vw';
video.style.height = '100vh';
video.style.objectFit = 'cover';
video.style.backgroundColor = 'black';
video.style.zIndex = '9999';

document.body.appendChild(video);

video.play()
  .then(() => {
    if (video.requestFullscreen) {
      return video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      return video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      return video.msRequestFullscreen();
    }
  })
  .catch(err => {
    console.error('Ошибка при запуске видео или переходе в fullscreen:', err);
  });

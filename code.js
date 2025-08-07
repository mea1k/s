const video = document.createElement('video');
video.src = 'https://github.com/mea1k/s/raw/refs/heads/main/youtubecom%20video720p.mp4';
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

export function initVideo(): void {
  const wrapper = document.getElementById("video");
  const video = document.getElementById("introVideo") as HTMLVideoElement | null;
  const button = document.getElementById("videoPlay");
  if (!wrapper || !video || !button) return;

  button.addEventListener("click", () => {
    video.controls = true;
    wrapper.classList.add("is-playing");
    video.play().catch(() => {
      wrapper.classList.remove("is-playing");
      video.controls = false;
    });
  });

  video.addEventListener("ended", () => {
    video.controls = false;
    wrapper.classList.remove("is-playing");
    video.currentTime = 0;
  });
}

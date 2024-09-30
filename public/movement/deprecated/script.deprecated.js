const emoji = document.createElement("div");

// when chaser die, show emoji
function showEmoji(position) {
  emoji.innerText = "💥";
  emoji.style.position = "absolute";
  emoji.style.fontSize = "24px";
  emoji.style.left = position[0] + "px";
  emoji.style.bottom = position[1] + "px";

  box.append(emoji);

  setTimeout(() => {
    emoji.remove();
  }, 1000);
}

//Random function for trees
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.querySelector(".dice-face").textContent = randomInt(1, 6);
document.querySelector("#rollBtn").addEventListener("click", (c) => {
  document.querySelector(".dice-face").textContent = randomInt(1, 6);
});



console.log(document.querySelector('.mode-btn').value);

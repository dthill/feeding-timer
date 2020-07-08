const startButton = document.getElementById("start-stop-continue-timer");
const saveButton = document.getElementById("save-timer");
const resetButton = document.getElementById("reset-timer");
const clearButton = document.getElementById("clear");
const timerForm = document.getElementById("timer-form");
const sideSelection = document.getElementsByName("side");
const timer = document.getElementById("timer");
const feedingTable = document.getElementById("feeding-time-body");

let start;
let running;
let duration;
let interval;
let side;

const reset = () => {
  startButton.innerText = "Start";
  timer.innerText = "00:00";
  clearInterval(interval);
  resetButton.disabled = true;
  saveButton.disabled = true;
  start = 0;
  running = false;
  sideSelection.forEach((radioButton) => {
    radioButton.checked = false;
  });
  side = undefined;
};

const save = () => {
  if (!localStorage.feeding) {
    localStorage.feeding = JSON.stringify([]);
  }
  const feedings = JSON.parse(localStorage.feeding);
  feedings.push({
    start: start,
    duration: duration,
    side: side,
  });
  localStorage.feeding = JSON.stringify(feedings);
};

const load = () => {
  if (localStorage.feeding) {
    return JSON.parse(localStorage.feeding);
  }
  return [];
};

const display = () => {
  const feedings = load();
  let tableContents = "";
  feedings.forEach((feed) => {
    const start = new Date(feed.start);
    const tableRow = `
    <tr class="table--row">
        <td>${start.toLocaleDateString()} ${start.toLocaleTimeString()}</td>
        <td>${feed.duration}</td>
        <td>${feed.side ? feed.side : " "}</td>
    </tr>
  `;
    tableContents = tableRow + tableContents;
  });
  feedingTable.innerHTML = tableContents;
};

reset();
display();

startButton.addEventListener("click", (event) => {
  event.preventDefault();
  startButton.innerText = running ? "Continue" : "Stop";
  running = !running;
  start = start === 0 ? new Date() : start;
  resetButton.disabled = false;
  saveButton.disabled = false;
  if (!running) {
    clearInterval(interval);
  } else {
    interval = setInterval(() => {
      duration = Date.now() - start;
      duration = new Date(duration);
      const mins = duration.getMinutes() < 10 ? "0" + duration.getMinutes() : duration.getMinutes();
      const seconds = duration.getSeconds() < 10 ? "0" + duration.getSeconds() : duration.getSeconds();
      duration = `${mins}:${seconds}`
      timer.innerText = duration;
    }, 1000);
  }
});

resetButton.addEventListener("click", (event) => {
  event.preventDefault();
  reset();
});

saveButton.addEventListener("click", (event) => {
  event.preventDefault();
  save();
  display();
  reset();
});

sideSelection.forEach((radioButton) => {
  radioButton.addEventListener("click", (event) => {
    resetButton.disabled = false;
    side = event.target.value;
  });
});

clearButton.addEventListener("click", (event) => {
  event.preventDefault();
  const result = confirm("Are you sure you want to delete all?");
  if (result) {
    localStorage.clear();
    display();
    reset();
  }
});

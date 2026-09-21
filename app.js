/*
 * 野流 LIVE CONTROL
 *
 * GitHub Pages / Static MVP
 *
 * 現在はローカル状態で動作するプロトタイプ。
 * Firebase等を接続すれば複数端末間の
 * リアルタイム通信に移行できる。
 */


// =========================
// DATA
// =========================

const players = {

  A: {
    name: "A",
    instrument: "ギター"
  },

  B: {
    name: "B",
    instrument: "ドラム"
  },

  C: {
    name: "C",
    instrument: "ベース"
  },

  D: {
    name: "D",
    instrument: "シンセ"
  }

};


const scores = {

  1: {
    title: "SCORE 01",
    content: "全員で演奏"
  },

  2: {
    title: "SCORE 02",
    content: "徐々に音量を下げる"
  },

  3: {
    title: "SCORE 03",
    content: "自由演奏"
  }

};


let selectedPlayer = null;

let selectedScore = 1;

let childPlayer = "A";

let currentInstruction = "WAIT";

let chatMessages = [];


// =========================
// SCREEN
// =========================

function showScreen(id) {

  document
    .querySelectorAll(".screen")
    .forEach(screen => {

      screen.classList.add("hidden");

    });

  document
    .getElementById(id)
    .classList.remove("hidden");

}


// =========================
// ROLE
// =========================

function enterParent() {

  showScreen("parent-screen");

  renderParent();

}


function enterChild() {

  showScreen("child-screen");

  renderChild();

}


function backToRole() {

  showScreen("role-screen");

}


// =========================
// PARENT
// =========================

function renderParent() {

  renderPlayers();

  renderScores();

  renderEditor();

  renderChat();

}


function renderPlayers() {

  const container =
    document.getElementById("parent-players");

  container.innerHTML = "";

  Object.entries(players).forEach(
    ([id, player]) => {

      const button =
        document.createElement("button");

      button.className = "player-button";

      if (selectedPlayer === id) {

        button.classList.add("selected");

      }

      button.innerHTML = `
        <div class="player-name">
          ${player.name}
        </div>

        <div class="player-instrument-small">
          ${player.instrument}
        </div>
      `;

      button.onclick = () => {

        selectedPlayer = id;

        document
          .getElementById("selected-player")
          .textContent =
            `${player.name} / ${player.instrument}`;

        renderPlayers();

      };

      container.appendChild(button);

    }
  );

}


function renderScores() {

  const container =
    document.getElementById("score-list");

  container.innerHTML = "";

  Object.entries(scores).forEach(
    ([id, score]) => {

      const button =
        document.createElement("button");

      button.className = "score-button";

      if (Number(id) === selectedScore) {

        button.classList.add("selected");

      }

      button.innerHTML = `
        <strong>${score.title}</strong>
        <br>
        ${score.content}
      `;

      button.onclick = () => {

        selectedScore = Number(id);

        renderParent();

      };

      container.appendChild(button);

    }
  );

}


function renderEditor() {

  const score =
    scores[selectedScore];

  document.getElementById(
    "score-title"
  ).value = score.title;

  document.getElementById(
    "score-content"
  ).value = score.content;

}


function saveScore() {

  scores[selectedScore].title =
    document.getElementById(
      "score-title"
    ).value;

  scores[selectedScore].content =
    document.getElementById(
      "score-content"
    ).value;

  renderParent();

  renderChild();

}


// =========================
// INSTRUCTION
// =========================

function sendInstruction(instruction) {

  if (!selectedPlayer) {

    alert("演奏者を選択してください");

    return;

  }

  currentInstruction = instruction;

  /*
   * 将来的にはここでFirebase等へ送信。
   *
   * sendToPlayer(
   *   selectedPlayer,
   *   instruction
   * );
   */

  renderChild();

}


// =========================
// CHILD
// =========================

function renderChild() {

  const player =
    players[childPlayer];

  document.getElementById(
    "child-instrument"
  ).textContent =
    player.instrument;

  document.getElementById(
    "child-instruction"
  ).textContent =
    currentInstruction;

  const score =
    scores[selectedScore];

  document.getElementById(
    "child-score-title"
  ).textContent =
    score.title;

  document.getElementById(
    "child-score-content"
  ).textContent =
    score.content;

  renderChildChat();

}


// =========================
// CHAT
// =========================

function sendParentChat() {

  const input =
    document.getElementById(
      "parent-chat-input"
    );

  const message =
    input.value.trim();

  if (!message) return;

  chatMessages.push({
    sender: "親",
    text: message
  });

  input.value = "";

  renderChat();

  renderChildChat();

}


function sendChildChat() {

  const input =
    document.getElementById(
      "child-chat-input"
    );

  const message =
    input.value.trim();

  if (!message) return;

  chatMessages.push({
    sender: players[childPlayer].instrument,
    text: message
  });

  input.value = "";

  renderChildChat();

  renderChat();

}


function renderChat() {

  const container =
    document.getElementById("chat-log");

  container.innerHTML = "";

  chatMessages.forEach(message => {

    const div =
      document.createElement("div");

    div.className =
      "chat-message";

    div.textContent =
      `${message.sender}: ${message.text}`;

    container.appendChild(div);

  });

}


function renderChildChat() {

  const container =
    document.getElementById(
      "child-chat-log"
    );

  container.innerHTML = "";

  chatMessages.forEach(message => {

    const div =
      document.createElement("div");

    div.className =
      "chat-message";

    div.textContent =
      `${message.sender}: ${message.text}`;

    container.appendChild(div);

  });

}


// =========================
// START
// =========================

showScreen("role-screen");

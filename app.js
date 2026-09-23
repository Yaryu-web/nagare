// =========================
// PLAYERS
// =========================

let players = {

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


// =========================
// SCORES
// =========================

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


// =========================
// STATE
// =========================

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

  const target =
    document.getElementById(id);

  if (target) {

    target.classList.remove("hidden");

  }

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


// =========================
// PLAYER LIST
// =========================

function renderPlayers() {

  const container =
    document.getElementById("parent-players");

  if (!container) return;

  container.innerHTML = "";

  Object.entries(players).forEach(
    ([id, player]) => {

      const wrapper =
        document.createElement("div");

      wrapper.className =
        "player-item";


      const button =
        document.createElement("button");

      button.className =
        "player-button";

      if (selectedPlayer === id) {

        button.classList.add("selected");

      }


      button.innerHTML = `
        <div class="player-name">
          ${escapeHTML(player.name)}
        </div>

        <div class="player-instrument-small">
          ${escapeHTML(player.instrument)}
        </div>
      `;


      button.onclick = () => {

        selectedPlayer = id;

        const selected =
          document.getElementById(
            "selected-player"
          );

        if (selected) {

          selected.textContent =
            `${player.name} / ${player.instrument}`;

        }

        renderPlayers();

      };


      wrapper.appendChild(button);


      // EDIT BUTTON

      const editButton =
        document.createElement("button");

      editButton.className =
        "player-edit-button";

      editButton.textContent =
        "編集";

      editButton.onclick = () => {

        editPlayer(id);

      };


      wrapper.appendChild(editButton);


      // DELETE BUTTON

      const deleteButton =
        document.createElement("button");

      deleteButton.className =
        "player-delete-button";

      deleteButton.textContent =
        "削除";

      deleteButton.onclick = () => {

        deletePlayer(id);

      };


      wrapper.appendChild(deleteButton);


      container.appendChild(wrapper);

    }
  );

}


// =========================
// ADD PLAYER
// =========================

function addPlayer() {

  let number = 1;

  let id;

  do {

    id = `P${number}`;

    number++;

  } while (players[id]);


  players[id] = {

    name: id,

    instrument: "楽器"

  };


  selectedPlayer = id;

  renderParent();

}


// =========================
// EDIT PLAYER
// =========================

function editPlayer(id) {

  const player =
    players[id];

  if (!player) return;


  const newName =
    prompt(
      "演奏者名を入力してください",
      player.name
    );


  if (newName === null) {

    return;

  }


  const trimmedName =
    newName.trim();


  if (!trimmedName) {

    alert("演奏者名を入力してください");

    return;

  }


  const newInstrument =
    prompt(
      "楽器名を入力してください",
      player.instrument
    );


  if (newInstrument === null) {

    return;

  }


  const trimmedInstrument =
    newInstrument.trim();


  if (!trimmedInstrument) {

    alert("楽器名を入力してください");

    return;

  }


  player.name =
    trimmedName;

  player.instrument =
    trimmedInstrument;


  renderParent();

  renderChild();

}


// =========================
// DELETE PLAYER
// =========================

function deletePlayer(id) {

  const player =
    players[id];

  if (!player) return;


  const confirmed =
    confirm(
      `${player.name}（${player.instrument}）を削除しますか？`
    );


  if (!confirmed) {

    return;

  }


  delete players[id];


  if (selectedPlayer === id) {

    selectedPlayer = null;

  }


  if (childPlayer === id) {

    const remainingPlayers =
      Object.keys(players);

    if (remainingPlayers.length > 0) {

      childPlayer =
        remainingPlayers[0];

    } else {

      childPlayer = null;

    }

  }


  renderParent();

  renderChild();

}


// =========================
// SCORES
// =========================

function renderScores() {

  const container =
    document.getElementById("score-list");

  if (!container) return;

  container.innerHTML = "";

  Object.entries(scores).forEach(
    ([id, score]) => {

      const button =
        document.createElement("button");

      button.className =
        "score-button";


      if (Number(id) === selectedScore) {

        button.classList.add("selected");

      }


      button.innerHTML = `
        <strong>
          ${escapeHTML(score.title)}
        </strong>

        <br>

        ${escapeHTML(score.content)}
      `;


      button.onclick = () => {

        selectedScore =
          Number(id);

        renderParent();

      };


      container.appendChild(button);

    }
  );

}


// =========================
// SCORE EDITOR
// =========================

function renderEditor() {

  const score =
    scores[selectedScore];

  const title =
    document.getElementById(
      "score-title"
    );

  const content =
    document.getElementById(
      "score-content"
    );


  if (title) {

    title.value =
      score.title;

  }


  if (content) {

    content.value =
      score.content;

  }

}


function saveScore() {

  const title =
    document.getElementById(
      "score-title"
    );

  const content =
    document.getElementById(
      "score-content"
    );


  if (title) {

    scores[selectedScore].title =
      title.value;

  }


  if (content) {

    scores[selectedScore].content =
      content.value;

  }


  renderParent();

  renderChild();

}


// =========================
// INSTRUCTION
// =========================

function sendInstruction(instruction) {

  if (!selectedPlayer) {

    alert(
      "演奏者を選択してください"
    );

    return;

  }


  currentInstruction =
    instruction;


  // 将来的にはここで
  // Firebase等へ送信する。


  renderChild();

}


// =========================
// CHILD
// =========================

function renderChild() {

  const instrumentElement =
    document.getElementById(
      "child-instrument"
    );

  const instructionElement =
    document.getElementById(
      "child-instruction"
    );

  const titleElement =
    document.getElementById(
      "child-score-title"
    );

  const contentElement =
    document.getElementById(
      "child-score-content"
    );


  if (!childPlayer ||
      !players[childPlayer]) {

    if (instrumentElement) {

      instrumentElement.textContent =
        "演奏者なし";

    }

    if (instructionElement) {

      instructionElement.textContent =
        "WAIT";

    }

    if (titleElement) {

      titleElement.textContent =
        "SCORE";

    }

    if (contentElement) {

      contentElement.textContent =
        "";

    }

    renderChildChat();

    return;

  }


  const player =
    players[childPlayer];


  if (instrumentElement) {

    instrumentElement.textContent =
      `${player.name} / ${player.instrument}`;

  }


  if (instructionElement) {

    instructionElement.textContent =
      currentInstruction;

  }


  const score =
    scores[selectedScore];


  if (titleElement) {

    titleElement.textContent =
      score.title;

  }


  if (contentElement) {

    contentElement.textContent =
      score.content;

  }


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


  if (!input) return;


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


  if (!input) return;


  const message =
    input.value.trim();


  if (!message) return;


  const sender =
    childPlayer &&
    players[childPlayer]
      ? players[childPlayer].instrument
      : "子";


  chatMessages.push({

    sender: sender,

    text: message

  });


  input.value = "";


  renderChildChat();

  renderChat();

}


function renderChat() {

  const container =
    document.getElementById(
      "chat-log"
    );


  if (!container) return;


  container.innerHTML = "";


  chatMessages.forEach(
    message => {

      const div =
        document.createElement(
          "div"
        );


      div.className =
        "chat-message";


      div.textContent =
        `${message.sender}: ${message.text}`;


      container.appendChild(div);

    }
  );

}


function renderChildChat() {

  const container =
    document.getElementById(
      "child-chat-log"
    );


  if (!container) return;


  container.innerHTML = "";


  chatMessages.forEach(
    message => {

      const div =
        document.createElement(
          "div"
        );


      div.className =
        "chat-message";


      div.textContent =
        `${message.sender}: ${message.text}`;


      container.appendChild(div);

    }
  );

}


// =========================
// HTML ESCAPE
// =========================

function escapeHTML(value) {

  return String(value)

    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");

}


// =========================
// START
// =========================

showScreen("role-screen");

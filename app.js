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
// SCALES
// =========================

const scales = {

  "F Major": [
    "F",
    "G",
    "A",
    "Bb",
    "C",
    "D",
    "E"
  ],

  "Ab Major": [
    "Ab",
    "Bb",
    "C",
    "Db",
    "Eb",
    "F",
    "G"
  ],

  "C Dorian": [
    "C",
    "D",
    "Eb",
    "F",
    "G",
    "A",
    "Bb"
  ],

  "C Mixolydian": [
    "C",
    "D",
    "E",
    "F",
    "G",
    "A",
    "Bb"
  ],

  "A Minor": [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G"
  ],

  "E Phrygian": [
    "E",
    "F",
    "G",
    "A",
    "B",
    "C",
    "D"
  ],

  "平調子": [
    "D",
    "G",
    "A",
    "C",
    "D"
  ],

  "スパニッシュスケール": [
    "E",
    "F",
    "G#",
    "A",
    "B",
    "C",
    "D"
  ]

};


// =========================
// STATE
// =========================

let selectedPlayer = null;

let selectedScore = 1;

let childPlayer = "A";

let chatMessages = [];


// 各演奏者ごとの指示
let playerInstructions = {};


// 現在送信済みのスケール
let currentScale = null;


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

  initializeScaleSelector();

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

  renderScalePreview();

}


// =========================
// PLAYERS
// =========================

function renderPlayers() {

  const container =
    document.getElementById(
      "parent-players"
    );


  if (!container) return;


  container.innerHTML = "";


  Object.entries(players)
    .forEach(([id, player]) => {


      const wrapper =
        document.createElement("div");


      wrapper.className =
        "player-item";


      const button =
        document.createElement("button");


      button.className =
        "player-button";


      if (selectedPlayer === id) {

        button.classList.add(
          "selected"
        );

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


        selected.textContent =
          `${player.name} / ${player.instrument}`;


        renderPlayers();

      };


      wrapper.appendChild(button);


      // EDIT

      const editButton =
        document.createElement("button");


      editButton.className =
        "player-edit-button";


      editButton.textContent =
        "編集";


      editButton.onclick = () => {

        editPlayer(id);

      };


      wrapper.appendChild(
        editButton
      );


      // DELETE

      const deleteButton =
        document.createElement("button");


      deleteButton.className =
        "player-delete-button";


      deleteButton.textContent =
        "削除";


      deleteButton.onclick = () => {

        deletePlayer(id);

      };


      wrapper.appendChild(
        deleteButton
      );


      container.appendChild(
        wrapper
      );

    });

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


  playerInstructions[id] =
    "WAIT";


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
      "演奏者名",
      player.name
    );


  if (newName === null) {

    return;

  }


  const trimmedName =
    newName.trim();


  if (!trimmedName) {

    alert(
      "演奏者名を入力してください"
    );

    return;

  }


  const newInstrument =
    prompt(
      "楽器名",
      player.instrument
    );


  if (newInstrument === null) {

    return;

  }


  const trimmedInstrument =
    newInstrument.trim();


  if (!trimmedInstrument) {

    alert(
      "楽器名を入力してください"
    );

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


  if (
    !confirm(
      `${player.name}（${player.instrument}）を削除しますか？`
    )
  ) {

    return;

  }


  delete players[id];

  delete playerInstructions[id];


  if (selectedPlayer === id) {

    selectedPlayer = null;

  }


  if (childPlayer === id) {

    const remaining =
      Object.keys(players);


    childPlayer =
      remaining.length
        ? remaining[0]
        : null;

  }


  renderParent();

  renderChild();

}


// =========================
// INSTRUCTIONS
// =========================

function sendInstruction(instruction) {

  if (!selectedPlayer) {

    alert(
      "演奏者を選択してください"
    );

    return;

  }


  // 選択された演奏者だけに指示

  playerInstructions[
    selectedPlayer
  ] = instruction;


  renderParent();

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


  if (
    !childPlayer ||
    !players[childPlayer]
  ) {

    instrumentElement.textContent =
      "演奏者なし";


    instructionElement.textContent =
      "WAIT";


    renderChildScale();

    renderChildChat();

    return;

  }


  const player =
    players[childPlayer];


  instrumentElement.textContent =
    `${player.name} / ${player.instrument}`;


  instructionElement.textContent =
    playerInstructions[
      childPlayer
    ] || "WAIT";


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


  renderChildScale();

  renderChildChat();

}


// =========================
// SCALE SELECTOR
// =========================

function initializeScaleSelector() {

  const select =
    document.getElementById(
      "scale-select"
    );


  if (!select) return;


  select.innerHTML = "";


  Object.keys(scales)
    .forEach(scaleName => {

      const option =
        document.createElement(
          "option"
        );


      option.value =
        scaleName;


      option.textContent =
        scaleName;


      select.appendChild(
        option
      );

    });


  select.onchange =
    renderScalePreview;


  if (!currentScale) {

    select.value =
      "F Major";

  }


  renderScalePreview();

}


// =========================
// SCALE PREVIEW
// =========================

function renderScalePreview() {

  const select =
    document.getElementById(
      "scale-select"
    );


  const preview =
    document.getElementById(
      "parent-scale-preview"
    );


  if (!select || !preview) {

    return;

  }


  const scaleName =
    select.value;


  const notes =
    scales[scaleName];


  preview.innerHTML = `

    <div class="scale-preview-name">
      ${escapeHTML(scaleName)}
    </div>

    <div class="scale-notes">
      ${notes
        .map(note =>
          `<span>${escapeHTML(note)}</span>`
        )
        .join("")}
    </div>

  `;

}


// =========================
// SEND SCALE
// =========================

function sendScale() {

  const select =
    document.getElementById(
      "scale-select"
    );


  if (!select) return;


  const scaleName =
    select.value;


  currentScale = {

    name: scaleName,

    notes: [
      ...scales[scaleName]
    ]

  };


  renderScalePreview();

  renderChild();

}


// =========================
// CHILD SCALE
// =========================

function renderChildScale() {

  const nameElement =
    document.getElementById(
      "child-scale-name"
    );


  const notesElement =
    document.getElementById(
      "child-scale-notes"
    );


  if (!nameElement ||
      !notesElement) {

    return;

  }


  if (!currentScale) {

    nameElement.textContent =
      "—";


    notesElement.textContent =
      "スケール未指定";


    return;

  }


  nameElement.textContent =
    currentScale.name;


  notesElement.innerHTML =
    currentScale.notes
      .map(
        note =>
          `<span>${escapeHTML(note)}</span>`
      )
      .join("");

}


// =========================
// SCORES
// =========================

function renderScores() {

  const container =
    document.getElementById(
      "score-list"
    );


  if (!container) return;


  container.innerHTML = "";


  Object.entries(scores)
    .forEach(([id, score]) => {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "score-button";


      if (
        Number(id) ===
        selectedScore
      ) {

        button.classList.add(
          "selected"
        );

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

        renderChild();

      };


      container.appendChild(
        button
      );

    });

}


// =========================
// SCORE EDITOR
// =========================

function renderEditor() {

  const score =
    scores[selectedScore];


  document.getElementById(
    "score-title"
  ).value =
    score.title;


  document.getElementById(
    "score-content"
  ).value =
    score.content;

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


// =========================
// CHAT RENDER
// =========================

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

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


// =========================
// START
// =========================

Object.keys(players)
  .forEach(id => {

    playerInstructions[id] =
      "WAIT";

  });


showScreen(
  "role-screen"
);

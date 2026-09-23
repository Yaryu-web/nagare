// ============================================================
// PLAYERS
// ============================================================

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


// ============================================================
// SCORES
// ============================================================

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


// ============================================================
// SCALES
// ============================================================

const scaleDefinitions = {

  Western: {

    Major: [
      0, 2, 4, 5, 7, 9, 11
    ],

    Minor: [
      0, 2, 3, 5, 7, 8, 10
    ],

    Dorian: [
      0, 2, 3, 5, 7, 9, 10
    ],

    Phrygian: [
      0, 1, 3, 5, 7, 8, 10
    ],

    Lydian: [
      0, 2, 4, 6, 7, 9, 11
    ],

    Mixolydian: [
      0, 2, 4, 5, 7, 9, 10
    ],

    Locrian: [
      0, 1, 3, 5, 6, 8, 10
    ]

  },


  Japanese: {

    "平調子": [
      0, 2, 5, 7, 9
    ],

    "陰旋法": [
      0, 2, 3, 7, 9
    ]

  },


  World: {

    Spanish: [
      0, 1, 3, 4, 5, 7, 8, 10
    ],

    Hirajoshi: [
      0, 2, 3, 7, 8
    ]

  },


  Custom: {

    Custom: [
      0, 2, 4, 7, 9
    ]

  }

};


// ============================================================
// NOTE NAMES
// ============================================================

const noteNames = [
  "C",
  "C#",
  "D",
  "Eb",
  "E",
  "F",
  "F#",
  "G",
  "Ab",
  "A",
  "Bb",
  "B"
];


// ============================================================
// STATE
// ============================================================

let selectedPlayer = null;

let selectedScore = 1;

let childPlayer = "A";

let chatMessages = [];


// 各演奏者ごとの指示

const playerInstructions = {};

Object.keys(players).forEach(id => {

  playerInstructions[id] = "WAIT";

});


// 現在のスケール

let currentScale = {

  category: "Western",

  type: "Major",

  root: 0,

  name: "C Major",

  notes: [
    "C",
    "D",
    "E",
    "F",
    "G",
    "A",
    "B"
  ]

};


// ============================================================
// SCREEN
// ============================================================

function showScreen(id) {

  document
    .querySelectorAll(".screen")
    .forEach(screen => {

      screen.classList.add("hidden");

    });


  const target =
    document.getElementById(id);


  if (!target) {

    console.error(
      "Screen not found:",
      id
    );

    return;

  }


  target.classList.remove("hidden");

}


// ============================================================
// ROLE
// ============================================================

function enterParent() {

  showScreen("parent-screen");

  renderParent();

}


function enterChild() {

  showScreen("child-screen");

  renderChildPlayerSelector();

  renderChild();

}


function backToRole() {

  showScreen("role-screen");

}


// ============================================================
// PARENT
// ============================================================

function renderParent() {

  renderPlayers();

  renderScores();

  renderEditor();

  renderChat();

  renderScaleTypes();

  renderCurrentParentInstruction();

  renderCurrentScale();

}


// ============================================================
// PLAYERS
// ============================================================

function renderPlayers() {

  const container =
    document.getElementById(
      "parent-players"
    );


  container.innerHTML = "";


  Object.entries(players).forEach(
    ([id, player]) => {


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
          ${player.name}
        </div>

        <div class="player-instrument-small">
          ${player.instrument}
        </div>

        <div class="player-instruction-small">
          ${playerInstructions[id]}
        </div>

      `;


      button.onclick = () => {

        selectedPlayer = id;


        document.getElementById(
          "selected-player"
        ).textContent =
          `${player.name} / ${player.instrument}`;


        renderPlayers();

        renderCurrentParentInstruction();

      };


      container.appendChild(button);

    }
  );

}


// ============================================================
// CURRENT PLAYER INSTRUCTION
// ============================================================

function renderCurrentParentInstruction() {

  const display =
    document.getElementById(
      "current-player-instruction"
    );


  if (!display) return;


  if (!selectedPlayer) {

    display.textContent =
      "WAIT";

    return;

  }


  display.textContent =
    playerInstructions[selectedPlayer];

}


// ============================================================
// SEND INSTRUCTION
// ============================================================

function sendInstruction(instruction) {

  if (!selectedPlayer) {

    alert(
      "演奏者を選択してください"
    );

    return;

  }


  // 演奏者ごとに保存

  playerInstructions[selectedPlayer] =
    instruction;


  renderPlayers();

  renderCurrentParentInstruction();

  renderChild();

}


// ============================================================
// SCORES
// ============================================================

function renderScores() {

  const container =
    document.getElementById(
      "score-list"
    );


  container.innerHTML = "";


  Object.entries(scores).forEach(
    ([id, score]) => {


      const button =
        document.createElement("button");


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
          ${score.title}
        </strong>

        <br>

        ${score.content}

      `;


      button.onclick = () => {

        selectedScore =
          Number(id);

        renderParent();

        renderChild();

      };


      container.appendChild(button);

    }
  );

}


// ============================================================
// SCORE EDITOR
// ============================================================

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


// ============================================================
// CHILD PLAYER SELECTOR
// ============================================================

function renderChildPlayerSelector() {

  const select =
    document.getElementById(
      "child-player-select"
    );


  if (!select) return;


  select.innerHTML = "";


  Object.entries(players).forEach(
    ([id, player]) => {


      const option =
        document.createElement(
          "option"
        );


      option.value = id;


      option.textContent =
        `${player.name} / ${player.instrument}`;


      if (id === childPlayer) {

        option.selected = true;

      }


      select.appendChild(option);

    }
  );


  updateChildPlayerName();

}


function selectChildPlayer() {

  const select =
    document.getElementById(
      "child-player-select"
    );


  childPlayer =
    select.value;


  updateChildPlayerName();

  renderChild();

}


function updateChildPlayerName() {

  const player =
    players[childPlayer];


  const name =
    document.getElementById(
      "child-player-name"
    );


  if (!name) return;


  name.textContent =
    `${player.name} / ${player.instrument}`;

}


// ============================================================
// CHILD
// ============================================================

function renderChild() {

  const player =
    players[childPlayer];


  if (!player) return;


  document.getElementById(
    "child-instrument"
  ).textContent =
    player.instrument;


  document.getElementById(
    "child-instruction"
  ).textContent =
    playerInstructions[childPlayer];


  document.getElementById(
    "child-score-title"
  ).textContent =
    scores[selectedScore].title;


  document.getElementById(
    "child-score-content"
  ).textContent =
    scores[selectedScore].content;


  renderCurrentScale();

  renderChildChat();

  updateChildPlayerName();

}


// ============================================================
// SCALE CATEGORY
// ============================================================

function renderScaleTypes() {

  const category =
    document.getElementById(
      "scale-category"
    ).value;


  const typeSelect =
    document.getElementById(
      "scale-type"
    );


  if (!typeSelect) return;


  typeSelect.innerHTML = "";


  Object.keys(
    scaleDefinitions[category]
  ).forEach(type => {


    const option =
      document.createElement(
        "option"
      );


    option.value = type;

    option.textContent = type;


    typeSelect.appendChild(
      option
    );

  });


  renderScaleRoots();

}


// ============================================================
// ROOT
// ============================================================

function renderScaleRoots() {

  const rootSelect =
    document.getElementById(
      "scale-root"
    );


  if (!rootSelect) return;


  rootSelect.innerHTML = "";


  noteNames.forEach(
    (note, index) => {


      const option =
        document.createElement(
          "option"
        );


      option.value = index;

      option.textContent = note;


      rootSelect.appendChild(
        option
      );

    }
  );

}


// ============================================================
// SCALE
// ============================================================

function sendScale() {

  const category =
    document.getElementById(
      "scale-category"
    ).value;


  const type =
    document.getElementById(
      "scale-type"
    ).value;


  const root =
    Number(
      document.getElementById(
        "scale-root"
      ).value
    );


  const intervals =
    scaleDefinitions
      [category]
      [type];


  const notes =
    intervals.map(interval => {

      return noteNames[
        (root + interval) % 12
      ];

    });


  currentScale = {

    category: category,

    type: type,

    root: root,

    name:
      `${noteNames[root]} ${type}`,

    notes: notes

  };


  renderCurrentScale();

  renderChild();

}


// ============================================================
// RENDER SCALE
// ============================================================

function renderCurrentScale() {

  const parentName =
    document.getElementById(
      "parent-scale-name"
    );


  const parentNotes =
    document.getElementById(
      "parent-scale-notes"
    );


  const childName =
    document.getElementById(
      "child-scale-name"
    );


  const childNotes =
    document.getElementById(
      "child-scale-notes"
    );


  if (parentName) {

    parentName.textContent =
      currentScale.name;

  }


  if (parentNotes) {

    parentNotes.textContent =
      currentScale.notes.join("  ");

  }


  if (childName) {

    childName.textContent =
      currentScale.name;

  }


  if (childNotes) {

    childNotes.textContent =
      currentScale.notes.join("  ");

  }

}


// ============================================================
// CHAT
// ============================================================

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

    sender:
      players[childPlayer].instrument,

    text: message

  });


  input.value = "";


  renderChildChat();

  renderChat();

}


// ============================================================
// CHAT RENDER
// ============================================================

function renderChat() {

  const container =
    document.getElementById(
      "chat-log"
    );


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


// ============================================================
// START
// ============================================================

showScreen(
  "role-screen"
);

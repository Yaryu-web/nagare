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

const scaleCategories = {

  Western: {

    "F Major": [
      "F", "G", "A", "Bb",
      "C", "D", "E"
    ],

    "Ab Major": [
      "Ab", "Bb", "C", "Db",
      "Eb", "F", "G"
    ],

    "C Dorian": [
      "C", "D", "Eb", "F",
      "G", "A", "Bb"
    ],

    "C Mixolydian": [
      "C", "D", "E", "F",
      "G", "A", "Bb"
    ],

    "A Minor": [
      "A", "B", "C", "D",
      "E", "F", "G"
    ],

    "E Phrygian": [
      "E", "F", "G", "A",
      "B", "C", "D"
    ],

    "C# Pentatonic": [
      "C#", "D#", "F",
      "G#", "A#"
    ]

  },


  Japanese: {

    "平調子": [
      "D", "G", "A",
      "C", "D"
    ],

    "陰旋法": [
      "D", "Eb", "G",
      "A", "Bb"
    ]

  },


  World: {

    "Spanish Scale": [
      "E", "F", "G#",
      "A", "B", "C", "D"
    ],

    "Hirajoshi": [
      "C", "Db", "F",
      "G", "Ab"
    ]

  }

};


// =========================
// FAVORITES
// =========================

let favoriteScales = {

  "F Major": [
    "F", "G", "A", "Bb",
    "C", "D", "E"
  ],

  "Ab Major": [
    "Ab", "Bb", "C", "Db",
    "Eb", "F", "G"
  ],

  "C# Pentatonic": [
    "C#", "D#", "F",
    "G#", "A#"
  ],

  "C Dorian": [
    "C", "D", "Eb", "F",
    "G", "A", "Bb"
  ]

};


// =========================
// CUSTOM
// =========================

let customScales = {};


// =========================
// STATE
// =========================

let selectedPlayer = null;

let selectedScore = 1;

let childPlayer = "A";

let chatMessages = [];

let instructionTimeline = [];

let playerInstructions = {};

let currentScale = null;


// =========================
// INITIALIZE
// =========================

Object.keys(players).forEach(id => {

  playerInstructions[id] = [];

});


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

        updateSelectedPlayer();

        renderPlayers();

      };


      wrapper.appendChild(button);


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


function updateSelectedPlayer() {

  const element =
    document.getElementById(
      "selected-player"
    );


  if (!element) return;


  if (!selectedPlayer ||
      !players[selectedPlayer]) {

    element.textContent =
      "演奏者を選択してください";

    return;

  }


  const player =
    players[selectedPlayer];


  element.textContent =
    `${player.name} / ${player.instrument}`;

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


  playerInstructions[id] = [];


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

  const now =
    new Date();


  const time =
    now.toLocaleTimeString(
      "ja-JP",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    );


  // 全体への指示

  if (instruction === "ALL") {

    Object.keys(players)
      .forEach(id => {

        if (!playerInstructions[id]) {

          playerInstructions[id] = [];

        }


        playerInstructions[id].push({
          instruction: "CONTINUE",
          time: time,
          scope: "ALL"
        });

      });


    instructionTimeline.push({

      time: time,

      type: "instruction",

      target: "全体",

      instruction: "全体への指示"

    });


    renderParent();

    renderChild();

    return;

  }


  if (!selectedPlayer) {

    alert(
      "演奏者を選択してください"
    );

    return;

  }


  if (!playerInstructions[selectedPlayer]) {

    playerInstructions[selectedPlayer] = [];

  }


  playerInstructions[selectedPlayer]
    .push({

      instruction: instruction,

      time: time,

      scope: selectedPlayer

    });


  const player =
    players[selectedPlayer];


  instructionTimeline.push({

    time: time,

    type: "instruction",

    target:
      `${player.name} / ${player.instrument}`,

    instruction:
      instruction

  });


  renderParent();

  renderChild();

}


// =========================
// CHILD
// =========================

function renderChild() {

  renderChildPlayerSelector();

  renderChildMain();

  renderChildScale();

  renderChildInstructionLog();

  renderChildChat();

}


// =========================
// CHILD PLAYER SELECTOR
// =========================

function renderChildPlayerSelector() {

  const container =
    document.getElementById(
      "child-player-selector"
    );


  if (!container) return;


  container.innerHTML = "";


  Object.entries(players)
    .forEach(([id, player]) => {


      const button =
        document.createElement("button");


      button.className =
        "child-player-button";


      if (childPlayer === id) {

        button.classList.add(
          "selected"
        );

      }


      button.innerHTML = `

        <strong>
          ${escapeHTML(player.name)}
        </strong>

        <span>
          ${escapeHTML(player.instrument)}
        </span>

      `;


      button.onclick = () => {

        childPlayer = id;

        renderChild();

      };


      container.appendChild(
        button
      );

    });

}


// =========================
// CHILD MAIN
// =========================

function renderChildMain() {

  const instrumentElement =
    document.getElementById(
      "child-instrument"
    );


  const instructionElement =
    document.getElementById(
      "child-instruction"
    );


  if (!instrumentElement ||
      !instructionElement) {

    return;

  }


  if (
    !childPlayer ||
    !players[childPlayer]
  ) {

    instrumentElement.textContent =
      "演奏者なし";


    instructionElement.textContent =
      "WAIT";


    return;

  }


  const player =
    players[childPlayer];


  instrumentElement.textContent =
    `${player.name} / ${player.instrument}`;


  const instructions =
    playerInstructions[childPlayer] || [];


  const latest =
    instructions[
      instructions.length - 1
    ];


  instructionElement.textContent =
    latest
      ? latest.instruction
      : "WAIT";


  const score =
    scores[selectedScore];


  const titleElement =
    document.getElementById(
      "child-score-title"
    );


  const contentElement =
    document.getElementById(
      "child-score-content"
    );


  if (titleElement) {

    titleElement.textContent =
      score.title;

  }


  if (contentElement) {

    contentElement.textContent =
      score.content;

  }

}


// =========================
// CHILD INSTRUCTION LOG
// =========================

function renderChildInstructionLog() {

  const container =
    document.getElementById(
      "child-instruction-log"
    );


  if (!container) return;


  container.innerHTML = "";


  if (
    !childPlayer ||
    !players[childPlayer]
  ) {

    return;

  }


  const ownInstructions =
    playerInstructions[
      childPlayer
    ] || [];


  ownInstructions
    .forEach(item => {


      const div =
        document.createElement(
          "div"
        );


      div.className =
        "instruction-history-item";


      const target =
        item.scope === "ALL"
          ? "全体"
          : "自分";


      div.innerHTML = `

        <span class="history-time">
          ${escapeHTML(item.time)}
        </span>

        <span class="history-target">
          親 → ${escapeHTML(target)}
        </span>

        <strong>
          ${escapeHTML(item.instruction)}
        </strong>

      `;


      container.appendChild(div);

    });

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


  addScaleGroup(
    select,
    "Favorite",
    favoriteScales
  );


  Object.entries(scaleCategories)
    .forEach(
      ([category, categoryScales]) => {

        addScaleGroup(
          select,
          category,
          categoryScales
        );

      }
    );


  addScaleGroup(
    select,
    "Custom",
    customScales
  );


  select.onchange =
    () => {

      renderScalePreview();

      renderScaleEditor();

    };


  if (
    currentScale &&
    scaleExists(currentScale.name)
  ) {

    select.value =
      currentScale.name;

  } else {

    select.value =
      "F Major";

  }


  renderScalePreview();

  renderScaleEditor();

}


// =========================
// SCALE GROUP
// =========================

function addScaleGroup(
  select,
  category,
  collection
) {

  const group =
    document.createElement(
      "optgroup"
    );


  group.label =
    category;


  Object.keys(collection)
    .forEach(scaleName => {

      const option =
        document.createElement(
          "option"
        );


      option.value =
        scaleName;


      option.textContent =
        scaleName;


      group.appendChild(
        option
      );

    });


  select.appendChild(group);

}


// =========================
// SCALE LOOKUP
// =========================

function findScale(name) {

  if (favoriteScales[name]) {

    return favoriteScales[name];

  }


  for (
    const category
    of Object.values(scaleCategories)
  ) {

    if (category[name]) {

      return category[name];

    }

  }


  if (customScales[name]) {

    return customScales[name];

  }


  return null;

}


function scaleExists(name) {

  return !!findScale(name);

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
    findScale(scaleName);


  if (!notes) {

    preview.innerHTML =
      "スケール未指定";

    return;

  }


  preview.innerHTML = `

    <div class="scale-preview-name">
      ${escapeHTML(scaleName)}
    </div>

    <div class="scale-notes">

      ${notes
        .map(
          note =>
            `<span>${escapeHTML(note)}</span>`
        )
        .join("")}

    </div>

  `;

}


// =========================
// SCALE EDITOR
// =========================

function renderScaleEditor() {

  const select =
    document.getElementById(
      "scale-select"
    );


  const nameInput =
    document.getElementById(
      "scale-edit-name"
    );


  const notesInput =
    document.getElementById(
      "scale-edit-notes"
    );


  if (
    !select ||
    !nameInput ||
    !notesInput
  ) {

    return;

  }


  const name =
    select.value;


  const notes =
    findScale(name);


  nameInput.value =
    name || "";


  notesInput.value =
    notes
      ? notes.join(", ")
      : "";

}


// =========================
// SAVE FAVORITE
// =========================

function saveFavoriteScale() {

  const nameInput =
    document.getElementById(
      "scale-edit-name"
    );


  const notesInput =
    document.getElementById(
      "scale-edit-notes"
    );


  const name =
    nameInput.value.trim();


  const notes =
    parseScaleNotes(
      notesInput.value
    );


  if (!name) {

    alert(
      "スケール名を入力してください"
    );

    return;

  }


  if (!notes.length) {

    alert(
      "構成音を入力してください"
    );

    return;

  }


  favoriteScales[name] =
    notes;


  initializeScaleSelector();


  const select =
    document.getElementById(
      "scale-select"
    );


  select.value =
    name;


  renderScalePreview();

  renderScaleEditor();

}


// =========================
// SAVE CUSTOM
// =========================

function saveCustomScale() {

  const nameInput =
    document.getElementById(
      "scale-edit-name"
    );


  const notesInput =
    document.getElementById(
      "scale-edit-notes"
    );


  const name =
    nameInput.value.trim();


  const notes =
    parseScaleNotes(
      notesInput.value
    );


  if (!name) {

    alert(
      "スケール名を入力してください"
    );

    return;

  }


  if (!notes.length) {

    alert(
      "構成音を入力してください"
    );

    return;

  }


  customScales[name] =
    notes;


  initializeScaleSelector();


  const select =
    document.getElementById(
      "scale-select"
    );


  select.value =
    name;


  renderScalePreview();

  renderScaleEditor();

}


// =========================
// SCALE NOTES PARSER
// =========================

function parseScaleNotes(value) {

  return value
    .split(",")
    .map(note => note.trim())
    .filter(Boolean);

}


// =========================
// DELETE EDITABLE SCALE
// =========================

function deleteEditableScale() {

  const select =
    document.getElementById(
      "scale-select"
    );


  if (!select) return;


  const name =
    select.value;


  if (
    favoriteScales[name]
  ) {

    if (
      !confirm(
        `${name} をFavoriteから削除しますか？`
      )
    ) {

      return;

    }


    delete favoriteScales[name];

  }

  else if (
    customScales[name]
  ) {

    if (
      !confirm(
        `${name} をCustomから削除しますか？`
      )
    ) {

      return;

    }


    delete customScales[name];

  }

  else {

    alert(
      "FavoriteまたはCustomのスケールを選択してください"
    );

    return;

  }


  initializeScaleSelector();

  renderScalePreview();

  renderScaleEditor();

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


  const notes =
    findScale(scaleName);


  if (!notes) {

    return;

  }


  currentScale = {

    name: scaleName,

    notes: [
      ...notes
    ]

  };


  const now =
    new Date();


  const time =
    now.toLocaleTimeString(
      "ja-JP",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    );


  instructionTimeline.push({

    time: time,

    type: "scale",

    target: "全体",

    instruction:
      `SCALE / ${scaleName}`

  });


  renderScalePreview();

  renderChild();

  renderChat();

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


  if (
    !nameElement ||
    !notesElement
  ) {

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


  if (!score) return;


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
// PARENT CHAT
// =========================

function sendParentChat() {

  const input =
    document.getElementById(
      "parent-chat-input"
    );


  const message =
    input.value.trim();


  if (!message) return;


  const now =
    new Date();


  const time =
    now.toLocaleTimeString(
      "ja-JP",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    );


  chatMessages.push({

    sender: "親",

    text: message,

    time: time,

    type: "chat"

  });


  input.value = "";


  renderChat();

  renderChildChat();

}


// =========================
// CHILD CHAT
// =========================

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


  const now =
    new Date();


  const time =
    now.toLocaleTimeString(
      "ja-JP",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    );


  chatMessages.push({

    sender: sender,

    text: message,

    time: time,

    type: "chat"

  });


  input.value = "";


  renderChildChat();

  renderChat();

}


// =========================
// PARENT CHAT / TIMELINE
// =========================

function renderChat() {

  const container =
    document.getElementById(
      "chat-log"
    );


  if (!container) return;


  container.innerHTML = "";


  instructionTimeline
    .forEach(item => {

      const div =
        document.createElement(
          "div"
        );


      div.className =
        "timeline-item";


      div.innerHTML = `

        <div class="timeline-time">
          ${escapeHTML(item.time)}
        </div>

        <div class="timeline-target">
          → ${escapeHTML(item.target)}
        </div>

        <div class="timeline-content">
          ${escapeHTML(item.instruction)}
        </div>

      `;


      container.appendChild(div);

    });


  chatMessages
    .forEach(message => {

      const div =
        document.createElement(
          "div"
        );


      div.className =
        "chat-message";


      div.innerHTML = `

        <span class="chat-time">
          ${escapeHTML(message.time)}
        </span>

        <strong>
          ${escapeHTML(message.sender)}
        </strong>

        <span>
          ${escapeHTML(message.text)}
        </span>

      `;


      container.appendChild(div);

    });


  container.scrollTop =
    container.scrollHeight;

}


// =========================
// CHILD CHAT
// =========================

function renderChildChat() {

  const container =
    document.getElementById(
      "child-chat-log"
    );


  if (!container) return;


  container.innerHTML = "";


  chatMessages
    .forEach(message => {

      const div =
        document.createElement(
          "div"
        );


      div.className =
        "chat-message";


      div.innerHTML = `

        <span class="chat-time">
          ${escapeHTML(message.time)}
        </span>

        <strong>
          ${escapeHTML(message.sender)}
        </strong>

        <span>
          ${escapeHTML(message.text)}
        </span>

      `;


      container.appendChild(div);

    });


  container.scrollTop =
    container.scrollHeight;

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

showScreen(
  "role-screen"
);

// ============================================================
// 野流 LIVE CONTROL
// Firebase Realtime Database version
// ============================================================


// ============================================================
// LOCAL STATE
// ============================================================

let players = {};

let scores = {};

let selectedPlayer = null;

let selectedScore = "1";

let childPlayer = null;

let currentScale = null;

let chatMessages = [];


// ============================================================
// DEFAULT DATA
// ============================================================

const defaultPlayers = {

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


const defaultScores = {

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

let scales = {

  western: {

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

    "C# Panta": [
      "C#",
      "D#",
      "F#",
      "G#",
      "A#"
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

    "C Major": [
      "C",
      "D",
      "E",
      "F",
      "G",
      "A",
      "B"
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

    "D Dorian": [
      "D",
      "E",
      "F",
      "G",
      "A",
      "B",
      "C"
    ],

    "E Phrygian": [
      "E",
      "F",
      "G",
      "A",
      "B",
      "C",
      "D"
    ]

  },


  japanese: {

    "平調子": [
      "C",
      "Db",
      "F",
      "G",
      "Ab"
    ],

    "陰旋法": [
      "C",
      "Db",
      "F",
      "G",
      "Bb"
    ]

  },


  world: {

    "Spanish": [
      "E",
      "F",
      "G#",
      "A",
      "B",
      "C",
      "D"
    ],

    "Hirajoshi": [
      "C",
      "Db",
      "F",
      "G",
      "Ab"
    ]

  },


  favorite: {

    "F Maj": [
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

    "C# Panta": [
      "C#",
      "D#",
      "F#",
      "G#",
      "A#"
    ],

    "C Dorian": [
      "C",
      "D",
      "Eb",
      "F",
      "G",
      "A",
      "Bb"
    ]

  },


  custom: {}

};


// ============================================================
// FIREBASE
// ============================================================

function getDB() {

  if (!window.yaryuDB) {

    console.error(
      "Firebaseがまだ初期化されていません"
    );

    return null;

  }

  return window.yaryuDB;

}


// ============================================================
// INITIALIZE
// ============================================================

function initializeAppData() {

  const db = getDB();

  if (!db) return;


  const playersRef =
    db.ref(db.database, "players");


  db.onValue(
    playersRef,
    snapshot => {

      const data =
        snapshot.val();

      if (data) {

        players = data;

      } else {

        players =
          JSON.parse(
            JSON.stringify(defaultPlayers)
          );

        db.set(
          playersRef,
          players
        );

      }

      renderPlayers();
      renderChildPlayerSelect();
      renderChild();

    }
  );


  const scoresRef =
    db.ref(db.database, "scores");


  db.onValue(
    scoresRef,
    snapshot => {

      const data =
        snapshot.val();

      if (data) {

        scores = data;

      } else {

        scores =
          JSON.parse(
            JSON.stringify(defaultScores)
          );

        db.set(
          scoresRef,
          scores
        );

      }

      renderScores();
      renderEditor();
      renderChild();

    }
  );


  const scaleRef =
    db.ref(db.database, "scale");


  db.onValue(
    scaleRef,
    snapshot => {

      currentScale =
        snapshot.val();

      renderScale();
      renderChildScale();

    }
  );


  const chatRef =
    db.ref(db.database, "chat");


  db.onValue(
    chatRef,
    snapshot => {

      const data =
        snapshot.val();

      if (!data) {

        chatMessages = [];

      } else {

        chatMessages =
          Object.values(data)
            .sort(
              (a, b) =>
                (a.timestamp || 0) -
                (b.timestamp || 0)
            );

      }

      renderChat();
      renderChildChat();

    }
  );


  Object.keys(defaultPlayers)
    .forEach(id => {

      listenInstruction(id);

    });


  const globalRef =
    db.ref(
      db.database,
      "globalInstruction"
    );


  db.onValue(
    globalRef,
    snapshot => {

      const data =
        snapshot.val();

      if (!data) return;

      renderChildInstruction();

    }
  );


  listenScales();

}


// ============================================================
// SCALE DATABASE
// ============================================================

function listenScales() {

  const db = getDB();

  if (!db) return;


  const refScales =
    db.ref(
      db.database,
      "scaleDefinitions"
    );


  db.onValue(
    refScales,
    snapshot => {

      const data =
        snapshot.val();

      if (!data) return;

      if (data.favorite) {

        scales.favorite =
          data.favorite;

      }

      if (data.custom) {

        scales.custom =
          data.custom;

      }

      populateScaleSelect();

    }
  );

}


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


  if (target) {

    target.classList.remove("hidden");

  }

}


// ============================================================
// ROLE
// ============================================================

function enterParent() {

  showScreen(
    "parent-screen"
  );

  renderParent();

}


function enterChild() {

  showScreen(
    "child-screen"
  );

  renderChild();

  renderChildPlayerSelect();

}


function backToRole() {

  showScreen(
    "role-screen"
  );

}


// ============================================================
// PARENT
// ============================================================

function renderParent() {

  renderPlayers();

  renderScores();

  renderEditor();

  populateScaleSelect();

  renderScale();

  renderChat();

}


// ============================================================
// PLAYERS
// ============================================================

function renderPlayers() {

  const container =
    document.getElementById(
      "parent-players"
    );


  if (!container) return;


  container.innerHTML = "";


  Object.entries(players)
    .forEach(
      ([id, player]) => {

        const wrapper =
          document.createElement(
            "div"
          );


        wrapper.className =
          "player-wrapper";


        const button =
          document.createElement(
            "button"
          );


        button.className =
          "player-button";


        if (
          selectedPlayer === id
        ) {

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

          if (selected) {

            selected.textContent =
              `${player.name} / ${player.instrument}`;

          }

          renderPlayers();

        };


        wrapper.appendChild(button);


        const editButton =
          document.createElement(
            "button"
          );


        editButton.textContent =
          "編集";


        editButton.onclick = () =>
          editPlayer(id);


        wrapper.appendChild(
          editButton
        );


        const deleteButton =
          document.createElement(
            "button"
          );


        deleteButton.textContent =
          "削除";


        deleteButton.onclick = () =>
          deletePlayer(id);


        wrapper.appendChild(
          deleteButton
        );


        container.appendChild(
          wrapper
        );

      }
    );

}


// ============================================================
// ADD PLAYER
// ============================================================

function addPlayer() {

  const db = getDB();

  if (!db) return;


  const name =
    prompt(
      "演奏者名を入力してください",
      `PLAYER ${Object.keys(players).length + 1}`
    );


  if (!name) return;


  const instrument =
    prompt(
      "楽器名を入力してください",
      "楽器"
    );


  if (!instrument) return;


  const id =
    createPlayerId();


  players[id] = {

    name,
    instrument

  };


  db.set(
    db.ref(
      db.database,
      `players/${id}`
    ),
    players[id]
  );

}


// ============================================================
// CREATE PLAYER ID
// ============================================================

function createPlayerId() {

  let number = 1;

  while (
    players[
      String.fromCharCode(
        64 + number
      )
    ]
  ) {

    number++;

  }


  if (number <= 26) {

    return String.fromCharCode(
      64 + number
    );

  }


  return `P${number}`;

}


// ============================================================
// EDIT PLAYER
// ============================================================

function editPlayer(id) {

  const db = getDB();

  if (!db) return;


  const player =
    players[id];


  const name =
    prompt(
      "演奏者名",
      player.name
    );


  if (!name) return;


  const instrument =
    prompt(
      "楽器名",
      player.instrument
    );


  if (!instrument) return;


  db.set(
    db.ref(
      db.database,
      `players/${id}`
    ),
    {
      name,
      instrument
    }
  );

}


// ============================================================
// DELETE PLAYER
// ============================================================

function deletePlayer(id) {

  const db = getDB();

  if (!db) return;


  if (
    !confirm(
      `${players[id].name}を削除しますか？`
    )
  ) {

    return;

  }


  db.remove(
    db.ref(
      db.database,
      `players/${id}`
    )
  );


  if (
    selectedPlayer === id
  ) {

    selectedPlayer = null;

  }


  if (
    childPlayer === id
  ) {

    childPlayer = null;

  }

}


// ============================================================
// CHILD PLAYER SELECT
// ============================================================

function renderChildPlayerSelect() {

  const select =
    document.getElementById(
      "child-player-select"
    );


  if (!select) return;


  select.innerHTML = "";


  Object.entries(players)
    .forEach(
      ([id, player]) => {

        const option =
          document.createElement(
            "option"
          );


        option.value = id;


        option.textContent =
          `${player.name} / ${player.instrument}`;


        if (
          id === childPlayer
        ) {

          option.selected = true;

        }


        select.appendChild(
          option
        );

      }
    );


  if (
    !childPlayer &&
    Object.keys(players).length
  ) {

    childPlayer =
      Object.keys(players)[0];

    select.value =
      childPlayer;

  }

}


function selectChildPlayer() {

  const select =
    document.getElementById(
      "child-player-select"
    );


  if (!select) return;


  childPlayer =
    select.value;


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


  if (!container) return;


  container.innerHTML = "";


  Object.entries(scores)
    .forEach(
      ([id, score]) => {

        const button =
          document.createElement(
            "button"
          );


        button.className =
          "score-button";


        if (
          id === selectedScore
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

          selectedScore = id;

          renderParent();
          renderChild();

        };


        container.appendChild(
          button
        );

      }
    );

}


// ============================================================
// SCORE EDITOR
// ============================================================

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


// ============================================================
// SAVE SCORE
// ============================================================

function saveScore() {

  const db = getDB();

  if (!db) return;


  if (!scores[selectedScore]) return;


  const title =
    document.getElementById(
      "score-title"
    ).value;


  const content =
    document.getElementById(
      "score-content"
    ).value;


  db.set(
    db.ref(
      db.database,
      `scores/${selectedScore}`
    ),
    {
      title,
      content
    }
  );

}


// ============================================================
// INSTRUCTIONS
// ============================================================

function sendInstruction(
  instruction
) {

  const db = getDB();

  if (!db) return;


  if (!selectedPlayer) {

    alert(
      "演奏者を選択してください"
    );

    return;

  }


  const timestamp =
    Date.now();


  db.set(
    db.ref(
      db.database,
      `instructions/${selectedPlayer}`
    ),
    {
      type: instruction,
      timestamp
    }
  );


  addTimelineMessage({

    sender: "親",

    target:
      players[selectedPlayer].name,

    text:
      `指示: ${instruction}`,

    timestamp

  });

}


// ============================================================
// GLOBAL INSTRUCTION
// ============================================================

function sendGlobalInstruction(
  instruction
) {

  const db = getDB();

  if (!db) return;


  const timestamp =
    Date.now();


  db.set(
    db.ref(
      db.database,
      "globalInstruction"
    ),
    {
      type: instruction,
      timestamp
    }
  );


  addTimelineMessage({

    sender: "親",

    target: "全員",

    text:
      `全体指示: ${instruction}`,

    timestamp

  });

}


// ============================================================
// INSTRUCTION LISTENER
// ============================================================

function listenInstruction(id) {

  const db = getDB();

  if (!db) return;


  const instructionRef =
    db.ref(
      db.database,
      `instructions/${id}`
    );


  db.onValue(
    instructionRef,
    snapshot => {

      if (
        id !== childPlayer
      ) {

        return;

      }


      renderChildInstruction();

    }
  );

}


// ============================================================
// CHILD INSTRUCTION
// ============================================================

function renderChildInstruction() {

  if (!childPlayer) return;


  const db = getDB();

  if (!db) return;


  const personalRef =
    db.ref(
      db.database,
      `instructions/${childPlayer}`
    );


  const globalRef =
    db.ref(
      db.database,
      "globalInstruction"
    );


  db.onValue(
    personalRef,
    personalSnapshot => {

      db.onValue(
        globalRef,
        globalSnapshot => {

          const personal =
            personalSnapshot.val();


          const global =
            globalSnapshot.val();


          let instruction =
            "WAIT";


          if (global) {

            instruction =
              global.type;

          }


          if (personal) {

            instruction =
              personal.type;

          }


          const element =
            document.getElementById(
              "child-instruction"
            );


          if (element) {

            element.textContent =
              instruction;

          }

        },
        {
          onlyOnce: true
        }
      );

    },
    {
      onlyOnce: true
    }
  );

}


// ============================================================
// CHILD
// ============================================================

function renderChild() {

  renderChildPlayerSelect();

  renderChildInstruction();

  renderChildScale();

  renderChildScore();

  renderChildChat();

}


// ============================================================
// CHILD SCORE
// ============================================================

function renderChildScore() {

  const score =
    scores[selectedScore];


  if (!score) return;


  const title =
    document.getElementById(
      "child-score-title"
    );


  const content =
    document.getElementById(
      "child-score-content"
    );


  if (title) {

    title.textContent =
      score.title;

  }


  if (content) {

    content.textContent =
      score.content;

  }

}


// ============================================================
// SCALE SELECT
// ============================================================

function populateScaleSelect() {

  const select =
    document.getElementById(
      "scale-select"
    );


  if (!select) return;


  const current =
    select.value;


  select.innerHTML = "";


  addScaleGroup(
    select,
    "Western",
    scales.western
  );


  addScaleGroup(
    select,
    "Japanese",
    scales.japanese
  );


  addScaleGroup(
    select,
    "World",
    scales.world
  );


  addScaleGroup(
    select,
    "Favorite",
    scales.favorite
  );


  addScaleGroup(
    select,
    "Custom",
    scales.custom
  );


  if (current) {

    select.value =
      current;

  }


  select.onchange =
    renderScale;


  renderScale();

}


// ============================================================
// SCALE GROUP
// ============================================================

function addScaleGroup(
  select,
  label,
  data
) {

  const group =
    document.createElement(
      "optgroup"
    );


  group.label =
    label;


  Object.entries(data || {})
    .forEach(
      ([name, notes]) => {

        const option =
          document.createElement(
            "option"
          );


        option.value =
          `${label}:${name}`;


        option.textContent =
          name;


        group.appendChild(
          option
        );

      }
    );


  select.appendChild(
    group
  );

}


// ============================================================
// GET SELECTED SCALE
// ============================================================

function getSelectedScale() {

  const select =
    document.getElementById(
      "scale-select"
    );


  if (!select) return null;


  const value =
    select.value;


  const separator =
    value.indexOf(":");


  if (separator === -1) {

    return null;

  }


  const category =
    value.substring(
      0,
      separator
    );


  const name =
    value.substring(
      separator + 1
    );


  const keyMap = {

    Western: "western",

    Japanese: "japanese",

    World: "world",

    Favorite: "favorite",

    Custom: "custom"

  };


  const key =
    keyMap[category];


  if (!key) return null;


  return {

    name,

    notes:
      scales[key][name] || []

  };

}


// ============================================================
// RENDER SCALE
// ============================================================

function renderScale() {

  const scale =
    getSelectedScale();


  const preview =
    document.getElementById(
      "parent-scale-preview"
    );


  if (!preview) return;


  if (!scale) {

    preview.textContent =
      "スケールを選択してください";

    return;

  }


  preview.innerHTML = `
    <strong>
      ${escapeHTML(scale.name)}
    </strong>

    <div>
      ${scale.notes
        .map(
          note =>
            `<span>${escapeHTML(note)}</span>`
        )
        .join(" ")}
    </div>
  `;

}


// ============================================================
// SEND SCALE
// ============================================================

function sendScale() {

  const db = getDB();

  if (!db) return;


  const scale =
    getSelectedScale();


  if (!scale) {

    alert(
      "スケールを選択してください"
    );

    return;

  }


  db.set(
    db.ref(
      db.database,
      "scale"
    ),
    {

      name:
        scale.name,

      notes:
        scale.notes,

      timestamp:
        Date.now()

    }
  );

}


// ============================================================
// CHILD SCALE
// ============================================================

function renderChildScale() {

  const name =
    document.getElementById(
      "child-scale-name"
    );


  const notes =
    document.getElementById(
      "child-scale-notes"
    );


  if (!name || !notes) return;


  if (!currentScale) {

    name.textContent =
      "—";

    notes.textContent =
      "—";

    return;

  }


  name.textContent =
    currentScale.name;


  notes.textContent =
    currentScale.notes.join(
      "  "
    );

}


// ============================================================
// CUSTOM SCALE
// ============================================================

function saveCustomScale() {

  const db = getDB();

  if (!db) return;


  const name =
    document.getElementById(
      "custom-scale-name"
    ).value.trim();


  const notesText =
    document.getElementById(
      "custom-scale-notes"
    ).value.trim();


  if (!name || !notesText) {

    alert(
      "スケール名と構成音を入力してください"
    );

    return;

  }


  const notes =
    notesText
      .split(/[\s,、]+/)
      .filter(Boolean);


  db.set(
    db.ref(
      db.database,
      `scaleDefinitions/custom/${name}`
    ),
    notes
  );


  alert(
    "Customスケールを保存しました"
  );

}


// ============================================================
// CHAT
// ============================================================

function addTimelineMessage(
  message
) {

  const db = getDB();

  if (!db) return;


  const chatRef =
    db.ref(
      db.database,
      "chat"
    );


  const newMessage =
    db.push(chatRef);


  db.set(
    newMessage,
    {

      sender:
        message.sender,

      target:
        message.target,

      text:
        message.text,

      timestamp:
        message.timestamp

    }
  );

}


// ============================================================
// PARENT CHAT
// ============================================================

function sendParentChat() {

  const input =
    document.getElementById(
      "parent-chat-input"
    );


  const text =
    input.value.trim();


  if (!text) return;


  addTimelineMessage({

    sender: "親",

    target: "全員",

    text,

    timestamp:
      Date.now()

  });


  input.value = "";

}


// ============================================================
// CHILD CHAT
// ============================================================

function sendChildChat() {

  if (!childPlayer) {

    alert(
      "先に自分のパートを選択してください"
    );

    return;

  }


  const input =
    document.getElementById(
      "child-chat-input"
    );


  const text =
    input.value.trim();


  if (!text) return;


  addTimelineMessage({

    sender:
      players[childPlayer].name,

    target:
      "親 / 全員",

    text,

    timestamp:
      Date.now()

  });


  input.value = "";

}


// ============================================================
// CHAT RENDER
// ============================================================

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
        `[${formatTime(message.timestamp)}] ` +
        `${message.sender} → ${message.target}: ` +
        message.text;


      container.appendChild(
        div
      );

    }
  );


  container.scrollTop =
    container.scrollHeight;

}


// ============================================================
// CHILD CHAT RENDER
// ============================================================

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
        `[${formatTime(message.timestamp)}] ` +
        `${message.sender} → ${message.target}: ` +
        message.text;


      container.appendChild(
        div
      );

    }
  );


  container.scrollTop =
    container.scrollHeight;

}


// ============================================================
// TIME
// ============================================================

function formatTime(
  timestamp
) {

  if (!timestamp) {

    return "--:--:--";

  }


  return new Date(
    timestamp
  ).toLocaleTimeString(
    "ja-JP",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }
  );

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(
  value
) {

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


// ============================================================
// START
// ============================================================

showScreen(
  "role-screen"
);


window.addEventListener(
  "load",
  () => {

    setTimeout(
      initializeAppData,
      100
    );

  }
);

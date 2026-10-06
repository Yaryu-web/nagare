import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  update,
  remove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// =====================================================
// FIREBASE
// =====================================================

const firebaseConfig = {
  apiKey: "AIzaSyBvmH9nJXVq_Ys0CDGafHwo0zGP64S-KKY",
  authDomain: "yaryu-live-control.firebaseapp.com",
  projectId: "yaryu-live-control",
  storageBucket: "yaryu-live-control.firebasestorage.app",
  messagingSenderId: "364112884906",
  appId: "1:364112884906:web:a30198670caa2f2d344cd3",
  measurementId: "G-WVR9BGQ9XL"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getDatabase(firebaseApp);


// =====================================================
// DATABASE ROOT
// =====================================================

const roomRef = ref(db, "yaryu");


// =====================================================
// LOCAL STATE
// =====================================================

let players = {};

let scores = {};

let selectedPlayer = null;

let selectedScore = 1;

let childPlayer = null;

let currentScale = null;


// =====================================================
// DEFAULT DATA
// =====================================================

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


// =====================================================
// SCALE DATA
// =====================================================

const scales = {

  Western: {

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

    "C# Major": [
      "C#",
      "D#",
      "E#",
      "F#",
      "G#",
      "A#",
      "B#"
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


  Japanese: {

    "平調子": [
      "C",
      "Db",
      "F",
      "G",
      "Ab"
    ],

    "陰旋法": [
      "A",
      "B",
      "C",
      "E",
      "F"
    ],

    "陽旋法": [
      "C",
      "D",
      "E",
      "G",
      "A"
    ]

  },


  World: {

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
    ],

    "Pelog": [
      "C",
      "Db",
      "Eb",
      "G",
      "Ab"
    ]

  },


  Favorite: {

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
      "E",
      "F#",
      "G#",
      "B"
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


  Custom: {

    "Custom 01": [
      "C",
      "Db",
      "E",
      "F#"
    ]

  }

};


// =====================================================
// INITIALIZE DATABASE
// =====================================================

async function initializeDatabase() {

  onValue(
    roomRef,
    snapshot => {

      const data = snapshot.val();

      if (!data) {

        set(roomRef, {

          players: defaultPlayers,

          scores: defaultScores,

          scale: {
            category: "Favorite",
            name: "F Maj",
            notes: scales.Favorite["F Maj"]
          },

          instructions: {},

          chat: {}

        });

        return;

      }

      players =
        data.players ||
        defaultPlayers;

      scores =
        data.scores ||
        defaultScores;

      currentScale =
        data.scale ||
        {
          category: "Favorite",
          name: "F Maj",
          notes: scales.Favorite["F Maj"]
        };

      renderEverything();

    }
  );

}


// =====================================================
// SCREEN
// =====================================================

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


// =====================================================
// ROLE
// =====================================================

window.enterParent = function () {

  showScreen("parent-screen");

  renderParent();

};


window.enterChild = function () {

  showScreen("child-screen");

  renderChild();

};


window.backToRole = function () {

  showScreen("role-screen");

};


// =====================================================
// RENDER EVERYTHING
// =====================================================

function renderEverything() {

  renderParent();

  renderChild();

  renderScaleSelector();

}


// =====================================================
// PARENT
// =====================================================

function renderParent() {

  if (
    !document.getElementById(
      "parent-screen"
    )
  ) {

    return;

  }

  renderPlayers();

  renderScores();

  renderEditor();

  renderScaleSelector();

  renderParentScale();

  renderChat();

}


// =====================================================
// PLAYERS
// =====================================================

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
        "player-entry";


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


      // 編集

      const editButton =
        document.createElement("button");

      editButton.textContent =
        "編集";

      editButton.onclick = () => {

        editPlayer(id);

      };


      wrapper.appendChild(
        editButton
      );


      // 削除

      const deleteButton =
        document.createElement("button");

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


// =====================================================
// ADD PLAYER
// =====================================================

window.addPlayer = async function () {

  const name =
    prompt(
      "演奏者名を入力してください",
      "E"
    );

  if (!name) return;


  const instrument =
    prompt(
      "楽器名を入力してください",
      "楽器"
    );

  if (!instrument) return;


  const ids =
    Object.keys(players);


  let nextLetter =
    "A";


  for (
    let i = 0;
    i < 26;
    i++
  ) {

    const candidate =
      String.fromCharCode(
        65 + i
      );


    if (!ids.includes(candidate)) {

      nextLetter =
        candidate;

      break;

    }

  }


  await set(
    ref(
      db,
      `yaryu/players/${nextLetter}`
    ),
    {
      name: name,
      instrument: instrument
    }
  );

};


// =====================================================
// EDIT PLAYER
// =====================================================

async function editPlayer(id) {

  const player =
    players[id];


  const name =
    prompt(
      "演奏者名",
      player.name
    );


  if (name === null) return;


  const instrument =
    prompt(
      "楽器名",
      player.instrument
    );


  if (instrument === null) return;


  await update(
    ref(
      db,
      `yaryu/players/${id}`
    ),
    {
      name: name,
      instrument: instrument
    }
  );

}


// =====================================================
// DELETE PLAYER
// =====================================================

async function deletePlayer(id) {

  const player =
    players[id];


  const ok =
    confirm(
      `${player.name} / ${player.instrument} を削除しますか？`
    );


  if (!ok) return;


  await remove(
    ref(
      db,
      `yaryu/players/${id}`
    )
  );


  if (selectedPlayer === id) {

    selectedPlayer = null;

  }


  if (childPlayer === id) {

    childPlayer = null;

  }

}


// =====================================================
// SCORE LIST
// =====================================================

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
        document.createElement("button");


      button.className =
        "score-button";


      if (
        Number(id) ===
        Number(selectedScore)
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

      };


      container.appendChild(
        button
      );

    });

}


// =====================================================
// SCORE EDITOR
// =====================================================

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


// =====================================================
// SAVE SCORE
// =====================================================

window.saveScore = async function () {

  const title =
    document.getElementById(
      "score-title"
    );


  const content =
    document.getElementById(
      "score-content"
    );


  if (!title || !content) return;


  await update(
    ref(
      db,
      `yaryu/scores/${selectedScore}`
    ),
    {
      title:
        title.value,

      content:
        content.value
    }
  );

};


// =====================================================
// INSTRUCTION
// =====================================================

window.sendInstruction =
async function (instruction) {

  if (!selectedPlayer) {

    alert(
      "演奏者を選択してください"
    );

    return;

  }


  const instructionRef =
    push(
      ref(
        db,
        "yaryu/instructions"
      )
    );


  await set(
    instructionRef,
    {

      target:
        selectedPlayer,

      instruction:
        instruction,

      timestamp:
        Date.now()

    }
  );

};


// =====================================================
// CHILD PLAYER SELECTOR
// =====================================================

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
        "player-button";


      if (
        childPlayer === id
      ) {

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
      `;


      button.onclick = () => {

        childPlayer =
          id;

        renderChild();

      };


      container.appendChild(
        button
      );

    });

}


// =====================================================
// CHILD
// =====================================================

function renderChild() {

  renderChildPlayerSelector();

  renderChildPlayer();

  renderChildScale();

  renderChildScore();

  renderChildChat();

}


// =====================================================
// CHILD PLAYER
// =====================================================

function renderChildPlayer() {

  const instrument =
    document.getElementById(
      "child-instrument"
    );


  const instruction =
    document.getElementById(
      "child-instruction"
    );


  if (!instrument) return;


  if (!childPlayer) {

    instrument.textContent =
      "演奏者を選択してください";

    instruction.textContent =
      "WAIT";

    return;

  }


  const player =
    players[childPlayer];


  if (!player) return;


  instrument.textContent =
    `${player.name} / ${player.instrument}`;


  const instructionsRef =
    ref(
      db,
      "yaryu/instructions"
    );


  onValue(
    instructionsRef,
    snapshot => {

      const data =
        snapshot.val() || {};


      const entries =
        Object.values(data);


      const own =
        entries
          .filter(
            item =>
              item.target ===
              childPlayer
          )
          .sort(
            (a, b) =>
              b.timestamp -
              a.timestamp
          );


      const global =
        entries
          .filter(
            item =>
              item.target ===
              "ALL"
          )
          .sort(
            (a, b) =>
              b.timestamp -
              a.timestamp
          );


      const latest =
        own[0] ||
        global[0];


      if (latest) {

        instruction.textContent =
          latest.instruction;

      } else {

        instruction.textContent =
          "WAIT";

      }


      renderChildChat();

    },
    {
      onlyOnce: false
    }
  );

}


// =====================================================
// SEND GLOBAL INSTRUCTION
// =====================================================

window.sendGlobalInstruction =
async function (instruction) {

  const instructionRef =
    push(
      ref(
        db,
        "yaryu/instructions"
      )
    );


  await set(
    instructionRef,
    {

      target:
        "ALL",

      instruction:
        instruction,

      timestamp:
        Date.now()

    }
  );

};


// =====================================================
// SCALE SELECTOR
// =====================================================

function renderScaleSelector() {

  const select =
    document.getElementById(
      "scale-select"
    );


  if (!select) return;


  select.innerHTML = "";


  Object.entries(scales)
    .forEach(
      ([category, scaleList]) => {

        const group =
          document.createElement(
            "optgroup"
          );


        group.label =
          category;


        Object.keys(scaleList)
          .forEach(name => {

            const option =
              document.createElement(
                "option"
              );


            option.value =
              `${category}::${name}`;


            option.textContent =
              name;


            if (
              currentScale &&
              currentScale.category ===
                category &&
              currentScale.name ===
                name
            ) {

              option.selected =
                true;

            }


            group.appendChild(
              option
            );

          });


        select.appendChild(
          group
        );

      }
    );


  select.onchange =
    renderSelectedScalePreview;


  renderSelectedScalePreview();

}


// =====================================================
// SCALE PREVIEW
// =====================================================

function renderSelectedScalePreview() {

  const select =
    document.getElementById(
      "scale-select"
    );


  const preview =
    document.getElementById(
      "parent-scale-preview"
    );


  if (!select || !preview)
    return;


  const value =
    select.value;


  if (!value) return;


  const parts =
    value.split("::");


  const category =
    parts[0];


  const name =
    parts[1];


  const notes =
    scales[
      category
    ][
      name
    ];


  preview.innerHTML = `

    <div class="scale-name">
      ${name}
    </div>

    <div class="scale-notes">
      ${notes.join(" · ")}
    </div>

  `;

}


// =====================================================
// SEND SCALE
// =====================================================

window.sendScale =
async function () {

  const select =
    document.getElementById(
      "scale-select"
    );


  if (!select) return;


  const parts =
    select.value.split("::");


  const category =
    parts[0];


  const name =
    parts[1];


  const notes =
    scales[
      category
    ][
      name
    ];


  await set(
    ref(
      db,
      "yaryu/scale"
    ),
    {

      category:
        category,

      name:
        name,

      notes:
        notes,

      timestamp:
        Date.now()

    }
  );

};


// =====================================================
// PARENT SCALE
// =====================================================

function renderParentScale() {

  const preview =
    document.getElementById(
      "parent-scale-preview"
    );


  if (!preview || !currentScale)
    return;


  preview.innerHTML = `

    <div class="scale-name">
      ${currentScale.name}
    </div>

    <div class="scale-notes">
      ${currentScale.notes.join(" · ")}
    </div>

  `;

}


// =====================================================
// CHILD SCALE
// =====================================================

function renderChildScale() {

  const name =
    document.getElementById(
      "child-scale-name"
    );


  const notes =
    document.getElementById(
      "child-scale-notes"
    );


  if (!name || !notes)
    return;


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
      " · "
    );

}

// =========================
// LIVE RESET
// =========================

function resetLive() {

  if (
    !confirm(
      "このライブのチャットと指示をすべて消去しますか？"
    )
  ) {
    return;
  }

  // チャットを消去
  chatMessages = [];

  // 全演奏者の指示を WAIT に戻す
  Object.keys(players).forEach(id => {

    playerInstructions[id] = "WAIT";

  });

  // 画面を更新
  renderParent();
  renderChild();

}

// =====================================================
// CHAT
// =====================================================

window.sendParentChat =
async function () {

  const input =
    document.getElementById(
      "parent-chat-input"
    );


  if (!input) return;


  const message =
    input.value.trim();


  if (!message) return;


  const messageRef =
    push(
      ref(
        db,
        "yaryu/chat"
      )
    );


  await set(
    messageRef,
    {

      sender:
        "親",

      target:
        "ALL",

      text:
        message,

      timestamp:
        Date.now()

    }
  );


  input.value =
    "";

};

// =========================
// CHAT RESET
// =========================

function resetChat() {

  const confirmed =
    confirm(
      "チャット履歴をすべて削除しますか？"
    );

  if (!confirmed) {
    return;
  }

  const chatRef =
    ref(db, "yaryu/chat");

  remove(chatRef)
    .then(() => {

      console.log("チャットをリセットしました");

    })
    .catch((error) => {

      console.error(
        "チャットのリセットに失敗しました:",
        error
      );

      alert(
        "チャットのリセットに失敗しました"
      );

    });

}

// =====================================================
// CHILD CHAT
// =====================================================

window.sendChildChat =
async function () {

  if (!childPlayer) {

    alert(
      "先に自分の演奏者を選択してください"
    );

    return;

  }


  const input =
    document.getElementById(
      "child-chat-input"
    );


  if (!input) return;


  const message =
    input.value.trim();


  if (!message) return;


  const player =
    players[childPlayer];


  const messageRef =
    push(
      ref(
        db,
        "yaryu/chat"
      )
    );


  await set(
    messageRef,
    {

      sender:
        player.instrument,

      senderPlayer:
        childPlayer,

      target:
        "ALL",

      text:
        message,

      timestamp:
        Date.now()

    }
  );


  input.value =
    "";

};


// =====================================================
// TIME FORMAT
// =====================================================

function formatTime(timestamp) {

  if (!timestamp)
    return "";


  const date =
    new Date(timestamp);


  return date.toLocaleTimeString(
    "ja-JP",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }
  );

}


// =====================================================
// PARENT CHAT / TIMELINE
// =====================================================

function renderChat() {

  const container =
    document.getElementById(
      "chat-log"
    );


  if (!container) return;


  container.innerHTML =
    "";


  const chatRef =
    ref(
      db,
      "yaryu/chat"
    );


  const instructionRef =
    ref(
      db,
      "yaryu/instructions"
    );


  let chatData =
    {};


  let instructionData =
    {};


  function renderTimeline() {

    const timeline = [];


    Object.values(chatData)
      .forEach(message => {

        timeline.push({

          type:
            "chat",

          timestamp:
            message.timestamp,

          sender:
            message.sender,

          target:
            message.target,

          text:
            message.text

        });

      });


    Object.values(instructionData)
      .forEach(item => {

        timeline.push({

          type:
            "instruction",

          timestamp:
            item.timestamp,

          target:
            item.target,

          text:
            item.instruction

        });

      });


    timeline.sort(
      (a, b) =>
        a.timestamp -
        b.timestamp
    );


    container.innerHTML =
      "";


    timeline.forEach(item => {

      const div =
        document.createElement(
          "div"
        );


      div.className =
        "chat-message";


      const time =
        formatTime(
          item.timestamp
        );


      if (
        item.type ===
        "instruction"
      ) {

        const target =
          item.target ===
          "ALL"

            ? "全体"

            : (
              players[item.target]
                ? players[item.target].name
                : item.target
            );


        div.textContent =
          `[${time}] 指示 → ${target}: ${item.text}`;

      } else {

        div.textContent =
          `[${time}] ${item.sender}: ${item.text}`;

      }


      container.appendChild(
        div
      );

    });


    container.scrollTop =
      container.scrollHeight;

  }


  onValue(
    chatRef,
    snapshot => {

      chatData =
        snapshot.val() || {};

      renderTimeline();

    }
  );


  onValue(
    instructionRef,
    snapshot => {

      instructionData =
        snapshot.val() || {};

      renderTimeline();

    }
  );

}


// =====================================================
// CHILD CHAT
//
// 自分への指示
// 全体への指示
// チャット
// を表示
// =====================================================

function renderChildChat() {

  const container =
    document.getElementById(
      "child-chat-log"
    );


  if (!container) return;


  if (!childPlayer) {

    container.innerHTML =
      "<div>演奏者を選択してください</div>";

    return;

  }


  const chatRef =
    ref(
      db,
      "yaryu/chat"
    );


  const instructionRef =
    ref(
      db,
      "yaryu/instructions"
    );


  let chatData =
    {};


  let instructionData =
    {};


  function renderTimeline() {

    const timeline = [];


    Object.values(
      instructionData
    )
      .forEach(item => {

        if (
          item.target ===
            "ALL" ||
          item.target ===
            childPlayer
        ) {

          timeline.push({

            type:
              "instruction",

            timestamp:
              item.timestamp,

            target:
              item.target,

            text:
              item.instruction

          });

        }

      });


    Object.values(chatData)
      .forEach(message => {

        timeline.push({

          type:
            "chat",

          timestamp:
            message.timestamp,

          sender:
            message.sender,

          text:
            message.text

        });

      });


    timeline.sort(
      (a, b) =>
        a.timestamp -
        b.timestamp
    );


    container.innerHTML =
      "";


    timeline.forEach(item => {

      const div =
        document.createElement(
          "div"
        );


      div.className =
        "chat-message";


      const time =
        formatTime(
          item.timestamp
        );


      if (
        item.type ===
        "instruction"
      ) {

        const label =
          item.target ===
          "ALL"

            ? "全体指示"

            : "自分への指示";


        div.textContent =
          `[${time}] ${label}: ${item.text}`;

      } else {

        div.textContent =
          `[${time}] ${item.sender}: ${item.text}`;

      }


      container.appendChild(
        div
      );

    });


    container.scrollTop =
      container.scrollHeight;

  }


  onValue(
    chatRef,
    snapshot => {

      chatData =
        snapshot.val() || {};

      renderTimeline();

    }
  );


  onValue(
    instructionRef,
    snapshot => {

      instructionData =
        snapshot.val() || {};

      renderTimeline();

    }
  );

}


// =====================================================
// FIREBASE SCALE LISTENER
// =====================================================

onValue(
  ref(
    db,
    "yaryu/scale"
  ),
  snapshot => {

    const data =
      snapshot.val();


    if (!data) return;


    currentScale =
      data;


    renderParentScale();

    renderChildScale();

    renderScaleSelector();

  }
);


// =====================================================
// INITIALIZE
// =====================================================

showScreen(
  "role-screen"
);


initializeDatabase();

* {
  box-sizing: border-box;
}

html {
  min-height: 100%;
}

body {
  margin: 0;
  background: #111;
  color: #eee;

  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "Helvetica Neue",
    sans-serif;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

button:active {
  transform: scale(.98);
}

.screen {
  min-height: 100vh;
  padding: 24px;
}

.hidden {
  display: none !important;
}


/* =========================
   ROLE
========================= */

#role-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#role-screen h1 {
  font-size: 64px;
  margin: 0;
}

.subtitle {
  letter-spacing: .4em;
  margin-bottom: 60px;
  opacity: .6;
}

.role-buttons {
  display: flex;
  gap: 20px;
}

.role-button {
  width: 180px;
  height: 180px;

  border: 1px solid #555;

  background: #222;
  color: white;

  font-size: 40px;
}

.role-button:hover {
  background: #2b2b2b;
}

.role-button small {
  display: block;

  font-size: 12px;

  margin-top: 10px;

  opacity: .5;
}


/* =========================
   HEADER
========================= */

header {
  display: flex;

  justify-content: space-between;
  align-items: center;

  margin-bottom: 25px;
}

header h1 {
  margin: 0;
}

.mode {
  font-size: 11px;

  letter-spacing: .2em;

  opacity: .5;
}

header > button {
  background: #222;

  border: 1px solid #444;

  color: white;

  padding: 9px 16px;
}


/* =========================
   PANELS
========================= */

.parent-layout {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 16px;

  max-width: 1400px;

  margin: auto;
}

.panel {
  background: #1b1b1b;

  border: 1px solid #333;

  padding: 20px;

  min-width: 0;
}

.panel h2 {
  margin-top: 0;
}


/* =========================
   PLAYERS
========================= */

.player-item {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    auto
    auto;

  gap: 6px;

  margin-bottom: 8px;
}

.player-button {
  width: 100%;

  text-align: left;

  padding: 15px;

  background: #222;

  border: 1px solid #444;

  color: white;
}

.player-button:hover {
  background: #292929;
}

.player-button.selected {
  border-color: white;

  background: #292929;
}

.player-name {
  font-weight: bold;
}

.player-instrument-small {
  opacity: .5;

  font-size: 13px;

  margin-top: 3px;
}

.player-edit-button,
.player-delete-button {
  padding: 0 10px;

  background: #222;

  color: #aaa;

  border: 1px solid #444;
}

.player-delete-button {
  color: #888;
}

.add-player-button {
  width: 100%;

  margin-top: 8px;

  padding: 13px;

  background: #222;

  border: 1px dashed #555;

  color: white;
}

.add-player-button:hover {
  background: #292929;
}


/* =========================
   SELECTED PLAYER
========================= */

.selected-player {
  min-height: 42px;

  display: flex;

  align-items: center;

  padding: 10px 12px;

  background: #111;

  border: 1px solid #333;

  color: #ddd;
}


/* =========================
   INSTRUCTIONS
========================= */

.instruction-grid {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 10px;

  margin-top: 20px;
}

.instruction-grid button {
  min-height: 65px;

  background: #292929;

  color: white;

  border: 1px solid #555;

  font-weight: bold;
}

.instruction-grid button:hover {
  background: #333;
}

.instruction-grid .instruction-all {
  grid-column: 1 / -1;

  background: #202020;

  border-color: #777;
}


/* =========================
   SCALE
========================= */

.scale-panel select {
  width: 100%;

  margin-top: 7px;

  padding: 11px;

  background: #111;

  color: white;

  border: 1px solid #444;
}

.scale-preview {
  margin-top: 15px;

  padding: 16px;

  background: #111;

  border: 1px solid #333;
}

.scale-preview-name {
  font-size: 20px;

  font-weight: bold;

  margin-bottom: 12px;
}

.scale-notes {
  display: flex;

  flex-wrap: wrap;

  gap: 7px;
}

.scale-notes span,
.child-scale-notes span {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  min-width: 42px;

  padding: 8px 10px;

  background: #242424;

  border: 1px solid #444;

  border-radius: 3px;

  font-weight: bold;
}

.scale-send-button {
  width: 100%;

  margin-top: 12px;

  padding: 14px;

  background: #eee;

  color: #111;

  border: 0;

  font-weight: bold;
}

.scale-send-button:hover {
  background: white;
}


/* =========================
   SCALE EDITOR
========================= */

.scale-editor {
  margin-top: 20px;

  padding-top: 20px;

  border-top: 1px solid #333;
}

.scale-editor h3 {
  margin-top: 0;
}

.scale-editor-buttons {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 8px;

  margin-top: 10px;
}

.scale-editor-buttons button {
  padding: 11px;

  background: #222;

  color: white;

  border: 1px solid #444;
}

.danger-button {
  width: 100%;

  margin-top: 8px;

  padding: 10px;

  background: #181818;

  color: #999;

  border: 1px solid #333;
}


/* =========================
   SCORE
========================= */

.score-button {
  display: block;

  width: 100%;

  padding: 15px;

  margin-bottom: 8px;

  text-align: left;

  background: #222;

  color: white;

  border: 1px solid #444;
}

.score-button:hover {
  background: #292929;
}

.score-button.selected {
  border-color: white;
}

label {
  display: block;

  margin: 12px 0;
}

input,
textarea {
  display: block;

  width: 100%;

  margin-top: 6px;

  padding: 10px;

  background: #111;

  color: white;

  border: 1px solid #444;
}

textarea {
  min-height: 120px;

  resize: vertical;
}

.panel > button {
  background: #222;

  color: white;

  border: 1px solid #444;

  padding: 10px 15px;
}


/* =========================
   CHAT / TIMELINE
========================= */

#chat-log,
#child-chat-log {
  height: 280px;

  overflow-y: auto;

  padding: 10px;

  background: #111;

  border: 1px solid #333;
}

.timeline-item {
  padding: 10px 8px;

  margin-bottom: 6px;

  border-left: 2px solid #777;

  background: #181818;
}

.timeline-time {
  font-size: 11px;

  opacity: .45;
}

.timeline-target {
  font-size: 12px;

  margin-top: 3px;

  opacity: .65;
}

.timeline-content {
  margin-top: 5px;

  font-weight: bold;
}

.chat-message {
  display: flex;

  gap: 8px;

  flex-wrap: wrap;

  padding: 8px 4px;

  border-bottom: 1px solid #222;
}

.chat-time {
  font-size: 11px;

  opacity: .4;
}

.chat-message strong {
  color: #ddd;
}

.chat-input {
  display: flex;

  gap: 8px;

  margin-top: 8px;
}

.chat-input input {
  flex: 1;

  margin-top: 0;
}

.chat-input button {
  padding: 0 18px;
}


/* =========================
   CHILD
========================= */

.child-layout {
  max-width: 800px;

  margin: auto;

  display: flex;

  flex-direction: column;

  gap: 16px;
}

.child-player-select-panel {
  padding-bottom: 15px;
}

.child-section-label {
  font-size: 11px;

  letter-spacing: .2em;

  opacity: .45;

  margin-bottom: 8px;
}

.child-player-selector {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 8px;
}

.child-player-button {
  display: flex;

  flex-direction: column;

  align-items: flex-start;

  gap: 4px;

  padding: 13px;

  background: #222;

  color: white;

  border: 1px solid #444;
}

.child-player-button span {
  font-size: 12px;

  opacity: .5;
}

.child-player-button.selected {
  border-color: white;

  background: #2b2b2b;
}


/* =========================
   PLAYER CARD
========================= */

.player-card {
  text-align: center;

  padding: 30px;
}

.player-instrument {
  font-size: 18px;

  opacity: .6;
}

.instruction-display {
  margin-top: 20px;

  min-height: 220px;

  display: flex;

  align-items: center;
  justify-content: center;

  background: #181818;

  border: 1px solid #444;

  font-size: 64px;

  font-weight: bold;
}


/* =========================
   CHILD INSTRUCTION HISTORY
========================= */

.child-instruction-log {
  max-height: 220px;

  overflow-y: auto;
}

.instruction-history-item {
  display: grid;

  grid-template-columns:
    auto auto 1fr;

  gap: 10px;

  align-items: center;

  padding: 10px 0;

  border-bottom: 1px solid #292929;
}

.history-time {
  font-size: 11px;

  opacity: .45;
}

.history-target {
  font-size: 12px;

  opacity: .6;
}


/* =========================
   CHILD SCALE
========================= */

.child-scale-panel {
  text-align: center;

  padding: 24px;
}

.child-scale-name {
  font-size: 28px;

  font-weight: bold;

  margin-bottom: 18px;
}

.child-scale-notes {
  display: flex;

  flex-wrap: wrap;

  justify-content: center;

  gap: 8px;
}


/* =========================
   CHILD SCORE
========================= */

.score-display {
  white-space: pre-wrap;

  line-height: 1.7;

  font-size: 18px;
}


/* =========================
   MOBILE
========================= */

@media (max-width: 700px) {

  .screen {
    padding: 12px;
  }

  #role-screen h1 {
    font-size: 48px;
  }

  .role-buttons {
    width: 100%;
  }

  .role-button {
    flex: 1;

    width: auto;

    height: 140px;
  }

  .parent-layout {
    grid-template-columns: 1fr;
  }

  .player-item {
    grid-template-columns:
      minmax(0, 1fr)
      auto
      auto;
  }

  .instruction-display {
    min-height: 180px;

    font-size: 48px;
  }

  .child-player-selector {
    grid-template-columns: 1fr 1fr;
  }

  .instruction-history-item {
    grid-template-columns:
      1fr 1fr;

    gap: 5px;
  }

  .instruction-history-item strong {
    grid-column: 1 / -1;
  }

  .scale-editor-buttons {
    grid-template-columns: 1fr;
  }

  .chat-input {
    flex-direction: row;
  }

}

/* =========================
   CHAT HEADER
========================= */

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.chat-header h2 {
  margin: 0;
}

.chat-reset-button {
  padding: 8px 12px;

  background: #222;
  color: #aaa;

  border: 1px solid #444;

  cursor: pointer;

  font-size: 12px;
}

.chat-reset-button:hover {
  color: white;
  border-color: #777;
}

.chat-reset-button:active {
  transform: scale(.97);
}

window.resetChat = resetChat;

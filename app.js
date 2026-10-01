import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getDatabase,
  ref,
  set,
  push,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// =====================================================
// FIREBASE
// =====================================================

const firebaseConfig = {

  apiKey: "AIzaSyBvmH9nJXVq_Ys0CDGafHwo0zGP64S-KKY",

  authDomain:
    "yaryu-live-control.firebaseapp.com",

  databaseURL:
    "https://yaryu-live-control-default-rtdb.firebaseio.com",

  projectId:
    "yaryu-live-control",

  storageBucket:
    "yaryu-live-control.firebasestorage.app",

  messagingSenderId:
    "364112884906",

  appId:
    "1:364112884906:web:a30198670caa2f2d344cd3",

  measurementId:
    "G-WVR9BGQ9XL"

};


const app = initializeApp(firebaseConfig);

const db = getDatabase(app);


// =====================================================
// PLAYERS
// =====================================================

let players = {

  A: {
    name: "A",
    instrument: "ギター",
    instruction: "WAIT"
  },

  B: {
    name: "B",
    instrument: "ドラム",
    instruction: "WAIT"
  },

  C: {
    name: "C",
    instrument: "ベース",
    instruction: "WAIT"
  },

  D: {
    name: "D",
    instrument: "シンセ",
    instruction: "WAIT"
  }

};


// =====================================================
// SCORES
// =====================================================

let scores = {

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
// SCALES
// =====================================================

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
  ],

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
  ],

  "Spanish": [
    "E",
    "F",
    "G#",
    "A",
    "B",
    "C",
    "D"
  ]

};


let currentScale = {
  name: "F Major",
  notes: scales["F Major"]
};


// =====================================================
// STATE
// =====================================================

let selectedPlayer = null;

let selectedScore = 1;

let childPlayer = null;

let chatMessages = [];


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
// PARENT
// =====================================================

function renderParent() {

  renderPlayers();

  renderScores();

  renderEditor();

  renderScale();

  renderChat();

}


function renderPlayers() {

  const container =
    document.getElementById(
      "parent-players"
    );

  if (!container) return;

  container.innerHTML = "";


  Object.entries(players)
    .forEach(([id, player]) => {

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


      button.onclick = function () {

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


      container.appendChild(button);

    });

}


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


    await set(

      ref(
        db,
        `session/players/${selectedPlayer}/instruction`
      ),

      instruction

    );


    await addTimelineMessage(

      "指示",

      `${players[selectedPlayer].name} / ${players[selectedPlayer].instrument} → ${instruction}`

    );

  };


// =====================================================
// SCORE
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


      button.onclick = function () {

        selectedScore =
          Number(id);

        renderParent();

      };


      container.appendChild(button);

    });

}


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

  if (!title || !content) return;


  title.value =
    score.title;

  content.value =
    score.content;

}


window.saveScore =
  async function () {

    const title =
      document.getElementById(
        "score-title"
      );

    const content =
      document.getElementById(
        "score-content"
      );


    if (!title || !content) return;


    scores[selectedScore] = {

      title: title.value,

      content: content.value

    };


    await set(

      ref(
        db,
        `session/scores/${selectedScore}`
      ),

      scores[selectedScore]

    );


    renderParent();

  };


// =====================================================
// SCALE
// =====================================================

function renderScale() {

  const select =
    document.getElementById(
      "scale-select"
    );

  const preview =
    document.getElementById(
      "parent-scale-preview"
    );


  if (!select) return;


  select.innerHTML = "";


  Object.keys(scales)
    .forEach(name => {

      const option =
        document.createElement(
          "option"
        );

      option.value = name;

      option.textContent = name;


      if (
        name === currentScale.name
      ) {

        option.selected = true;

      }


      select.appendChild(option);

    });


  function updatePreview() {

    const name =
      select.value;

    const notes =
      scales[name];


    if (preview) {

      preview.textContent =
        `${name} : ${notes.join(" - ")}`;

    }

  }


  select.onchange =
    updatePreview;


  updatePreview();

}


window.sendScale =
  async function () {

    const select =
      document.getElementById(
        "scale-select"
      );


    if (!select) return;


    const name =
      select.value;


    const notes =
      scales[name];


    currentScale = {

      name: name,

      notes: notes

    };


    await set(

      ref(
        db,
        "session/scale"
      ),

      currentScale

    );


    await addTimelineMessage(

      "SCALE",

      `${name} : ${notes.join(" - ")}`

    );


    renderScale();

  };


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


    await sendChat(

      "親",

      message

    );


    input.value = "";

  };


window.sendChildChat =
  async function () {

    if (!childPlayer) {

      alert(
        "演奏者を選択してください"
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


    await sendChat(

      players[childPlayer].instrument,

      message

    );


    input.value = "";

  };


async function sendChat(
  sender,
  text
) {

  const messageRef =
    push(
      ref(
        db,
        "session/chat"
      )
    );


  await set(

    messageRef,

    {

      sender: sender,

      text: text,

      timestamp:
        Date.now()

    }

  );

}


// =====================================================
// TIMELINE
// =====================================================

async function addTimelineMessage(
  sender,
  text
) {

  const messageRef =
    push(
      ref(
        db,
        "session/chat"
      )
    );


  await set(

    messageRef,

    {

      sender: sender,

      text: text,

      timestamp:
        Date.now(),

      type: "instruction"

    }

  );

}


// =====================================================
// CHAT RENDER
// =====================================================

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


      const time =
        message.timestamp
          ? new Date(
              message.timestamp
            ).toLocaleTimeString(
              "ja-JP",
              {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
              }
            )
          : "";


      div.textContent =
        `[${time}] ${message.sender}: ${message.text}`;


      container.appendChild(div);

    }
  );


  container.scrollTop =
    container.scrollHeight;

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


      const time =
        message.timestamp
          ? new Date(
              message.timestamp
            ).toLocaleTimeString(
              "ja-JP",
              {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
              }
            )
          : "";


      div.textContent =
        `[${time}] ${message.sender}: ${message.text}`;


      container.appendChild(div);

    }
  );


  container.scrollTop =
    container.scrollHeight;

}


// =====================================================
// CHILD
// =====================================================

function renderChild() {

  renderChildPlayerSelector();

  updateChildDisplay();

}


function renderChildPlayerSelector() {

  const old =
    document.getElementById(
      "child-player-selector"
    );

  if (!old) return;


  old.innerHTML = "";


  Object.entries(players)
    .forEach(([id, player]) => {

      const button =
        document.createElement("button");


      button.textContent =
        `${player.name} / ${player.instrument}`;


      button.className =
        "player-button";


      if (
        childPlayer === id
      ) {

        button.classList.add(
          "selected"
        );

      }


      button.onclick =
        function () {

          childPlayer = id;

          renderChild();

        };


      old.appendChild(button);

    });

}


function updateChildDisplay() {

  const player =
    players[childPlayer];


  const instrument =
    document.getElementById(
      "child-instrument"
    );


  const instruction =
    document.getElementById(
      "child-instruction"
    );


  if (!player) {

    if (instrument) {

      instrument.textContent =
        "演奏者を選択してください";

    }

    if (instruction) {

      instruction.textContent =
        "WAIT";

    }

    return;

  }


  if (instrument) {

    instrument.textContent =
      `${player.name} / ${player.instrument}`;

  }


  if (instruction) {

    instruction.textContent =
      player.instruction ||
      "WAIT";

  }


  const scaleName =
    document.getElementById(
      "child-scale-name"
    );


  const scaleNotes =
    document.getElementById(
      "child-scale-notes"
    );


  if (scaleName) {

    scaleName.textContent =
      currentScale.name;

  }


  if (scaleNotes) {

    scaleNotes.textContent =
      currentScale.notes.join(
        " - "
      );

  }


  const score =
    scores[selectedScore];


  const scoreTitle =
    document.getElementById(
      "child-score-title"
    );


  const scoreContent =
    document.getElementById(
      "child-score-content"
    );


  if (scoreTitle) {

    scoreTitle.textContent =
      score.title;

  }


  if (scoreContent) {

    scoreContent.textContent =
      score.content;

  }


  renderChildChat();

}


// =====================================================
// FIREBASE REALTIME LISTENERS
// =====================================================


// PLAYERS

onValue(

  ref(
    db,
    "session/players"
  ),

  snapshot => {

    const data =
      snapshot.val();


    if (!data) return;


    players = data;


    renderPlayers();

    renderChildPlayerSelector();

    updateChildDisplay();

  }

);


// SCALE

onValue(

  ref(
    db,
    "session/scale"
  ),

  snapshot => {

    const data =
      snapshot.val();


    if (!data) return;


    currentScale = data;


    renderScale();

    updateChildDisplay();

  }

);


// SCORES

onValue(

  ref(
    db,
    "session/scores"
  ),

  snapshot => {

    const data =
      snapshot.val();


    if (!data) return;


    scores = data;


    renderScores();

    renderEditor();

    updateChildDisplay();

  }

);


// CHAT

onValue(

  ref(
    db,
    "session/chat"
  ),

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
              a.timestamp -
              b.timestamp
          );

    }


    renderChat();

    renderChildChat();

  }

);


// =====================================================
// START
// =====================================================

showScreen(
  "role-screen"
);

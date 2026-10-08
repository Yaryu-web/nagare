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


const firebaseConfig = {

  apiKey: "AIzaSyBvmH9nJXVq_Ys0CDGafHwo0zGP64S-KKY",

  authDomain:
    "yaryu-live-control.firebaseapp.com",

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


const firebaseApp =
  initializeApp(firebaseConfig);

const db =
  getDatabase(firebaseApp);

const roomRef =
  ref(db, "yaryu");


/* =========================
   STATE
========================= */

let players = {};

let scores = {};

let selectedPlayer = null;

let selectedScore = 1;

let childPlayer = null;

let currentScale = null;

let currentScore = null;

let savedScales = {};


/* =========================
   DEFAULT PLAYERS
========================= */

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


/* =========================
   DEFAULT SCORES
========================= */

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


/* =========================
   DEFAULT SCALES
========================= */

const scales = {

  Western: {

    "F Major":
      ["F","G","A","Bb","C","D","E"],

    "Ab Major":
      ["Ab","Bb","C","Db","Eb","F","G"],

    "C# Major":
      ["C#","D#","E#","F#","G#","A#","B#"],

    "C Dorian":
      ["C","D","Eb","F","G","A","Bb"],

    "A Minor":
      ["A","B","C","D","E","F","G"],

    "D Dorian":
      ["D","E","F","G","A","B","C"],

    "E Phrygian":
      ["E","F","G","A","B","C","D"]

  },


  Japanese: {

    "平調子":
      ["C","Db","F","G","Ab"],

    "陰旋法":
      ["A","B","C","E","F"],

    "陽旋法":
      ["C","D","E","G","A"]

  },


  World: {

    "Spanish":
      ["E","F","G#","A","B","C","D"],

    "Hirajoshi":
      ["C","Db","F","G","Ab"],

    "Pelog":
      ["C","Db","Eb","G","Ab"]

  },


  Favorite: {

    "F Maj":
      ["F","G","A","Bb","C","D","E"],

    "Ab Major":
      ["Ab","Bb","C","Db","Eb","F","G"],

    "C# Panta":
      ["C#","E","F#","G#","B"],

    "C Dorian":
      ["C","D","Eb","F","G","A","Bb"],

    "C Minor Blues":
      ["C","Eb","F","Gb","G","Bb"]

  },


  Custom: {

    "Custom 01":
      ["C","Db","E","F#"]

  }

};


/* =========================
   COMBINE SCALES
========================= */

function allScales() {

  const result =
    JSON.parse(
      JSON.stringify(scales)
    );


  Object.values(savedScales)
    .forEach(scale => {

      if (!result[scale.category]) {

        result[scale.category] = {};

      }

      result[scale.category][scale.name] =
        scale.notes;

    });


  return result;

}


/* =========================
   DATABASE
========================= */

async function initializeDatabase() {

  onValue(
    roomRef,
    snapshot => {

      const data =
        snapshot.val();


      if (!data) {

        set(
          roomRef,
          {

            players:
              defaultPlayers,

            scores:
              defaultScores,

            currentScore: {

              id: 1,

              title:
                defaultScores[1].title,

              content:
                defaultScores[1].content,

              timestamp:
                Date.now()

            },

            scale: {

              category:
                "Favorite",

              name:
                "F Maj",

              notes:
                scales.Favorite["F Maj"],

              timestamp:
                Date.now()

            },

            scales: {},

            instructions: {},

            chat: {}

          }
        );

        return;

      }


      players =
        data.players ||
        defaultPlayers;


      scores =
        data.scores ||
        defaultScores;


      savedScales =
        data.scales ||
        {};


      currentScale =
        data.scale ||
        {

          category:
            "Favorite",

          name:
            "F Maj",

          notes:
            scales.Favorite["F Maj"]

        };


      currentScore =
        data.currentScore ||
        {

          id: 1,

          title:
            scores[1]?.title ||
            "SCORE 01",

          content:
            scores[1]?.content ||
            "全員で演奏"

        };


      renderEverything();

    }

  );

}


/* =========================
   SCREEN
========================= */

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


window.enterParent =
  function () {

    showScreen(
      "parent-screen"
    );

    renderParent();

  };


window.enterChild =
  function () {

    showScreen(
      "child-screen"
    );

    renderChild();

  };


window.backToRole =
  function () {

    showScreen(
      "role-screen"
    );

  };


/* =========================
   RENDER EVERYTHING
========================= */

function renderEverything() {

  renderParent();

  renderChild();

  renderScaleSelector();

}


/* =========================
   PARENT
========================= */

function renderParent() {

  if (
    !document.getElementById(
      "parent-screen"
    )
  ) return;


  renderPlayers();

  renderScores();

  renderEditor();

  renderScaleSelector();

  renderParentScale();

  renderScaleEditor();

  renderChat();

  renderCurrentScore();

}


/* =========================
   PLAYERS
========================= */

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
          "player-entry";


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
            ${player.name}
          </div>

          <div class="player-instrument-small">
            ${player.instrument}
          </div>

        `;


        button.onclick =
          () => {

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


        wrapper.appendChild(
          button
        );


        const editButton =
          document.createElement(
            "button"
          );

        editButton.textContent =
          "編集";

        editButton.onclick =
          () => editPlayer(id);

        wrapper.appendChild(
          editButton
        );


        const deleteButton =
          document.createElement(
            "button"
          );

        deleteButton.textContent =
          "削除";

        deleteButton.onclick =
          () => deletePlayer(id);

        wrapper.appendChild(
          deleteButton
        );


        container.appendChild(
          wrapper
        );

      }
    );

}


/* =========================
   ADD PLAYER
========================= */

window.addPlayer =
  async function () {

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


    let nextLetter = "A";


    for (
      let i = 0;
      i < 26;
      i++
    ) {

      const candidate =
        String.fromCharCode(
          65 + i
        );


      if (
        !ids.includes(candidate)
      ) {

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

        name,

        instrument

      }
    );

  };


/* =========================
   EDIT PLAYER
========================= */

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

      name,

      instrument

    }
  );

}


/* =========================
   DELETE PLAYER
========================= */

async function deletePlayer(id) {

  const player =
    players[id];


  if (
    !confirm(
      `${player.name} / ${player.instrument} を削除しますか？`
    )
  ) return;


  await remove(
    ref(
      db,
      `yaryu/players/${id}`
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


/* =========================
   SCORES
========================= */

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


        button.onclick =
          () => {

            selectedScore =
              Number(id);

            renderParent();

          };


        container.appendChild(
          button
        );

      }
    );

}


/* =========================
   SCORE EDITOR
========================= */

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


/* =========================
   SAVE SCORE
========================= */

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


    if (
      !title ||
      !content
    ) return;


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


/* =========================
   SEND SCORE TO EVERYONE
========================= */

window.sendScore =
  async function () {

    const score =
      scores[selectedScore];


    if (!score) return;


    currentScore = {

      id:
        Number(selectedScore),

      title:
        score.title,

      content:
        score.content,

      timestamp:
        Date.now()

    };


    await set(
      ref(
        db,
        "yaryu/currentScore"
      ),
      currentScore
    );

  };


/* =========================
   CURRENT SCORE
========================= */

function renderCurrentScore() {

  const title =
    document.getElementById(
      "parent-current-score-title"
    );


  const content =
    document.getElementById(
      "parent-current-score-content"
    );


  if (
    !title ||
    !content
  ) return;


  if (!currentScore) {

    title.textContent =
      "—";

    content.textContent =
      "スコア未送信";

    return;

  }


  title.textContent =
    currentScore.title;


  content.textContent =
    currentScore.content;

}


function renderChildScore() {

  const title =
    document.getElementById(
      "child-score-title"
    );


  const content =
    document.getElementById(
      "child-score-content"
    );


  if (
    !title ||
    !content
  ) return;


  if (!currentScore) {

    title.textContent =
      "SCORE";

    content.textContent =
      "スコア未送信";

    return;

  }


  title.textContent =
    currentScore.title;


  content.textContent =
    currentScore.content;

}


/* =========================
   INSTRUCTIONS
========================= */

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

        instruction,

        timestamp:
          Date.now()

      }
    );

  };


/* =========================
   CHILD PLAYER
========================= */

function renderChildPlayerSelector() {

  const container =
    document.getElementById(
      "child-player-selector"
    );


  if (!container) return;


  container.innerHTML = "";


  Object.entries(players)
    .forEach(
      ([id, player]) => {

        const button =
          document.createElement(
            "button"
          );


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


        button.onclick =
          () => {

            childPlayer =
              id;

            renderChild();

          };


        container.appendChild(
          button
        );

      }
    );

}


function renderChild() {

  renderChildPlayerSelector();

  renderChildPlayer();

  renderChildScale();

  renderChildScore();

  renderChildChat();

}


function renderChildPlayer() {

  const instrument =
    document.getElementById(
      "child-instrument"
    );


  const instruction =
    document.getElementById(
      "child-instruction"
    );


  if (
    !instrument ||
    !instruction
  ) return;


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
            (a,b) =>
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
            (a,b) =>
              b.timestamp -
              a.timestamp
          );


      const latest =
        own[0] ||
        global[0];


      instruction.textContent =
        latest
          ? latest.instruction
          : "WAIT";


      renderChildChat();

    }
  );

}


/* =========================
   GLOBAL INSTRUCTION
========================= */

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

        instruction,

        timestamp:
          Date.now()

      }
    );

  };


/* =========================
   SCALE SELECTOR
========================= */

function renderScaleSelector() {

  const select =
    document.getElementById(
      "scale-select"
    );


  if (!select) return;


  const scaleData =
    allScales();


  select.innerHTML =
    "";


  Object.entries(
    scaleData
  )
    .forEach(
      ([category, scaleList]) => {

        const group =
          document.createElement(
            "optgroup"
          );


        group.label =
          category;


        Object.keys(
          scaleList
        )
          .forEach(
            name => {

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

            }
          );


        select.appendChild(
          group
        );

      }
    );


  select.onchange =
    renderSelectedScalePreview;


  renderSelectedScalePreview();

}


/* =========================
   GET SELECTED SCALE
========================= */

function getSelectedScale() {

  const select =
    document.getElementById(
      "scale-select"
    );


  if (
    !select ||
    !select.value
  ) return null;


  const [
    category,
    ...nameParts
  ] =
    select.value.split("::");


  const name =
    nameParts.join("::");


  const scaleData =
    allScales();


  if (
    !scaleData[category] ||
    !scaleData[category][name]
  ) {

    return null;

  }


  return {

    category,

    name,

    notes:
      scaleData[category][name]

  };

}


/* =========================
   SCALE PREVIEW
========================= */

function renderSelectedScalePreview() {

  const preview =
    document.getElementById(
      "parent-scale-preview"
    );


  const selected =
    getSelectedScale();


  if (
    !preview ||
    !selected
  ) return;


  preview.innerHTML = `

    <div class="scale-name">
      ${selected.name}
    </div>

    <div class="scale-notes">
      ${selected.notes.join(" · ")}
    </div>

  `;

}


/* =========================
   SEND SCALE
========================= */

window.sendScale =
  async function () {

    const selected =
      getSelectedScale();


    if (!selected) return;


    currentScale = {

      ...selected,

      timestamp:
        Date.now()

    };


    await set(
      ref(
        db,
        "yaryu/scale"
      ),
      currentScale
    );

  };


/* =========================
   PARENT SCALE
========================= */

function renderParentScale() {

  const preview =
    document.getElementById(
      "parent-scale-preview"
    );


  if (
    !preview ||
    !currentScale
  ) return;


  preview.innerHTML = `

    <div class="scale-name">
      ${currentScale.name}
    </div>

    <div class="scale-notes">
      ${currentScale.notes.join(" · ")}
    </div>

  `;

}


/* =========================
   CHILD SCALE
========================= */

function renderChildScale() {

  const name =
    document.getElementById(
      "child-scale-name"
    );


  const notes =
    document.getElementById(
      "child-scale-notes"
    );


  if (
    !name ||
    !notes
  ) return;


  if (!currentScale) {

    name.textContent =
      "—";

    notes.textContent =
      "スケール未指定";

    return;

  }


  name.textContent =
    currentScale.name;


  notes.textContent =
    currentScale.notes.join(
      " · "
    );

}


/* =========================
   SCALE EDITOR
========================= */

function renderScaleEditor() {

  const select =
    document.getElementById(
      "scale-edit-select"
    );


  const categoryInput =
    document.getElementById(
      "scale-edit-category"
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
    !categoryInput ||
    !nameInput ||
    !notesInput
  ) return;


  const scaleData =
    allScales();


  select.innerHTML =
    "";


  Object.entries(
    scaleData
  )
    .forEach(
      ([category, scaleList]) => {

        Object.entries(
          scaleList
        )
          .forEach(
            ([name]) => {

              const option =
                document.createElement(
                  "option"
                );


              option.value =
                `${category}::${name}`;


              option.textContent =
                `${category} / ${name}`;


              select.appendChild(
                option
              );

            }
          );

      }
    );


  const currentValue =
    currentScale
      ? `${currentScale.category}::${currentScale.name}`
      : select.options[0]?.value;


  if (currentValue) {

    select.value =
      currentValue;

  }


  const loadSelected =
    () => {

      const [
        category,
        ...nameParts
      ] =
        select.value.split("::");


      const name =
        nameParts.join("::");


      const data =
        allScales();


      if (
        !data[category] ||
        !data[category][name]
      ) return;


      categoryInput.value =
        category;


      nameInput.value =
        name;


      notesInput.value =
        data[category][name].join(
          " "
        );

    };


  select.onchange =
    loadSelected;


  loadSelected();

}


/* =========================
   NEW SCALE
========================= */

window.newScaleEditor =
  function () {

    const category =
      document.getElementById(
        "scale-edit-category"
      );


    const name =
      document.getElementById(
        "scale-edit-name"
      );


    const notes =
      document.getElementById(
        "scale-edit-notes"
      );


    if (
      !category ||
      !name ||
      !notes
    ) return;


    category.value =
      "Favorite";


    name.value =
      "";


    notes.value =
      "";


    name.focus();

  };


/* =========================
   SAVE SCALE
========================= */

window.saveScale =
  async function () {

    const categoryInput =
      document.getElementById(
        "scale-edit-category"
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
      !categoryInput ||
      !nameInput ||
      !notesInput
    ) return;


    const category =
      categoryInput.value.trim();


    const name =
      nameInput.value.trim();


    const notes =
      notesInput.value
        .split(
          /[\s,、]+/
        )
        .map(
          note =>
            note.trim()
        )
        .filter(
          Boolean
        );


    if (
      !category ||
      !name ||
      notes.length === 0
    ) {

      alert(
        "カテゴリー、スケール名、構成音をすべて入力してください。"
      );

      return;

    }


    const scaleId =
      push(
        ref(
          db,
          "yaryu/scales"
        )
      ).key;


    await set(
      ref(
        db,
        `yaryu/scales/${scaleId}`
      ),
      {

        category,

        name,

        notes,

        timestamp:
          Date.now()

      }
    );


    alert(
      `「${name}」を保存しました。`
    );


    renderScaleEditor();

    renderScaleSelector();

  };


/* =========================
   DELETE SCALE
========================= */

window.deleteScale =
  async function () {

    const select =
      document.getElementById(
        "scale-edit-select"
      );


    if (
      !select ||
      !select.value
    ) return;


    const [
      category,
      ...nameParts
    ] =
      select.value.split("::");


    const name =
      nameParts.join("::");


    const match =
      Object.entries(
        savedScales
      )
      .find(
        ([id, scale]) =>

          scale.category ===
            category &&

          scale.name ===
            name
      );


    if (!match) {

      alert(
        "標準スケールは削除できません。"
      );

      return;

    }


    if (
      !confirm(
        `「${name}」を削除しますか？`
      )
    ) return;


    await remove(
      ref(
        db,
        `yaryu/scales/${match[0]}`
      )
    );

  };


/* =========================
   PARENT CHAT
========================= */

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


/* =========================
   RESET CHAT
========================= */

function resetChat() {

  if (
    !confirm(
      "チャットと指示の履歴をすべて削除しますか？"
    )
  ) return;


  Promise.all([

    remove(
      ref(
        db,
        "yaryu/chat"
      )
    ),

    remove(
      ref(
        db,
        "yaryu/instructions"
      )
    )

  ])

    .then(
      () =>
        console.log(
          "チャットと指示をリセットしました"
        )
    )

    .catch(
      error => {

        console.error(
          error
        );

        alert(
          "リセットに失敗しました"
        );

      }
    );

}


window.resetChat =
  resetChat;


/* =========================
   CHILD CHAT
========================= */

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


/* =========================
   TIME
========================= */

function formatTime(timestamp) {

  if (!timestamp) return "";


  return new Date(
    timestamp
  )
    .toLocaleTimeString(
      "ja-JP",
      {

        hour:
          "2-digit",

        minute:
          "2-digit",

        second:
          "2-digit"

      }
    );

}


/* =========================
   PARENT CHAT
========================= */

function renderChat() {

  const container =
    document.getElementById(
      "chat-log"
    );


  if (!container) return;


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


  let chatData = {};

  let instructionData = {};


  function renderTimeline() {

    const timeline = [];


    Object.values(
      chatData
    )
      .forEach(
        message => {

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

        }
      );


    Object.values(
      instructionData
    )
      .forEach(
        item => {

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
      );


    timeline.sort(
      (a,b) =>
        a.timestamp -
        b.timestamp
    );


    container.innerHTML =
      "";


    timeline.forEach(
      item => {

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
                  players[
                    item.target
                  ]
                    ? players[
                        item.target
                      ].name

                    : item.target
                );


          div.textContent =
            `[${time}] 指示 → ${target}: ${item.text}`;

        }

        else {

          div.textContent =
            `[${time}] ${item.sender}: ${item.text}`;

        }


        container.appendChild(
          div
        );

      }
    );


    container.scrollTop =
      container.scrollHeight;

  }


  onValue(
    chatRef,
    snapshot => {

      chatData =
        snapshot.val() ||
        {};

      renderTimeline();

    }
  );


  onValue(
    instructionRef,
    snapshot => {

      instructionData =
        snapshot.val() ||
        {};

      renderTimeline();

    }
  );

}


/* =========================
   CHILD CHAT
========================= */

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


  let chatData = {};

  let instructionData = {};


  function renderTimeline() {

    const timeline = [];


    Object.values(
      instructionData
    )
      .forEach(
        item => {

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

        }
      );


    Object.values(
      chatData
    )
      .forEach(
        message => {

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

        }
      );


    timeline.sort(
      (a,b) =>
        a.timestamp -
        b.timestamp
    );


    container.innerHTML =
      "";


    timeline.forEach(
      item => {

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

        }

        else {

          div.textContent =
            `[${time}] ${item.sender}: ${item.text}`;

        }


        container.appendChild(
          div
        );

      }
    );


    container.scrollTop =
      container.scrollHeight;

  }


  onValue(
    chatRef,
    snapshot => {

      chatData =
        snapshot.val() ||
        {};

      renderTimeline();

    }
  );


  onValue(
    instructionRef,
    snapshot => {

      instructionData =
        snapshot.val() ||
        {};

      renderTimeline();

    }
  );

}


/* =========================
   FIREBASE LISTENERS
========================= */

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


onValue(
  ref(
    db,
    "yaryu/currentScore"
  ),
  snapshot => {

    const data =
      snapshot.val();


    if (!data) return;


    currentScore =
      data;


    renderCurrentScore();

    renderChildScore();

  }
);


/* =========================
   START
========================= */

showScreen(
  "role-screen"
);

initializeDatabase();

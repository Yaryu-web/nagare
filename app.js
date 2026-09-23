/* =========================================================
   野流 LIVE CONTROL
   ========================================================= */

const STORAGE_KEY =
  "yaryu-live-control-v4";


/* =========================================================
   DEFAULT STATE
   ========================================================= */

const DEFAULT_STATE = {

  players: {

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

  },


  scores: {

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

  },


  selectedScore: 1,

  selectedPlayer: null,

  childPlayer: "A",


  instructions: {},

  globalInstructions: [],

  chatMessages: [],


  currentScale: {

    category: "Favorite",

    id: "f-maj"

  },


  scales: {

    /* =========================
       FAVORITE
    ========================== */

    Favorite: [

      {
        id: "f-maj",
        name: "F Maj",
        root: "F",
        notes: [
          "F",
          "G",
          "A",
          "Bb",
          "C",
          "D",
          "E"
        ]
      },

      {
        id: "ab-major",
        name: "Ab Major",
        root: "Ab",
        notes: [
          "Ab",
          "Bb",
          "C",
          "Db",
          "Eb",
          "F",
          "G"
        ]
      },

      {
        id: "csharp-panta",
        name: "C# Panta",
        root: "C#",
        notes: [
          "C#",
          "D#",
          "F#",
          "G#",
          "A#"
        ]
      },

      {
        id: "c-dorian",
        name: "C Dorian",
        root: "C",
        notes: [
          "C",
          "D",
          "Eb",
          "F",
          "G",
          "A",
          "Bb"
        ]
      }

    ],


    /* =========================
       WESTERN
    ========================== */

    Western: [

      {
        id: "c-major",
        name: "C Major",
        root: "C",
        notes: [
          "C",
          "D",
          "E",
          "F",
          "G",
          "A",
          "B"
        ]
      },

      {
        id: "a-minor",
        name: "A Minor",
        root: "A",
        notes: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G"
        ]
      },

      {
        id: "c-dorian",
        name: "C Dorian",
        root: "C",
        notes: [
          "C",
          "D",
          "Eb",
          "F",
          "G",
          "A",
          "Bb"
        ]
      },

      {
        id: "c-phrygian",
        name: "C Phrygian",
        root: "C",
        notes: [
          "C",
          "Db",
          "Eb",
          "F",
          "G",
          "Ab",
          "Bb"
        ]
      },

      {
        id: "c-lydian",
        name: "C Lydian",
        root: "C",
        notes: [
          "C",
          "D",
          "E",
          "F#",
          "G",
          "A",
          "B"
        ]
      },

      {
        id: "c-mixolydian",
        name: "C Mixolydian",
        root: "C",
        notes: [
          "C",
          "D",
          "E",
          "F",
          "G",
          "A",
          "Bb"
        ]
      },

      {
        id: "c-locrian",
        name: "C Locrian",
        root: "C",
        notes: [
          "C",
          "Db",
          "Eb",
          "F",
          "Gb",
          "Ab",
          "Bb"
        ]
      },

      {
        id: "a-harmonic-minor",
        name: "A Harmonic Minor",
        root: "A",
        notes: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G#"
        ]
      },

      {
        id: "a-melodic-minor",
        name: "A Melodic Minor",
        root: "A",
        notes: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F#",
          "G#"
        ]
      }

    ],


    /* =========================
       JAPANESE
    ========================== */

    Japanese: [

      {
        id: "hirajoshi",
        name: "平調子",
        root: "C",
        notes: [
          "C",
          "Db",
          "F",
          "G",
          "Ab"
        ]
      },

      {
        id: "in-sen",
        name: "陰旋法",
        root: "C",
        notes: [
          "C",
          "Db",
          "F",
          "G",
          "Bb"
        ]
      },

      {
        id: "yo-sen",
        name: "陽旋法",
        root: "C",
        notes: [
          "C",
          "D",
          "F",
          "G",
          "A"
        ]
      }

    ],


    /* =========================
       WORLD
    ========================== */

    World: [

      {
        id: "spanish",
        name: "Spanish",
        root: "E",
        notes: [
          "E",
          "F",
          "G#",
          "A",
          "B",
          "C",
          "D"
        ]
      },

      {
        id: "hirajoshi-world",
        name: "Hirajoshi",
        root: "C",
        notes: [
          "C",
          "Db",
          "F",
          "G",
          "Ab"
        ]
      },

      {
        id: "penta",
        name: "C# Panta",
        root: "C#",
        notes: [
          "C#",
          "D#",
          "F#",
          "G#",
          "A#"
        ]
      }

    ],


    /* =========================
       CUSTOM
    ========================== */

    Custom: []

  }

};


/* =========================================================
   STATE
   ========================================================= */

let state = loadState();


function clone(obj) {

  return JSON.parse(
    JSON.stringify(obj)
  );

}


function loadState() {

  try {

    const saved =
      JSON.parse(
        localStorage.getItem(
          STORAGE_KEY
        )
      );

    if (!saved) {

      return clone(
        DEFAULT_STATE
      );

    }

    return mergeState(
      clone(DEFAULT_STATE),
      saved
    );

  }

  catch (e) {

    console.error(e);

    return clone(
      DEFAULT_STATE
    );

  }

}


function mergeState(
  base,
  saved
) {

  const out = {
    ...base,
    ...saved
  };

  out.players =
    saved.players ||
    base.players;

  out.scores =
    saved.scores ||
    base.scores;

  out.instructions =
    saved.instructions ||
    {};

  out.globalInstructions =
    saved.globalInstructions ||
    [];

  out.chatMessages =
    saved.chatMessages ||
    [];

  out.scales = {
    ...base.scales,
    ...(saved.scales || {})
  };

  out.scales.Custom =
    saved.scales &&
    saved.scales.Custom
      ? saved.scales.Custom
      : [];

  return out;

}


function persist() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );

  renderAll();

}


window.addEventListener(
  "storage",
  function (e) {

    if (
      e.key === STORAGE_KEY
    ) {

      state = loadState();

      renderAll();

    }

  }
);


/* =========================================================
   UTILITIES
   ========================================================= */

function now() {

  return new Date()
    .toLocaleTimeString(
      "ja-JP",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    );

}


function uid(
  prefix = "id"
) {

  return (
    prefix +
    "-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .slice(2, 7)
  );

}


/* =========================================================
   SCREEN
   ========================================================= */

function showScreen(id) {

  document
    .querySelectorAll(".screen")
    .forEach(
      function (screen) {

        screen.classList.add(
          "hidden"
        );

      }
    );

  const target =
    document.getElementById(id);

  if (target) {

    target.classList.remove(
      "hidden"
    );

  }

}


function enterParent() {

  showScreen(
    "parent-screen"
  );

  renderAll();

}


function enterChild() {

  if (
    !state.players[
      state.childPlayer
    ]
  ) {

    state.childPlayer =
      Object.keys(
        state.players
      )[0] || null;

    persist();

  }

  showScreen(
    "child-screen"
  );

  renderAll();

}


function backToRole() {

  showScreen(
    "role-screen"
  );

}


/* =========================================================
   RENDER
   ========================================================= */

function renderAll() {

  if (
    !document.getElementById(
      "parent-screen"
    )
  ) {

    return;

  }

  renderParent();

  renderChild();

}


function renderParent() {

  renderPlayers();

  renderScores();

  renderScoreEditor();

  renderScaleControls();

  renderScaleEditor();

  renderTimeline();

}


/* =========================================================
   PLAYERS
   ========================================================= */

function renderPlayers() {

  const container =
    document.getElementById(
      "parent-players"
    );

  container.innerHTML = "";


  Object.entries(
    state.players
  ).forEach(
    function ([id, player]) {

      const button =
        document.createElement(
          "button"
        );

      button.className =
        "player-button" +
        (
          state.selectedPlayer === id
            ? " selected"
            : ""
        );

      button.innerHTML =

        `<div class="player-name">
          ${escapeHtml(
            player.name
          )}
        </div>

        <div class="player-instrument-small">
          ${escapeHtml(
            player.instrument
          )}
        </div>`;


      button.onclick =
        function () {

          state.selectedPlayer =
            id;

          persist();

        };


      container.appendChild(
        button
      );

    }
  );


  const editor =
    document.getElementById(
      "player-editor"
    );


  if (
    !state.selectedPlayer ||
    !state.players[
      state.selectedPlayer
    ]
  ) {

    editor.innerHTML =
      "<div>演奏者を選択すると編集できます。</div>";

    return;

  }


  const player =
    state.players[
      state.selectedPlayer
    ];


  editor.innerHTML =

    `<h3>
      選択中の演奏者を編集
    </h3>

    <label>
      奏者名
      <input
        id="edit-player-name"
        value="${attr(
          player.name
        )}">
    </label>

    <label>
      楽器名
      <input
        id="edit-player-instrument"
        value="${attr(
          player.instrument
        )}">
    </label>

    <div class="editor-actions">

      <button
        onclick="savePlayer()">
        保存
      </button>

      <button
        class="danger"
        onclick="deleteSelectedPlayer()">
        削除
      </button>

    </div>`;

}


function addPlayer() {

  let i = 1;

  while (
    state.players[
      "P" + i
    ]
  ) {

    i++;

  }

  const id =
    "P" + i;


  state.players[id] = {

    name: id,

    instrument: "未設定"

  };


  state.selectedPlayer =
    id;


  persist();

}


function savePlayer() {

  const id =
    state.selectedPlayer;


  if (
    !id ||
    !state.players[id]
  ) {

    return;

  }


  state.players[id].name =

    document
      .getElementById(
        "edit-player-name"
      )
      .value
      .trim() || id;


  state.players[id].instrument =

    document
      .getElementById(
        "edit-player-instrument"
      )
      .value
      .trim() ||
    "未設定";


  persist();

}


function deleteSelectedPlayer() {

  const id =
    state.selectedPlayer;


  if (
    !id ||
    !state.players[id]
  ) {

    return;

  }


  if (
    !confirm(
      `${state.players[id].name} を削除しますか？`
    )
  ) {

    return;

  }


  delete state.players[id];

  delete state.instructions[id];


  const ids =
    Object.keys(
      state.players
    );


  state.selectedPlayer =
    ids[0] || null;


  if (
    state.childPlayer === id
  ) {

    state.childPlayer =
      ids[0] || null;

  }


  persist();

}


/* =========================================================
   SCORES
   ========================================================= */

function renderScores() {

  const container =
    document.getElementById(
      "score-list"
    );

  container.innerHTML = "";


  Object.entries(
    state.scores
  ).forEach(
    function ([id, score]) {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "score-button" +
        (
          Number(id) ===
          Number(
            state.selectedScore
          )
            ? " selected"
            : ""
        );


      button.innerHTML =

        `<strong>
          ${escapeHtml(
            score.title
          )}
        </strong>

        <br>

        ${escapeHtml(
          score.content
        )}`;


      button.onclick =
        function () {

          state.selectedScore =
            Number(id);

          persist();

        };


      container.appendChild(
        button
      );

    }
  );

}


function renderScoreEditor() {

  const score =
    state.scores[
      state.selectedScore
    ];


  if (!score) {

    return;

  }


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

  const score =
    state.scores[
      state.selectedScore
    ];


  if (!score) {

    return;

  }


  score.title =
    document.getElementById(
      "score-title"
    ).value;


  score.content =
    document.getElementById(
      "score-content"
    ).value;


  persist();

}


/* =========================================================
   INSTRUCTIONS
   ========================================================= */

function sendInstruction(
  instruction,
  broadcast = false
) {

  const time =
    now();


  if (broadcast) {

    state.globalInstructions
      .push({

        id: uid("ins"),

        instruction:

          instruction,

        time: time

      });


    state.chatMessages.push({

      id: uid("chat"),

      type: "instruction",

      sender: "親",

      target: "全員",

      text: instruction,

      time: time

    });


  }

  else {

    if (
      !state.selectedPlayer
    ) {

      alert(
        "演奏者を選択してください"
      );

      return;

    }


    if (
      !state.instructions[
        state.selectedPlayer
      ]
    ) {

      state.instructions[
        state.selectedPlayer
      ] = [];

    }


    state.instructions[
      state.selectedPlayer
    ].push({

      id: uid("ins"),

      instruction:
        instruction,

      time: time

    });


    const player =
      state.players[
        state.selectedPlayer
      ];


    state.chatMessages.push({

      id: uid("chat"),

      type: "instruction",

      sender: "親",

      target:
        player.name,

      text:
        instruction,

      time:
        time

    });

  }


  persist();

}


/* =========================================================
   TIMELINE
   ========================================================= */

function renderTimeline() {

  const container =
    document.getElementById(
      "chat-log"
    );

  container.innerHTML = "";


  state.chatMessages.forEach(
    function (message) {

      const div =
        document.createElement(
          "div"
        );


      div.className =
        "timeline-item";


      if (
        message.type ===
        "instruction"
      ) {

        div.innerHTML =

          `<span class="timeline-time">
            ${message.time}
          </span>

          <span class="timeline-tag">
            指示
          </span>

          <strong>
            ${escapeHtml(
              message.target
            )}
          </strong>

          ：${escapeHtml(
            message.text
          )}`;

      }

      else {

        div.innerHTML =

          `<span class="timeline-time">
            ${message.time}
          </span>

          <span class="timeline-tag">
            CHAT
          </span>

          <strong>
            ${escapeHtml(
              message.sender
            )}
          </strong>

          ：${escapeHtml(
            message.text
          )}`;

      }


      container.appendChild(
        div
      );

    }
  );


  container.scrollTop =
    container.scrollHeight;

}


function clearTimeline() {

  if (
    !confirm(
      "親側の指示・チャット履歴をすべて消去しますか？"
    )
  ) {

    return;

  }


  state.chatMessages = [];

  state.globalInstructions = [];


  Object.keys(
    state.instructions
  ).forEach(
    function (key) {

      state.instructions[key] = [];

    }
  );


  persist();

}


function sendParentChat() {

  const input =
    document.getElementById(
      "parent-chat-input"
    );


  const text =
    input.value.trim();


  if (!text) {

    return;

  }


  state.chatMessages.push({

    id: uid("chat"),

    type: "chat",

    sender: "親",

    text: text,

    time: now()

  });


  input.value = "";


  persist();

}


/* =========================================================
   CHILD
   ========================================================= */

function renderChild() {

  const ids =
    Object.keys(
      state.players
    );


  const list =
    document.getElementById(
      "child-player-list"
    );


  list.innerHTML = "";


  ids.forEach(
    function (id) {

      const player =
        state.players[id];


      const button =
        document.createElement(
          "button"
        );


      button.className =
        state.childPlayer === id
          ? "selected"
          : "";


      button.textContent =
        `${player.name} / ${player.instrument}`;


      button.onclick =
        function () {

          state.childPlayer =
            id;

          persist();

        };


      list.appendChild(
        button
      );

    }
  );


  const player =
    state.players[
      state.childPlayer
    ];


  document.getElementById(
    "child-player-name"
  ).textContent =
    player
      ? player.name
      : "—";


  document.getElementById(
    "child-instrument"
  ).textContent =
    player
      ? player.instrument
      : "—";


  const own =
    state.instructions[
      state.childPlayer
    ] || [];


  const latestOwn =
    own.length
      ? own[own.length - 1]
      : null;


  const latestGlobal =
    state.globalInstructions.length
      ? state.globalInstructions[
          state.globalInstructions.length - 1
        ]
      : null;


  document.getElementById(
    "child-instruction"
  ).textContent =

    latestOwn
      ? latestOwn.instruction
      : latestGlobal
        ? latestGlobal.instruction
        : "WAIT";


  renderChildHistory(
    "child-personal-instructions",
    own
  );


  renderChildHistory(
    "child-global-instructions",
    state.globalInstructions
  );


  const score =
    state.scores[
      state.selectedScore
    ];


  document.getElementById(
    "child-score-title"
  ).textContent =
    score
      ? score.title
      : "SCORE";


  document.getElementById(
    "child-score-content"
  ).textContent =
    score
      ? score.content
      : "";


  renderChildScale();

  renderChildChat();

}


function renderChildHistory(
  id,
  items
) {

  const container =
    document.getElementById(
      id
    );


  container.innerHTML = "";


  items
    .slice()
    .reverse()
    .forEach(
      function (item) {

        const div =
          document.createElement(
            "div"
          );


        div.className =
          "history-item";


        div.innerHTML =

          `<span class="timeline-time">
            ${item.time}
          </span>

          <strong>
            ${escapeHtml(
              item.instruction
            )}
          </strong>`;


        container.appendChild(
          div
        );

      }
    );

}


function renderChildChat() {

  const container =
    document.getElementById(
      "child-chat-log"
    );


  container.innerHTML = "";


  state.chatMessages.forEach(
    function (message) {

      const div =
        document.createElement(
          "div"
        );


      div.className =
        "timeline-item";


      if (
        message.type ===
        "instruction"
      ) {

        const ownTarget =
          state.players[
            state.childPlayer
          ]?.name;


        if (
          message.target !==
            "全員" &&
          message.target !==
            ownTarget
        ) {

          return;

        }


        div.innerHTML =

          `<span class="timeline-time">
            ${message.time}
          </span>

          <span class="timeline-tag">
            指示
          </span>

          <strong>
            ${escapeHtml(
              message.target
            )}
          </strong>

          ：${escapeHtml(
            message.text
          )}`;

      }

      else {

        div.innerHTML =

          `<span class="timeline-time">
            ${message.time}
          </span>

          <span class="timeline-tag">
            CHAT
          </span>

          <strong>
            ${escapeHtml(
              message.sender
            )}
          </strong>

          ：${escapeHtml(
            message.text
          )}`;

      }


      container.appendChild(
        div
      );

    }
  );


  container.scrollTop =
    container.scrollHeight;

}


function sendChildChat() {

  const input =
    document.getElementById(
      "child-chat-input"
    );


  const text =
    input.value.trim();


  if (!text) {

    return;

  }


  const player =
    state.players[
      state.childPlayer
    ];


  state.chatMessages.push({

    id: uid("chat"),

    type: "chat",

    sender:
      player
        ? player.name
        : "子",

    text:
      text,

    time:
      now()

  });


  input.value = "";


  persist();

}


/* =========================================================
   SCALE
   ========================================================= */

function categories() {

  return Object.keys(
    state.scales
  );

}


function renderScaleControls() {

  const category =
    document.getElementById(
      "scale-category"
    );


  const select =
    document.getElementById(
      "scale-select"
    );


  category.innerHTML = "";


  categories().forEach(
    function (name) {

      const option =
        document.createElement(
          "option"
        );

      option.value = name;

      option.textContent =
        name;

      category.appendChild(
        option
      );

    }
  );


  category.value =
    state.currentScale.category;


  const list =
    state.scales[
      state.currentScale.category
    ] || [];


  select.innerHTML = "";


  list.forEach(
    function (scale) {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        scale.id;

      option.textContent =
        scale.name;

      select.appendChild(
        option
      );

    }
  );


  if (
    list.some(
      function (scale) {

        return (
          scale.id ===
          state.currentScale.id
        );

      }
    )
  ) {

    select.value =
      state.currentScale.id;

  }

  else if (
    list[0]
  ) {

    state.currentScale.id =
      list[0].id;

    select.value =
      list[0].id;

  }


  previewScale();

}


function renderScaleList() {

  const category =
    document.getElementById(
      "scale-category"
    ).value;


  const list =
    state.scales[
      category
    ] || [];


  const select =
    document.getElementById(
      "scale-select"
    );


  select.innerHTML = "";


  list.forEach(
    function (scale) {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        scale.id;

      option.textContent =
        scale.name;

      select.appendChild(
        option
      );

    }
  );


  if (list[0]) {

    state.currentScale = {

      category:
        category,

      id:
        list[0].id

    };

  }


  previewScale();

  renderScaleEditor();

}


function getSelectedScale() {

  const list =
    state.scales[
      state.currentScale.category
    ] || [];


  return list.find(
    function (scale) {

      return (
        scale.id ===
        state.currentScale.id
      );

    }
  ) || list[0];

}


function previewScale() {

  const category =
    document.getElementById(
      "scale-category"
    ).value;


  const id =
    document.getElementById(
      "scale-select"
    ).value;


  state.currentScale = {

    category:
      category,

    id:
      id

  };


  const scale =
    getSelectedScale();


  const preview =
    document.getElementById(
      "scale-preview"
    );


  if (!scale) {

    preview.innerHTML =
      "スケールがありません";

    renderScaleEditor();

    return;

  }


  preview.innerHTML =

    `<div class="scale-name">
      ${escapeHtml(
        scale.name
      )}
    </div>

    <div class="scale-notes">
      ${scale.notes
        .map(
          escapeHtml
        )
        .join(" — ")}
    </div>`;


  renderScaleEditor();

}


function sendScale() {

  const scale =
    getSelectedScale();


  if (!scale) {

    return;

  }


  const time =
    now();


  state.currentScale = {

    category:
      document.getElementById(
        "scale-category"
      ).value,

    id:
      scale.id

  };


  state.chatMessages.push({

    id:
      uid("chat"),

    type:
      "instruction",

    sender:
      "親",

    target:
      "全員",

    text:
      `SCALE: ${scale.name} / ${scale.notes.join(" ")}`,

    time:
      time

  });


  persist();

}


function renderChildScale() {

  const scale =
    getSelectedScale();


  const container =
    document.getElementById(
      "child-scale"
    );


  if (!scale) {

    container.textContent =
      "—";

    return;

  }


  container.innerHTML =

    `<div class="scale-name">
      ${escapeHtml(
        scale.name
      )}
    </div>

    <div class="scale-notes">
      ${scale.notes
        .map(
          escapeHtml
        )
        .join(" — ")}
    </div>`;

}


/* =========================================================
   SCALE EDITOR
   ========================================================= */

function renderScaleEditor() {

  const container =
    document.getElementById(
      "scale-editor"
    );


  if (!container) {

    return;

  }


  const category =
    state.currentScale.category;


  const scale =
    getSelectedScale();


  if (!scale) {

    container.innerHTML =

      `<button
        onclick="addCustomScale()">
        ＋ Customを追加
      </button>`;

    return;

  }


  const removable =
    category === "Custom" ||
    category === "Favorite";


  container.innerHTML =

    `<label>
      名前
      <input
        id="scale-edit-name"
        value="${attr(
          scale.name
        )}">
    </label>

    <label>
      ルート
      <input
        id="scale-edit-root"
        value="${attr(
          scale.root || ""
        )}">
    </label>

    <label>
      構成音（スペース区切り）
      <input
        id="scale-edit-notes"
        value="${attr(
          (
            scale.notes || []
          ).join(" ")
        )}">
    </label>

    <div class="editor-actions">

      <button
        onclick="saveScale()">
        保存
      </button>

      ${
        removable

          ? `<button
               class="danger"
               onclick="deleteScale()">
               削除
             </button>`

          : ""
      }

      ${
        category === "Custom"

          ? `<button
               onclick="addCustomScale()">
               ＋ Customを追加
             </button>`

          : ""
      }

    </div>`;

}


function saveScale() {

  const scale =
    getSelectedScale();


  if (!scale) {

    return;

  }


  scale.name =
    document
      .getElementById(
        "scale-edit-name"
      )
      .value
      .trim() ||
    "Untitled";


  scale.root =
    document
      .getElementById(
        "scale-edit-root"
      )
      .value
      .trim();


  scale.notes =
    document
      .getElementById(
        "scale-edit-notes"
      )
      .value
      .trim()
      .split(/\s+/)
      .filter(Boolean);


  persist();

}


function addCustomScale() {

  const id =
    uid("scale");


  state.scales.Custom.push({

    id:
      id,

    name:
      "Custom Scale",

    root:
      "C",

    notes: [
      "C",
      "D",
      "E",
      "G",
      "A"
    ]

  });


  state.currentScale = {

    category:
      "Custom",

    id:
      id

  };


  persist();

}


function deleteScale() {

  const category =
    state.currentScale.category;


  if (
    ![
      "Custom",
      "Favorite"
    ].includes(category)
  ) {

    return;

  }


  const list =
    state.scales[
      category
    ];


  const index =
    list.findIndex(
      function (scale) {

        return (
          scale.id ===
          state.currentScale.id
        );

      }
    );


  if (index < 0) {

    return;

  }


  if (
    !confirm(
      `${list[index].name} を削除しますか？`
    )
  ) {

    return;

  }


  list.splice(
    index,
    1
  );


  state.currentScale = {

    category:
      category,

    id:
      list[0]
        ? list[0].id
        : ""

  };


  persist();

}


/* =========================================================
   ESCAPE
   ========================================================= */

function escapeHtml(value) {

  return String(
    value ?? ""
  ).replace(
    /[&<>"']/g,

    function (match) {

      return {

        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"

      }[match];

    }
  );

}


function attr(value) {

  return escapeHtml(
    value
  ).replace(
    /`/g,
    "&#96;"
  );

}


/* =========================================================
   START
   ========================================================= */

showScreen(
  "role-screen"
);

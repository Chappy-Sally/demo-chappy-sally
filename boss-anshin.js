const anshinImageBase =
  "https://raw.githubusercontent.com/Chappy-Sally/chappy-sally-images/main/anshin/";

const anshinCards = [
  {
    name:"人の目が気になる",
    file:"as_people_eyes.png"
  },
  {
    name:"完璧でなきゃ",
    file:"as_perfection.png"
  },
  {
    name:"失敗したくない",
    file:"as_fear_of_failure.png"
  },
  {
    name:"自信がない",
    file:"as_low_confidence.png"
  },
  {
    name:"比較しちゃう",
    file:"as_comparison.png"
  },
  {
    name:"焦っちゃう",
    file:"as_impatience.png"
  },
  {
    name:"不安でしかたない",
    file:"as_anxiety.png"
  },
  {
    name:"執着しちゃう",
    file:"as_attachment.png"
  },
  {
    name:"過去が気になる",
    file:"as_past.png"
  },
  {
    name:"未来が心配",
    file:"as_future_worry.png"
  },
  {
    name:"お金が不安",
    file:"as_money.png"
  },
  {
    name:"頑張りすぎちゃう",
    file:"as_overwork.png"
  },
  {
    name:"悪い気がする",
    file:"as_guilt.png"
  },
  {
    name:"あきらめ「もうムリ…」",
    file:"as_give_up.png"
  },
  {
    name:"我慢しなきゃー",
    file:"as_endurance.png"
  },
  {
    name:"やらなきゃっ",
    file:"as_obligation.png"
  },
  {
    name:"遠慮します",
    file:"as_hesitation.png"
  },
  {
    name:"私に戻る",
    file:"as_return.png"
  },
  {
    name:"どうせ私なんて…",
    file:"as_hopeless.png"
  },
  {
    name:"決められない",
    file:"as_indecision.png"
  },
  {
    name:"思い込んじゃう",
    file:"as_belief.png"
  },
  {
    name:"認められたい！",
    file:"as_need_approval.png"
  },
  {
    name:"ちゃんとしなきゃ",
    file:"as_should.png"
  }
];

let selectedCards = [];


/* カードをランダムに選ぶ */
function getRandomItems(list, count){
  return [...list]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}


/* 安心カードを1枚引く */
function drawBossOne(){
  selectedCards = getRandomItems(anshinCards, 1);

  showCards([
    "今の思い込み"
  ]);

  checkReady();
}


/* 安心カードを3枚引く */
function drawBossThree(){
  selectedCards = getRandomItems(anshinCards, 3);

  showCards([
    "今の思い込み",
    "隠れ思い込み",
    "安心に戻るヒント"
  ]);

  checkReady();
}


/* 引いたカードを画面に表示する */
function showCards(labels){
  const area = document.getElementById("cardsArea");

  if(!area){
    return;
  }

  area.innerHTML = "";
  area.classList.remove("hidden");

  selectedCards.forEach((card, index) => {
    const box = document.createElement("div");
    box.className = "mini-card";

    const img = document.createElement("img");
    img.src = anshinImageBase + card.file;
    img.alt = card.name;

    img.onerror = function(){
      this.alt = card.name + "の画像を読み込めませんでした";
    };

    const label = document.createElement("div");
    label.className = "card-label";
    label.textContent = labels[index] || "思い込み";

    const name = document.createElement("div");
    name.className = "card-name";
    name.textContent = card.name;

    box.appendChild(img);
    box.appendChild(label);
    box.appendChild(name);

    area.appendChild(box);
  });
}


/* 入力とカードがそろったらコピーボタンを使えるようにする */
function checkReady(){
  const themeInput = document.getElementById("theme");
  const blocksInput = document.getElementById("blocks");
  const copyBtn = document.getElementById("copyBtn");

  if(!themeInput || !blocksInput || !copyBtn){
    return;
  }

  const theme = themeInput.value.trim();
  const blocks = blocksInput.value.trim();

  copyBtn.disabled =
    !(theme && blocks && selectedCards.length > 0);
}


/* 引いたカードをコピー用の文章にする */
function buildCardText(){
  if(selectedCards.length === 1){
    return `今の思い込み：${selectedCards[0].name}`;
  }

  const labels = [
    "今の思い込み",
    "隠れ思い込み",
    "安心に戻るヒント"
  ];

  return selectedCards
    .map((card, index) => {
      return `${labels[index]}：${card.name}`;
    })
    .join("\n");
}


/* チャッピーGPTへ貼る文章を作る */
function buildPrompt(){
  const themeInput = document.getElementById("theme");
  const blocksInput = document.getElementById("blocks");

  const theme = themeInput
    ? themeInput.value.trim()
    : "";

  const blocks = blocksInput
    ? blocksInput.value.trim()
    : "";

  const memoryChecks = JSON.parse(
    localStorage.getItem("memoryChecks") || "[]"
  );

  const memoryText =
    localStorage.getItem("memoryText") || "";

  let memorySection = "";

  if(memoryChecks.length > 0 || memoryText.trim()){
    memorySection += `\n【子どもの頃や過去について】\n`;

    if(memoryChecks.length > 0){
      memoryChecks.forEach(item => {
        memorySection += `・${item}\n`;
      });
    }

    if(memoryText.trim()){
      memorySection += `\n【思い出したこと】\n`;
      memorySection += `${memoryText.trim()}\n`;
    }
  }

  return `カードを引いたよ🌿

【テーマ】
${theme}

【今のブレーキ】
${blocks}
${memorySection}
【カード】
${buildCardText()}
`;
}


/* 作った文章をコピーする */
function copyPrompt(){
  const text = buildPrompt();

  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("チャッピーGPTへ貼る文章をコピーしたよ🐶💕");
    })
    .catch(() => {
      alert(
        "コピーできませんでした。手動でコピーしてください🙏"
      );
    });
}


/* 入力されるたびにコピーボタンを確認する */
window.addEventListener("DOMContentLoaded", () => {
  const themeInput = document.getElementById("theme");
  const blocksInput = document.getElementById("blocks");

  if(themeInput){
    themeInput.addEventListener("input", checkReady);
  }

  if(blocksInput){
    blocksInput.addEventListener("input", checkReady);
  }

  checkReady();
});

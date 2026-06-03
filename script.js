const params = new URLSearchParams(location.search);
const type = params.get("type") || "parentChild";

const quizInfo = {
  parentChild:{
    title:"親子なの誰？",
    desc:"戦国武将の親子関係を当てるクイズ"
  },
  badRelations:{
    title:"実は仲悪かった武将",
    desc:"不仲・対立した武将を当てよう"
  },
  marriage:{
    title:"政略結婚クイズ",
    desc:"戦国時代の婚姻関係を当てるクイズ"
  },
  lordVassal:{
    title:"この主従関係、誰？",
    desc:"主君と家臣の関係を当てよう"
  },
  betrayed:{
    title:"裏切られすぎ武将クイズ",
    desc:"裏切りや離反に苦しんだ人物を当てよう"
  },
  relatives:{
    title:"実は親戚だった武将",
    desc:"意外な血縁・姻戚関係を当てよう"
  },
  nobunagaTarget:{
    title:"織田信長に殺されかけた人物クイズ",
    desc:"信長と危険な関係にあった人物を当てよう"
  }
};

const quizData = window.quizData || {};
const allQuestions = quizData[type] || quizData.parentChild || [];

let questions = shuffle([...allQuestions]).slice(0, 50);
let current = 0;
let score = 0;
let answered = false;

const titleEl = document.getElementById("title");
const descEl = document.getElementById("desc");
const menuEl = document.getElementById("menu");
const countEl = document.getElementById("count");
const scoreEl = document.getElementById("score");
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const resultEl = document.getElementById("result");
const barEl = document.getElementById("bar");

titleEl.textContent = quizInfo[type]?.title || "戦国人間関係クイズ";
descEl.textContent = quizInfo[type]?.desc || "";

Object.keys(quizInfo).forEach(key=>{
  const a = document.createElement("a");
  a.href = `?type=${key}`;
  a.textContent = quizInfo[key].title;
  if(key === type) a.classList.add("active");
  menuEl.appendChild(a);
});

function showQuestion(){
  answered = false;

  if(current >= questions.length){
    questionEl.textContent = "クイズ終了！";
    choicesEl.innerHTML = "";
    resultEl.textContent = `${questions.length}問中 ${score}問正解！`;
    countEl.textContent = "終了";
    barEl.style.width = "100%";
    return;
  }

  const q = questions[current];

  countEl.textContent = `${current + 1} / ${questions.length}`;
  scoreEl.textContent = `スコア:${score}`;
  questionEl.textContent = q.question;
  resultEl.textContent = "";
  choicesEl.innerHTML = "";

  shuffle([...q.choices]).forEach(choice=>{
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = choice;
    btn.onclick = () => answer(btn, choice, q.answer, q.explain);
    choicesEl.appendChild(btn);
  });

  barEl.style.width = `${(current / questions.length) * 100}%`;
}

function answer(btn, choice, answer, explain){
  if(answered) return;
  answered = true;

  document.querySelectorAll(".choice").forEach(b=>{
    if(b.textContent === answer) b.classList.add("correct");
    if(b === btn && choice !== answer) b.classList.add("wrong");
  });

  if(choice === answer){
    score++;
    resultEl.textContent = `正解！ ${explain || ""}`;
  }else{
    resultEl.textContent = `不正解。正解は「${answer}」。${explain || ""}`;
  }

  scoreEl.textContent = `スコア:${score}`;

  setTimeout(()=>{
    current++;
    showQuestion();
  }, 1200);
}

function shuffle(arr){
  for(let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

showQuestion();
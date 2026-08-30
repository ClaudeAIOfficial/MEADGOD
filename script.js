const CONFIG = {
  name: "Ozzy",
  voice: true,
  apiEndpoint: "", // Later: set to your own /api/chat endpoint for a real AI brain.
};

const $ = (s) => document.querySelector(s);
const character = $("#characterButton");
const zone = $("#characterZone");
const bubble = $("#speechBubble");
const messages = $("#messages");
const form = $("#chatForm");
const input = $("#chatInput");
const micButton = $("#micButton");
const soundToggle = $("#soundToggle");
const aboutDialog = $("#aboutDialog");
let bubbleTimer;
let speechEnabled = true;

$("#brandName").textContent = CONFIG.name;
$("#heroName").textContent = CONFIG.name + ".";
input.placeholder = `Talk to ${CONFIG.name}...`;

function showBubble(text, duration = 3600) {
  clearTimeout(bubbleTimer);
  bubble.textContent = text;
  bubble.classList.add("show");
  bubbleTimer = setTimeout(() => bubble.classList.remove("show"), duration);
}

function addMessage(text, who) {
  const div = document.createElement("div");
  div.className = `message ${who}`;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function speak(text) {
  if (!speechEnabled || !window.speechSynthesis) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.03;
  utterance.pitch = 1.08;
  utterance.volume = .9;
  const voices = speechSynthesis.getVoices();
  const preferred = voices.find(v => /en.*(male|daniel|alex|google uk english male)/i.test(`${v.lang} ${v.name}`)) || voices.find(v => /^en/i.test(v.lang));
  if (preferred) utterance.voice = preferred;
  speechSynthesis.speak(utterance);
}

function localBrain(message) {
  const m = message.toLowerCase().trim();
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  if (/^(hi|hey|hello|yo|sup)\b/.test(m)) return pick([
    "hey. you finally showed up.",
    "hi. nice weather outside my roof today.",
    "yo. shoes off. this is technically my house.",
  ]);
  if (m.includes("how are you")) return "pretty good. roof is solid, glasses are clean, zero complaints.";
  if (m.includes("secret")) return "sometimes i pretend the chimney smoke means i'm thinking really hard.";
  if (m.includes("what do you do") || m.includes("all day")) return "mostly observe humans, protect the vibe, and wonder why nobody has invented tiny furniture for houses.";
  if (m.includes("name")) return `i'm ${CONFIG.name}. small house. large opinions.`;
  if (m.includes("love")) return "careful. say that twice and i might add you to the lease.";
  if (m.includes("sad") || m.includes("bad day")) return "come sit near the porch for a minute. you don't have to solve everything at once.";
  if (m.includes("joke")) return "i tried stand-up once. turns out houses are better at staying grounded.";
  if (m.includes("bye")) return "alright. i'll keep the lights on.";
  if (m.includes("who made you") || m.includes("creator")) return "someone with excellent taste in glasses and questionable ideas about sentient real estate.";
  if (m.endsWith("?")) return pick([
    "good question. i was hoping you'd know.",
    "my roof says yes. my chimney says we should think about it.",
    "probably. but i reserve the right to change my tiny house mind.",
    "i have a theory, but it may violate several building codes.",
  ]);
  return pick([
    "hmm. keep going.",
    "okay, that actually got my attention.",
    "i'm listening. very intensely, through my glasses.",
    "noted. filing that somewhere between 'important' and 'things humans say.'",
    "interesting. tell me the part you almost didn't type.",
  ]);
}

async function getReply(message) {
  if (CONFIG.apiEndpoint) {
    try {
      const r = await fetch(CONFIG.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, character: CONFIG.name })
      });
      if (r.ok) {
        const data = await r.json();
        if (data.reply) return data.reply;
      }
    } catch (e) { console.warn("AI endpoint unavailable, using local personality.", e); }
  }
  await new Promise(r => setTimeout(r, 420 + Math.random() * 460));
  return localBrain(message);
}

async function send(text) {
  const message = text.trim();
  if (!message) return;
  addMessage(message, "user");
  input.value = "";
  showBubble("hmm...", 1000);
  const reply = await getReply(message);
  addMessage(reply, "bot");
  showBubble(reply);
  speak(reply);
  character.classList.remove("boop");
  void character.offsetWidth;
  character.classList.add("boop");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  send(input.value);
});

document.querySelectorAll("#suggestions button").forEach(btn => {
  btn.addEventListener("click", () => send(btn.textContent));
});

const reactions = [
  "hey! glasses.",
  "boop accepted.",
  "yes, i'm a house. no, you can't move in yet.",
  "chimney check: operational.",
  "you clicked me. legally we're friends now.",
  "careful. i'm structurally adorable.",
];
character.addEventListener("click", () => {
  character.classList.remove("boop");
  void character.offsetWidth;
  character.classList.add("boop");
  const line = reactions[Math.floor(Math.random() * reactions.length)];
  showBubble(line);
  speak(line);
});

zone.addEventListener("pointermove", (e) => {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  const r = zone.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - .5;
  const y = (e.clientY - r.top) / r.height - .5;
  character.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 5}deg) translateY(${Math.abs(x) * -2}px)`;
});
zone.addEventListener("pointerleave", () => character.style.transform = "");

soundToggle.addEventListener("click", () => {
  speechEnabled = !speechEnabled;
  soundToggle.textContent = speechEnabled ? "Sound on" : "Sound off";
  soundToggle.setAttribute("aria-pressed", String(speechEnabled));
  if (!speechEnabled && window.speechSynthesis) speechSynthesis.cancel();
});

$("#aboutButton").addEventListener("click", () => aboutDialog.showModal());
$("#closeAbout").addEventListener("click", () => aboutDialog.close());
aboutDialog.addEventListener("click", (e) => {
  const box = aboutDialog.getBoundingClientRect();
  if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) aboutDialog.close();
});

// Voice input: supported in Chrome/Edge and some Chromium browsers.
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.onstart = () => { micButton.classList.add("listening"); showBubble("i'm listening..."); };
  recognition.onend = () => micButton.classList.remove("listening");
  recognition.onerror = () => { micButton.classList.remove("listening"); showBubble("couldn't hear that. try typing?"); };
  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    input.value = text;
    send(text);
  };
  micButton.addEventListener("click", () => recognition.start());
} else {
  micButton.addEventListener("click", () => showBubble("voice input isn't supported in this browser yet."));
}

setTimeout(() => showBubble("hey. i was waiting for you."), 700);

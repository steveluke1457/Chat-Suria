const chatlog = document.getElementById("chatlog");
const historyList = document.getElementById("historyList");
const API_URL = "https://chatbot-backend-production.up.railway.app/api/chat";

let history = JSON.parse(localStorage.getItem("chatHistory") || "[]");

function renderHistory() {
  historyList.innerHTML = "";
  history.forEach((entry, index) => {
    const li = document.createElement("li");
    li.textContent = entry.user.slice(0, 30);
    li.onclick = () => loadConversation(index);
    historyList.appendChild(li);
  });
}

function loadConversation(index) {
  const conversation = history[index];
  chatlog.innerHTML = "";
  addMessage("user", conversation.user);
  addMessage("bot", conversation.bot);
}

function addMessage(role, content) {
  const msg = document.createElement("div");
  msg.className = `message ${role}`;
  msg.innerHTML = `<strong>${role === "user" ? "You" : "Bot"}:</strong> ${content}`;
  chatlog.appendChild(msg);
  chatlog.scrollTop = chatlog.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const userMessage = input.value.trim();
  if (!userMessage) return;

  addMessage("user", userMessage);
  input.value = "";

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: userMessage }]
    })
  });

  const data = await response.json();
  const botReply = data.choices[0].message.content;
  addMessage("bot", botReply);

  history.push({ user: userMessage, bot: botReply });
  localStorage.setItem("chatHistory", JSON.stringify(history));
  renderHistory();
}

function clearHistory() {
  localStorage.removeItem("chatHistory");
  history = [];
  renderHistory();
  chatlog.innerHTML = "";
}

renderHistory();

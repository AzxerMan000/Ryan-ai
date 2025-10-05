const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const clearChatBtn = document.getElementById("clearChat");

let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

function renderChat() {
  chatBox.innerHTML = "";
  chatHistory.forEach(msg => {
    const div = document.createElement("div");
    div.className = `message ${msg.role}`;
    div.textContent = msg.text;
    chatBox.appendChild(div);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  chatHistory.push({ role: "user", text });
  renderChat();
  userInput.value = "";

  const loadingDiv = document.createElement("div");
  loadingDiv.className = "message bot";
  loadingDiv.textContent = "Thinking...";
  chatBox.appendChild(loadingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history: chatHistory }),
    });

    const data = await res.json();
    chatHistory.push({ role: "bot", text: data.reply || "(No response)" });
  } catch (err) {
    chatHistory.push({ role: "bot", text: "Error connecting to server." });
  }

  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  renderChat();
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

clearChatBtn.addEventListener("click", () => {
  chatHistory = [];
  localStorage.removeItem("chatHistory");
  renderChat();
});

renderChat();

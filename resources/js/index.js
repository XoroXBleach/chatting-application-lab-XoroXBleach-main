const nameInput = document.getElementById("my-name-input");
const myMessage = document.getElementById("my-message-input");
const sendButton = document.getElementById("send-button");
const chatBox = document.getElementById("chat");
const serverURL = `https://it3049c-chat.fly.dev/messages`;

function addMessageToDOM(message) {
  const formattedMessage = formatMessage(message, nameInput.value);
  chatBox.innerHTML += formattedMessage;
}


function formatMessage(message, myNameInput) {
  const time = new Date(message.timestamp);
  const formattedTime = `${time.getHours()}:${time.getMinutes()}`;

  if (myNameInput === message.sender) {
    return `
      <div class="mine messages">
        <div class="message">
          ${message.text}
        </div>
        <div class="sender-info">
          ${formattedTime}
        </div>
      </div>
    `;
  } else {
    return `
      <div class="yours messages">
        <div class="message">
          ${message.text}
        </div>
        <div class="sender-info">
          ${message.sender} ${formattedTime}
        </div>
      </div>
    `;
  }
}



async function updateMessages() {
  const messages = await fetchMessages();
  let formattedMessages = "";
  messages.forEach(message => {
    formattedMessages += formatMessage(message, nameInput.value);
  });
  chatBox.innerHTML = formattedMessages;
}


sendButton.addEventListener("click", function(event) {
  event.preventDefault();
  const sender = nameInput.value;
  const message = myMessage.value;
  sendMessages(sender, message);
  myMessage.value = "";
});

async function fetchMessages() {
  const response = await fetch(serverURL);
  return response.json();
}

function sendMessages(username, text) {
  const newMessage = {
    sender: username,
    text: text,
    timestamp: new Date().toISOString()
    
  };
  
  addMessageToDOM(newMessage);

  fetch(serverURL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newMessage)
  });
  updateMessages();
}

updateMessages();
document.addEventListener("DOMContentLoaded", async () => {
  await updateMessages();
  setInterval(updateMessages, 10000);
});

import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(eLement) {
eLement.textContent = '';

loadInterval = setInterval(() => {
  eLement.textContent += '.';

  if (eLement.textContent === '....'){
    eLement.textContent = '';
  }
}, 300)
}

function typeText(eLement, text){
  let index = 0;

  let interval = setInterval(() => {
    if(index < text.length) {
      eLement.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20)
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe (isAi, value, UniqueId) {
  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
    <div class="chat">
    <div className="profile">
    <img
    src="${isAi ? bot : user}"
    alt="${isAi ? 'bot' : 'user'}"
    />
    </div>
    <div class="message" id=${UniqueId}>${value}</div>
    </div>
    </div>
    `
  )
}

const handleSubmit = async (e) => {
e.preventDefault();

const data = new FormData(form);

//user chatstripe
chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

form.reset();

// bot chatstripe
const uniqueId = generateUniqueId();
chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

chatContainer.scrollTop = chatContainer.scrollHeight;

const messageDiv = document.getElementById(uniqueId);

loader(messageDiv);

// fetch data from server -> bot response

const response = await fetch('https://codex-7guu.onrender.com', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: data.get('prompt')
  })
})

clearInterval(loadInterval);
messageDiv.innerHTML = '';

if(response.ok) {
const data = await response.json();
const parsedData = data.bot.trim();

typeText(messageDiv, parsedData);
} else {
  const err = await response.text();

  messageDiv.innerHTML = "Something went wrong";

  alert(err);
}
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})

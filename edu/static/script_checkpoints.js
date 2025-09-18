const container = document.getElementById('cards-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const cpHeading = document.getElementById('cp-heading');
const cpElement = document.getElementById('checkpoint-data').dataset.cp;
const lang = document.getElementById('lang').dataset.lang;

let cards = [];
let currentIndex = 0;

// Fetch data from backend API
async function fetchCards() {
try {
    console.log('checkpoint:', cpElement);
const response = await fetch("/get_content", {
    method: "POST",
    headers: {
    "Content-Type": "application/json"
    },
    body: JSON.stringify({ 'lsn': 'lsn1', 'cp': cpElement })
});
if (!response.ok) throw new Error('Failed to fetch cards');
    data = await response.json();
    cards = data.cards;
    cpHeading.textContent = await changeLanguage(data.heading);
    renderCard(currentIndex);
} catch (err) {
console.error('Error loading cards:', err);
container.innerHTML = '<p style="color:white">Failed to load content</p>';
}
}

// Render a single card by index
async function renderCard(index) {
const card = cards[index];
if (!card) return;

    const translatedText = await changeLanguage(card.info);  // Await here
    const translatedheading = await changeLanguage(card.heading);

container.innerHTML = `
<div class="card">
<img src="data:image/jpeg;base64,${card.image_base64}" alt="${card.heading}" />
<div class="card-content">
    <h3>${translatedheading}</h3>
    <p>${translatedText}</p>
</div>
</div>
`;
}

// Animate and navigate to another card
function navigate(direction) {
if ((direction === 'next' && currentIndex >= cards.length - 1) ||
(direction === 'prev' && currentIndex <= 0)) return;

container.classList.add('slide-down-fade-out');

container.addEventListener('animationend', function handler() {
container.classList.remove('slide-down-fade-out');

// Change card index
currentIndex += direction === 'next' ? 1 : -1;
renderCard(currentIndex);

container.classList.add('slide-up-fade-in');
container.removeEventListener('animationend', handler);

container.addEventListener('animationend', function handler2() {
container.classList.remove('slide-up-fade-in');
container.removeEventListener('animationend', handler2);
});
});
}

prevBtn.addEventListener('click', () => navigate('prev'));
nextBtn.addEventListener('click', () => navigate('next'));

// Initialize on page load
fetchCards();

async function changeLanguage(card) {
      const encodedText = encodeURIComponent(card);

      if (lang=='en'){
        return card;
      }

      console.log(lang)

      let email = 'chat241289@gmail.com';

      const apiUrl = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${'en'}|${lang}&de=${email}`;

      try {
        const res = await fetch(apiUrl);
        const data = await res.json();

        let translatedText = data.responseData.translatedText;

        // Return modified card
        return translatedText;
      } catch (error) {
        console.error("Translation error:", error);
        return card; // Fallback to original
      }
    }

const chatInput = document.getElementById('chat-input');

chatInput.addEventListener('input', function () {
  this.style.height = 'auto'; // reset height
  this.style.height = Math.min(this.scrollHeight, 96) + 'px'; // max 96px (4 lines * 24px)
});

const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');

chatForm.addEventListener('submit', function(event) {
  event.preventDefault();  // Prevent form reload

  const userInput = chatInput.value.trim();
  if (userInput === '') return;

  // Append user message to chat window
  const userMsg = document.createElement('div');
  userMsg.textContent = userInput;
  userMsg.style.color = '#fdfeffff';
  userMsg.style.padding = '10px 15px';
  userMsg.style.borderRadius = '15px';
  userMsg.style.marginBottom = '8px';
  userMsg.style.alignSelf = 'flex-end';
  userMsg.style.fontWeight = 'bold';
  userMsg.style.alignSelf = 'flex-end'; // pushes message to right
  userMsg.style.maxWidth = '70%';       // limits message width
  userMsg.style.overflowWrap = 'break-word'; 
  userMsg.style.border = '1.5px solid white';       // white border
  userMsg.style.boxShadow = '0 2px 8px rgba(255, 255, 255, 0.6)'; // white shadow with some blur
  userMsg.classList.add('user-message');
  chatMessages.appendChild(userMsg);
  
  chatInput.value = '';  // Clear input after sending
  chatInput.style.height = 'auto';  // Reset textarea height

  chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll down

  fetch('/get_chat_reply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ question: userInput })
  })
    .then(response => response.json())
    .then(data => {
      const botReply = data.reply || 'No reply received.';

      // Simple markdown to HTML converter (handles **bold**, line breaks, lists)
      function markdownToHtml(text) {
        if (!text) return '';

        // Escape HTML tags (optional but recommended)
        const escapeHtml = (str) =>
          str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        let escaped = escapeHtml(text);

        // Convert **bold** to <b> tags
        escaped = escaped.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

        // Convert numbered lists (simple approach)
        escaped = escaped.replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>');
        escaped = escaped.replace(/(<li>.*<\/li>)/gs, '<ol>$1</ol>');

        // Convert bullet points "-" or "*" at start of line to <li> in <ul>
        escaped = escaped.replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>');
        escaped = escaped.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

        // Convert double newlines to paragraph breaks
        escaped = escaped.replace(/\n{2,}/g, '</p><p>');

        // Convert single newlines to <br>
        escaped = escaped.replace(/\n/g, '<br>');

        // Wrap whole text in <p> for paragraphs
        return '<p>' + escaped + '</p>';
      }

      const botMsg = document.createElement('div');
      botMsg.innerHTML = markdownToHtml(botReply);

      botMsg.style.color = '#fdfeffff';
      botMsg.style.padding = '10px 15px';
      botMsg.style.borderRadius = '15px';
      botMsg.style.marginBottom = '8px';
      botMsg.style.fontWeight = 'bold';
      botMsg.style.maxWidth = '70%';       // limits message width
      botMsg.style.overflowWrap = 'break-word'; 
      botMsg.style.border = '1.5px solid white';       // white border
      botMsg.style.boxShadow = '0 2px 8px rgba(255, 255, 255, 0.6)'; // white shadow with some blur
      botMsg.classList.add('bot-message');

      chatMessages.appendChild(botMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    })
    .catch(error => {
      console.error('Error:', error);
      const errorMsg = document.createElement('div');
      errorMsg.textContent = '⚠️ Error connecting to chatbot.';
      errorMsg.style.color = 'red';
      errorMsg.style.alignSelf = 'center';
      chatMessages.appendChild(errorMsg);
    });

});

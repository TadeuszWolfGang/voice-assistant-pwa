// voice-assistant.js (updated to use proxy server)
const startButton = document.getElementById('startButton');
const resultArea = document.getElementById('result');

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'pl-PL';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

startButton.addEventListener('click', () => {
  resultArea.textContent = 'Słucham...';
  recognition.start();
});

recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript;
  resultArea.textContent = `📣 Ty: ${transcript}\n🤖 GPT myśli...`;

  try {
    const response = await fetch('https://twoj-serwer-proxy.com/api/gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Odpowiadasz krótko i zwięźle jak asystent głosowy.' },
          { role: 'user', content: transcript }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;
    resultArea.textContent = `📣 Ty: ${transcript}\n🤖 GPT: ${reply}`;
  } catch (error) {
    console.error('Błąd:', error);
    resultArea.textContent = 'Wystąpił problem z połączeniem z serwerem.';
  }
};

recognition.onerror = (event) => {
  resultArea.textContent = 'Błąd rozpoznawania mowy: ' + event.error;
};

/* Additional HTML head links for PWA assets */
const head = document.head;
const manifestLink = document.createElement('link');
manifestLink.rel = 'manifest';
manifestLink.href = '/manifest.json';
head.appendChild(manifestLink);

const iconLink = document.createElement('link');
iconLink.rel = 'icon';
iconLink.href = '/favicon.ico';
head.appendChild(iconLink);

const appleIcon = document.createElement('link');
appleIcon.rel = 'apple-touch-icon';
appleIcon.href = '/icon-192.png';
head.appendChild(appleIcon);

const metaTheme = document.createElement('meta');
metaTheme.name = 'theme-color';
metaTheme.content = '#9dd3df';
head.appendChild(metaTheme);

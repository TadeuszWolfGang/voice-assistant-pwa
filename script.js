
const startButton = document.getElementById('startButton');
const resultArea = document.getElementById('result');

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'pl-PL';
recognition.interimResults = false;

startButton.addEventListener('click', () => {
  recognition.start();
  resultArea.textContent = '🎤 Słucham...';
});

recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript;
  resultArea.textContent = `📣 Ty: ${transcript}\n🤖 GPT myśli...`;

  try {
    const response = await fetch('/api/gpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Odpowiadasz krótko i przyjaźnie, jak pies-asystent głosowy.' },
          { role: 'user', content: transcript }
        ]
      })
    });
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;
    resultArea.textContent = `📣 Ty: ${transcript}\n🤖 GPT: ${reply}`;

    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.lang = 'pl-PL';
    speechSynthesis.speak(utterance);
  } catch (err) {
    resultArea.textContent = '❌ Błąd: nie udało się uzyskać odpowiedzi.';
  }
};

recognition.onerror = (event) => {
  resultArea.textContent = '❌ Błąd rozpoznawania mowy: ' + event.error;
};

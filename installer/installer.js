let currentStep = 1;
const totalSteps = 4;

function nextStep() {
  if (currentStep < totalSteps) {
    document.getElementById(`step-${currentStep}`).classList.add('hidden');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
    currentStep++;
    document.getElementById(`step-${currentStep}`).classList.remove('hidden');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
  }
}

function runInstall() {
  const config = {
    postgres: {
      host: document.getElementById('pg-host').value,
      port: document.getElementById('pg-port').value,
      user: document.getElementById('pg-user').value,
      pass: document.getElementById('pg-pass').value,
      db: document.getElementById('pg-db').value,
    },
    admin: {
      email: document.getElementById('admin-email').value,
      pass: document.getElementById('admin-pass').value,
    },
  };

  const bar = document.getElementById('progress-bar');
  const status = document.getElementById('install-status');
  let progress = 0;

  const steps = [
    'Vérification de la connexion...',
    'Création du schéma PostgreSQL...',
    'Initialisation MongoDB...',
    'Création du compte administrateur...',
    'Installation terminée ✓',
  ];

  const interval = setInterval(() => {
    progress += 20;
    bar.style.width = progress + '%';
    status.textContent = steps[progress / 20 - 1];
    if (progress >= 100) {
      clearInterval(interval);
      fetch('install.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      }).catch(() => {});
    }
  }, 800);
}

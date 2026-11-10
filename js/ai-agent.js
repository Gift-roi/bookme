// BookMe Cameroun - Assistant IA & Concierge de Réservation (Vercel AI SDK + Moteur Local Temps Réel)

class BookMeAIAgent {
  constructor() {
    this.isOpen = false;
    this.isTyping = false;
    this.messages = [
      {
        role: 'assistant',
        text: 'Bonjour 👋 ! Je suis l\'**Assistant IA BookMe Cameroun** (propulsé par Vercel AI SDK). Dites-moi ce que vous cherchez à **Douala** (ex: *"Un barbier à Akwa"*, *"Beauté à Bonapriso"*, *"Moins de 10 000 FCFA"*, *"Comment payer par Orange Money ?"*) !',
        providers: []
      }
    ];
  }

  init() {
    const wrapper = document.createElement('div');
    wrapper.id = 'bookme-ai-widget';
    wrapper.className = 'no-print';
    document.body.appendChild(wrapper);
    this.render();
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.render();
    if (this.isOpen) {
      setTimeout(() => {
        const input = document.getElementById('ai-agent-input');
        if (input) input.focus();
      }, 80);
    }
  }

  askQuick(question) {
    this.sendPrompt(question);
  }

  async sendPrompt(rawPrompt) {
    const prompt = (rawPrompt || '').trim();
    if (!prompt || this.isTyping) return;

    this.messages.push({ role: 'user', text: prompt });
    this.isTyping = true;
    this.render();
    this.scrollToBottom();

    // 1. Tentative via l'endpoint Serverless Vercel AI SDK (/api/agent)
    let answeredByCloud = false;
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.text) {
          const matchedProviders = this.findMatchingProviders(prompt);
          this.messages.push({
            role: 'assistant',
            text: data.text,
            providers: matchedProviders.slice(0, 2)
          });
          answeredByCloud = true;
        }
      }
    } catch (_) {
      // En mode local ou hors AI Gateway, on utilise le moteur d'outils local branché sur window.bookMeStore
    }

    // 2. Exécution locale des outils sur la base temps réel BookMe Store
    if (!answeredByCloud) {
      await new Promise(r => setTimeout(r, 320));
      const reply = this.runLocalAgentTools(prompt);
      this.messages.push(reply);
    }

    this.isTyping = false;
    this.render();
    this.scrollToBottom();
  }

  findMatchingProviders(query) {
    const store = window.bookMeStore;
    if (!store) return [];
    const q = query.toLowerCase();
    const verified = store.db.providers.filter(p => p.verificationStatus === 'verified');

    return verified.filter(p => {
      const services = store.getProviderServices(p.id, true);
      const cat = store.db.categories.find(c => c.id === p.categoryId);
      const hay = [
        p.businessName,
        p.neighborhood,
        p.description,
        cat ? cat.name : '',
        ...services.map(s => s.name)
      ].join(' ').toLowerCase();

      const words = q.split(/\s+/).filter(w => w.length >= 3);
      return words.some(w => hay.includes(w));
    });
  }

  runLocalAgentTools(prompt) {
    const store = window.bookMeStore;
    const q = prompt.toLowerCase();

    // Question sur l'accès Administrateur
    if (q.includes('admin') || q.includes('administrateur') || q.includes('mot de passe')) {
      return {
        role: 'assistant',
        text: '🛡️ **Accès Console Administrateur BookMe** :\n• Cliquez directement sur le bouton **Admin** dans la barre du haut, ou\n• Connectez-vous avec **`admin@bookme.cm`** et le mot de passe **`adminpassword`**.',
        providers: []
      };
    }

    // Question sur Orange Money / MTN MoMo / Paiement
    if (q.includes('orange') || q.includes('mtn') || q.includes('momo') || q.includes('paiement') || q.includes('payer')) {
      return {
        role: 'assistant',
        text: '💳 **Modes de paiement sur BookMe Cameroun** :\n1. **Orange Money** & **MTN Mobile Money (MoMo)** : disponibles chez tous nos partenaires Pro & Business avec génération immédiate d\'une référence de transaction (`RG15`).\n2. **Paiement sur place** : vous réservez gratuitement votre créneau en ligne et réglez directement au salon lors du rendez-vous.',
        providers: []
      };
    }

    // Extraction de budget éventuel (ex: "moins de 8000" ou "5000")
    const numMatch = q.match(/(\d[\d\s]*)/);
    let maxBudget = 0;
    if (numMatch && (q.includes('moins') || q.includes('max') || q.includes('fcfa') || q.includes('budget'))) {
      maxBudget = parseInt(numMatch[1].replace(/\s+/g, ''), 10) || 0;
    }

    let matches = this.findMatchingProviders(prompt);
    if (maxBudget > 0 && store) {
      const budgetMatches = store.db.providers.filter(
        p => p.verificationStatus === 'verified' && store.getMinServicePrice(p.id) <= maxBudget
      );
      matches = matches.length ? matches.filter(p => store.getMinServicePrice(p.id) <= maxBudget) : budgetMatches;
    }

    if (matches.length > 0 && store) {
      const listText = matches.slice(0, 3).map(p => {
        const minPrice = store.getMinServicePrice(p.id);
        return `• **${p.businessName}** (${p.neighborhood}) — dès **${store.formatFCFA(minPrice)}** ⭐ ${p.rating}`;
      }).join('\n');

      return {
        role: 'assistant',
        text: `J'ai trouvé **${matches.length} établissement(s) vérifié(s)** à Douala correspondant à votre demande :\n${listText}\n\nVous pouvez ouvrir leur fiche ou réserver directement ci-dessous :`,
        providers: matches.slice(0, 2)
      };
    }

    // Recommandation générale des meilleurs pros de Douala
    const topProviders = store
      ? store.db.providers.filter(p => p.verificationStatus === 'verified').slice(0, 2)
      : [];

    return {
      role: 'assistant',
      text: 'Voici nos établissements les mieux notés à **Douala** (*Akwa, Bonapriso, Makepe, Bonamoussadi, Logpom, Bonanjo*). Précisez un quartier, un service (*coiffure, beauté, diagnostic auto, photo, ménage, coaching*) ou un budget en **FCFA** :',
      providers: topProviders
    };
  }

  formatText(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="px-1 py-0.5 rounded bg-slate-200 text-slate-900 font-mono text-[11px]">$1</code>')
      .replace(/\n/g, '<br/>');
  }

  scrollToBottom() {
    setTimeout(() => {
      const box = document.getElementById('ai-agent-messages');
      if (box) box.scrollTop = box.scrollHeight;
    }, 30);
  }

  render() {
    const container = document.getElementById('bookme-ai-widget');
    if (!container) return;
    const store = window.bookMeStore;

    container.innerHTML = `
      <!-- Bouton flottant Assistant IA BookMe -->
      <div class="fixed bottom-5 left-5 z-40">
        ${this.isOpen ? `
          <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-[340px] sm:w-[380px] overflow-hidden flex flex-col animate-fade-in mb-3">
            <!-- En-tête de l'agent -->
            <div class="hero-gradient text-white px-4 py-3.5 flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <img src="./assets/logo.svg" alt="BookMe AI" class="w-8 h-8 rounded-lg shadow" />
                <div>
                  <div class="flex items-center gap-1.5">
                    <h4 class="text-xs font-extrabold tracking-wide">Assistant IA BookMe</h4>
                    <span class="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-amber-400 text-slate-950">Vercel AI SDK</span>
                  </div>
                  <p class="text-[10px] text-teal-200">Concierge intelligent • Douala 24h/7j</p>
                </div>
              </div>
              <button onclick="bookMeAI.toggle()" class="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs font-bold">✕</button>
            </div>

            <!-- Suggestions rapides -->
            <div class="px-3 py-2 bg-slate-50 border-b border-slate-200 flex gap-1.5 overflow-x-auto text-[11px]">
              <button onclick="bookMeAI.askQuick('Barbier à Akwa')" class="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-teal-600 text-slate-700 font-semibold whitespace-nowrap">💈 Barbier Akwa</button>
              <button onclick="bookMeAI.askQuick('Beauté à Bonapriso')" class="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-teal-600 text-slate-700 font-semibold whitespace-nowrap">✨ Beauté Bonapriso</button>
              <button onclick="bookMeAI.askQuick('Budget moins de 8000 FCFA')" class="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-teal-600 text-slate-700 font-semibold whitespace-nowrap">💰 &lt; 8 000 FCFA</button>
              <button onclick="bookMeAI.askQuick('Comment payer avec Orange Money ?')" class="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-teal-600 text-slate-700 font-semibold whitespace-nowrap">📱 Mobile Money</button>
            </div>

            <!-- Fil de conversation -->
            <div id="ai-agent-messages" class="p-3.5 space-y-3 max-h-80 overflow-y-auto bg-slate-50/60 text-xs">
              ${this.messages.map(m => `
                <div class="flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}">
                  <div class="${m.role === 'user' ? 'bg-teal-700 text-white rounded-2xl rounded-br-sm' : 'bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-bl-sm shadow-sm'} px-3.5 py-2.5 max-w-[88%] space-y-2">
                    <div class="leading-relaxed">${this.formatText(m.text)}</div>
                    ${m.providers && m.providers.length ? `
                      <div class="space-y-1.5 pt-1 border-t border-slate-100">
                        ${m.providers.map(p => `
                          <div class="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                            <div class="min-w-0">
                              <p class="font-bold text-slate-900 truncate text-[11px]">${p.businessName}</p>
                              <p class="text-[10px] text-slate-500">${p.neighborhood} • dès ${store ? store.formatFCFA(store.getMinServicePrice(p.id)) : ''}</p>
                            </div>
                            <button onclick="app.openBookingModal('${p.id}')" class="px-2.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-[10px] shrink-0">
                              Réserver
                            </button>
                          </div>
                        `).join('')}
                      </div>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
              ${this.isTyping ? `
                <div class="flex justify-start">
                  <div class="bg-white border border-slate-200 rounded-2xl px-3.5 py-2 text-slate-500 text-[11px] italic">
                    L'agent BookMe analyse les disponibilités...
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Champ de saisie -->
            <form onsubmit="event.preventDefault(); const inp = document.getElementById('ai-agent-input'); bookMeAI.sendPrompt(inp.value); inp.value='';" class="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
              <input id="ai-agent-input" type="text" placeholder="Ex: Coiffeur à Akwa, diagnostic auto..." class="flex-1 text-xs border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-teal-600" />
              <button type="submit" class="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shrink-0">
                Envoyer
              </button>
            </form>
          </div>
        ` : ''}

        <button onclick="bookMeAI.toggle()" class="px-4 py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white shadow-xl border border-teal-500/40 flex items-center gap-2.5 transition transform hover:scale-105">
          <img src="./assets/logo.svg" alt="Logo" class="w-6 h-6 rounded-md" />
          <div class="text-left">
            <span class="block text-xs font-extrabold leading-none">Assistant IA BookMe</span>
            <span class="block text-[10px] text-teal-400 font-semibold">Conseiller Douala • Vercel AI</span>
          </div>
        </button>
      </div>
    `;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.bookMeAI = new BookMeAIAgent();
  window.bookMeAI.init();
});


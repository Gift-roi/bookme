// BookMe Cameroun - Modales Interactives (Réservation, Paiement Mobile Money, Profil, Avis, Reçu, Auth)

Object.assign(window.BookMeApp.prototype, {
  closeModal() {
    const m = document.getElementById('app-modal');
    if (m) m.innerHTML = '';
  },

  // CL05 : Consultation détaillée du profil professionnel
  openProviderModal(providerId) {
    const p = this.store.db.providers.find(pr => pr.id === providerId);
    if (!p) return;
    const services = this.store.getProviderServices(p.id, true);
    const reviews = this.store.db.reviews.filter(r => r.providerId === p.id && r.status === 'published');
    const modal = document.getElementById('app-modal');

    modal.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onclick="if(event.target===this) app.closeModal()">
        <div class="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 animate-fade-in">
          <div class="relative h-56 bg-slate-900">
            <img src="${p.coverImage}" class="w-full h-full object-cover opacity-90" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
            <button onclick="app.closeModal()" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 text-slate-900 flex items-center justify-center font-bold">✕</button>
            <div class="absolute bottom-4 left-6 right-6 text-white">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-600">✓ Établissement Vérifié BookMe</span>
              <h2 class="text-2xl font-extrabold mt-1">${p.businessName}</h2>
              <p class="text-xs text-slate-300">${p.address} • Tél : ${p.phone}</p>
            </div>
          </div>

          <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${p.description}</p>

            <div>
              <h3 class="text-sm font-extrabold text-slate-900 mb-3">Prestations & Tarifs (CL05)</h3>
              <div class="space-y-2.5">
                ${services.map(s => `
                  <div class="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-4 hover:border-teal-600 transition">
                    <div>
                      <p class="font-bold text-sm text-slate-900">${s.name}</p>
                      <p class="text-xs text-slate-500">${s.description} • Durée : ${s.duration} min</p>
                    </div>
                    <div class="flex items-center gap-3 shrink-0">
                      <span class="font-extrabold text-sm text-teal-800">${this.store.formatFCFA(s.price, s.isQuote)}</span>
                      <button onclick="app.openBookingModal('${p.id}', '${s.id}')" class="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold">
                        Choisir
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
              <p class="font-bold text-slate-800">Conditions d'annulation (RG11) & Horaires (RG13)</p>
              <p class="text-slate-600">${p.cancellationPolicy} • Fuseau : Africa/Douala (GMT+1).</p>
            </div>

            <div>
              <h3 class="text-sm font-extrabold text-slate-900 mb-3">Avis Clients Vérifiés (${reviews.length})</h3>
              <div class="space-y-2.5">
                ${reviews.length === 0 ? `<p class="text-xs text-slate-500">Aucun avis publié.</p>` : reviews.map(r => `
                  <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div class="flex justify-between font-bold text-slate-900">
                      <span>${r.clientName}</span>
                      <span class="text-amber-500">${'★'.repeat(r.rating)}</span>
                    </div>
                    <p class="text-slate-600 mt-1">${r.comment}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // CL06 & CL07 : Parcours de Réservation & Paiement Mobile Money / Sur place
  openBookingModal(providerId, preselectedServiceId = null) {
    if (!this.store.currentUser) {
      this.openAuthModal();
      return;
    }
    const p = this.store.db.providers.find(pr => pr.id === providerId);
    const services = this.store.getProviderServices(providerId, true);
    if (!p || !services.length) return;

    const chosenService = services.find(s => s.id === preselectedServiceId) || services[0];
    this.bookingDraft = {
      providerId: p.id,
      serviceId: chosenService.id,
      date: '2026-11-11',
      time: '',
      paymentMethod: p.acceptOnlinePayment ? 'orange_money' : 'onsite',
      paymentPhone: this.store.currentUser.phone || '+237 699 00 00 00',
      notes: ''
    };
    this.renderBookingModal();
  },

  renderBookingModal() {
    const d = this.bookingDraft;
    if (!d) return;
    const p = this.store.db.providers.find(pr => pr.id === d.providerId);
    const services = this.store.getProviderServices(p.id, true);
    const srv = services.find(s => s.id === d.serviceId) || services[0];
    const daySlots = this.store.getSlotsForDate(p.id, d.date);

    // Sélectionner automatiquement le premier créneau disponible si vide
    if (!d.time || !daySlots.slots.some(s => s.time === d.time && s.available)) {
      const firstAvail = daySlots.slots.find(s => s.available);
      d.time = firstAvail ? firstAvail.time : '';
    }

    const modal = document.getElementById('app-modal');
    modal.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onclick="if(event.target===this) app.closeModal()">
        <div class="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 animate-fade-in">
          <div class="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <div>
              <span class="text-[11px] uppercase tracking-wider text-amber-400 font-bold">Réservation Sécurisée (CL06 / CL07)</span>
              <h3 class="text-lg font-extrabold">${p.businessName} (${p.neighborhood})</h3>
            </div>
            <button onclick="app.closeModal()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">✕</button>
          </div>

          <div class="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs sm:text-sm">
            <!-- 1. Choix de la prestation -->
            <div>
              <label class="block font-extrabold text-slate-900 mb-1.5">1. Prestation choisie</label>
              <select onchange="app.bookingDraft.serviceId = this.value; app.renderBookingModal();"
                class="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 bg-slate-50">
                ${services.map(s => `
                  <option value="${s.id}" ${s.id === srv.id ? 'selected' : ''}>
                    ${s.name} — ${this.store.formatFCFA(s.price, s.isQuote)} (${s.duration} min)
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- 2. Date & Créneau disponible (RG04 / RG06) -->
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-extrabold text-slate-900 mb-1.5">2. Date du rendez-vous</label>
                <input type="date" value="${d.date}" min="2026-11-10"
                  onchange="app.bookingDraft.date = this.value; app.bookingDraft.time=''; app.renderBookingModal();"
                  class="w-full border border-slate-300 rounded-xl px-3.5 py-2 font-bold text-slate-800" />
              </div>
              <div class="bg-teal-50/70 border border-teal-200 rounded-xl p-3 text-xs">
                <p class="font-bold text-teal-900">Mode de confirmation : ${p.confirmationMode === 'auto' ? 'Immédiate' : 'Validation manuelle'}</p>
                <p class="text-teal-700 mt-0.5">Les créneaux grisés sont déjà réservés ou bloqués (RG04).</p>
              </div>
            </div>

            <div>
              <label class="block font-extrabold text-slate-900 mb-2">3. Créneaux horaires disponibles (Africa/Douala GMT+1)</label>
              ${daySlots.closed ? `
                <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs">
                  Établissement fermé à cette date. Veuillez choisir un autre jour.
                </div>
              ` : `
                <div class="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  ${daySlots.slots.map(s => `
                    <button type="button" ${!s.available ? 'disabled' : ''}
                      onclick="app.bookingDraft.time='${s.time}'; app.renderBookingModal();"
                      class="slot-btn py-2 px-2 rounded-xl border border-slate-200 text-xs font-bold ${d.time === s.time ? 'selected' : ''}">
                      ${s.time}
                    </button>
                  `).join('')}
                </div>
              `}
            </div>

            <!-- 4. Mode de paiement (Section 8 : Mobile Money ou Sur place) -->
            <div>
              <label class="block font-extrabold text-slate-900 mb-2">4. Mode de règlement (Section 8)</label>
              <div class="grid sm:grid-cols-3 gap-2.5">
                ${p.acceptOnlinePayment ? `
                  <button type="button" onclick="app.bookingDraft.paymentMethod='orange_money'; app.renderBookingModal();"
                    class="p-3 rounded-xl border-2 text-left transition ${d.paymentMethod === 'orange_money' ? 'border-orange-500 bg-orange-50/60' : 'border-slate-200'}">
                    <span class="badge-om px-2 py-0.5 rounded text-[10px] font-extrabold">ORANGE MONEY</span>
                    <p class="font-bold text-xs text-slate-900 mt-1.5">Paiement #150*50#</p>
                  </button>
                  <button type="button" onclick="app.bookingDraft.paymentMethod='mtn_momo'; app.renderBookingModal();"
                    class="p-3 rounded-xl border-2 text-left transition ${d.paymentMethod === 'mtn_momo' ? 'border-yellow-500 bg-yellow-50/60' : 'border-slate-200'}">
                    <span class="badge-momo px-2 py-0.5 rounded text-[10px] font-extrabold">MTN MoMo</span>
                    <p class="font-bold text-xs text-slate-900 mt-1.5">Paiement *126#</p>
                  </button>
                ` : ''}
                <button type="button" onclick="app.bookingDraft.paymentMethod='onsite'; app.renderBookingModal();"
                  class="p-3 rounded-xl border-2 text-left transition ${d.paymentMethod === 'onsite' ? 'border-teal-600 bg-teal-50/60' : 'border-slate-200'}">
                  <span class="bg-slate-800 text-white px-2 py-0.5 rounded text-[10px] font-extrabold">SUR PLACE</span>
                  <p class="font-bold text-xs text-slate-900 mt-1.5">Régler au rendez-vous</p>
                </button>
              </div>

              ${(d.paymentMethod === 'orange_money' || d.paymentMethod === 'mtn_momo') ? `
                <div class="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div class="text-xs">
                    <p class="font-bold text-slate-800">Numéro Mobile Money à débiter :</p>
                    <p class="text-slate-500">Vérification serveur-à-serveur avec référence unique (RG15)</p>
                  </div>
                  <input type="tel" value="${d.paymentPhone}" oninput="app.bookingDraft.paymentPhone = this.value"
                    class="border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold bg-white" />
                </div>
              ` : ''}
            </div>

            <!-- 5. Récapitulatif contractuel & Conditions d'annulation (RG11 / RG14) -->
            <div class="bg-slate-900 text-white p-4 rounded-2xl space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-slate-400">Prestation & Durée :</span>
                <span class="font-bold">${srv.name} (${srv.duration} min)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Créneau :</span>
                <span class="font-bold text-amber-400">${d.date} à ${d.time || 'Non sélectionné'}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Conditions d'annulation (RG11) :</span>
                <span class="text-right">${p.cancellationPolicy}</span>
              </div>
              <div class="flex justify-between border-t border-slate-700 pt-2 text-sm font-extrabold">
                <span>Montant garanti (RG14) :</span>
                <span class="text-teal-400">${this.store.formatFCFA(srv.price, srv.isQuote)}</span>
              </div>
            </div>

            <button type="button" onclick="app.confirmBooking()"
              class="w-full py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-sm shadow-lg transition">
              Confirmer la réservation ${d.paymentMethod !== 'onsite' ? '& Payer via Mobile Money' : ''}
            </button>
          </div>
        </div>
      </div>
    `;
  },

  confirmBooking() {
    try {
      const booking = this.store.createBooking(this.bookingDraft);
      this.closeModal();
      this.clientTab = 'bookings';
      this.renderAll();
      this.toast(`Réservation ${booking.id} enregistrée avec succès !`);
    } catch (err) {
      this.toast(err.message, 'error');
    }
  },

  cancelBooking(bookingId) {
    try {
      this.store.updateBookingStatus(bookingId, 'cancelled', this.store.currentUser ? this.store.currentUser.name : 'Client');
      this.renderAll();
      this.toast(`Réservation ${bookingId} annulée.`);
    } catch (err) {
      this.toast(err.message, 'error');
    }
  },

  // CL10 & RG08 : Publier un avis après prestation terminée
  openReviewModal(bookingId) {
    const b = this.store.db.bookings.find(bk => bk.id === bookingId);
    if (!b) return;
    const modal = document.getElementById('app-modal');
    modal.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4" onclick="if(event.target===this) app.closeModal()">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
          <h3 class="text-lg font-extrabold text-slate-900">Évaluer la prestation (CL10 / RG08)</h3>
          <p class="text-xs text-slate-500">${b.serviceNameSnapshot} (${b.date})</p>
          <form onsubmit="app.submitReview(event, '${b.id}')" class="space-y-3 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Note sur 5 étoiles</label>
              <select name="rating" class="w-full border border-slate-300 rounded-xl px-3 py-2 font-bold text-amber-600">
                <option value="5">★★★★★ (5/5 - Excellent)</option>
                <option value="4">★★★★☆ (4/5 - Très bien)</option>
                <option value="3">★★★☆☆ (3/5 - Correct)</option>
                <option value="2">★★☆☆☆ (2/5 - Décevant)</option>
                <option value="1">★☆☆☆☆ (1/5 - Mauvais)</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Votre commentaire</label>
              <textarea name="comment" required rows="3" placeholder="Partagez votre expérience (ponctualité, accueil, qualité)..." class="w-full border border-slate-300 rounded-xl px-3 py-2"></textarea>
            </div>
            <div class="flex justify-end gap-2">
              <button type="button" onclick="app.closeModal()" class="px-4 py-2 rounded-xl bg-slate-100 font-bold">Annuler</button>
              <button type="submit" class="px-4 py-2 rounded-xl bg-teal-700 text-white font-bold">Publier l'avis</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  submitReview(e, bookingId) {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      this.store.addReview({
        bookingId,
        rating: fd.get('rating'),
        comment: fd.get('comment')
      });
      this.closeModal();
      this.renderAll();
      this.toast('Merci ! Votre avis vérifié a été publié.');
    } catch (err) {
      this.toast(err.message, 'error');
    }
  },

  // Reçu de réservation et référence de transaction (RG15)
  openReceiptModal(bookingId) {
    const b = this.store.db.bookings.find(bk => bk.id === bookingId);
    if (!b) return;
    const p = this.store.db.providers.find(pr => pr.id === b.providerId);
    const u = this.store.db.users.find(us => us.id === b.clientId);
    const modal = document.getElementById('app-modal');

    modal.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4" onclick="if(event.target===this) app.closeModal()">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-fade-in">
          <div class="flex items-center justify-between border-b border-slate-200 pb-3">
            <div class="flex items-center gap-2.5">
              <img src="./assets/logo.svg" alt="BookMe" class="w-9 h-9 rounded-lg shadow-sm" />
              <div>
                <span class="text-[10px] font-bold uppercase text-teal-700">Reçu Officiel BookMe Cameroun</span>
                <h3 class="text-base font-extrabold text-slate-900">Réf : ${b.id}</h3>
              </div>
            </div>
            ${window.BookMeViews.statusBadge(b.status)}
          </div>
          <div class="space-y-2 text-xs">
            <div class="flex justify-between"><span class="text-slate-500">Client :</span><strong>${u ? u.name : ''}</strong></div>
            <div class="flex justify-between"><span class="text-slate-500">Prestataire :</span><strong>${p ? p.businessName : ''}</strong></div>
            <div class="flex justify-between"><span class="text-slate-500">Quartier :</span><span>${p ? p.neighborhood + ', ' + p.city : ''}</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Prestation :</span><strong>${b.serviceNameSnapshot}</strong></div>
            <div class="flex justify-between"><span class="text-slate-500">Date & Heure :</span><strong>${b.date} à ${b.time} (GMT+1)</strong></div>
            <div class="flex justify-between"><span class="text-slate-500">Réf. Paiement (RG15) :</span><code class="font-bold">${b.paymentRef}</code></div>
            <div class="flex justify-between border-t border-slate-200 pt-2 text-sm font-extrabold text-teal-800">
              <span>Montant Total :</span>
              <span>${this.store.formatFCFA(b.priceSnapshot, b.isQuoteSnapshot)}</span>
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-2 no-print">
            <button onclick="window.print()" class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold">Imprimer / PDF</button>
            <button onclick="app.closeModal()" class="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold">Fermer</button>
          </div>
        </div>
      </div>
    `;
  },

  // Notifications (CL11 / PR12)
  openNotificationsModal() {
    const u = this.store.currentUser;
    const list = u ? this.store.db.notifications.filter(n => n.userId === u.id) : [];
    list.forEach(n => { n.read = true; });
    this.store.saveDatabase();
    this.renderNavbar();

    const modal = document.getElementById('app-modal');
    modal.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4" onclick="if(event.target===this) app.closeModal()">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fade-in">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-extrabold text-slate-900">Centre de Notifications (CL11 / PR12)</h3>
            <button onclick="app.closeModal()" class="text-slate-500 font-bold">✕</button>
          </div>
          <div class="space-y-2.5 max-h-96 overflow-y-auto text-xs">
            ${list.length === 0 ? `<p class="text-slate-500">Aucune notification.</p>` : list.map(n => `
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div class="flex justify-between font-bold text-slate-900">
                  <span>${n.title}</span>
                  <span class="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded">${n.channel}</span>
                </div>
                <p class="text-slate-600">${n.message}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  // Authentification & Changement rapide de compte démo (CL01, CL02, PR01)
  openAuthModal(mode = 'switch') {
    const modal = document.getElementById('app-modal');
    modal.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onclick="if(event.target===this) app.closeModal()">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl my-8 animate-fade-in text-xs">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <img src="./assets/logo.svg" alt="BookMe" class="w-8 h-8 rounded-lg shadow-sm" />
              <h3 class="text-lg font-extrabold text-slate-900">Comptes & Inscription BookMe (CL01 / PR01)</h3>
            </div>
            <button onclick="app.closeModal()" class="font-bold text-slate-500">✕</button>
          </div>

          <div class="bg-teal-50 border border-teal-200 rounded-2xl p-3.5 space-y-2">
            <p class="font-extrabold text-teal-900">Accès Rapide Démo (1 clic pour tester les 3 rôles) :</p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button onclick="app.switchDemoRole('usr-client-1'); app.closeModal();" class="p-2 rounded-xl bg-white border border-teal-200 font-bold text-slate-800 hover:bg-teal-600 hover:text-white transition">
                👤 Client (Christian)
              </button>
              <button onclick="app.switchDemoRole('usr-pro-1'); app.closeModal();" class="p-2 rounded-xl bg-white border border-teal-200 font-bold text-slate-800 hover:bg-teal-600 hover:text-white transition">
                💈 Pro (King's Barber)
              </button>
              <button onclick="app.switchDemoRole('usr-admin-1'); app.closeModal();" class="p-2 rounded-xl bg-white border border-teal-200 font-bold text-slate-800 hover:bg-teal-600 hover:text-white transition">
                🛡️ Administrateur
              </button>
            </div>
          </div>

          <form onsubmit="app.handleLogin(event)" class="space-y-2.5 border-t border-slate-200 pt-4">
            <p class="font-extrabold text-slate-900 text-sm">Se connecter avec vos identifiants (CL02 / Admin)</p>
            <div class="grid sm:grid-cols-2 gap-2.5">
              <input type="text" name="emailOrPhone" required placeholder="E-mail ou Tél (ex: admin@bookme.cm)" class="border border-slate-300 rounded-xl px-3 py-2" />
              <input type="password" name="password" required placeholder="Mot de passe (ex: adminpassword)" class="border border-slate-300 rounded-xl px-3 py-2" />
            </div>
            <button type="submit" class="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold">
              Se connecter
            </button>
          </form>

          <form onsubmit="app.handleRegister(event)" class="space-y-3 border-t border-slate-200 pt-4">
            <p class="font-extrabold text-slate-900 text-sm">Créer un nouveau compte Client ou Professionnel</p>
            <div class="grid sm:grid-cols-2 gap-2.5">
              <input type="text" name="name" required placeholder="Nom complet *" class="border border-slate-300 rounded-xl px-3 py-2" />
              <input type="tel" name="phone" required placeholder="Téléphone (+237 6...)" class="border border-slate-300 rounded-xl px-3 py-2" />
              <input type="email" name="email" required placeholder="Adresse e-mail *" class="border border-slate-300 rounded-xl px-3 py-2" />
              <input type="password" name="password" required placeholder="Mot de passe *" class="border border-slate-300 rounded-xl px-3 py-2" />
            </div>
            <div class="grid sm:grid-cols-2 gap-2.5">
              <select name="role" onchange="document.getElementById('pro-extra-fields').classList.toggle('hidden', this.value!=='provider')"
                class="border border-slate-300 rounded-xl px-3 py-2 font-bold">
                <option value="client">Compte Client</option>
                <option value="provider" ${mode === 'register-pro' ? 'selected' : ''}>Compte Professionnel</option>
              </select>
              <input type="text" name="neighborhood" value="Akwa" placeholder="Quartier (ex: Akwa, Bonapriso)" class="border border-slate-300 rounded-xl px-3 py-2" />
            </div>
            <div id="pro-extra-fields" class="${mode === 'register-pro' ? '' : 'hidden'} space-y-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <input type="text" name="businessName" placeholder="Nom commercial du salon / entreprise" class="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white" />
              <input type="text" name="verificationDoc" placeholder="N° NIU / RCCM ou CNI pour validation Admin (PR03)" class="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white" />
            </div>
            <button type="submit" class="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold">
              Créer le compte & Se connecter
            </button>
          </form>
        </div>
      </div>
    `;
  },

  handleLogin(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const u = this.store.login(fd.get('emailOrPhone'), fd.get('password'));
      this.closeModal();
      this.syncSpaceWithUser();
      this.renderAll();
      this.toast(`Connecté en tant que ${u.name} (${u.role.toUpperCase()})`);
    } catch (err) {
      this.toast(err.message, 'error');
    }
  },

  handleRegister(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const u = this.store.registerUser(Object.fromEntries(fd.entries()));
      this.closeModal();
      this.syncSpaceWithUser();
      this.renderAll();
      this.toast(`Compte créé ! Bienvenue ${u.name}.`);
    } catch (err) {
      this.toast(err.message, 'error');
    }
  },

  // Actions Rapides Client / Pro / Admin
  toggleFavorite(providerId, e) {
    if (e) e.stopPropagation();
    try {
      const added = this.store.toggleFavorite(providerId);
      this.renderAll();
      this.toast(added ? 'Ajouté à vos favoris (CL12)' : 'Retiré de vos favoris');
    } catch (err) {
      this.toast(err.message, 'error');
    }
  },

  switchProAccount(userId) {
    this.store.setCurrentUser(userId);
    this.renderAll();
  },

  toggleConfirmationMode(providerId) {
    const p = this.store.db.providers.find(pr => pr.id === providerId);
    if (!p) return;
    p.confirmationMode = p.confirmationMode === 'auto' ? 'manual' : 'auto';
    this.store.saveDatabase();
    this.renderAll();
    this.toast(`Mode de confirmation passé en : ${p.confirmationMode === 'auto' ? 'Automatique' : 'Manuel'}`);
  },

  changeBookingStatus(bookingId, status) {
    try {
      this.store.updateBookingStatus(bookingId, status, 'Professionnel');
      this.renderAll();
      this.toast(`Réservation ${bookingId} mise à jour (${status}).`);
    } catch (err) {
      this.toast(err.message, 'error');
    }
  },

  quickBlockSlot(providerId, date, time) {
    this.store.addBlockedSlot(providerId, date, time, 'Bloqué depuis le calendrier Pro');
    this.renderAll();
    this.toast(`Créneau ${date} à ${time} bloqué (PR09).`);
  },

  handleAddBlock(e, providerId) {
    e.preventDefault();
    const fd = new FormData(e.target);
    this.store.addBlockedSlot(providerId, fd.get('date'), fd.get('time'), fd.get('reason'));
    this.renderAll();
    this.toast('Créneau bloqué avec succès.');
  },

  removeBlock(blockId) {
    this.store.removeBlockedSlot(blockId);
    this.renderAll();
    this.toast('Créneau débloqué.');
  },

  handleSaveService(e, providerId) {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      this.store.saveService(providerId, {
        name: fd.get('name'),
        price: fd.get('price'),
        duration: fd.get('duration'),
        isQuote: fd.get('isQuote') === 'on',
        description: fd.get('description')
      });
      this.renderAll();
      this.toast('Nouvelle prestation publiée !');
    } catch (err) {
      this.toast(err.message, 'error');
    }
  },

  toggleServiceActive(providerId, serviceId) {
    const s = this.store.db.services.find(sr => sr.id === serviceId);
    if (!s) return;
    s.active = !s.active;
    this.store.saveDatabase();
    this.renderAll();
  },

  deleteService(providerId, serviceId) {
    this.store.deleteService(providerId, serviceId);
    this.renderAll();
    this.toast('Prestation supprimée.');
  },

  upgradePlan(providerId, planId) {
    const p = this.store.db.providers.find(pr => pr.id === providerId);
    const plan = this.store.db.platform_settings.plans.find(pl => pl.id === planId);
    if (!p || !plan) return;
    p.subscriptionPlan = planId;
    p.acceptOnlinePayment = planId !== 'basic';
    const sub = this.store.db.subscriptions.find(s => s.providerId === providerId);
    if (sub) {
      sub.planId = planId;
      sub.amount = plan.price;
    }
    this.store.saveDatabase();
    this.renderAll();
    this.toast(`Abonnement mis à jour vers la formule ${plan.name} !`);
  },

  updateCommissionRate(val) {
    this.store.db.platform_settings.commissionRate = Number(val);
    this.store.saveDatabase();
    this.renderAll();
  },

  adminVerifyProvider(providerId, status) {
    this.store.verifyProvider(providerId, status);
    this.renderAll();
    this.toast(`Statut du professionnel mis à jour : ${status}`);
  },

  toggleCategory(catId) {
    const c = this.store.db.categories.find(ct => ct.id === catId);
    if (!c) return;
    c.active = !c.active;
    this.store.saveDatabase();
    this.renderAll();
  },

  handleAddCategory(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    this.store.saveCategory({ name: fd.get('name'), description: fd.get('description') });
    this.renderAll();
    this.toast('Catégorie ajoutée (AD04).');
  },

  toggleUser(userId) {
    this.store.toggleUserStatus(userId);
    this.renderAll();
    this.toast('Statut de l\'utilisateur modifié (AD02).');
  },

  toggleReviewStatus(revId) {
    const r = this.store.db.reviews.find(rv => rv.id === revId);
    if (!r) return;
    r.status = r.status === 'published' ? 'hidden' : 'published';
    this.store.recalculateProviderRating(r.providerId);
    this.store.saveDatabase();
    this.renderAll();
    this.toast('Statut de l\'avis mis à jour (AD07).');
  },

  exportAdminReport() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.store.db, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `bookme-cameroun-rapport-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    this.toast('Rapport JSON exporté avec succès (AD10).');
  },

  resetDemo() {
    this.store.resetDatabase();
    this.syncSpaceWithUser();
    this.renderAll();
    this.toast('Base de données de démonstration réinitialisée.');
  }
});

window.addEventListener('DOMContentLoaded', () => {
  window.app = new window.BookMeApp();
  window.app.init();
});


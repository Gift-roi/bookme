// BookMe Cameroun - Espaces Professionnel (PR01-PR12), Administrateur (AD01-AD10) & Modales

Object.assign(window.BookMeApp.prototype, {
  // ============================================================================
  // 4.2 ESPACE PROFESSIONNEL (PR01 à PR12)
  // ============================================================================
  renderProviderSpace() {
    const u = this.store.currentUser;
    const pro = this.store.db.providers.find(p => p.id === (u && u.providerId)) || this.store.db.providers[0];
    const bookings = this.store.db.bookings.filter(b => b.providerId === pro.id);
    const services = this.store.getProviderServices(pro.id, false);
    const reviews = this.store.db.reviews.filter(r => r.providerId === pro.id);
    const blocked = this.store.db.blocked_slots.filter(blk => blk.providerId === pro.id);

    const completedBookings = bookings.filter(b => b.status === 'completed');
    const revenue = completedBookings.reduce((sum, b) => sum + Number(b.priceSnapshot || 0), 0);
    const cancelCount = bookings.filter(b => b.status === 'cancelled' || b.status === 'noshow').length;
    const cancelRate = bookings.length ? Math.round((cancelCount / bookings.length) * 100) : 0;

    return `
      <!-- En-tête Espace Professionnel -->
      <div class="bg-slate-900 text-white border-b border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <img src="${pro.coverImage}" class="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400" alt="${pro.businessName}" />
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="text-xl font-extrabold">${pro.businessName}</h1>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${pro.verificationStatus === 'verified' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300'}">
                  ${pro.verificationStatus === 'verified' ? '✓ Établissement Vérifié (RG02)' : '⏳ En attente de validation Admin'}
                </span>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950 uppercase">Forfait ${pro.subscriptionPlan}</span>
              </div>
              <p class="text-xs text-slate-400 mt-1">${pro.address} • Confirmation : <strong>${pro.confirmationMode === 'auto' ? 'Automatique' : 'Manuelle (PR08)'}</strong></p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <select onchange="app.switchProAccount(this.value)" class="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 font-semibold">
              ${this.store.db.providers.map(p => `<option value="${p.userId}" ${p.id === pro.id ? 'selected' : ''}>Simuler Pro : ${p.businessName}</option>`).join('')}
            </select>
            <button onclick="app.toggleConfirmationMode('${pro.id}')" class="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-bold transition">
              Mode : ${pro.confirmationMode === 'auto' ? 'Auto' : 'Manuel'}
            </button>
          </div>
        </div>

        <!-- Onglets Pro -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-6 overflow-x-auto">
          ${[
            ['dashboard', 'layout-dashboard', 'Tableau de bord & RDV (PR08/PR10)'],
            ['calendar', 'calendar', 'Calendrier & Blocages (PR06/PR07/PR09)'],
            ['services', 'scissors', `Prestations & Tarifs (${services.length}) (PR04/PR05)`],
            ['reviews', 'star', `Avis reçus (${reviews.length}) (PR11)`],
            ['subscription', 'crown', 'Abonnement & Profil (PR02/PR03)']
          ].map(([id, icon, label]) => `
            <button onclick="app.proTab='${id}'; app.renderAll();"
              class="py-3 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-1.5 transition ${this.proTab === id ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'}">
              <i data-lucide="${icon}" class="w-4 h-4"></i> ${label}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <!-- Statistiques Clés (PR10) -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p class="text-xs text-slate-500 font-medium">Chiffre d'affaires réalisé (PR10)</p>
            <p class="text-2xl font-extrabold text-teal-800 mt-1">${this.store.formatFCFA(revenue)}</p>
            <p class="text-[11px] text-emerald-600 font-semibold mt-1">${completedBookings.length} prestations terminées</p>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p class="text-xs text-slate-500 font-medium">Total Réservations reçues</p>
            <p class="text-2xl font-extrabold text-slate-900 mt-1">${bookings.length}</p>
            <p class="text-[11px] text-amber-600 font-semibold mt-1">${bookings.filter(b => b.status === 'pending').length} en attente de décision</p>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p class="text-xs text-slate-500 font-medium">Taux d'annulation / No-show</p>
            <p class="text-2xl font-extrabold text-slate-900 mt-1">${cancelRate}%</p>
            <p class="text-[11px] text-slate-500 mt-1">${cancelCount} annulation(s) ou absence(s)</p>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p class="text-xs text-slate-500 font-medium">Note Moyenne Clients (PR11)</p>
            <p class="text-2xl font-extrabold text-amber-500 mt-1">★ ${pro.rating} / 5</p>
            <p class="text-[11px] text-slate-500 mt-1">Basé sur ${pro.reviewCount} avis vérifiés</p>
          </div>
        </div>

        ${this.proTab === 'dashboard' ? `
          <!-- Gestion des Demandes & Rendez-vous (PR08) -->
          <div class="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-extrabold text-slate-900">Gestion des Réservations Clients (PR08)</h2>
              <span class="text-xs text-slate-500">Acceptez, refusez ou marquez vos rendez-vous comme terminés</span>
            </div>

            <div class="space-y-3">
              ${bookings.length === 0 ? `<p class="text-sm text-slate-500">Aucune réservation enregistrée.</p>` : bookings.map(b => {
                const client = this.store.db.users.find(u => u.id === b.clientId);
                return `
                  <div class="p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition">
                    <div class="space-y-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <span class="font-mono text-xs font-bold text-slate-500">${b.id}</span>
                        ${window.BookMeViews.statusBadge(b.status)}
                        ${window.BookMeViews.paymentBadge(b.paymentMethod, b.paymentStatus)}
                      </div>
                      <p class="font-extrabold text-slate-900 text-sm">${b.serviceNameSnapshot} — <span class="text-teal-700">${this.store.formatFCFA(b.priceSnapshot, b.isQuoteSnapshot)}</span></p>
                      <p class="text-xs text-slate-600">
                        Client : <strong>${client ? client.name : 'Client'}</strong> (${client ? client.phone : ''}) • Date : <strong class="text-slate-900">${b.date} à ${b.time}</strong> (${b.durationSnapshot} min)
                      </p>
                      ${b.notes ? `<p class="text-xs italic text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">Note client : "${b.notes}"</p>` : ''}
                    </div>

                    <div class="flex flex-wrap items-center gap-2 shrink-0">
                      ${b.status === 'pending' ? `
                        <button onclick="app.changeBookingStatus('${b.id}', 'confirmed')" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold">
                          ✓ Accepter
                        </button>
                        <button onclick="app.changeBookingStatus('${b.id}', 'rejected')" class="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold">
                          ✕ Refuser
                        </button>
                      ` : ''}
                      ${b.status === 'confirmed' ? `
                        <button onclick="app.changeBookingStatus('${b.id}', 'completed')" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold">
                          ✓ Marquer Terminée (& Encaisser)
                        </button>
                        <button onclick="app.changeBookingStatus('${b.id}', 'noshow')" class="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold">
                          Absence (No-show)
                        </button>
                        <button onclick="app.changeBookingStatus('${b.id}', 'cancelled')" class="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold">
                          Annuler
                        </button>
                      ` : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        ${this.proTab === 'calendar' ? this.renderProCalendar(pro, blocked) : ''}
        ${this.proTab === 'services' ? this.renderProServices(pro, services) : ''}
        ${this.proTab === 'reviews' ? this.renderProReviews(pro, reviews) : ''}
        ${this.proTab === 'subscription' ? this.renderProSubscription(pro) : ''}
      </div>
    `;
  }

  renderProCalendar(pro, blocked) {
    const dayInfo = this.store.getSlotsForDate(pro.id, this.calendarDate);
    return `
      <div class="grid lg:grid-cols-12 gap-6">
        <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 class="text-base font-extrabold text-slate-900">Calendrier & Disponibilités en temps réel (PR07)</h3>
              <p class="text-xs text-slate-500">Cliquez sur un créneau disponible pour le bloquer ponctuellement (PR09).</p>
            </div>
            <input type="date" value="${this.calendarDate}" onchange="app.calendarDate = this.value; app.renderAll();"
              class="border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800" />
          </div>

          ${dayInfo.closed ? `
            <div class="p-6 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-800">
              Votre établissement est configuré comme fermé à cette date (${this.calendarDate}).
            </div>
          ` : `
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              ${dayInfo.slots.map(s => `
                <button onclick="${s.available ? `app.quickBlockSlot('${pro.id}', '${this.calendarDate}', '${s.time}')` : ''}"
                  class="p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center transition ${
                    s.available
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 hover:bg-amber-50 hover:border-amber-300'
                      : 'bg-rose-50 border-rose-200 text-rose-800 cursor-not-allowed'
                  }">
                  <span>${s.time}</span>
                  <span class="text-[10px] font-medium">${s.reason}</span>
                </button>
              `).join('')}
            </div>
          `}
        </div>

        <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 class="text-base font-extrabold text-slate-900">Créneaux Bloqués (PR09)</h3>
          <form onsubmit="app.handleAddBlock(event, '${pro.id}')" class="grid grid-cols-2 gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <input type="date" name="date" value="${this.calendarDate}" required class="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white" />
            <input type="time" name="time" value="15:00" step="1800" required class="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white" />
            <input type="text" name="reason" placeholder="Motif (Pause, congé, matériel...)" required class="col-span-2 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white" />
            <button type="submit" class="col-span-2 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800">
              + Bloquer ce créneau
            </button>
          </form>

          <div class="space-y-2">
            ${blocked.map(blk => `
              <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <p class="font-bold text-slate-800">${blk.date} à ${blk.time}</p>
                  <p class="text-slate-500">${blk.reason}</p>
                </div>
                <button onclick="app.removeBlock('${blk.id}')" class="text-rose-600 hover:underline font-bold">Débloquer</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderProServices(pro, services) {
    return `
      <div class="grid lg:grid-cols-12 gap-6">
        <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 class="text-base font-extrabold text-slate-900">Catalogue de vos Prestations (PR04 / PR05)</h3>
          <div class="space-y-3">
            ${services.map(s => `
              <div class="p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="font-bold text-sm text-slate-900">${s.name}</h4>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold ${s.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}">
                      ${s.active ? 'Actif' : 'Désactivé'}
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 mt-0.5">${s.description}</p>
                  <p class="text-xs font-extrabold text-teal-700 mt-1">${this.store.formatFCFA(s.price, s.isQuote)} • Durée : ${s.duration} min</p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <button onclick="app.toggleServiceActive('${pro.id}', '${s.id}')" class="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-slate-100">
                    ${s.active ? 'Désactiver' : 'Activer'}
                  </button>
                  <button onclick="app.deleteService('${pro.id}', '${s.id}')" class="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 self-start">
          <h3 class="text-base font-extrabold text-slate-900">Ajouter une Prestation (RG03 & RG14)</h3>
          <form onsubmit="app.handleSaveService(event, '${pro.id}')" class="space-y-3 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Nom de la prestation *</label>
              <input type="text" name="name" required placeholder="Ex: Coupe Afro + Soin Kératine" class="w-full border border-slate-300 rounded-xl px-3 py-2" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Tarif (FCFA) *</label>
                <input type="number" name="price" value="5000" min="0" step="500" class="w-full border border-slate-300 rounded-xl px-3 py-2 font-bold" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Durée (minutes) *</label>
                <select name="duration" class="w-full border border-slate-300 rounded-xl px-3 py-2 font-bold">
                  <option value="30">30 min</option>
                  <option value="45" selected>45 min</option>
                  <option value="60">60 min (1h)</option>
                  <option value="90">90 min (1h30)</option>
                  <option value="120">120 min (2h)</option>
                </select>
              </div>
            </div>
            <label class="inline-flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
              <input type="checkbox" name="isQuote" class="rounded text-teal-600" />
              Prestation "Sur devis" (RG03)
            </label>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Description</label>
              <textarea name="description" rows="2" placeholder="Détails de la prestation..." class="w-full border border-slate-300 rounded-xl px-3 py-2"></textarea>
            </div>
            <button type="submit" class="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold">
              Publier la prestation
            </button>
          </form>
        </div>
      </div>
    `;
  }

  renderProReviews(pro, reviews) {
    return `
      <div class="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h3 class="text-base font-extrabold text-slate-900">Avis Clients Vérifiés (${reviews.length}) (PR11)</h3>
        <div class="space-y-3">
          ${reviews.length === 0 ? `<p class="text-xs text-slate-500">Aucun avis reçu pour l'instant.</p>` : reviews.map(r => `
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-bold text-sm text-slate-900">${r.clientName}</span>
                <span class="text-amber-500 font-bold text-xs">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
              </div>
              <p class="text-[11px] text-teal-700 font-semibold">${r.serviceName}</p>
              <p class="text-xs text-slate-700">${r.comment}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderProSubscription(pro) {
    const plans = this.store.db.platform_settings.plans;
    return `
      <div class="space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 class="text-lg font-extrabold text-slate-900 mb-1">Formules d'Abonnement Professionnel BookMe (Section 9)</h3>
          <p class="text-xs text-slate-500 mb-6">Changez de formule à tout moment pour activer les paiements Mobile Money et booster votre visibilité à Douala.</p>
          <div class="grid md:grid-cols-3 gap-6">
            ${plans.map(plan => `
              <div class="rounded-2xl border-2 p-5 flex flex-col justify-between ${pro.subscriptionPlan === plan.id ? 'border-teal-600 bg-teal-50/30' : 'border-slate-200 bg-white'}">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-base font-extrabold text-slate-900">${plan.name}</span>
                    <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">${plan.badge}</span>
                  </div>
                  <p class="text-2xl font-extrabold text-teal-800">${plan.price === 0 ? 'Gratuit' : this.store.formatFCFA(plan.price) + '/mois'}</p>
                  <ul class="space-y-2 text-xs text-slate-600 pt-2">
                    ${plan.features.map(f => `<li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-teal-600 shrink-0"></i> ${f}</li>`).join('')}
                  </ul>
                </div>
                <button onclick="app.upgradePlan('${pro.id}', '${plan.id}')"
                  class="mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition ${pro.subscriptionPlan === plan.id ? 'bg-teal-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}">
                  ${pro.subscriptionPlan === plan.id ? '✓ Formule Actuelle' : 'Choisir ' + plan.name}
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ============================================================================
  // 4.3 ESPACE ADMINISTRATEUR (AD01 à AD10)
  // ============================================================================
  renderAdminSpace() {
    const db = this.store.db;
    const totalSubRev = db.subscriptions.reduce((s, sub) => s + Number(sub.amount || 0), 0);
    const totalComm = db.bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + Number(b.commissionAmount || 0), 0);
    const pendingPros = db.providers.filter(p => p.verificationStatus === 'pending');

    return `
      <div class="bg-slate-950 text-white border-b border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-amber-400">Supervision Générale BookMe Cameroun</span>
            <h1 class="text-2xl font-extrabold">Console d'Administration (AD01 – AD10)</h1>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="app.exportAdminReport()" class="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-bold flex items-center gap-1.5">
              <i data-lucide="download" class="w-4 h-4"></i> Exporter Rapport JSON (AD10)
            </button>
            <button onclick="app.resetDemo()" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300">
              Réinitialiser Démo
            </button>
          </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-6 overflow-x-auto">
          ${[
            ['overview', 'bar-chart-3', 'Tableau de bord & Revenus (AD01/AD08/AD09)'],
            ['providers', 'shield-alert', `Vérification Prestataires (${pendingPros.length} en attente) (AD03)`],
            ['categories', 'layers', `Catégories (${db.categories.length}) (AD04)`],
            ['users', 'users', `Utilisateurs (${db.users.length}) (AD02)`],
            ['moderation', 'flag', 'Avis, Signalements & Audit (AD06/AD07)']
          ].map(([id, icon, label]) => `
            <button onclick="app.adminTab='${id}'; app.renderAll();"
              class="py-3 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-1.5 ${this.adminTab === id ? 'border-teal-400 text-teal-400' : 'border-transparent text-slate-400 hover:text-white'}">
              <i data-lucide="${icon}" class="w-4 h-4"></i> ${label}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <!-- KPI Globaux (AD01) -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-2xl border border-slate-200">
            <p class="text-xs text-slate-500">Utilisateurs & Prestataires</p>
            <p class="text-2xl font-extrabold text-slate-900 mt-1">${db.users.length} comptes</p>
            <p class="text-xs text-teal-700 font-semibold mt-1">${db.providers.filter(p => p.verificationStatus === 'verified').length} pros validés • ${pendingPros.length} en attente</p>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-slate-200">
            <p class="text-xs text-slate-500">Revenus Abonnements (AD08)</p>
            <p class="text-2xl font-extrabold text-teal-800 mt-1">${this.store.formatFCFA(totalSubRev)}/mois</p>
            <p class="text-xs text-slate-500 mt-1">Formules Pro (5k) & Business (15k)</p>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-slate-200">
            <p class="text-xs text-slate-500">Commissions Encaissées (AD09)</p>
            <p class="text-2xl font-extrabold text-amber-600 mt-1">${this.store.formatFCFA(totalComm)}</p>
            <p class="text-xs text-slate-500 mt-1">Taux actif : ${db.platform_settings.commissionRate}% sur Mobile Money</p>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-slate-200">
            <p class="text-xs text-slate-500">Total Réservations supervisées (AD05)</p>
            <p class="text-2xl font-extrabold text-slate-900 mt-1">${db.bookings.length}</p>
            <p class="text-xs text-emerald-700 font-semibold mt-1">${db.payments.length} transactions Mobile Money vérifiées</p>
          </div>
        </div>

        ${this.adminTab === 'overview' ? this.renderAdminOverview() : ''}
        ${this.adminTab === 'providers' ? this.renderAdminProviders() : ''}
        ${this.adminTab === 'categories' ? this.renderAdminCategories() : ''}
        ${this.adminTab === 'users' ? this.renderAdminUsers() : ''}
        ${this.adminTab === 'moderation' ? this.renderAdminModeration() : ''}
      </div>
    `;
  }

  renderAdminOverview() {
    const rate = this.store.db.platform_settings.commissionRate;
    return `
      <div class="grid lg:grid-cols-12 gap-6">
        <!-- Simulateur du Modèle Économique (Section 9.1 du Cahier des Charges) -->
        <div class="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-extrabold text-slate-900">Modèle Économique & Commissions (Section 9.1 / AD09)</h3>
            <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">Commission : ${rate}%</span>
          </div>
          <p class="text-xs text-slate-600">Ajustez le taux de commission prélevé sur les paiements en ligne Orange Money & MTN MoMo (RG10) :</p>
          <div class="flex items-center gap-3">
            <input type="range" min="1" max="15" value="${rate}"
              oninput="app.updateCommissionRate(this.value)" class="w-full accent-teal-700" />
            <span class="font-extrabold text-sm text-teal-800 w-14">${rate} %</span>
          </div>

          <div class="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
            <p class="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Simulation Mensuelle Cible Douala (Section 9.1)</p>
            <div class="flex justify-between"><span>50 pros × 5 000 FCFA (Abonnement Pro) :</span><strong>250 000 FCFA</strong></div>
            <div class="flex justify-between"><span>500 réservations × 5 000 FCFA (Volume 2,5M × ${rate}%) :</span><strong>${this.store.formatFCFA(2500000 * (rate / 100))}</strong></div>
            <div class="flex justify-between border-t border-slate-200 pt-2 text-sm font-extrabold text-teal-800">
              <span>Chiffre d'affaires mensuel simulé :</span>
              <span>${this.store.formatFCFA(250000 + 2500000 * (rate / 100))}</span>
            </div>
          </div>
        </div>

        <!-- Supervision des dernières réservations (AD05) -->
        <div class="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 class="text-base font-extrabold text-slate-900">Supervision des Réservations & Transactions (AD05)</h3>
          <div class="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            ${this.store.db.bookings.map(b => `
              <div class="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span class="font-mono font-bold text-slate-700">${b.id}</span> • <strong>${b.serviceNameSnapshot}</strong>
                  <p class="text-slate-500">${b.date} à ${b.time} • Tarif : ${this.store.formatFCFA(b.priceSnapshot)} (Comm: ${this.store.formatFCFA(b.commissionAmount)})</p>
                </div>
                ${window.BookMeViews.statusBadge(b.status)}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderAdminProviders() {
    return `
      <div class="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h3 class="text-base font-extrabold text-slate-900">Validation & Vérification des Professionnels (AD03 & RG02)</h3>
        <p class="text-xs text-slate-500">Règle RG02 : Un professionnel doit être validé par l'administrateur avant que ses prestations ne soient visibles par les clients.</p>
        <div class="space-y-3">
          ${this.store.db.providers.map(p => `
            <div class="p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-extrabold text-sm text-slate-900">${p.businessName}</span>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${p.verificationStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' : p.verificationStatus === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}">
                    ${p.verificationStatus.toUpperCase()}
                  </span>
                </div>
                <p class="text-xs text-slate-600 mt-1">${p.neighborhood}, ${p.city} • Tél : ${p.phone}</p>
                <p class="text-xs font-mono text-teal-800 bg-teal-50 px-2 py-1 rounded mt-1 inline-block">Justificatif (PR03) : ${p.verificationDoc}</p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                ${p.verificationStatus !== 'verified' ? `
                  <button onclick="app.adminVerifyProvider('${p.id}', 'verified')" class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold">
                    ✓ Valider le professionnel
                  </button>
                ` : ''}
                ${p.verificationStatus !== 'rejected' ? `
                  <button onclick="app.adminVerifyProvider('${p.id}', 'rejected')" class="px-3 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold">
                    Rejeter / Complément
                  </button>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderAdminCategories() {
    return `
      <div class="grid lg:grid-cols-12 gap-6">
        <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <h3 class="text-base font-extrabold text-slate-900">Catégories de Services (AD04)</h3>
          ${this.store.db.categories.map(c => `
            <div class="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p class="font-bold text-sm text-slate-900">${c.name}</p>
                <p class="text-xs text-slate-500">${c.description}</p>
              </div>
              <button onclick="app.toggleCategory('${c.id}')"
                class="px-3 py-1.5 rounded-xl text-xs font-bold ${c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}">
                ${c.active ? 'Active' : 'Désactivée'}
              </button>
            </div>
          `).join('')}
        </div>
        <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-3 self-start">
          <h3 class="text-base font-extrabold text-slate-900">Nouvelle Catégorie (AD04)</h3>
          <form onsubmit="app.handleAddCategory(event)" class="space-y-3 text-xs">
            <input type="text" name="name" required placeholder="Ex: Événementiel & Traiteur" class="w-full border border-slate-300 rounded-xl px-3 py-2" />
            <textarea name="description" required rows="2" placeholder="Exemples de prestations..." class="w-full border border-slate-300 rounded-xl px-3 py-2"></textarea>
            <button type="submit" class="w-full py-2.5 rounded-xl bg-teal-700 text-white font-bold">+ Créer la catégorie</button>
          </form>
        </div>
      </div>
    `;
  }

  renderAdminUsers() {
    return `
      <div class="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h3 class="text-base font-extrabold text-slate-900">Gestion des Comptes Clients & Professionnels (AD02)</h3>
        <div class="divide-y divide-slate-200 text-xs">
          ${this.store.db.users.map(u => `
            <div class="py-3 flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <img src="${u.avatar}" class="w-9 h-9 rounded-full object-cover" />
                <div>
                  <p class="font-bold text-slate-900">${u.name} <span class="uppercase text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">${u.role}</span></p>
                  <p class="text-slate-500">${u.email} • ${u.phone} • ${u.neighborhood}, ${u.city}</p>
                </div>
              </div>
              ${u.role !== 'admin' ? `
                <button onclick="app.toggleUser('${u.id}')" class="px-3 py-1.5 rounded-xl font-bold ${u.status === 'active' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-600 text-white'}">
                  ${u.status === 'active' ? 'Suspendre' : 'Réactiver'}
                </button>
              ` : '<span class="text-slate-400 font-semibold">Super Admin</span>'}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderAdminModeration() {
    return `
      <div class="grid lg:grid-cols-12 gap-6">
        <div class="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <h3 class="text-base font-extrabold text-slate-900">Modération des Avis Clients (AD07)</h3>
          ${this.store.db.reviews.map(r => `
            <div class="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
              <div>
                <p class="font-bold text-slate-900">${r.clientName} (${r.rating}/5 ★) — <span class="text-teal-700">${r.serviceName}</span></p>
                <p class="text-slate-600 mt-0.5">${r.comment}</p>
              </div>
              <button onclick="app.toggleReviewStatus('${r.id}')" class="px-2.5 py-1.5 rounded-lg font-bold shrink-0 ${r.status === 'published' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-100 text-emerald-800'}">
                ${r.status === 'published' ? 'Masquer' : 'Publier'}
              </button>
            </div>
          `).join('')}
        </div>

        <div class="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <h3 class="text-base font-extrabold text-slate-900">Journal de Traçabilité & Audit Sécurité (Section 11)</h3>
          <div class="space-y-2 max-h-80 overflow-y-auto text-xs">
            ${this.store.db.audit_logs.map(log => `
              <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div class="flex justify-between font-mono text-[11px] text-teal-800 font-bold">
                  <span>${log.action}</span>
                  <span>${new Date(log.timestamp).toLocaleString('fr-FR')}</span>
                </div>
                <p class="text-slate-700 mt-0.5"><strong>${log.actor}</strong> : ${log.details}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
});


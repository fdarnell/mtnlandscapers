/* Rental ROI calculator (/rental-roi-calculator).
 *
 * How much landscaping a short-term rental can pay for out of the extra
 * bookings it brings in, while the owner still comes out ahead every month.
 * Ported from the October 2026 prototype; the math is unchanged:
 *
 *   monthly income = nights x rate x (1 - platform fee) / 12
 *   gain           = income after the install - income before
 *   max payment    = gain - the owner's target monthly profit
 *   max price      = the loan amount that max payment pays off on the plan
 *
 * Deferred plans (no payments for N months) grow the balance at the plan APR
 * for those months before the payments start, which is how deferred interest
 * is charged when the promo balance isn't paid off in time.
 */
(function () {
  'use strict';
  var root = document.getElementById('roi');
  if (!root) return;

  // Promo and fixed-rate plans. The APR on 4188 and 2521 depends on the
  // applicant, so the page asks for it within the lender's published range.
  // Both START 5 POINTS ABOVE THEIR LOWEST (Franklin, 2026-10-28, the same
  // rule as the quoting software): the lowest rate is the best case.
  var PLANS = [
    { id: '6124', name: '0% APR for 24 months', apr: 0, term: 24, defer: 0,
      note: '0% APR, 24 equal monthly payments.' },
    { id: '2716', name: '6.99% APR for 60 months', apr: 6.99, term: 60, defer: 0,
      note: 'Fixed 6.99% APR, 60 monthly payments.' },
    { id: '4069', name: '6-month promo, then 108 payments', apr: 9.99, term: 108, defer: 0,
      note: 'Deferred interest: waived if paid in full within 6 months.' },
    { id: '4129', name: '12-month promo, then 108 payments', apr: 9.99, term: 108, defer: 0,
      note: 'Deferred interest: waived if paid in full within 12 months.' },
    { id: '4188', name: '18-month promo, then 84 payments', apr: 22.99, term: 84, defer: 0, range: [17.99, 29.99],
      note: 'Deferred interest: waived if paid in full within 18 months.' },
    { id: '2521', name: '12 months no payments, then 84', apr: 20.85, term: 84, defer: 12, range: [15.85, 24.77],
      note: 'No payments for 12 months. Interest is waived if paid in full during the promo; otherwise deferred interest is charged (shown here).' },
    { id: 'custom', name: 'Custom rate and term', apr: 9.99, term: 60, defer: 0,
      note: 'Enter any APR and term.' }
  ];

  function payment(price, p) {
    var r = p.apr / 100 / 12;
    var bal = price * Math.pow(1 + r, p.defer);
    if (r === 0) return bal / p.term;
    return (bal * r) / (1 - Math.pow(1 + r, -p.term));
  }

  function maxPrice(pmt, p) {
    if (pmt <= 0) return 0;
    var r = p.apr / 100 / 12;
    if (r === 0) return pmt * p.term;
    return ((pmt * (1 - Math.pow(1 + r, -p.term))) / r) / Math.pow(1 + r, p.defer);
  }

  function totalInterest(price, p) { return payment(price, p) * p.term - price; }

  function monthlyIncome(nights, rate, fee) { return (nights * rate * (1 - fee / 100)) / 12; }

  function usd(n, d) {
    d = d || 0;
    return (n < 0 ? '-' : '') + '$' + Math.abs(n).toLocaleString('en-US',
      { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  function pct(n) { return (n * 100).toFixed(1) + '%'; }

  function $(id) { return document.getElementById(id); }
  function num(id) { var v = parseFloat($(id).value); return isFinite(v) ? v : 0; }
  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
  function set(id, text, tone) {
    var el = $(id);
    el.textContent = text;
    if (tone !== undefined) {
      el.classList.toggle('roi-good', tone === 'good');
      el.classList.toggle('roi-bad', tone === 'bad');
    }
  }

  var select = $('roi-plan');
  PLANS.forEach(function (p) {
    var o = document.createElement('option');
    o.value = p.id;
    o.textContent = p.name;
    select.appendChild(o);
  });

  function currentPlans() {
    return PLANS.map(function (p) {
      var q = { id: p.id, name: p.name, apr: p.apr, term: p.term, defer: p.defer, note: p.note, range: p.range };
      if (p.id === '4188') q.apr = clamp(num('roi-apr4188') || p.apr, 17.99, 29.99);
      if (p.id === '2521') q.apr = clamp(num('roi-apr2521') || p.apr, 15.85, 24.77);
      if (p.id === 'custom') { q.apr = num('roi-capr'); q.term = Math.max(1, Math.round(num('roi-cterm') || 1)); }
      return q;
    });
  }

  function render() {
    var nights = num('roi-nights'), rate = num('roi-rate'), fee = num('roi-fee');
    var extra = num('roi-extra'), inc = num('roi-inc'), target = num('roi-target');
    var price = num('roi-price');
    var plans = currentPlans();
    var plan = plans.filter(function (p) { return p.id === select.value; })[0] || plans[0];

    $('roi-f4188').hidden = plan.id !== '4188';
    $('roi-f2521').hidden = plan.id !== '2521';
    $('roi-fcustom').hidden = plan.id !== 'custom';
    set('roi-note', plan.note);

    var keep = 1 - fee / 100;
    var cur = monthlyIncome(nights, rate, fee);
    var next = monthlyIncome(nights + extra, rate + inc, fee);
    var gain = next - cur;
    var maxPmt = gain - target;
    var maxP = maxPrice(maxPmt, plan);
    var pmt = payment(price, plan);
    var netDuring = gain - pmt;
    var months = plan.term + plan.defer;
    var totalExtra = gain * months - pmt * plan.term;
    var need = pmt + target;
    var nightsNeeded = rate * keep > 0 ? (need * 12) / (rate * keep) : NaN;
    var rateNeeded = nights + extra > 0 && keep > 0
      ? ((need * 12) / keep + nights * rate) / (nights + extra) - rate : NaN;

    set('roi-plan-label', plan.id === 'custom' ? 'custom plan' : 'plan ' + plan.id);
    var ok = maxPmt > 0;
    $('roi-max-ok').hidden = !ok;
    $('roi-max-no').hidden = ok;
    if (ok) {
      set('roi-max', usd(maxP));
      set('roi-max-target', usd(target) + '/month');
      set('roi-max-pmt', usd(maxPmt));
    }
    set('roi-gain', usd(gain));

    set('roi-at', usd(price));
    set('roi-pmt', usd(pmt, 2));
    set('roi-net', usd(netDuring), netDuring >= target ? 'good' : 'bad');
    set('roi-int', usd(totalInterest(price, plan)));
    set('roi-after', usd(gain), 'good');
    set('roi-months', String(months));
    set('roi-total', usd(totalExtra), totalExtra >= 0 ? 'good' : 'bad');
    $('roi-defer-stat').hidden = plan.defer === 0;
    set('roi-defer', String(plan.defer));
    set('roi-need-target', usd(target));
    set('roi-need-nights', isFinite(nightsNeeded) ? String(Math.ceil(nightsNeeded)) : '—');
    set('roi-need-rate', isFinite(rateNeeded) ? usd(Math.max(0, rateNeeded), 2) : '—');
    set('roi-need-extra', String(extra));

    set('roi-occ-now', pct(nights / 365));
    set('roi-occ-new', pct((nights + extra) / 365));
    set('roi-inc-now', usd(cur));
    set('roi-inc-new', usd(next), 'good');

    var rows = plans.map(function (p) {
      var pp = payment(price, p), n = gain - pp;
      var tr = document.createElement('tr');
      tr.tabIndex = 0;
      tr.dataset.plan = p.id;
      if (p.id === plan.id) tr.className = 'roi-sel';
      tr.innerHTML =
        '<td><span class="roi-pname"></span><small></small></td>' +
        '<td class="num">' + usd(pp, 2) + '</td>' +
        '<td class="num ' + (n >= target ? 'roi-good' : 'roi-bad') + '">' + usd(n) + '</td>' +
        '<td class="num">' + usd(totalInterest(price, p)) + '</td>' +
        '<td class="num">' + (maxPmt > 0 ? usd(maxPrice(maxPmt, p)) : '—') + '</td>';
      tr.querySelector('.roi-pname').textContent = p.name;
      tr.querySelector('small').textContent =
        (p.id === 'custom' ? '' : 'Plan ' + p.id + ' · ') + p.apr + '% APR';
      return tr;
    });
    var body = $('roi-compare');
    body.textContent = '';
    rows.forEach(function (tr) { body.appendChild(tr); });
  }

  function pick(e) {
    var tr = e.target.closest('tr[data-plan]');
    if (!tr) return;
    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
    if (e.type === 'keydown') e.preventDefault();
    select.value = tr.dataset.plan;
    render();
  }

  root.addEventListener('input', render);
  root.addEventListener('change', render);
  $('roi-compare').addEventListener('click', pick);
  $('roi-compare').addEventListener('keydown', pick);
  $('roi-print').addEventListener('click', function () { window.print(); });

  root.classList.add('roi-live');
  render();
})();

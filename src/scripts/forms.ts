/* ==========================================================================
   Formlar: iletişim, toptan teklif, bülten, sipariş talebi
   - PUBLIC_FORM_ENDPOINT tanımlıysa form servisine (Web3Forms / Formspree / Getform …) JSON olarak gönderilir.
   - Tanımlı değilse kullanıcının e-posta istemcisi hazır doldurulmuş bir e-postayla açılır (mailto).
   ========================================================================== */
import type { KvData } from './app';

const data = (): KvData => JSON.parse(document.getElementById('kv-data')!.textContent || '{}');

export type SendResult = { ok: boolean; via: 'service' | 'mailto'; error?: string };

/** Form servisine gönderim. Formspree/Getform/Web3Forms JSON + Accept: application/json kabul eder. */
export async function sendForm(formName: string, fields: Record<string, string>, opts: { newsletter?: boolean } = {}): Promise<SendResult> {
  const d = data();
  const endpoint = (opts.newsletter && d.form.newsletter) || d.form.endpoint;
  const subject = `[KIVRIM] ${formName}`;
  if (!endpoint) {
    const body = Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join('\n');
    location.href = `mailto:${d.form.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body + '\n\nSayfa: ' + location.href)}`;
    return { ok: true, via: 'mailto' };
  }
  const payload: Record<string, string> = { ...fields, form: formName, subject, _subject: subject, sayfa: location.href };
  if (d.form.key) payload.access_key = d.form.key; // Web3Forms
  if (fields['E-posta'] || fields.email) payload.replyto = fields['E-posta'] || fields.email;
  try {
    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) {
      let msg = res.statusText;
      try { const j = await res.json(); msg = j.message || j.error || (j.errors && j.errors.map((x: { message: string }) => x.message).join(', ')) || msg; } catch { /* yok say */ }
      return { ok: false, via: 'service', error: msg };
    }
    return { ok: true, via: 'service' };
  } catch (err) {
    return { ok: false, via: 'service', error: (err as Error).message };
  }
}

function status(el: HTMLElement | null, state: 'ok' | 'error' | 'info', text: string) {
  if (!el) return;
  el.hidden = false; el.dataset.state = state; el.textContent = text;
}

/** Form alanlarını etiket adlarıyla toplar (e-postada okunaklı olsun diye). */
export function collect(form: HTMLFormElement): Record<string, string> {
  const out: Record<string, string> = {};
  const fd = new FormData(form);
  for (const [name, value] of fd.entries()) {
    if (typeof value !== 'string' || name.startsWith('_')) continue;
    const el = form.elements.namedItem(name) as HTMLElement | null;
    const label = el?.dataset?.label || name;
    out[label] = out[label] ? out[label] + ', ' + value : value;
  }
  return out;
}

export function initForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-kv-form]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const st = form.querySelector<HTMLElement>('.form-status');
      // honeypot
      if ((form.elements.namedItem('_gotcha') as HTMLInputElement | null)?.value) return;
      if (!form.checkValidity()) {
        const bad = form.querySelector<HTMLInputElement>(':invalid');
        status(st, 'error', bad?.type === 'checkbox' ? 'Devam etmek için onay kutusunu işaretleyin.' : 'Lütfen zorunlu alanları doğru şekilde doldurun.');
        bad?.focus();
        return;
      }
      const btn = form.querySelector<HTMLButtonElement>('button[type=submit]');
      if (btn) btn.disabled = true;
      const res = await sendForm(form.dataset.kvForm!, collect(form), { newsletter: form.hasAttribute('data-newsletter') });
      if (btn) btn.disabled = false;
      if (res.ok && res.via === 'service') {
        status(st, 'ok', form.dataset.okText || 'Teşekkürler! Mesajınız bize ulaştı; en kısa sürede dönüş yapacağız.');
        form.reset();
        form.dispatchEvent(new CustomEvent('kv:sent'));
      } else if (res.ok) {
        status(st, 'info', 'E-posta uygulamanız açıldı. Mesajı göndermeyi unutmayın.');
      } else {
        status(st, 'error', 'Gönderilemedi (' + (res.error || 'bağlantı hatası') + '). Lütfen tekrar deneyin ya da ' + data().form.email + ' adresine yazın.');
      }
    });
  });
}

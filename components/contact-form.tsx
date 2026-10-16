'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, LockKeyhole } from 'lucide-react';
import { areas } from '@/content/areas';
import { siteConfig } from '@/site.config';
import {
  leadSchema,
  maskPhone,
  mensagemLead,
  momentos,
  urgencias,
  type Lead,
} from '@/lib/lead';
import { track } from '@/lib/analytics';
import { WhatsAppLink } from './whatsapp-link';
export function ContactForm({ initialArea = '' }: { initialArea?: string }) {
  const [step, setStep] = useState(initialArea ? 1 : 0);
  const [area, setArea] = useState(initialArea);
  const [momento, setMomento] = useState('');
  const [urgencia, setUrgencia] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ lead: Lead; saved: boolean } | null>(null);
  const title = useRef<HTMLHeadingElement>(null);
  function next() {
    const valid = step === 0 ? area : step === 1 ? momento : urgencia;
    if (!valid) {
      setError('Selecione uma opção para continuar.');
      return;
    }
    setError('');
    setStep(step + 1);
    setTimeout(() => title.current?.focus(), 0);
  }
  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = leadSchema.safeParse({
      ...Object.fromEntries(form),
      area,
      momento,
      urgencia,
      consentimento_lgpd: form.get('consentimento_lgpd') === 'on',
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error || 'Não foi possível enviar. Tente novamente.',
        );
      setDone({ lead: parsed.data, saved: result.saved });
      track('lead_submit', { area, momento });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível enviar.');
    } finally {
      setBusy(false);
    }
  }
  if (done)
    return (
      <div className="contact-form" role="status">
        <CheckCircle2 className="success-symbol" size={32} />
        <h3>
          {done.saved ? 'Recebemos seu contato.' : 'Sua mensagem está pronta.'}
        </h3>
        <p className="muted">
          {done.saved
            ? 'A equipe vai analisar sua solicitação. Se preferir, continue a conversa no WhatsApp.'
            : 'O envio pelo site ainda não está disponível. Abra o WhatsApp abaixo para enviar sua solicitação à equipe.'}
        </p>
        <WhatsAppLink message={mensagemLead(done.lead)} icon>
          Abrir WhatsApp
        </WhatsAppLink>
        {done.lead.momento === 'so_duvida' && (
          <div className="button-row">
            <Link className="text-link" href="/noticias">
              Consultar notícias
            </Link>
            {done.lead.area !== 'outro' && (
              <Link
                className="text-link"
                href={`/areas-de-atuacao/${done.lead.area}`}
              >
                Conhecer a área
              </Link>
            )}
          </div>
        )}
        <button
          className="plain-button"
          onClick={() => {
            setDone(null);
            setStep(0);
          }}
        >
          Iniciar outro contato
        </button>
      </div>
    );
  return (
    <div className="contact-form">
      <div className="form-top">
        <span>Vamos entender seu caso</span>
        <span>Etapa {step + 1} de 4</span>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-label="Etapas do contato"
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={step + 1}
      >
        <span style={{ width: `${(step + 1) * 25}%` }} />
      </div>
      <h3 ref={title} tabIndex={-1}>
        {
          [
            'Em que podemos ajudar?',
            'Em que momento você está?',
            'Como está o seu prazo?',
            'Como podemos falar com você?',
          ][step]
        }
      </h3>
      <form
        onSubmit={
          step === 3
            ? send
            : (e) => {
                e.preventDefault();
                next();
              }
        }
      >
        <div hidden={step !== 0}>
          <div className="field">
            <label htmlFor="area">Assunto do atendimento</label>
            <select
              id="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            >
              <option value="">Selecione uma área</option>
              {areas.map((a) => (
                <option value={a.slug} key={a.slug}>
                  {a.nome}
                </option>
              ))}
              <option value="outro">Outro assunto</option>
            </select>
          </div>
          <p className="small muted">
            Não sabe qual área escolher? Selecione “Outro assunto” e a equipe
            orienta você.
          </p>
        </div>
        <div hidden={step !== 1} className="options">
          {Object.entries(momentos).map(([value, label]) => (
            <label className="option" key={value}>
              <input
                type="radio"
                name="momento"
                value={value}
                checked={momento === value}
                onChange={() => setMomento(value)}
              />
              {label}
            </label>
          ))}
        </div>
        <div hidden={step !== 2} className="options">
          {Object.entries(urgencias).map(([value, label]) => (
            <label className="option" key={value}>
              <input
                type="radio"
                name="urgencia"
                value={value}
                checked={urgencia === value}
                onChange={() => setUrgencia(value)}
              />
              {label}
            </label>
          ))}
        </div>
        <div hidden={step !== 3}>
          <div className="field">
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              name="nome"
              autoComplete="name"
              maxLength={120}
              required={step === 3}
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="whatsapp">WhatsApp com DDD</label>
              <input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                autoComplete="tel-national"
                inputMode="tel"
                placeholder="(64) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(maskPhone(e.target.value))}
                required={step === 3}
              />
            </div>
            <div className="field">
              <label htmlFor="cidade">Cidade</label>
              <input
                id="cidade"
                name="cidade"
                defaultValue={siteConfig.city}
                autoComplete="address-level2"
                maxLength={100}
                required={step === 3}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="descricao">Breve descrição (opcional)</label>
            <textarea
              id="descricao"
              name="descricao"
              maxLength={400}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-describedby="description-help"
            />
            <small id="description-help" className="muted">
              {description.length}/400 · Evite dados sensíveis neste primeiro
              contato.
            </small>
          </div>
          <label className="check">
            <input
              name="consentimento_lgpd"
              type="checkbox"
              required={step === 3}
            />
            <span>
              Autorizo o uso dos dados para retorno sobre esta solicitação,
              conforme a{' '}
              <Link className="text-link" href="/privacidade">
                política de privacidade
              </Link>
              .
            </span>
          </label>
        </div>
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="website">Deixe este campo vazio</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <div className="form-actions">
          {step > 0 && (
            <button
              type="button"
              className="button ghost"
              disabled={busy}
              onClick={() => {
                setStep(step - 1);
                setError('');
              }}
            >
              Voltar
            </button>
          )}
          <button type="submit" className="button primary" disabled={busy}>
            {busy
              ? 'Enviando…'
              : step === 3
                ? 'Enviar solicitação'
                : 'Continuar'}
          </button>
        </div>
        <p className="form-note">
          <LockKeyhole size={14} />
          Seus dados são tratados com cuidado e discrição.
        </p>
      </form>
    </div>
  );
}

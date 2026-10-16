'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Check, SlidersHorizontal } from 'lucide-react';
import { areas } from '@/content/areas';
const options = [
  { value: '', label: 'Todas as áreas' },
  ...areas.map((a) => ({ value: a.slug, label: a.nome })),
];
export function AreaFilter({ initialValue = '' }: { initialValue?: string }) {
  const [value, setValue] = useState(
    options.some((o) => o.value === initialValue) ? initialValue : '',
  );
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const selected = options.find((o) => o.value === value) || options[0];
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  useEffect(() => {
    if (open)
      document
        .getElementById(`${id}-${active}`)
        ?.scrollIntoView({ block: 'nearest' });
  }, [active, open, id]);
  function select(index: number) {
    setValue(options[index].value);
    setOpen(false);
    trigger.current?.focus();
  }
  function key(event: React.KeyboardEvent) {
    if (
      ['ArrowDown', 'ArrowUp', 'Home', 'End', 'Escape', 'Enter', ' '].includes(
        event.key,
      )
    )
      event.preventDefault();
    if (event.key === 'Escape' || event.key === 'Tab') {
      setOpen(false);
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      setActive((i) =>
        !open
          ? Math.max(
              0,
              options.findIndex((o) => o.value === value),
            )
          : (i + (event.key === 'ArrowDown' ? 1 : -1) + options.length) %
            options.length,
      );
      setOpen(true);
    } else if (event.key === 'Home') {
      setOpen(true);
      setActive(0);
    } else if (event.key === 'End') {
      setOpen(true);
      setActive(options.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      if (open) select(active);
      else {
        setActive(options.findIndex((o) => o.value === value));
        setOpen(true);
      }
    } else if (event.key.length === 1) {
      const index = options.findIndex((o) =>
        o.label
          .toLocaleLowerCase('pt-BR')
          .startsWith(event.key.toLocaleLowerCase('pt-BR')),
      );
      if (index >= 0) {
        setOpen(true);
        setActive(index);
      }
    }
  }
  return (
    <div className="field area-filter" ref={root}>
      <label id={`${id}-label`} htmlFor={`${id}-trigger`}>
        Filtrar por área
      </label>
      <input type="hidden" name="area" value={value} />
      <button
        ref={trigger}
        id={`${id}-trigger`}
        type="button"
        className="select-trigger"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-options`}
        aria-haspopup="listbox"
        aria-labelledby={`${id}-label ${id}-value`}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        onKeyDown={key}
        onBlur={(e) => {
          if (!root.current?.contains(e.relatedTarget)) setOpen(false);
        }}
        onClick={() => {
          setActive(options.findIndex((o) => o.value === value));
          setOpen(!open);
        }}
      >
        <span className="select-value">
          <SlidersHorizontal size={18} />
          <span id={`${id}-value`}>{selected.label}</span>
        </span>
        <ChevronDown size={18} className={open ? 'rotated' : ''} />
      </button>
      <div className="select-popover" hidden={!open}>
        <div className="select-popover-heading">
          Escolha um assunto<span>{areas.length} áreas</span>
        </div>
        <ul role="listbox" id={`${id}-options`} aria-labelledby={`${id}-label`}>
          {options.map((o, i) => (
            <li
              id={`${id}-${i}`}
              role="option"
              aria-selected={value === o.value}
              key={o.value}
              className={active === i ? 'active' : ''}
              onMouseDown={(e) => e.preventDefault()}
              onMouseMove={() => setActive(i)}
              onClick={() => select(i)}
            >
              <span>{o.label}</span>
              {value === o.value && <Check size={18} />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

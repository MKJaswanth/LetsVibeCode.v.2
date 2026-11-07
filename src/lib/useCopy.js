import { useEffect, useRef, useState } from 'react';

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.select();
  const ok = document.execCommand('copy');
  input.remove();
  if (!ok) throw new Error('Clipboard unavailable');
}

// Returns [state, copy] where state is 'idle' | 'copied' | 'error'.
export function useCopy() {
  const [state, setState] = useState('idle');
  const timer = useRef(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async (text) => {
    try {
      await copyText(text);
      setState('copied');
    } catch {
      setState('error');
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), 1800);
  };

  return [state, copy];
}

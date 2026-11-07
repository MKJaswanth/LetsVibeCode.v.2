import React, { useState } from 'react';
import { hostnameOf } from '../lib/catalog';

function getInitials(name) {
  const words = name.replace(/[^a-zA-Z0-9 ]/g, '').trim().split(/\s+/).filter(Boolean);
  if (words.length > 1) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return (words[0]?.slice(0, 2) || '?').toUpperCase();
}

const SIZES = {
  sm: { box: 'h-8 w-8 rounded-md', img: 'h-5 w-5', text: 'text-[11px]' },
  md: { box: 'h-10 w-10 rounded-lg', img: 'h-6 w-6', text: 'text-xs' },
  lg: { box: 'h-14 w-14 rounded-xl', img: 'h-8 w-8', text: 'text-base' },
};

export default function ToolIcon({ tool, size = 'md', className = '' }) {
  const [failed, setFailed] = useState(false);
  const hostname = hostnameOf(tool.url);
  const s = SIZES[size] || SIZES.md;
  const showImage = hostname && !failed;

  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center overflow-hidden ring-1 ring-inset ${
        showImage ? 'bg-neutral-100 ring-black/5' : 'bg-raised ring-line text-muted'
      } ${s.box} ${className}`}
    >
      {showImage ? (
        <img
          src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=128`}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={`${s.img} object-contain`}
        />
      ) : (
        <span className={`font-medium ${s.text}`}>{getInitials(tool.name)}</span>
      )}
    </div>
  );
}

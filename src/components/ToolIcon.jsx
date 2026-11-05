import React, { useMemo, useState } from 'react';

function getInitials(name) {
  const words = name.replace(/[^a-zA-Z0-9 ]/g, '').trim().split(/\s+/).filter(Boolean);
  if (words.length > 1) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return (words[0]?.slice(0, 2) || '?').toUpperCase();
}

export default function ToolIcon({ tool, size = 'md', className = '' }) {
  const [hasError, setHasError] = useState(false);
  const hostname = useMemo(() => {
    try {
      return new URL(tool.url).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  }, [tool.url]);

  const sizes = {
    sm: 'h-8 w-8 rounded-lg text-[10px]',
    md: 'h-11 w-11 rounded-xl text-xs',
    lg: 'h-14 w-14 rounded-2xl text-base',
  };

  return (
    <div className={`tool-icon ${sizes[size] || sizes.md} ${className}`} aria-hidden="true">
      {!hasError && hostname ? (
        <img
          src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=128`}
          alt=""
          loading="lazy"
          onError={() => setHasError(true)}
          className="h-7 w-7 object-contain sm:h-8 sm:w-8"
        />
      ) : null}
      {hasError || !hostname ? <span>{getInitials(tool.name)}</span> : null}
    </div>
  );
}

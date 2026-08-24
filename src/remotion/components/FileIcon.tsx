import React from 'react';

interface FileIconProps {
  filename?: string;
  className?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({ filename = 'index.ts', className = 'w-4 h-4' }) => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  // Python (.py)
  if (ext === 'py') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M11.91 2C6.44 2 6.78 4.38 6.78 4.38L6.79 6.85H12V7.61H4.25S2 7.35 2 12.82c0 5.48 1.96 5.25 1.96 5.25h1.17v-2.47s-.06-2.95 2.9-2.95h5.02s2.79.05 2.79-2.71V4.71S16.29 2 11.91 2zM9.54 3.53a.88.88 0 110 1.76.88.88 0 010-1.76z"
          fill="#3776AB"
        />
        <path
          d="M12.09 22c5.47 0 5.13-2.38 5.13-2.38l-.01-2.47H12v-.76h7.75s2.25.26 2.25-5.21c0-5.48-1.96-5.25-1.96-5.25h-1.17v2.47s.06 2.95-2.9 2.95h-5.02s-2.79-.05-2.79 2.71v5.23S7.71 22 12.09 22zm2.37-1.53a.88.88 0 110-1.76.88.88 0 010 1.76z"
          fill="#FFD43B"
        />
      </svg>
    );
  }

  // TypeScript (.ts)
  if (ext === 'ts') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#3178C6" />
        <path d="M4 8.5h6.5v2.2H8v6.8H5.5v-6.8H4V8.5zm8 4.7c.6-.4 1.4-.7 2.2-.7 1 0 1.6.4 1.6 1.1 0 .6-.4.9-1.3 1.3-1.4.5-2.5 1.3-2.5 2.8 0 1.8 1.4 2.8 3.3 2.8 1.1 0 2.1-.3 2.7-.7l-.5-1.8c-.5.3-1.3.6-2.1.6-.9 0-1.4-.4-1.4-1 0-.6.4-.9 1.4-1.3 1.5-.6 2.4-1.4 2.4-2.8 0-1.7-1.3-2.7-3.1-2.7-1 0-2 .3-2.6.7l.3 1.7z" fill="#FFFFFF" />
      </svg>
    );
  }

  // React / TSX (.tsx, .jsx)
  if (ext === 'tsx' || ext === 'jsx') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#00D8FF" strokeWidth="1.5" transform="rotate(30 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#00D8FF" strokeWidth="1.5" transform="rotate(90 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#00D8FF" strokeWidth="1.5" transform="rotate(150 12 12)" />
        <circle cx="12" cy="12" r="2" fill="#00D8FF" />
      </svg>
    );
  }

  // JavaScript (.js, .mjs)
  if (ext === 'js' || ext === 'mjs') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#F7DF1E" />
        <path d="M7 16.5c.5.8 1.2 1.3 2.2 1.3 1.2 0 2-.8 2-2.3V9.5H8.8v5.8c0 .5-.2.8-.7.8-.4 0-.7-.2-.9-.6L7 16.5zm7.3-3.2c.6-.4 1.3-.7 2.1-.7 1 0 1.5.4 1.5 1.1 0 .6-.4.9-1.2 1.2-1.3.5-2.3 1.3-2.3 2.7 0 1.8 1.4 2.8 3.2 2.8 1.1 0 2.1-.3 2.7-.7l-.5-1.7c-.5.3-1.2.5-2 .5-.8 0-1.3-.4-1.3-1 0-.6.4-.9 1.4-1.3 1.4-.5 2.2-1.3 2.2-2.7 0-1.7-1.3-2.6-3-2.6-1 0-1.9.3-2.5.7l.4 1.7z" fill="#000000" />
      </svg>
    );
  }

  // JSON (.json)
  if (ext === 'json') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 4C6.5 4 6 5 6 6.5v2.5c0 1-.5 1.5-1.5 2 1 .5 1.5 1 1.5 2V17.5C6 19 6.5 20 8 20" stroke="#CBCB41" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 4c1.5 0 2 1 2 2.5v2.5c0 1 .5 1.5 1.5 2-1 .5-1.5 1-1.5 2V17.5c0 1.5-.5 2.5-2 2.5" stroke="#CBCB41" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // Markdown (.md)
  if (ext === 'md') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#083fa1" />
        <path d="M4 7h2.5l2 3 2-3H13v10h-2.5v-5l-2 3-2-3v5H4V7zm13 0h2.5v5.5H22L18.5 17 15 12.5h2.5V7z" fill="#FFFFFF" />
      </svg>
    );
  }

  // Shell / Bash (.sh, .bash, .zsh)
  if (ext === 'sh' || ext === 'bash' || ext === 'zsh') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#293138" />
        <path d="M6 8l5 4-5 4M13 16h5" stroke="#4EAA25" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Generic Code / Config file
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" fill="#383e4a" />
      <path d="M14 2v6h6" fill="#4f5666" />
      <path d="M9 13l-2 2 2 2M15 13l2 2-2 2" stroke="#9da5b4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

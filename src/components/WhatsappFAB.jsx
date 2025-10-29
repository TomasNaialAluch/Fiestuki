import React from 'react';

export default function WhatsappFAB({ phone = '5492974218265', message = 'Hola! Quiero hacer una consulta 😊' }) {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear por WhatsApp"
      className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-[90] shadow-lg rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-white transition-transform duration-200 hover:scale-105"
      style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* WhatsApp SVG */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
        <path d="M20.52 3.48A11.89 11.89 0 0012.04 0C5.48 0 .2 5.27.2 11.8a11.63 11.63 0 001.59 5.94L0 24l6.43-1.68a11.76 11.76 0 005.61 1.43h.01c6.56 0 11.84-5.27 11.84-11.8 0-3.15-1.23-6.11-3.37-8.37zM12.05 21.3h-.01a9.53 9.53 0 01-4.86-1.33l-.35-.2-3.82 1 1.02-3.72-.23-.38a9.45 9.45 0 01-1.45-5.08c0-5.25 4.29-9.52 9.56-9.52 2.55 0 4.95.99 6.76 2.78a9.4 9.4 0 012.8 6.74c0 5.25-4.29 9.51-9.62 9.51zm5.47-7.13c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.68.15-.2.3-.78.96-.95 1.16-.18.2-.35.23-.65.08-.3-.15-1.25-.45-2.38-1.43-.88-.75-1.47-1.67-1.64-1.95-.17-.3 0-.45.14-.6.14-.15.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.63-.93-2.22-.24-.58-.5-.5-.68-.5h-.58c-.2 0-.53.08-.8.38-.27.3-1.05 1.03-1.05 2.5s1.08 2.9 1.24 3.1c.15.2 2.13 3.26 5.16 4.43.72.3 1.28.48 1.72.61.72.23 1.38.2 1.9.12.58-.09 1.75-.72 2-1.43.25-.71.25-1.32.18-1.44-.08-.12-.28-.2-.58-.35z"/>
      </svg>
    </a>
  );
}



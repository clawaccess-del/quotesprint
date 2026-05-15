'use client';

import { useEffect, useMemo, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

function isIosDevice() {
  if (typeof window === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isStandalone() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches || ('standalone' in window.navigator && Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone));
}

function downloadIconFile() {
  const link = document.createElement('a');
  link.href = '/brand/quotesprint-circle-logo.png';
  link.download = 'quotesprint-home-screen-icon.png';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function MobileInstallButton() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [installed, setInstalled] = useState(false);
  const ios = useMemo(() => isIosDevice(), []);

  useEffect(() => {
    setInstalled(isStandalone());

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => null);
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    function handleInstalled() {
      setInstalled(true);
      setInstallPrompt(null);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  async function installIcon() {
    if (installed) return;
    if (installPrompt) {
      await installPrompt.prompt();
      await installPrompt.userChoice.catch(() => null);
      setInstallPrompt(null);
      return;
    }
    downloadIconFile();
    setShowHelp(true);
  }

  if (installed) {
    return <div className="mobile-install-card installed"><strong>QuoteSprint icon installed</strong><span>Open QuoteSprint from your home screen anytime.</span></div>;
  }

  return (
    <div className="mobile-install-card">
      <div>
        <strong>Add a QuoteSprint icon</strong>
        <span>Create a home-screen shortcut that opens this URL: quotesprint.vercel.app/app.</span>
      </div>
      <button type="button" className="button mini" onClick={installIcon}>{installPrompt ? 'Install home-screen icon' : 'Download icon'}</button>
      {showHelp ? (
        <p className="fine-print install-help">
          {ios ? 'Browsers do not allow websites to add the linked icon automatically on iPhone. The icon file downloaded; to create the shortcut, open QuoteSprint in Safari, tap Share, then Add to Home Screen.' : 'The icon file downloaded. If your browser did not show an install prompt, open the browser menu and choose Install app or Add to Home screen to create the linked shortcut.'}
        </p>
      ) : null}
    </div>
  );
}

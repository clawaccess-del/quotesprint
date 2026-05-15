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

  async function installApp() {
    if (installed) return;
    if (!installPrompt) {
      setShowHelp((value) => !value);
      return;
    }
    await installPrompt.prompt();
    await installPrompt.userChoice.catch(() => null);
    setInstallPrompt(null);
  }

  if (installed) {
    return <div className="mobile-install-card installed"><strong>Mobile app icon installed</strong><span>Open QuoteSprint from your phone home screen anytime.</span></div>;
  }

  return (
    <div className="mobile-install-card">
      <div>
        <strong>Add QuoteSprint to your phone</strong>
        <span>Install a home-screen icon that opens straight into the mobile app.</span>
      </div>
      <button type="button" className="button mini" onClick={installApp}>{installPrompt ? 'Download mobile app' : 'Show install steps'}</button>
      {showHelp ? (
        <p className="fine-print install-help">
          {ios ? 'On iPhone: tap Share in Safari, then Add to Home Screen.' : 'On Android: open the browser menu, then tap Install app or Add to Home screen.'}
        </p>
      ) : null}
    </div>
  );
}

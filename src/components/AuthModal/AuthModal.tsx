// components/AuthModal.tsx
import {useState} from 'react';
import {supabase} from '../../lib/supabaseClient';
import ModalWrapper from '../ModalWrapper';
import s from './AuthModal.module.css';
import {useTranslation} from '../../hooks/useTranslation';

export default function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const {t} = useTranslation();

  const handleAuth = async () => {
    setMessage('');
    const method =
      mode === 'signIn'
        ? supabase.auth.signInWithPassword
        : supabase.auth.signUp;

    const {error} = await method({email, password});

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(t('auth.successMessage'));
      onClose();
    }
  };

  const handleGoogleLogin = async () => {
    const {error} = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) setMessage(error.message);
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      title={mode === 'signIn' ? t('auth.signInTitle') : t('auth.signUpTitle')}
      onClose={onClose}
    >
      <button className={s.googleButton} onClick={handleGoogleLogin}>
        {t('auth.googleButton')}
      </button>

      <div className={s.divider}>{t('auth.or')}</div>

      <input
        className={s.input}
        type="email"
        placeholder={t('auth.emailPlaceholder')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className={s.input}
        type="password"
        placeholder={t('auth.passwordPlaceholder')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className={s.submitButton} onClick={handleAuth}>
        {mode === 'signIn' ? t('auth.signInButton') : t('auth.signUpButton')}
      </button>

      <p className={s.toggleText}>
        {mode === 'signIn' ? (
          <>
            {t('auth.noAccount')}
            <span className={s.toggleLink} onClick={() => setMode('signUp')}>
              {t('auth.registerLink')}
            </span>
          </>
        ) : (
          <>
            {t('auth.haveAccount')}
            <span className={s.toggleLink} onClick={() => setMode('signIn')}>
              {t('auth.loginLink')}
            </span>
          </>
        )}
      </p>
      {message && <p className={s.message}>{message}</p>}
    </ModalWrapper>
  );
}

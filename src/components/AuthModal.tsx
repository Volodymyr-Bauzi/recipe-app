import {useState} from 'react';
import {supabase} from '../lib/supabaseClient';
import s from './AuthModal.module.css';

export default function AuthModal({onClose}: {onClose: () => void}) {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

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
      setMessage('Успішно! Перевірте пошту або увійдіть.');
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
    <div className={s.overlay}>
      <div className={s.modal}>
        <button className={s.closeButton} onClick={onClose}>
          ×
        </button>
        <h2 className={s.title}>
          {mode === 'signIn' ? 'Увійти' : 'Зареєструватися'}
        </h2>

        <button className={s.googleButton} onClick={handleGoogleLogin}>
          🟢 Продовжити з Google
        </button>

        <div className={s.divider}>або</div>

        <input
          className={s.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={s.input}
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={s.submitButton} onClick={handleAuth}>
          {mode === 'signIn' ? 'Увійти' : 'Зареєструватися'}
        </button>
        <p className={s.toggleText}>
          {mode === 'signIn' ? (
            <>
              Немає акаунту?
              <span className={s.toggleLink} onClick={() => setMode('signUp')}>
                Зареєструватися
              </span>
            </>
          ) : (
            <>
              Вже є акаунт?
              <span className={s.toggleLink} onClick={() => setMode('signIn')}>
                Увійти
              </span>
            </>
          )}
        </p>
        {message && <p className={s.message}>{message}</p>}
      </div>
    </div>
  );
}

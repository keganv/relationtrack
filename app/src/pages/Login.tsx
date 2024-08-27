import {FormEvent, useState} from 'react';
import {Link} from 'react-router-dom';
import Spinner from '../components/ui/Spinner';
import useAuthContext from '../hooks/useAuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, errors, loading } = useAuthContext();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  }

  return (
    <form method="POST" onSubmit={handleLogin} className="pa">
      <div className="form-row">
        <label htmlFor="email">Email<span className="required">*</span></label>
        <input id="email" name="email" type="email" autoComplete="email"
          className={`${errors?.email && 'error'}`} value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {errors?.email && <span className="error">{errors?.email[0]}</span>}
      </div>
      <div className="form-row">
        <label htmlFor="password">Password<span className="required">*</span></label>
        <input id="password" name="password" type="password" autoComplete="current-password"
               className={`${errors?.password && 'error'}`} required
               value={password} onChange={e => setPassword(e.target.value)}
        />
        {errors?.password && <span className="error">{errors?.password[0]}</span>}
      </div>
      <div className="flex wrap align-middle justify-between margin-top">
        <button type="submit" className="button primary col-12-sm" disabled={loading}>
          <span className={`${loading && 'mr-sm'}`}>Sign in</span>
          <Spinner loading={loading} />
        </button>
        <div className="col-12-sm font-sm text-right text-center-sm mt-4-sm">
          <div>
            <Link to={'/forgot-password'}>
              Forgot your password?
            </Link>
          </div>
          <div>
            Don't have an account? <Link to={'/register'} className="font-bold">Sign up!</Link>
          </div>
        </div>
      </div>
    </form>
  );
}

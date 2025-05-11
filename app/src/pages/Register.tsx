import { type FormEvent, useState } from 'react';
import { Link } from 'react-router';

import Spinner from '../components/ui/Spinner';
import useAuthContext from '../hooks/useAuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [first_name, setfirst_name] = useState('');
  const [last_name, setlast_name] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [username, setUsername] = useState('');
  const [terms, setTerms] = useState(false);
  const { register, errors, loading } = useAuthContext();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    await register({ first_name, last_name, email, password, password_confirmation, username, terms });
  }

  return (
    <form className="shadow-md mb-4 thick-border" method="POST" onSubmit={handleRegister}>
      <div className="form-row">
        <label htmlFor="first_name">First Name<span className="required">*</span></label>
        <input id="first_name" name="first_name" type="text" value={first_name}
               className={`${errors?.first_name && 'error'}`}
               onChange={(e) => setfirst_name(e.target.value)}/>
        {errors?.first_name && <span className="error">{errors?.first_name[0]}</span>}
      </div>
      <div className="form-row">
        <label htmlFor="last_name">Last Name<span className="required">*</span></label>
        <input id="last_name" name="last_name" type="text" value={last_name}
               className={`${errors?.last_name && 'error'}`}
               onChange={e => setlast_name(e.target.value)}
        />
        {errors?.last_name && <span className="error">{errors?.last_name[0]}</span>}
      </div>
      <div className="form-row">
        <label htmlFor="username">Username<span className="required">*</span></label>
        <input id="username" name="username" type="text" value={username}
               className={`${errors?.username && 'error'}`}
               onChange={e => setUsername(e.target.value)}
        />
        {errors?.username && <span className="error">{errors?.username[0]}</span>}
      </div>
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
               className={`${errors?.password && 'error'}`} value={password}
               onChange={e => setPassword(e.target.value)}
        />
        {errors?.password && <span className="error">{errors?.password[0]}</span>}
      </div>
      <div className="form-row">
        <label htmlFor="password_confirmation">Confirm Password<span className="required">*</span></label>
        <input id="password_confirmation" name="password_confirmation" type="password"
               autoComplete="current-password" className={`${errors?.password && 'error'}`}
               value={password_confirmation} onChange={e => setPasswordConfirmation(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <label htmlFor="agree_confirm" className="inline">
          <input id="agree_confirm" type="checkbox" name="terms" className="mr-1"
                 onChange={e => setTerms(e.target.checked)}/>
          I agree with <Link to={'/terms'}>the terms</Link>
        </label>
        {errors?.terms && <div className="flex-1 w-full error">{errors?.terms[0]}</div>}
      </div>
      <div className="flex flex-wrap justify-between items-center">
        <button type="submit" className="button primary angle-right" disabled={loading}>
          <span className={`${loading && 'mr-2'}`}>Register</span>
          <Spinner loading={loading}/>
        </button>
        <div className="mt-6 sm:mt-0 text-xs">
          Already have an account? <Link to={'/login'} className="link">Sign in.</Link>
        </div>
      </div>
    </form>
  );
}

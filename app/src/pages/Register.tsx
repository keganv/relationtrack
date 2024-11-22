import { FormEvent, useState } from 'react';
import { Link } from 'react-router';
import Spinner from '../components/ui/Spinner';
import useAuthContext from '../hooks/useAuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [username, setUsername] = useState('');
  const [terms, setTerms] = useState(false);
  const { register, errors, loading } = useAuthContext();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    await register({ firstName, lastName, email, password, password_confirmation, username, terms });
  }

  return (
    <form className="shadow-md mb-4 thick-border" method="POST" onSubmit={handleRegister}>
      <div className="form-row">
        <label htmlFor="firstName">First Name<span className="required">*</span></label>
        <input id="firstName" name="firstName" type="text" value={firstName}
               className={`${errors?.firstName && 'error'}`}
               onChange={(e) => setFirstName(e.target.value)}/>
        {errors?.firstName && <span className="error">{errors?.firstName[0]}</span>}
      </div>
      <div className="form-row">
        <label htmlFor="lastName">Last Name<span className="required">*</span></label>
        <input id="lastName" name="lastName" type="text" value={lastName}
               className={`${errors?.lastName && 'error'}`}
               onChange={e => setLastName(e.target.value)}
        />
        {errors?.lastName && <span className="error">{errors?.lastName[0]}</span>}
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

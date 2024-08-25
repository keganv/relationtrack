import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../components/ui/Spinner";
import useAuthContext from "../hooks/useAuthContext";

export default function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [username, setUsername] = useState('');
  const [terms, setTerms] = useState('');
  const { register, errors, loading } = useAuthContext();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    register({ name, email, password, password_confirmation, username, terms })
  }

  return (
    <form className="space-y-6" method="POST" onSubmit={handleRegister}>
      <div className="form-row">
        <label htmlFor="name">Name<span className="required">*</span></label>
        <input id="name" name="name" type="text" value={name}
               className={`${errors.name && 'error'}`}
               onChange={e => setName(e.target.value)}
        />
        {errors.name && <span className="error">{errors.name[0]}</span>}
      </div>
      <div className="form-row">
        <label htmlFor="username">Username<span className="required">*</span></label>
        <input id="username" name="username" type="text" value={username}
               className={`${errors.username && 'error'}`}
               onChange={e => setUsername(e.target.value)}
        />
        {errors.username && <span className="error">{errors.username[0]}</span>}
      </div>
      <div className="form-row">
        <label htmlFor="email">Email<span className="required">*</span></label>
        <input id="email" name="email" type="email" autoComplete="email"
               className={`${errors.email && 'error'}`} value={email}
               onChange={e => setEmail(e.target.value)}
        />
        {errors.email && <span className="error">{errors.email[0]}</span>}
      </div>
      <div className="form-row">
        <label htmlFor="password">Password<span className="required">*</span></label>
        <input id="password" name="password" type="password" autoComplete="current-password"
               className={`${errors.password && 'error'}`} value={password}
               onChange={e => setPassword(e.target.value)}
        />
        {errors.password && <span className="error">{errors.password[0]}</span>}
      </div>
      <div className="form-row">
        <label htmlFor="password_confirmation">Confirm Password<span className="required">*</span></label>
        <input id="password_confirmation" name="password_confirmation" type="password"
               autoComplete="current-password" className={`${errors.password && 'error'}`}
               value={password_confirmation} onChange={e => setPasswordConfirmation(e.target.value)}
        />
      </div>
      <div className="form-row">
        <div className="flex">
          <input id="agree_confirm" type="checkbox" name="terms" className="w-auto mr-sm"
                 onChange={e => setTerms(e.target.value)} />
          <label htmlFor="agree_confirm" className="pointer">
            I agree with <Link to={'/terms'}>the terms</Link>
          </label>
        </div>
        {errors.terms && <span className="error">{errors.terms[0]}</span>}
      </div>
      <div className="flex wrap align-middle justify-between margin-top">
        <button type="submit" className="button primary col-12-sm" disabled={loading}>
          <span className={`${loading && 'mr-sm'}`}>Register</span>
          <Spinner loading={loading} />
        </button>
        <div className="col-12-sm font-sm text-right text-center-sm mt-4-sm">
          Already have an account? <Link to={'/login'}>Sign in.</Link>
        </div>
      </div>
    </form>
  );
}

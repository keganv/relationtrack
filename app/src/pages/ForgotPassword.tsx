import { FormEvent, useEffect, useState } from "react";
import Spinner from "../components/ui/Spinner";
import useAuthContext from "../hooks/useAuthContext";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const { sendPasswordResetLink, loading, errors, status } = useAuthContext();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    sendPasswordResetLink({ email });
    setEmail('');
  }

  useEffect(() => {
    if (status) {
      toast.success(status)
    }
  }, [status])

  return (
    <form className="space-y-6" method="POST" onSubmit={handleSubmit}>
      <h2 className="text-center text-2xl">Forgot password?</h2>
      <p className="text-sm">Enter your registered email address, and we'll email you a link to
        reset your password.</p>
      <div className="mt-2">
        <label htmlFor="email" className="required">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={`${errors.email && 'error'}`}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {errors.email && <div className="error" role="alert">{errors.email[0]}</div>}
      </div>
      <div className="mt-2">
        <button type="submit" className="button primary angle-left" disabled={loading}>
          Send Link <Spinner loading={loading}/>
        </button>
      </div>
    </form>
  )
}

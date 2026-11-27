import { useState } from 'react'
import Button from './Button'
import { PASSWORD } from '../data/system'

/* Password prompt used by the role-switch dialog in App.jsx. */
export default function PasswordForm({ roleLabel, submitLabel, onSuccess, onCancel }) {
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (pw === PASSWORD) onSuccess()
    else { setError('Incorrect password. Check it and try again.'); setPw('') }
  }

  return (
    <form onSubmit={submit}>
      <label className="block">
        <span className="mb-1 block text-[13px] text-muted">Password for {roleLabel}</span>
        <div className="flex gap-2">
          <input
            type={show ? 'text' : 'password'} value={pw} autoFocus autoComplete="off"
            onChange={(e) => { setPw(e.target.value); setError('') }}
            aria-invalid={!!error} aria-describedby={error ? 'pw-error' : undefined}
            className="min-w-0 flex-1 rounded border border-line bg-surface px-2.5 py-2"
          />
          <Button type="button" variant="ghost" onClick={() => setShow(!show)} aria-pressed={show}>{show ? 'Hide' : 'Show'}</Button>
        </div>
      </label>
      {error && <p id="pw-error" role="alert" className="mt-2 mb-0 text-sm text-bad">{error}</p>}
      <div className="mt-4 flex justify-end gap-2">
        {onCancel && <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" variant="primary">{submitLabel}</Button>
      </div>
    </form>
  )
}

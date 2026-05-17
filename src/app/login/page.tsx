export default function LoginPage({ searchParams }: { searchParams?: Promise<{ sent?: string; error?: string }> }) {
  return (
    <section className="page-shell checkout-shell">
      <span className="eyebrow">Customer login</span>
      <h1>Log in with your purchase email.</h1>
      <p className="lead">Enter the email used at checkout and LeadSprint will send a secure login link if there is an active purchase or subscription on file.</p>
      <div className="checkout-card login-form">
        <a className="button full google-button" href="/api/auth/google/start">Continue with Google</a>
        <div className="login-divider"><span>or</span></div>
        <form action="/api/auth/request" method="post">
          <label>
            Email address
            <input type="email" name="email" placeholder="you@company.com" required />
          </label>
          <button className="button full" type="submit">Send login link</button>
        </form>
        <p className="fine-print">No password needed. Google login works when the Google account email matches the purchase email. Email links expire after 15 minutes.</p>
      </div>
    </section>
  );
}

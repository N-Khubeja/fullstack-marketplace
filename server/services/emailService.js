const resend = require("../config/resend")

async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}) {
  const { data, error } =
    await resend.emails.send({
      from:
        "My App <onboarding@resend.dev>",

      to: [to],

      subject: "Reset your password",

      html: `
        <div style="
          max-width: 560px;
          margin: 0 auto;
          padding: 24px;
          font-family: Arial, sans-serif;
          color: #222;
        ">
          <h1>Password reset</h1>

          <p>Hello ${name},</p>

          <p>
            We received a request to reset
            your password.
          </p>

          <p>
            Click the button below to choose
            a new password:
          </p>

          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #111;
              color: #fff;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Reset password
          </a>

          <p>
            This link will expire in 15 minutes.
          </p>

          <p>
            If you did not request this,
            you can ignore this email.
          </p>
        </div>
      `,
    })

  if (error) {
    throw new Error(
      error.message ||
      "Password reset email could not be sent"
    )
  }

  return data
}

module.exports = {
  sendPasswordResetEmail,
}
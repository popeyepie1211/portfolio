# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Contact form email setup

The contact form now posts to `/api/contact` and sends two emails through Resend: one to the portfolio inbox and one automatic thank-you reply to the visitor.

### Environment variables

Set these before running in development or deploying to Vercel:

- `RESEND_API_KEY` - your Resend API key.
- `RESEND_FROM_EMAIL` - a verified sender such as `Arya Shewale <onboarding@resend.dev>` or your own verified domain sender.

For local development, create a `.env.local` file by copying `.env.example` and filling in the values.

### Local development

The Vite dev server includes a lightweight `/api/contact` handler so the form can be tested locally with `npm run dev`.

### Deployment

1. Add the environment variables in your Vercel project settings.
2. Verify the `RESEND_FROM_EMAIL` sender in Resend if you are not using the default onboarding sender.
3. Deploy the site and submit the contact form once to confirm both emails arrive.

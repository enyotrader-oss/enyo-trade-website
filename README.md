# Enyo Trade Website

A responsive, single-page English website created for Enyo Trade. It now includes a small Node backend so the contact form can send email directly without opening the visitor's mail application.

## Files
- `index.html` — Website content
- `styles.css` — Design, gold/dark theme and responsive layout
- `script.js` — Mobile menu, reveal animations and contact-form behavior
- `server.js` — Local static server and direct mail API
- `.env.example` — SMTP configuration template
- `assets/` — Enyo Trade logo and favicon files

## Setup
1. Copy `.env.example` to `.env`
2. Fill in your SMTP details
3. Run `npm install`
4. Run `npm start`
5. Open `http://localhost:3001`

## Gmail setup
If you use Gmail for `enyotrader@gmail.com`, create a Gmail App Password and place it in `SMTP_PASS`.

## Render deployment
1. Push this folder to a GitHub repository
2. Create a new Render Web Service from that repository
3. Render will detect `render.yaml`
4. Add the SMTP environment variables in Render
5. Deploy and test the contact form

## Publishing options
The folder can be deployed on any hosting that supports Node.js, or separated into static hosting plus a Node backend.

## Important
Replace or expand any future performance content only with accurate and verifiable data. The website already includes a clear risk disclosure and explains that Enyo Trade is not a prop firm and does not manage client funds.

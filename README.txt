OZZY TRADER — TOKEN-GATED SITE

1. Open index.html in a text editor.
2. Search for: PASTE_YOUR_COIN_CA_HERE
3. Replace it with the Solana token mint / CA for $OZZY.
4. Optional: change MIN_TOKENS = 1 to the minimum amount users must hold.
5. Deploy index.html to Vercel / Netlify / GitHub Pages.

IMPORTANT:
This one-file build checks holdings in the browser. It is good for the front-end experience, but a technical user can bypass a client-side gate. If Ozzy is later connected to a paid AI/API, verify the wallet signature + token balance again on your server/API route before returning AI responses.

export async function GET() {
  const ready = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
  return Response.json({
    application:'DreamTrawell DMC', webAppConfigured:ready,
    project: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || null,
    mode:'firebase-client-sdk', adminSdk:false,
    notice:ready ? 'Configure Firestore/Storage rules and an adminUsers role before using the CMS.' : 'Copy .env.example to .env.local and restart Next.js.',
  }, { headers: { 'Cache-Control':'no-store' } });
}

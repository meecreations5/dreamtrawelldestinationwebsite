export const metadata = { title: 'Website Management | DreamTrawell', robots:{index:false,follow:false} };
export default function AdminLayout({children}) { return <div className="admin-root"><a className="skip" href="#main">Skip to admin content</a>{children}</div>; }

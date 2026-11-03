'use client';
import { useState } from 'react';
import { ArrowUpRight, Mail, Info } from 'lucide-react';
// V6 static parity: this explicitly prepares an email draft; it is not a stored CRM enquiry.
// Address is the trade-quotation contact shown in the supplied V6 static source; verify before deployment.
const TRADE_INBOX='outbound@dreamtrawelldestinations.com';
export function QuickContact(){const [values,setValues]=useState({name:'',agency:'',email:'',topic:'New destination enquiry',message:''});const [notice,setNotice]=useState('');
 function set(k,v){setValues(old=>({...old,[k]:v}));}
 function submit(e){e.preventDefault();if(!values.name.trim()||!values.agency.trim()||!/^\S+@\S+\.\S+$/.test(values.email)||!values.message.trim()){setNotice('Please complete all required fields.');return;}
 const subject=`DreamTrawell trade desk: ${values.topic}`;
 const body=[`Contact: ${values.name}`,`Agency: ${values.agency}`,`Email: ${values.email}`,`Topic: ${values.topic}`,'',values.message].join('\n');
 // No application state or sensitive data is persisted in the browser.
 window.location.href=`mailto:${TRADE_INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
 setNotice('Your email application should open with a prepared draft. Please send it there; no message has been submitted to the website.');
 }
 return <form className="v12-quick-form" onSubmit={submit}><div className="v12-form-title"><Mail size={26}/><div><h3>Send a message.</h3><p>For a general question or an early destination idea.</p></div></div><div className="v12-quick-fields"><label>Your name *<input required maxLength={120} value={values.name} onChange={e=>set('name',e.target.value)}/></label><label>Agency / company *<input required maxLength={120} value={values.agency} onChange={e=>set('agency',e.target.value)}/></label><label className="full">Business email *<input required type="email" maxLength={180} value={values.email} onChange={e=>set('email',e.target.value)}/></label><label className="full">Enquiry topic<select value={values.topic} onChange={e=>set('topic',e.target.value)}>{['New destination enquiry','Quotation or revision','Travel-agent partnership','Other query'].map(x=><option key={x}>{x}</option>)}</select></label><label className="full">Your message *<textarea rows={5} maxLength={2000} required value={values.message} onChange={e=>set('message',e.target.value)}/></label></div><button type="submit" className="btn btn-red">Prepare email message <ArrowUpRight size={16}/></button><p className="v12-contact-disclosure"><Info size={15}/> This opens your email app. It does not create a website enquiry or CRM lead.</p>{notice&&<p className="v12-notice" role="status">{notice}</p>}</form>;
}

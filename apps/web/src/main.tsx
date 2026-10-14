import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Activity, Bot, ClipboardList, FilePlus2, LayoutDashboard, ShieldCheck, Truck, Wrench } from 'lucide-react'
import './styles.css'

type Claim = {id:string; member_name:string; vehicle:string; incident_summary:string; status:string; version:number; created_at:string}
type StageEvent = {id:string; previous:string|null; current:string; reason:string; actor:string; occurred_at:string}
type Section = 'Overview'|'Claims'|'Providers'|'Dealers'|'AI Workforce'|'Audit'
const sections: {name:Section;icon:React.ElementType}[] = [
  {name:'Overview',icon:LayoutDashboard},{name:'Claims',icon:ClipboardList},
  {name:'Providers',icon:Wrench},{name:'Dealers',icon:Truck},
  {name:'AI Workforce',icon:Bot},{name:'Audit',icon:ShieldCheck}
]
const next: Record<string,string> = {SUBMITTED:'TRIAGE',TRIAGE:'ASSESSMENT',ASSESSMENT:'REPAIR_PLANNING',REPAIR_PLANNING:'AUTHORIZATION_PENDING'}
const api = async <T,>(path:string,options?:RequestInit):Promise<T> => {
  const response=await fetch(path,{...options,headers:{'Content-Type':'application/json',...options?.headers}})
  if(!response.ok) { const err=await response.json().catch(()=>({detail:'Request failed'})); throw new Error(err.detail||'Request failed') }
  return response.json() as Promise<T>
}
function App(){
  const [section,setSection]=useState<Section>('Overview')
  const [claims,setClaims]=useState<Claim[]>([])
  const [selected,setSelected]=useState<Claim|null>(null)
  const [events,setEvents]=useState<StageEvent[]>([])
  const [modal,setModal]=useState(false)
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  const [notice,setNotice]=useState('')
  const [form,setForm]=useState({member_name:'',vehicle:'',incident_summary:''})
  async function refresh(){try{setClaims(await api<Claim[]>('/api/v1/claims'));setError('')}catch(e){setError((e as Error).message+' — Start the local API on port 8000.')}}
  useEffect(()=>{void refresh()},[])
  async function openClaim(c:Claim){setSelected(c);try{setEvents(await api<StageEvent[]>(`/api/v1/claims/${c.id}/events`))}catch(e){setError((e as Error).message)}}
  async function create(e:React.FormEvent){e.preventDefault();setBusy(true);setError('');try{const claim=await api<Claim>('/api/v1/claims',{method:'POST',body:JSON.stringify(form)});setModal(false);setForm({member_name:'',vehicle:'',incident_summary:''});setNotice(`Created ${claim.id} (synthetic demo)`);await refresh();await openClaim(claim)}catch(e){setError((e as Error).message)}finally{setBusy(false)}}
  async function advance(){if(!selected||!next[selected.status])return;setBusy(true);try{const claim=await api<Claim>(`/api/v1/claims/${selected.id}/transitions`,{method:'POST',body:JSON.stringify({target:next[selected.status],expected_version:selected.version,reason:'Synthetic workflow demonstration',actor:'demo-adjuster'})});setNotice(`Moved to ${claim.status}`);await refresh();await openClaim(claim)}catch(e){setError((e as Error).message)}finally{setBusy(false)}}
  const heading=section==='Overview'?'Claims Command Center':section
  return <div className="shell"><aside className="sidebar"><div className="brand"><Activity size={25}/> SmartClaims</div><div className="subbrand">AI CLAIMS OPERATIONS</div><nav aria-label="Main navigation">{sections.map(s=><button key={s.name} className={section===s.name?'nav active':'nav'} onClick={()=>{setSection(s.name);setSelected(null)}}><s.icon size={18}/>{s.name}</button>)}</nav><div className="sidebarfoot">● Synthetic data only<br/>Local development</div></aside><main><header><div><div className="eyebrow">SMARTCLAIMS / {section.toUpperCase()}</div><h1>{heading}</h1><p className="muted">Manage claims, repair coordination and accountable next actions.</p></div><button className="primary" onClick={()=>setModal(true)}><FilePlus2 size={17}/> New claim</button></header>
  {error&&<div className="alert" role="alert">{error}</div>}{notice&&<div className="notice" role="status">{notice}</div>}
  {section==='Overview'&&<><div className="metrics"><div className="card metric"><span>Active claims</span><strong>{claims.filter(c=>c.status!=='CLOSED').length}</strong><small>Local demo records</small></div><div className="card metric"><span>Pending triage</span><strong>{claims.filter(c=>c.status==='SUBMITTED').length}</strong><small>Ready for review</small></div><div className="card metric"><span>Workflow stages</span><strong>11</strong><small>Defined in API</small></div><div className="card metric"><span>Human approvals</span><strong>Required</strong><small>Production control pending</small></div></div><div className="contentgrid"><div className="card"><div className="cardtitle"><h2>Recent claims</h2><button className="link" onClick={()=>setSection('Claims')}>View queue →</button></div><ClaimTable claims={claims} onOpen={openClaim}/></div><div className="card"><h2>Operational priorities</h2><div className="priority"><span className="dot blue"/> Review submitted claims</div><div className="priority"><span className="dot amber"/> Validate provider capacity</div><div className="priority"><span className="dot green"/> Verify dealer quote evidence</div><p className="muted note">Suggestions are illustrative and not connected to live partners.</p></div></div></>}
  {section==='Claims'&&<div className="card"><h2>Claims work queue</h2><ClaimTable claims={claims} onOpen={openClaim}/></div>}
  {section==='Providers'&&<div className="card"><h2>Repair provider workspace</h2><p className="muted">Provider assignments, estimates, appointments and repair milestones will be added after identity and tenant authorization.</p></div>}
  {section==='Dealers'&&<div className="card"><h2>Parts dealer workspace</h2><p className="muted">RFQs, VIN fitment, quotes, inventory, shipment and acknowledgments will use verified partner adapters.</p></div>}
  {section==='AI Workforce'&&<div className="card"><h2>AI workforce governance</h2><p className="muted">Agents are not enabled in this slice. Human-reviewed recommendations and audit will be implemented after authorization controls.</p></div>}
  {section==='Audit'&&<div className="card"><h2>Claim event history</h2><p className="muted">Select a claim from Overview or Claims to inspect its local event timeline.</p></div>}
  {selected&&<div className="card detail"><div className="cardtitle"><div><div className="eyebrow">CLAIM DETAIL</div><h2>{selected.id}</h2></div><button className="link" onClick={()=>setSelected(null)}>Close ×</button></div><p><b>{selected.member_name}</b> · {selected.vehicle}</p><p className="muted">{selected.incident_summary}</p><div className="detailrow"><span className="tag">{selected.status.replaceAll('_',' ')}</span><span>Version {selected.version}</span>{next[selected.status]&&<button className="primary" disabled={busy} onClick={()=>void advance()}>Demo → {next[selected.status].replaceAll('_',' ')}</button>}</div><h3>Event timeline</h3><ol className="timeline">{events.map(ev=><li key={ev.id}><strong>{ev.current.replaceAll('_',' ')}</strong><span>{ev.reason} · {ev.actor} · {new Date(ev.occurred_at).toLocaleString()}</span></li>)}</ol></div>}
  </main>{modal&&<div className="overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(false)}}><section className="dialog" role="dialog" aria-modal="true" aria-labelledby="formtitle"><div className="cardtitle"><h2 id="formtitle">Create demo claim</h2><button className="link" onClick={()=>setModal(false)} aria-label="Close dialog">✕</button></div><p className="muted">Fictional information only. Records are not persistent.</p><form onSubmit={e=>void create(e)}><label>Member name<input autoFocus required maxLength={100} value={form.member_name} onChange={e=>setForm({...form,member_name:e.target.value})}/></label><label>Vehicle<input required maxLength={120} value={form.vehicle} onChange={e=>setForm({...form,vehicle:e.target.value})}/></label><label>Incident summary<textarea required maxLength={2000} rows={4} value={form.incident_summary} onChange={e=>setForm({...form,incident_summary:e.target.value})}/></label><button className="primary" type="submit" disabled={busy}>{busy?'Submitting…':'Submit demo FNOL'}</button></form></section></div>}</div>
}
function ClaimTable({claims,onOpen}:{claims:Claim[];onOpen:(c:Claim)=>void}){return <div className="tablewrap"><table><thead><tr><th>Claim ID</th><th>Member</th><th>Vehicle</th><th>Status</th><th>Action</th></tr></thead><tbody>{claims.map(c=><tr key={c.id}><td><strong>{c.id}</strong></td><td>{c.member_name}</td><td>{c.vehicle}</td><td><span className="tag">{c.status.replaceAll('_',' ')}</span></td><td><button className="link" onClick={()=>onOpen(c)}>Open →</button></td></tr>)}</tbody></table>{claims.length===0&&<p className="empty">No claims yet. Create a synthetic claim to get started.</p>}</div>}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>)

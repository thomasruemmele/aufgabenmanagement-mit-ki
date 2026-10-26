export type List = {id:string; name:string; kind:'project'|'topic'; revision:number; createdAt:string; updatedAt:string};
export type Task = {id:string; listId:string; title:string; notes:string; dueDate:string|null; reminderAt:string|null; done:boolean; revision:number; createdAt:string; updatedAt:string};
export type Snapshot = {lists:List[]; tasks:Task[]; serverTime:string; timezone:string};
export const VIEWS = [{id:'all',name:'Alle Aufgaben'}, {id:'today',name:'Heute'}, {id:'week',name:'Diese Woche'}, {id:'next-week',name:'Nächste Woche'}, {id:'month',name:'Dieser Monat'}];
export function todayVienna(now=new Date()) { return new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Vienna',year:'numeric',month:'2-digit',day:'2-digit'}).format(now); }
export function addDays(date:string, count:number) {const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+count);return d.toISOString().slice(0,10);}
export function dateRange(view:string,today=todayVienna()):[string,string]|null {
 const d=new Date(today+'T12:00:00Z');const monday=addDays(today,-((d.getUTCDay()+6)%7));
 if(view==='today') return ['0000-01-01',today];
 if(view==='week') return [monday,addDays(monday,6)];
 if(view==='next-week') return [addDays(monday,7),addDays(monday,13)];
 if(view==='month') return [today.slice(0,7)+'-01', new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0,12)).toISOString().slice(0,10)];
 return null;
}
export function inView(task:Task, view:string,today=todayVienna()) {if(view==='all')return true; const range=dateRange(view,today); if(range)return !!task.dueDate&&task.dueDate>=range[0]&&task.dueDate<=range[1];return task.listId===view;}
export function formatDate(value:string|null) {if(!value)return ''; return new Intl.DateTimeFormat('de-AT',{day:'numeric',month:'short'}).format(new Date(value+'T12:00:00Z'));}
export function icsForTask(task:Task) {
 const esc=(s:string)=>s.replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
 const stamp=(s:string)=>new Date(s).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z/,'Z');
 const start=task.reminderAt ? 'DTSTART:'+stamp(task.reminderAt) : 'DTSTART;VALUE=DATE:'+(task.dueDate||todayVienna()).replace(/-/g,'');
 const alarm=task.reminderAt?['BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+esc(task.title),'TRIGGER;VALUE=DATE-TIME:'+stamp(task.reminderAt),'END:VALARM']:[];
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Meine Aufgaben//DE','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:'+task.id+'@meine-aufgaben','DTSTAMP:'+stamp(task.updatedAt),start,'SUMMARY:'+esc(task.title),'DESCRIPTION:'+esc(task.notes),...alarm,'END:VEVENT','END:VCALENDAR'];
 const fold=(line:string)=>{let out='',part='';for(const c of line){if(new TextEncoder().encode(part+c).length>73){out+=part+'\r\n ';part='';}part+=c;}return out+part;};
 return lines.map(fold).join('\r\n')+'\r\n';
}

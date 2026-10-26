import type { List, Task } from './model';
export type ImportData={lists:Pick<List,'id'|'name'|'kind'>[];tasks:Pick<Task,'id'|'title'|'notes'|'listId'|'dueDate'|'reminderAt'|'done'>[]};
function hash(value:string){let h=2166136261;for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(36);}
function csv(text:string){const rows:string[][]=[];let row:string[]=[],cell='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(cell);cell='';}else if(c==='\n'&&!quoted){row.push(cell.replace(/\r$/,''));rows.push(row);row=[];cell='';}else cell+=c;}if(quoted)throw new Error('CSV: Anführungszeichen nicht geschlossen.');row.push(cell.replace(/\r$/,''));if(row.some(Boolean))rows.push(row);return rows;}
export function parseImport(raw:string,filename=''):ImportData {
 if(raw.length>2_000_000)throw new Error('Die Datei ist größer als 2 MB.');
 const text=raw.replace(/^\uFEFF/,'').trim();if(!text)throw new Error('Die Datei ist leer.');
 if(text.startsWith('{')) {const data=JSON.parse(text);if(!Array.isArray(data.lists)||!Array.isArray(data.tasks))throw new Error('JSON benötigt lists und tasks. Verwende am besten einen Export dieser App.');
  return {lists:data.lists.map((l:any)=>({id:l.id,name:l.name,kind:l.kind||'project'})),tasks:data.tasks.map((t:any)=>({id:t.id,listId:t.listId,title:t.title,notes:t.notes||'',dueDate:t.dueDate||null,reminderAt:t.reminderAt||null,done:!!t.done}))};
 }
 const out:ImportData={lists:[],tasks:[]};
 const list=(name:string)=>{const clean=name.trim()||'Importierte Aufgaben';let l=out.lists.find(l=>l.name===clean);if(!l){l={id:'import-list-'+hash(clean),name:clean,kind:'project'};out.lists.push(l);}return l.id;};
 const occurrences=new Map<string,number>();
 const push=(title:string,listId:string,done=false,notes='',dueDate:string|null=null,reminderAt:string|null=null)=>{const key=JSON.stringify([listId,title,notes,dueDate,reminderAt]);const n=occurrences.get(key)||0;occurrences.set(key,n+1);out.tasks.push({id:'import-task-'+hash(key)+'-'+n,title,listId,notes,dueDate,reminderAt,done});};
 if(filename.toLowerCase().endsWith('.csv')||/^list,title[,\r\n]/i.test(text)){
  const [header,...rows]=csv(text);const names=header.map(c=>c.trim().toLowerCase());if(!names.includes('title'))throw new Error('CSV benötigt eine Spalte title. Weitere Spalten: list, notes, due_date, reminder_at, done.');
  for(const row of rows){const get=(k:string)=>row[names.indexOf(k)]||'';if(get('title').trim())push(get('title').trim(),list(get('list')),['true','1','yes','x','ja'].includes(get('done').toLowerCase()),get('notes'),get('due_date')||null,get('reminder_at')||null);}
 }else{let name=filename.replace(/\.[^.]+$/,'')||'Importierte Aufgaben';for(const line of text.split(/\r?\n/)){if(/^#{1,6}\s/.test(line)){name=line.replace(/^#+\s*/,'');continue;}const trimmed=line.trim();if(!trimmed)continue;const checked=/^[-*]?\s*\[[xX]\]/.test(trimmed);const title=trimmed.replace(/^[-*]\s*/,'').replace(/^\[[ xX]\]\s*/,'');if(title)push(title,list(name),checked);}}
 if(!out.tasks.length)throw new Error('Keine Aufgaben gefunden.');return out;
}

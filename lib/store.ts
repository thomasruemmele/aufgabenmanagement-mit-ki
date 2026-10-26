import { env } from 'cloudflare:workers';
import { z } from 'zod';
import { inView, type Task, type Snapshot } from './model';
export class AppError extends Error {constructor(message:string,public status=400){super(message);}}
const id=z.string().min(1).max(160).regex(/^[\p{L}\p{N}_.:-]+$/u);
const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s=>{const d=new Date(s+'T12:00:00Z');return !isNaN(d.getTime())&&d.toISOString().slice(0,10)===s;},'Ungültiges Datum');
const instant=z.string().datetime({offset:true}).transform(s=>new Date(s).toISOString());
const taskFields=z.object({title:z.string().trim().min(1).max(1000),listId:id,notes:z.string().max(30000).default(''),dueDate:date.nullable().default(null),reminderAt:instant.nullable().default(null),done:z.boolean().default(false)});
const imported=z.object({lists:z.array(z.object({id,name:z.string().trim().min(1).max(120),kind:z.enum(['project','topic']).default('project')})).max(100),tasks:z.array(taskFields.extend({id})).max(500)});
function db(){if(!env.DB)throw new AppError('Die Datenbank ist noch nicht verbunden.',503);return env.DB;}
const taskSelect='id, list_id AS listId, title, notes, due_date AS dueDate, reminder_at AS reminderAt, done, revision, created_at AS createdAt, updated_at AS updatedAt';
const listSelect='id, name, kind, revision, created_at AS createdAt, updated_at AS updatedAt';
const asTask=(row:any):Task=>({...row,done:!!row.done});
const now=()=>new Date().toISOString();
async function taskById(key:string){const t=await db().prepare(`SELECT ${taskSelect} FROM tasks WHERE id=?`).bind(key).first();if(!t)throw new AppError('Aufgabe nicht gefunden.',404);return asTask(t);}
async function listExists(key:string){if(!await db().prepare('SELECT id FROM lists WHERE id=?').bind(key).first())throw new AppError('Die Zielliste existiert nicht mehr.',409);}
export async function snapshot():Promise<Snapshot>{
 const results=await db().batch([db().prepare(`SELECT ${listSelect} FROM lists ORDER BY created_at,id`),db().prepare(`SELECT ${taskSelect} FROM tasks ORDER BY created_at,id`)]);
 return {lists:results[0].results as any,tasks:results[1].results.map(asTask),serverTime:now(),timezone:'Europe/Vienna'};
}
export async function perform(action:string, input:unknown={}):Promise<any>{
 const time=now();
 if(action==='snapshot'||action==='export')return {...await snapshot(),...(action==='export'?{format:'meine-aufgaben',version:1,exportedAt:time}:{})};
 if(action==='get_task'){const p=z.object({id}).parse(input);return taskById(p.id);}
 if(action==='find_tasks'){
  const p=z.object({view:z.string().optional(),query:z.string().optional(),done:z.boolean().optional()}).parse(input);const s=await snapshot();
  return {...s,tasks:s.tasks.filter(t=>(!p.view||inView(t,p.view))&&(p.done===undefined||t.done===p.done)&&(!p.query||[t.title,t.notes,s.lists.find(l=>l.id===t.listId)?.name].join(' ').toLocaleLowerCase('de').includes(p.query.toLocaleLowerCase('de'))))};
 }
 if(action==='create_list'){
  const p=z.object({id,name:z.string().trim().min(1).max(120),kind:z.enum(['project','topic']).default('project')}).parse(input);
  const existing=await db().prepare(`SELECT ${listSelect} FROM lists WHERE id=?`).bind(p.id).first();
  if(existing){if(existing.name!==p.name)throw new AppError('Diese Listen-ID ist bereits vergeben.',409);return existing;}
  await db().prepare('INSERT INTO lists (id,name,kind,created_at,updated_at) VALUES (?,?,?,?,?)').bind(p.id,p.name,p.kind,time,time).run();
  return db().prepare(`SELECT ${listSelect} FROM lists WHERE id=?`).bind(p.id).first();
 }
 if(action==='update_list'){
  const p=z.object({id,revision:z.number().int().positive(),name:z.string().trim().min(1).max(120),kind:z.enum(['project','topic'])}).parse(input);
  const r=await db().prepare('UPDATE lists SET name=?,kind=?,updated_at=?,revision=revision+1 WHERE id=? AND revision=?').bind(p.name,p.kind,time,p.id,p.revision).run();
  if(!r.meta.changes)throw new AppError('Die Liste wurde inzwischen geändert. Bitte neu laden.',409);return {ok:true};
 }
 if(action==='delete_list'){
  const p=z.object({id,revision:z.number().int().positive()}).parse(input);
  const r=await db().prepare('DELETE FROM lists WHERE id=? AND revision=? AND NOT EXISTS(SELECT 1 FROM tasks WHERE list_id=?)').bind(p.id,p.revision,p.id).run();
  if(!r.meta.changes)throw new AppError('Liste nicht gelöscht: Sie enthält Aufgaben oder wurde geändert. Verschiebe oder lösche zuerst alle Aufgaben.',409);return {ok:true};
 }
 if(action==='create_task'){
  const p=taskFields.extend({id}).parse(input);await listExists(p.listId);
  const existing=await db().prepare(`SELECT ${taskSelect} FROM tasks WHERE id=?`).bind(p.id).first();
  if(existing){if(existing.title!==p.title||existing.listId!==p.listId)throw new AppError('Diese Aufgaben-ID ist bereits vergeben.',409);return asTask(existing);}
  await db().prepare('INSERT INTO tasks (id,list_id,title,notes,due_date,reminder_at,done,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)').bind(p.id,p.listId,p.title,p.notes,p.dueDate,p.reminderAt,p.done?1:0,time,time).run();return taskById(p.id);
 }
 if(action==='update_task'){
  const p=z.object({id,revision:z.number().int().positive(),changes:taskFields.partial().strict()}).parse(input);
  const t=await taskById(p.id);if(t.revision!==p.revision)throw new AppError('Diese Aufgabe wurde inzwischen geändert. Dein Entwurf bleibt erhalten. Bitte neu laden und abgleichen.',409);
  const next={...t,...p.changes};await listExists(next.listId);
  const r=await db().prepare('UPDATE tasks SET list_id=?,title=?,notes=?,due_date=?,reminder_at=?,done=?,updated_at=?,revision=revision+1 WHERE id=? AND revision=?').bind(next.listId,next.title,next.notes,next.dueDate,next.reminderAt,next.done?1:0,time,p.id,p.revision).run();
  if(!r.meta.changes)throw new AppError('Diese Aufgabe wurde inzwischen geändert. Bitte neu laden und abgleichen.',409);return taskById(p.id);
 }
 if(action==='delete_task'){
  const p=z.object({id,revision:z.number().int().positive()}).parse(input);
  const r=await db().prepare('DELETE FROM tasks WHERE id=? AND revision=?').bind(p.id,p.revision).run();
  if(!r.meta.changes)throw new AppError('Aufgabe nicht gelöscht: Sie wurde inzwischen geändert oder bereits gelöscht.',409);return {ok:true};
 }
 if(action==='import'){
  const p=imported.parse(input);if(!p.lists.length)throw new AppError('Wähle mindestens eine Liste aus.');
  const ids=new Set(p.lists.map(l=>l.id));if(ids.size!==p.lists.length||new Set(p.tasks.map(t=>t.id)).size!==p.tasks.length)throw new AppError('Die Importdatei enthält doppelte IDs.');
  if(p.tasks.some(t=>!ids.has(t.listId)))throw new AppError('Jede Aufgabe muss zu einer ausgewählten Liste gehören.');
  const before=await snapshot();
  for(const l of p.lists){const old=before.lists.find(x=>x.id===l.id);if(old&&(old.name!==l.name||old.kind!==l.kind))throw new AppError('Eine Listen-ID gehört bereits zu einer anderen Liste. Exportiere die aktuelle Version oder passe die Importdatei an.',409);}
  const queries=p.lists.map(l=>db().prepare('INSERT INTO lists (id,name,kind,created_at,updated_at) VALUES (?,?,?,?,?) ON CONFLICT(id) DO NOTHING').bind(l.id,l.name,l.kind,time,time));
  queries.push(...p.tasks.map(t=>db().prepare('INSERT INTO tasks (id,list_id,title,notes,due_date,reminder_at,done,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING').bind(t.id,t.listId,t.title,t.notes,t.dueDate,t.reminderAt,t.done?1:0,time,time)));
  const r=await db().batch(queries);return {importedLists:r.slice(0,p.lists.length).reduce((n,x)=>n+(x.meta.changes||0),0),importedTasks:r.slice(p.lists.length).reduce((n,x)=>n+(x.meta.changes||0),0),skippedTasks:p.tasks.length-r.slice(p.lists.length).reduce((n,x)=>n+(x.meta.changes||0),0)};
 }
 throw new AppError('Unbekannte Aktion.',404);
}
export function publicError(error:unknown){if(error instanceof SyntaxError)return {message:'Die Anfrage enthält kein gültiges JSON.',status:400};if(error instanceof z.ZodError)return {message:'Bitte prüfe die Eingaben: '+error.issues.map(i=>i.path.join('.')+' '+i.message).join('; '),status:400};if(error instanceof AppError)return {message:error.message,status:error.status};console.error('Task store error',error instanceof Error?error.message:'unknown');return {message:'Speichern fehlgeschlagen. Bitte erneut versuchen.',status:500};}
// The shared owner workspace is protected by Sites dispatch (owner-only policy),
// including service access. No client-supplied owner identifier is accepted.
export function authorize(request:Request){
 const email=request.headers.get('oai-authenticated-user-email');
 if(email&&email.toLowerCase()!=='owner@example.com'&&!(import.meta.env.DEV&&email==='seedy@sites.test'))throw new AppError('Nur die eingerichtete Eigentümerin oder der Eigentümer darf diese App öffnen.',403);
 const origin=request.headers.get('origin');
 if(origin&&origin!==new URL(request.url).origin)throw new AppError('Anfrage von einer anderen Website abgelehnt.',403);
}

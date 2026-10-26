import { authorize, perform, publicError } from '@/lib/store';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store, private','X-Content-Type-Options':'nosniff'};
export async function GET(request:Request){try{authorize(request);return Response.json(await perform('snapshot'),{headers});}catch(e){const error=publicError(e);return Response.json({error:error.message},{status:error.status,headers});}}
export async function POST(request:Request){try{authorize(request);const raw=await request.text();if(raw.length>2_000_000)return Response.json({error:'Die Importdatei ist zu groß (maximal 2 MB).'}, {status:413,headers});const p=JSON.parse(raw);return Response.json(await perform(p.action,p.input),{headers});}catch(e){const error=publicError(e);return Response.json({error:error.message},{status:error.status,headers});}}

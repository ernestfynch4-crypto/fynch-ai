// Cloudflare Worker: keeps your API key secret. Set ANTHROPIC_API_KEY as a secret in the Worker settings.
const CORS={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'POST,OPTIONS'};
export default{async fetch(req,env){
  if(req.method==='OPTIONS')return new Response(null,{headers:CORS});
  const {messages=[],tone='friendly'}=await req.json();
  const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',
    headers:{'content-type':'application/json','x-api-key':env.ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01'},
    body:JSON.stringify({model:'claude-sonnet-5-5',max_tokens:800,
      system:`You are fynch Ai, a friendly everyday assistant for drafting messages, brainstorming ideas, summarising notes and planning days. Tone: ${tone}. Keep answers practical and concise. Use plain text, no markdown.`,
      messages:messages.slice(-12)})});
  const d=await r.json();
  const reply=(d.content||[]).map(b=>b.text||'').join('')||'Sorry, something went wrong.';
  return new Response(JSON.stringify({reply}),{headers:{...CORS,'Content-Type':'application/json'}});
}}

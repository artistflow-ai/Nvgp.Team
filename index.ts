// Stripe Checkout — eseguito lato server, mai dal browser.
// Configura STRIPE_SECRET_KEY e SITE_URL nei Secrets di Supabase.
import Stripe from "https://esm.sh/stripe@14?target=deno";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });
const cors = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};
serve(async req => {
  if(req.method==="OPTIONS") return new Response("ok",{headers:cors});
  try {
    const {email,service,amount}=await req.json();
    const allowed:Record<string,number>={"Post Instagram":35,"Storia Instagram":15,"Reel Instagram":50,"Pacchetto No Cap":80,"Post TikTok":10,"Video Lyrics TikTok":80,"Spotify Basic":10,"Spotify Medium":25,"Spotify Premium":40};
    if(!allowed[service] || allowed[service]!==Number(amount) || !email) throw new Error("Ordine non valido");
    const session=await stripe.checkout.sessions.create({mode:"payment",customer_email:email,line_items:[{price_data:{currency:"eur",product_data:{name:`NVGP.TEAM — ${service}`},unit_amount:amount*100},quantity:1}],success_url:`${Deno.env.get("SITE_URL")}/?payment=success`,cancel_url:`${Deno.env.get("SITE_URL")}/?payment=cancel`});
    return new Response(JSON.stringify({url:session.url}),{headers:{...cors,"Content-Type":"application/json"}});
  } catch(e) { return new Response(JSON.stringify({error:String(e)}),{status:400,headers:{...cors,"Content-Type":"application/json"}}); }
});
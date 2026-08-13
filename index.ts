// ============================================
// pillar-assistant Edge Function
//
// Same architecture as your existing sharpline-chat function:
// Supabase Edge Function → Anthropic API.
//
// Deploy with the Supabase CLI:
//   supabase functions deploy pillar-assistant
//
// Requires an ANTHROPIC_API_KEY secret set on the project:
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
// (reuse the same key sharpline-chat already uses)
// ============================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PILLAR_LABELS: Record<string, string> = {
  purpose: 'Purpose',
  connections: 'Connections',
  mind: 'Mind',
  body: 'Body',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { pillars } = await req.json();
    // pillars: [{ pillar: 'purpose', score: 5, interests: ['Travel', ...] }, ...]

    const summary = pillars
      .map((p: any) => `${PILLAR_LABELS[p.pillar] || p.pillar}: self-rated ${p.score}/10, current interests: ${(p.interests || []).join(', ') || 'none listed'}`)
      .join('\n');

    const prompt = `You are a supportive retirement life-planning assistant. A user has rated themselves across four pillars and listed current interests in each:

${summary}

Suggest exactly 4 new activities or interests for them to consider — aim for one per pillar (purpose, connections, mind, body), each building naturally on what they already enjoy without just repeating it. Keep each suggestion to one short, warm, concrete sentence (under 20 words). No preamble.

Respond ONLY with valid JSON, no markdown fences, in this exact shape:
[{"pillar":"purpose","suggestion":"..."},{"pillar":"connections","suggestion":"..."},{"pillar":"mind","suggestion":"..."},{"pillar":"body","suggestion":"..."}]`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text ?? '[]';
    const clean = text.replace(/```json|```/g, '').trim();
    const suggestions = JSON.parse(clean);

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

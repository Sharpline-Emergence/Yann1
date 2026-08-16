// ============================================
// theme-extractor Edge Function
//
// Takes the 6 questionnaire answers and returns AI-generated
// "theme circles" — the smaller circles from Yann's proposal.
// Each theme can link to multiple pillars and has a weight (1-3)
// indicating how strongly/often it showed up.
//
// Deploy with:
//   supabase functions deploy theme-extractor
// Reuses the same ANTHROPIC_API_KEY secret already set for pillar-assistant.
// ============================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { answers } = await req.json();
    // answers: { q1: "...", q2: "...", q3: "...", q4: "...", q5: ["Reading","Travel"], q6: "some" }

    const prompt = `You are analyzing a retiree's answers to a self-discovery questionnaire, as part of a life-planning app called Vivelo built around four pillars: Purpose, Connections, Mind, Body.

Their answers:
1. What activities have given you the greatest sense of satisfaction? — ${answers.q1 || '(no answer)'}
2. What personal strengths do people value most in you? — ${answers.q2 || '(no answer)'}
3. What are three things you'd like to experience or achieve in the next five years? — ${answers.q3 || '(no answer)'}
4. How would you ideally spend a free and fulfilling day? — ${answers.q4 || '(no answer)'}
5. Which activities do you currently enjoy most? — ${(answers.q5 || []).join(', ') || '(none selected)'}
6. How would you describe your current social life? — ${answers.q6 || '(no answer)'}

Extract 8-15 meaningful "theme circles" from these answers, following this process:
1. Identify concrete concepts/keywords in the answers (not generic filler words).
2. Cluster related keywords into richer themes (e.g. "Italian", "French" → "Language Learning"; not separate circles for each language).
3. A theme only qualifies as a circle if it meets at least one of: mentioned 2+ times or in multiple answers, expressed with clear enthusiasm, something they want to improve or start, something they already have real experience in, or it plausibly supports multiple pillars.
4. Each theme can connect to 1-3 pillars — many good themes span pillars (e.g. "Travel" often touches Purpose, Mind, and Connections at once). Don't force single-pillar assignment if the content justifies more.
5. Assign a weight 1-3: 3 = strong/repeated/high-enthusiasm theme, 2 = moderate, 1 = minor but still worth including.
6. Avoid generic single-mention circles like "Reading" unless there's real signal behind it — prefer specific, personal themes over category labels where the answers support it (e.g. "Mentoring Young Professionals" over plain "Mentoring", if that specificity is present in the answers).

Respond ONLY with valid JSON, no markdown fences, no preamble, in this exact shape:
[{"label":"Travel & Discovery","pillars":["purpose","mind","connections"],"weight":3,"rationale":"Mentioned in Q3 and Q4 with clear enthusiasm"}]`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text ?? '[]';
    const clean = text.replace(/```json|```/g, '').trim();
    const themes = JSON.parse(clean);

    return new Response(JSON.stringify({ themes }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

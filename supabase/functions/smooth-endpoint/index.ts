import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // جلب الكتب ومعاها الـ ID عشان نربطها بالإحصائيات
    const { data: allBooks } = await supabase.from("books").select("id, title, author, category");
    const { data: stats } = await supabase.rpc('get_book_activity_stats');

    // دمج البيانات في نص واحد يفهمه الذكاء الاصطناعي
    const libraryContext = allBooks?.map(b => {
      const s = stats?.find((item: any) => item.book_id === b.id);
      return `- ${b.title} | مؤلفه: ${b.author} | قسم: ${b.category} | تحميلاته: ${s?.downloads || 0} | تقييمه: ${s?.average_rating || 0}`;
    }).join("\n");

    const systemPrompt = `أنت "خبير نظم دعم القرار (DSS)" والمساعد الذكي الرسمي لقسم علوم المعلومات بجامعة بني سويف.
    مهمتك الأساسية هي تحليل بيانات الكتالوج الرقمي وتقديم توصيات دقيقة بناءً على الإحصائيات الحقيقية المتاحة فقط.
    
    قائمة البيانات المتاحة حالياً (المصدر الوحيد للحقيقة):
    ${libraryContext}
    
    قواعد السلوك والرد (بروتوكول الذكاء الاصطناعي):
    1. الالتزام بالسياق: لا تجزم أبداً بوجود محتوى خارج القائمة أعلاه. استخدم عبارات مثل "بناءً على السجلات المتاحة" أو "قد تكون هذه المواضيع ذات صلة بطلبك".
    2. منطق التوصية: عند ترشيح كتاب، اذكر السبب بناءً على البيانات (مثلاً: "أرشح لك هذا الكتاب لأنه الأعلى تقييماً في قسمه" أو "لأنه يشهد إقبالاً كبيراً في التحميلات").
    3. التعامل مع الطلبات المفقودة: إذا طلب المستخدم موضوعاً غير متوفر، قل له: "عذراً، هذا العنوان غير متوفر حالياً في كتالوج القسم، ولكن سأقوم برفع توصية للإدارة لتوفير مصادر في هذا المجال." ثم اقترح أقرب بديل من القائمة مع توضيح صلة القرابة.
    4. دعم القرار للإدارة: إذا كان السائل مسؤولاً، قدم تحليلات نقدية (مثلاً: "هناك كتب لم يتم تحميلها منذ فترة، قد تحتاج لإعادة تصنيف أو ترويج").
    5. لغة الكتابة: استخدم لغة عربية مهنية، واضحة، ومباشرة. تجنب الحشو، واجعل ردودك منظمة في نقاط إذا كانت تحتوي على أكثر من ترشيح.
    6. الدقة الإحصائية: عند ذكر أرقام التحميلات أو التقييم، التزم بما هو وارد في البيانات بدقة 100% دون تقريب أو تغيير.`;
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature: 0.3, // قللنا الحرارة عشان يكون دقيق جداً في الأرقام
      }),
    });

    const result = await response.json();
    return new Response(JSON.stringify({ reply: result.choices[0].message.content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
  }
});
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    
    const API_KEY = Deno.env.get("GROQ_API_KEY") || Deno.env.get("LOVABLE_API_KEY");
    if (!API_KEY) throw new Error("API Key is missing");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      }
    );

    // جلب الإحصائيات (RPC)
    const { data: statsData, error: dbError } = await supabase.rpc('get_book_activity_stats');
    if (dbError) throw dbError;

    // جلب بيانات الكتب
    const { data: booksMetadata, error: booksError } = await supabase
      .from("books")
      .select("id, title, author, category, year");
    if (booksError) throw booksError;

    // --- تحسين سياق البيانات لتقليل "الغباء" في الرد ---
    const booksContext = booksMetadata?.map((book: any) => {
      const stats = statsData?.find((s: any) => s.book_id === book.id);
      return `[ID: ${book.id} | ${book.title} | ${book.category} | تحميلات: ${stats?.downloads || 0} | تقييم: ${stats?.rating ? Number(stats.rating).toFixed(1) : 0}]`;
    }).join("\n");

    const systemPrompt = `أنت "مساعد مكتبة IQ الذكي"، نظام خبير لدعم اتخاذ القرار بقسم علوم المعلومات - جامعة بني سويف.

### بيانات المكتبة الحالية:
${booksContext}

### قواعد الرد (مهم جداً):
1. **الاختيار الذكي:** لا تعرض كل الكتب أبداً. اختر أفضل 3 رسائل فقط تناسب سؤال المستخدم.
2. **تحليل البيانات:** إذا كان الكتاب له تحميلات عالية، قل للمستخدم: "هذا الكتاب هو الأكثر طلباً بناءً على نشاط الباحثين".
3. **التنسيق:** استخدم Markdown الاحترافي:
   - العناوين (##) للترحيب.
   - القوائم النقطية لعرض الكتب.
   - الخط العريض **لأسماء الرسائل**.
4. **اللغة:** العربية الفصحى الأكاديمية فقط.
5. **التقييم:** استخدم النجوم (⭐) لوصف التقييمات.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${API_KEY}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature: 0.5, // تقليل الحرارة لردود أكثر دقة
        max_tokens: 1500,
      }),
    });

    const result = await response.json();
    const aiReply = result.choices?.[0]?.message?.content || "عذراً، واجهت مشكلة في معالجة طلبك حالياً.";

    return new Response(JSON.stringify({ reply: aiReply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("Function Error:", e.message);
    return new Response(JSON.stringify({ error: e.message }), { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
});
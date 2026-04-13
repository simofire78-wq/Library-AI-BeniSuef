import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Columns in DATA_Pro.csv (0-based, semicolon delimited):
// 0: Index
// 1: الترتيب الإجمالي  ← unique thesis number (de-duplicate by this)
// 2: رقم الصفحة التقديري
// 3: تصنيف ديوى
// 4: العنوان          ← Arabic title
// 5: المؤلف           ← author
// 6: تاريخ النشر      ← year
// 7: درجة الرسالة    ← دكتوراة / ماجستير
// 11: عنوان موازي    ← English title
// 13: ملخص           ← Arabic abstract
// 14: ملخص_إضافي    ← English abstract
// 17: كلمات مفتاحية  ← keywords

function deriveCategory(dewey: string, keywords: string, title: string): string {
  const kw = (keywords + ' ' + title).toLowerCase();

  if (kw.includes('ذكاء اصطناعي') || kw.includes('الذكاء الاصطناعي')) return 'الذكاء الاصطناعي';
  if (kw.includes('ببليومتري') || kw.includes('scientometri') || kw.includes('bibliometri') || kw.includes('قياس علم') || kw.includes('نشر دولي') || kw.includes('إنتاج الفكري') || kw.includes('الإنتاج الفكري')) return 'القياس العلمي';
  if (kw.includes('أرشيف') || kw.includes('وثائق') || kw.includes('archiv') || kw.includes('برديات')) return 'الأرشيف والتوثيق';
  if (kw.includes('فهرس') || kw.includes('تصنيف') || kw.includes('catalog') || kw.includes('فهرسة')) return 'الفهرسة والتصنيف';
  if (kw.includes('محو الأمية') || kw.includes('literacy') || kw.includes('ثقافة معلومات')) return 'محو الأمية المعلوماتية';
  if (kw.includes('جودة') || kw.includes('quality') || kw.includes('أداء')) return 'إدارة الجودة';
  if (kw.includes('إدارة المعرفة') || kw.includes('knowledge management')) return 'إدارة المعرفة';
  if (kw.includes('رقمن') || kw.includes('رقمي') || kw.includes('digital') || kw.includes('التحول الرقمي')) return 'التحول الرقمي';
  if (kw.includes('استرجاع') || kw.includes('retrieval') || kw.includes('بحث') || kw.includes('search engine')) return 'استرجاع المعلومات';
  if (kw.includes('شبكات التواصل') || kw.includes('social media') || kw.includes('تواصل اجتماعي') || kw.includes('كوفيد') || kw.includes('covid')) return 'التواصل الاجتماعي';
  if (kw.includes('تقنية') || kw.includes('information technology') || kw.includes('حوكمة') || kw.includes('انترنت') || kw.includes('إنترنت')) return 'تقنيات المعلومات';
  if (kw.includes('خدمات') || kw.includes('service') || kw.includes('مكتبة')) return 'الخدمات المكتبية';
  if (kw.includes('نشر') || kw.includes('publish') || kw.includes('open access') || kw.includes('وصول مفتوح')) return 'النشر والإتاحة';

  const num = parseFloat(dewey);
  if (num >= 20 && num < 30) return 'علوم المعلومات والمكتبات';
  if (num >= 90 && num < 100) return 'الأرشيف والتوثيق';
  if (num >= 4 && num < 10) return 'تقنيات المعلومات';

  return 'علوم المعلومات والمكتبات';
}

function extractYear(yearField: string): number {
  const match = (yearField || '').match(/(\d{4})/);
  return match ? parseInt(match[1]) : 2020;
}

function cleanTitle(t: string): string {
  return t.replace(/\s*:\s*$/, '').replace(/\s+/g, ' ').trim();
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let i = 0;
  const n = text.length;

  while (i < n) {
    const row: string[] = [];
    while (i < n && (text[i] === '\r' || text[i] === '\n')) i++;
    if (i >= n) break;

    while (i < n) {
      if (text[i] === '"') {
        i++;
        let field = '';
        while (i < n) {
          if (text[i] === '"') {
            if (i + 1 < n && text[i + 1] === '"') { field += '"'; i += 2; }
            else { i++; break; }
          } else {
            field += text[i++];
          }
        }
        row.push(field.trim());
      } else {
        let field = '';
        while (i < n && text[i] !== ';' && text[i] !== '\n' && text[i] !== '\r') {
          field += text[i++];
        }
        row.push(field.trim());
      }
      if (i < n && text[i] === ';') { i++; } else { break; }
    }

    if (row.length > 0 && row.some(f => f.length > 0)) rows.push(row);
  }
  return rows;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Download CSV from storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from('csv-imports')
      .download('DATA_Pro.csv');

    if (fileError) throw new Error(`Storage error: ${fileError.message}`);

    const csvText = await fileData.text();
    const rows = parseCsv(csvText);
    const dataRows = rows.slice(1); // skip header

    // De-duplicate by "الترتيب الإجمالي" (col 1)
    const seenIndex = new Set<string>();
    const books: Record<string, unknown>[] = [];

    for (const row of dataRows) {
      if (row.length < 8) continue;

      const thesisIndex = (row[1] || '').trim();
      if (!thesisIndex || seenIndex.has(thesisIndex)) continue;
      seenIndex.add(thesisIndex);

      const rawTitle = row[4] || '';
      const title = cleanTitle(rawTitle);
      if (!title || title.length < 3) continue;

      const author = (row[5] || '').replace(/\.$/, '').trim() || 'غير محدد';
      const dewey = (row[3] || '').trim();
      const year = extractYear(row[6] || '');
      const degree = (row[7] || '').includes('ماجستير') ? 'ماجستير' : 'دكتوراه';
      const titleEn = (row[11] || '').trim();
      const description = (row[13] || row[14] || '').substring(0, 1000).trim() || null;
      const rawKeywords = (row[17] || '').trim();
      const category = deriveCategory(dewey, rawKeywords, title);

      // Build keywords array
      const keywords: string[] = [degree];
      rawKeywords.split(/[;،,\-]/).forEach(part => {
        const kw = part.replace(/\/\s*qrmak.*/i, '').trim().replace(/\.$/, '').trim();
        if (kw && kw.length > 1) keywords.push(kw);
      });
      if (titleEn) keywords.push(titleEn.substring(0, 80));

      books.push({
        title,
        author,
        category,
        year,
        description,
        language: 'Arabic',
        keywords: [...new Set(keywords)].filter(k => k.length > 1).slice(0, 10),
      });
    }

    if (books.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No records parsed', rowCount: dataRows.length }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Clear existing data
    await supabase.from('book_usage').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('books').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert in batches of 20
    const inserted: Record<string, unknown>[] = [];
    for (let start = 0; start < books.length; start += 20) {
      const { data, error } = await supabase.from('books').insert(books.slice(start, start + 20)).select('id');
      if (error) throw error;
      if (data) inserted.push(...data);
    }

    // Init usage rows
    const usageRows = inserted.map(b => ({ book_id: b.id, views: 0, downloads: 0, rating: null }));
    for (let start = 0; start < usageRows.length; start += 20) {
      await supabase.from('book_usage').insert(usageRows.slice(start, start + 20));
    }

    return new Response(
      JSON.stringify({ success: true, imported: inserted.length, totalRows: dataRows.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

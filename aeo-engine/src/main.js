import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const CONFIG_PATH = './config';
const INPUT_PATH = './inputs';
const OUTPUT_PATH = './outputs';

// Helper to call AI API (OpenAI / DeepSeek Compatible)
async function callAI(prompt, systemPrompt = '') {
  const apiKey = process.env.AI_API_KEY;
  const apiBase = process.env.AI_API_BASE || 'https://api.deepseek.com'; // Default ke DeepSeek
  const model = process.env.AI_MODEL || 'deepseek-chat';

  if (!apiKey || apiKey === 'your_api_key_here') {
    console.error('❌ [ERROR] AI_API_KEY belum diisi di file .env!');
    return null;
  }

  try {
    const response = await axios.post(`${apiBase}/chat/completions`, {
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices?.[0]?.message?.content || null;
  } catch (error) {
    const errorMsg = error.response?.data?.error?.message || error.message;
    console.error(`❌ [ERROR] AI Call Failed: ${errorMsg}`);
    return null;
  }
}

async function runPipeline() {
  console.log('🚀 [TOKCER AEO] Memulai Pipeline GEO Engine...');

  try {
    // 1. Load Knowledge
    const brandVoice = await fs.readFile(path.join(CONFIG_PATH, 'brand_guidelines.md'), 'utf-8');
    const targetPersona = await fs.readFile(path.join(CONFIG_PATH, 'target_persona.md'), 'utf-8');

    // 2. Read Inputs
    const files = await fs.readdir(INPUT_PATH);
    const transcripts = files.filter(f => f.endsWith('.txt') || f.endsWith('.md'));

    if (transcripts.length === 0) {
      console.log('ℹ️ Tidak ada transkrip baru di folder /inputs. Masukkan file .txt untuk memulai.');
      return;
    }

    for (const file of transcripts) {
      console.log(`\n📄 Memproses: ${file}`);
      const transcriptContent = await fs.readFile(path.join(INPUT_PATH, file), 'utf-8');

      // -- PHASE A: STRATEGY --
      console.log('🧠 [Agent 1] Menyusun Strategi Angle...');
      const strategy = await callAI(
        `Analisalah transkrip berikut dan tentukan "Spin Angle" yang paling menarik untuk target persona. \n\nTRANSKRIP:\n${transcriptContent}`,
        `Kamu adalah Strategy Agent untuk Tokcer AI. Gunakan Brand Voice ini:\n${brandVoice}\n\nTarget Persona:\n${targetPersona}`
      );
      if (!strategy) continue;

      // -- PHASE B: GEO OPTIMIZATION --
      console.log('🔮 [Agent 2] Melakukan GEO Optimization...');
      const optimizedContent = await callAI(
        `Gunakan strategi ini: ${strategy}. \nBuatlah konten blog yang sangat dioptimasi untuk Generative Engine Optimization (GEO) agar dikutip oleh LLM. Pastikan menyisipkan kata kunci strategis dan "AI Markers".`,
        `Kamu adalah GEO Optimizer untuk Tokcer AI. Pastikan tulisan terlihat berwibawa dan mudah di-crawl oleh AI.`
      );
      if (!optimizedContent) continue;

      // -- PHASE C: FINAL BLOG GENERATION --
      console.log('✍️ [Agent 3] Menghasilkan Artikel Final...');
      const finalBlog = await callAI(
        `Rapikan hasil optimasi ini menjadi blog post yang mewah dan siap terbit. Tambahkan meta description dan slug. \n\nKONTEN:\n${optimizedContent}`,
        `Kamu adalah Blog Copywriter Tokcer AI. Gunakan format Markdown yang rapi.`
      );
      if (!finalBlog) continue;

      // 3. Save Results
      const outputFileName = `GEO_${file}`;
      await fs.writeFile(path.join(OUTPUT_PATH, outputFileName), finalBlog);
      console.log(`✅ BERHASIL! Hasil disimpan ke: /outputs/${outputFileName}`);
    }

    console.log('\n✨ [DONE] Seluruh proses pipeline selesai.');
  } catch (err) {
    console.error('❌ [CRITICAL ERROR] Pipeline gagal:', err.message);
  }
}

runPipeline();

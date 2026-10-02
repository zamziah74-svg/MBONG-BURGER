import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization with required telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 1. AI Chat Endpoint: Pembantu Dapur & Cadangan Pesanan (Customer Assistant)
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, context } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mesej diperlukan.' });
    }

    const systemInstruction = `Anda adalah "Kak Zamziah AI", pembantu peribadi yang sangat ramah, mesra, lemah-lembut dan berpengetahuan luas tentang hidangan di kedai makan "Burger & Popia Simpul".
Gaya bahasa: Bahasa Melayu santai, bersopan-santun, penuh kasih sayang seorang wanita tukang masak Melayu ("Dapur Bonda"), menggunakan panggilan mesra seperti "awak", "puan", "encik", atau "sahabat".

Maklumat Menu & Kedai:
- Burger Homemade:
  1. Burger Daging Special Homemade (RM 11.50) - Patty daging lembu berjus segar, telur goyang/banji, sos lada hitam Sarawak, keju cheddar.
  2. Burger Ayam Crispy Buttermilk (RM 10.90) - Fillet ayam rangup keemasan diperap susu mentega, sos keju & mayonis manis pedas, coleslaw ungu.
  3. Burger Double Daging & Double Cheese (RM 15.50) - 2 keping patty tebal berjus, 2 keping keju leleh, bawang karamel.
  4. Burger Ayam Bakar BBQ Madu (RM 12.00) - Paha ayam tanpa tulang dipanggang sos barbeku madu aroma asap kayu manis.
  * Tambahan Set Kombo: +RM 4.50 untuk kentang goreng rangup (fries) dan minuman sejuk.

- Popia Simpul Kasih:
  1. Popia Simpul Original (Balang Comel 180g: RM12, Balang Standard 350g: RM22, Balang Mega 650g: RM38) - Inti serunding ikan selayang kampung asli beraroma serai halia. Rangup krup-krup, tidak pedas, sesuai untuk semua peringkat umur dan kanak-kanak.
  2. Popia Simpul Pedas Manis (Balang Comel 180g: RM13, Balang Standard 350g: RM24, Balang Mega 650g: RM40) - Cili kering giling tempatan, daun kari wangi, rasa pedas manis menyengat yang ketagih.
  3. Popia Simpul Golden Cheese (Balang Comel 180g: RM14, Balang Standard 350g: RM25, Balang Mega 650g: RM42) - Salutan keju cheddar premium lemak masin manis kegemaran ramai.

- Set Kombo Istimewa:
  - "Kombo Minum Petang Kasih" (RM 22.00) - 1 Burger Daging Special atau Ayam Crispy + 1 Balang Popia Simpul Original (180g) + Air Minuman Sejuk.

- Servis & Polisi:
  - Waktu Pesanan: Setiap Hari, 2:00 Petang – 10:30 Malam.
  - Caj Penghantaran Rider: RM 5.00 (Percuma jika pesanan RM 40.00 ke atas!).
  - Ambil Sendiri (Pickup): Percuma di Seksyen 7 Shah Alam.
  - Kod Kupon: KASIH5 (Jimat RM5 belanja min RM25), SEDAP10 (Diskaun 10% min RM35).

Tugas Anda:
1. Bantu pelanggan memilih menu mengikut bajet, bilangan orang makan, atau selera (cth: pedas vs tak pedas, kanak-kanak vs dewasa).
2. Terangkan keistimewaan resipi homemade tanpa bahan pengawet.
3. Berikan cadangan hidangan spesifik dengan menyebut nama menu dan harga.
4. Pastikan jawapan ringkas, padat, menyelerakan dan mesra (2-4 perenggan pendek).`;

    // Format chat contents
    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const turn of history.slice(-6)) {
        contents.push({
          role: turn.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: turn.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    return res.status(500).json({ 
      error: 'Maaf, pembantu AI sedang sibuk seketika. Sila cuba sebentar lagi.',
      details: error?.message 
    });
  }
});

// 2. AI Copywriter Endpoint: Bantu pemilik kedai menulis penerangan produk atau promosi
app.post('/api/ai/generate-menu-copy', async (req: Request, res: Response) => {
  try {
    const { itemName, category, flavor, keyIngredients } = req.body;

    const prompt = `Anda adalah pakar penulisan promosi makanan (food copywriter) bertaraf tinggi di Malaysia.
Hasilkan teks promosi untuk menu baharu berikut:
- Nama Menu: ${itemName || 'Burger / Popia Simpul Istimewa'}
- Kategori: ${category || 'Makanan'}
- Perisa/Gaya: ${flavor || 'Original'}
- Ramuan/Ciri Utama: ${keyIngredients || 'Segar dan buatan tangan'}

Sila jana:
1. "tagline": Slogan ringkas 1 baris yang sangat menggiurkan (maksimum 12 perkataan).
2. "description": Penerangan ringkas 2-3 ayat yang menyelerakan menggambarkan rasa, tekstur, aroma dan keunikan bahan segar tempatan.
3. "recommendationTip": 1 petua ringkas bila atau bersama apa paling sedap dimakan.

Balas dalam format JSON tulen:
{
  "tagline": "...",
  "description": "...",
  "recommendationTip": "..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/generate-menu-copy:', error);
    return res.status(500).json({ error: 'Gagal menjana teks dengan AI.' });
  }
});

// Mount Vite or serve static
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

startServer();

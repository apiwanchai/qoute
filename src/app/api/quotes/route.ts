import { NextResponse } from 'next/server';

interface Quote {
  id: number;
  text: string;
  votes: number;
}

let quotes: Quote[] = [
  { id: 1, text: "อย่าเอาเราไปวัดกับใครเลย.. ตื่นไม่ทัน", votes: 10 },
  { id: 2, text: "ไม่เน้นแต่งหน้า เราเน้นแต่งรูป", votes: 20 },
  { id: 3, text: "ดีแต่เอว นอกนั้นเลวทุกอย่าง", votes: 30 },
  { id: 4, text: "ถ้าวิ่งอึด วิ่งทน เหมือนที่วิ่งตามผู้ชาย ป่านนี้ผอมไปแล้ว", votes: 40 },
  { id: 5, text: "เป็นคนดีก็ไม่ได้การันตีว่าเขาจะรัก", votes: 50 }
];


export async function GET() {
  return NextResponse.json(quotes);
}

export async function POST(req: Request) {
  const { id } = await req.json(); 
  const quoteId = Number(id);

  quotes = quotes.map(quote =>
    quote.id === quoteId ? { ...quote, votes: quote.votes + 1 } : quote
  );

  return NextResponse.json({ success: true, message: `Vote incremented for quote ${quoteId}` });
}

export const runtime = 'nodejs';

import fs from 'fs'; // for createReadStream
import fsp from 'fs/promises'; // for writeFile and unlink
import os from 'os';
import path from 'path';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const formData = await req.formData();
    const audio = formData.get('audio');
    const question = formData.get('question');

    if (!audio || !question) {
      return NextResponse.json({ error: 'Missing audio or question' }, { status: 400 });
    }

    // Save audio file to temp location
    const buffer = Buffer.from(await audio.arrayBuffer());
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, `response-${Date.now()}.webm`);
    await fsp.writeFile(filePath, buffer);

    // Transcribe using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
      response_format: 'text',
    });

    const userAnswer = transcription.trim();

    // Generate GPT feedback
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a friendly interview coach. The candidate just answered a behavioral interview question. Your job is to give thoughtful, specific, constructive feedback on their answer.`,
        },
        {
          role: 'user',
          content: `Question: ${question}\nAnswer: ${userAnswer}\n\nPlease give feedback.`,
        },
      ],
      temperature: 0.7,
    });

    const feedback = completion.choices[0].message.content;

    // Optional: delete temp file
    await fsp.unlink(filePath);

    return NextResponse.json({ feedback, transcript: userAnswer });
  } catch (err) {
    console.error("❌ Error in /api/feedback:", err);
    return NextResponse.json(
      { error: 'Failed to process feedback', details: err.message },
      { status: 500 }
    );
  }
}

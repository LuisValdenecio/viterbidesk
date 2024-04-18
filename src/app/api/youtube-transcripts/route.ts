import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

import { YoutubeLoader } from 'langchain/document_loaders/web/youtube';

export async function GET(request: NextRequest) {
  try {
    const loader = YoutubeLoader.createFromUrl('https://youtu.be/bZQun8Y4L2A', {
      language: 'en',
      addVideoInfo: true,
    });

    //const transcriptChunks = await YoutubeTranscript.fetchTranscript("https://www.youtube.com/watch?v=hZp80SYIRlY&t=2359s");
    //console.log(transcriptChunks);

    console.log(loader);

    const docs = await loader.load();

    console.log(docs);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

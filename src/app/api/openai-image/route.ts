import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not defined in environment variables');
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: true, message: 'No prompt provided' },
        { status: 400 }
      );
    }

    console.log('Generating image with DALL-E 3...');
    console.log('Prompt (first 200 chars):', prompt.slice(0, 200));

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1792x1024',
      quality: 'standard',
      style: 'vivid',
    });

    const imageUrl = response.data?.[0]?.url;
    const revisedPrompt = response.data?.[0]?.revised_prompt;

    if (!imageUrl) {
      throw new Error('No image URL returned from DALL-E');
    }

    console.log('Image generated successfully');

    return NextResponse.json({
      imageUrl,
      revisedPrompt,
    });
  } catch (error: any) {
    console.error('DALL-E image generation error:', error);

    const statusCode = error.status || 500;
    const errorMessage = error.message || 'Image generation failed';

    return NextResponse.json(
      {
        error: true,
        message: errorMessage,
        code: error.code || 'image_generation_error',
      },
      { status: statusCode }
    );
  }
}

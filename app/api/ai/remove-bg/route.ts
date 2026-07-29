import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, imageBase64 } = await req.json();

    const apiKey = process.env.REMOVE_BG_API_KEY;

    if (!apiKey) {
      // In development or if api key is missing, mock success by returning a response
      console.warn('REMOVE_BG_API_KEY is missing. Returning simulated transparent background image.');
      
      // Simulate slow response
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return NextResponse.json({
        success: true,
        message: 'Background removed successfully (Simulated)',
        // Return original or mock transparent result
        url: imageUrl || 'data:image/png;base64,iVBORw55...', 
      });
    }

    // Real remove.bg integration
    let imageSource = {};
    if (imageBase64) {
      imageSource = { image_file_b64: imageBase64.split(',')[1] };
    } else if (imageUrl) {
      imageSource = { image_url: imageUrl };
    } else {
      return NextResponse.json({ success: false, error: 'No image source provided' }, { status: 400 });
    }

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...imageSource,
        size: 'auto',
        format: 'png',
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`remove.bg API error: ${errText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const transparentDataUrl = `data:image/png;base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: transparentDataUrl,
    });

  } catch (error: any) {
    console.error('AI background removal error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

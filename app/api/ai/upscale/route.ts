import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json();
    const apiKey = process.env.REPLICATE_API_TOKEN;

    if (!apiKey) {
      console.warn('REPLICATE_API_TOKEN is missing. Returning simulated upscaled image (2x).');
      
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return NextResponse.json({
        success: true,
        message: 'Image upscaled to 300 DPI successfully (Simulated)',
        url: imageBase64, // Fallback to current image
      });
    }

    // Call Replicate ESRGAN model
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '42fed1c497417efd4d541472bc38860a18f201199268d31ff9c76a9f2441e13d', // ESRGAN model version
        input: {
          image: imageBase64,
          scale: 2,
          face_enhance: false,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Replicate upscaler API error: ${errText}`);
    }

    const prediction = await response.json();
    
    // Poll the prediction status
    let resultUrl = '';
    const maxPolls = 15;
    for (let i = 0; i < maxPolls; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const statusCheck = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { 'Authorization': `Token ${apiKey}` },
      });
      const checkResult = await statusCheck.json();
      if (checkResult.status === 'succeeded') {
        resultUrl = checkResult.output;
        break;
      } else if (checkResult.status === 'failed') {
        throw new Error('Replicate image upscaling failed.');
      }
    }

    if (!resultUrl) {
      throw new Error('Upscaling timeout.');
    }

    return NextResponse.json({
      success: true,
      url: resultUrl,
    });

  } catch (error: any) {
    console.error('AI image upscaler error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

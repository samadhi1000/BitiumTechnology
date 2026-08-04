import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        // Frontend eken ewana JSON data tika gannawa
        const body = await req.json();
        const { orderId, amount, currency } = body;

        // .env.local eken keys tika gannawa
        const merchantId = (process.env.PAYHERE_MERCHANT_ID || '').trim();
        const merchantSecret = (process.env.PAYHERE_MERCHANT_SECRET || process.env.PAYHERE_SECRET || '').trim();

        if (!merchantId || !merchantSecret) {
             return NextResponse.json({ success: false, message: "Credentials missing in .env.local" }, { status: 500 });
        }

        // Security Check 1: Amount formatting
        const formattedAmount = parseFloat(amount).toFixed(2);

        // Security Check 2: Hash Generation
        const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
        const hashString = `${merchantId}${orderId}${formattedAmount}${currency}${hashedSecret}`;
        const finalHash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

        // Frontend ekata response eka denawa
        return NextResponse.json({
            success: true,
            merchant_id: merchantId,
            order_id: orderId,
            amount: formattedAmount,
            currency: currency,
            hash: finalHash
        });

    } catch (error) {
        console.error("Hash generation error:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}
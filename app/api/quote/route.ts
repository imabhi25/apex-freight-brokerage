import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            organization, email, originCity, originZip,
            destinationCity, destinationZip, commodity,
            equipment, weight, cargoValue, contactName,
            phone, notes, referenceId
        } = body;

        const getEmailLayout = (title: string, refId: string, content: string) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { background:#F8FAFC; margin:0; padding:40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#111827; }
          .container { max-width:620px; margin:0 auto; border:1px solid #E2E8F0; background:#ffffff; padding:40px; border-radius:12px; }
          .header { border-bottom:1px solid #E2E8F0; padding-bottom:24px; margin-bottom:32px; }
          .tag { font-size:10px; font-weight:700; letter-spacing:0.2em; color:#64748B; text-transform:uppercase; margin-bottom:12px; }
          .title { font-size:20px; font-weight:800; letter-spacing:-0.01em; color:#111827; text-transform:uppercase; }
          .field-label { font-size:10px; font-weight:700; letter-spacing:0.2em; color:#2563EB; text-transform:uppercase; margin-bottom:8px; margin-top:24px; }
          .field-value { font-size:15px; color:#1f2937; line-height:1.6; white-space:pre-wrap; word-break:break-word; background:#F9FAFB; padding:12px; border-radius:8px; border:1px solid #F1F5F9; }
          .footer { margin-top:40px; padding-top:24px; border-top:1px solid #E2E8F0; font-size:10px; letter-spacing:0.1em; color:#94A3B8; text-transform:uppercase; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="tag">Apex Freight Brokerage — Official Transmission</div>
            <div class="title">${title}</div>
            <div class="tag" style="margin-top:8px;">REF ID: ${refId}</div>
          </div>
          ${content}
          <div class="footer">
            APEX FREIGHT BROKERAGE &nbsp;|&nbsp; MC #000000 &nbsp;|&nbsp; DOT #000000<br/>
            Standard Technical Dispatch. Prepared for Priority Processing.
          </div>
        </div>
      </body>
      </html>
    `;

        const adminContent = `
      <div class="field-label">ORGANIZATION</div>
      <div class="field-value">${organization}</div>
      <div class="field-label">LANE DETAILS</div>
      <div class="field-value">${originCity} (${originZip}) → ${destinationCity} (${destinationZip})</div>
      <div class="field-label">LOAD SPECS</div>
      <div class="field-value">Commodity: ${commodity}<br/>Equipment: ${equipment}<br/>Weight: ${weight} lbs<br/>Value: $${cargoValue}</div>
      <div class="field-label">CONTACT INFO</div>
      <div class="field-value">${contactName} | ${phone}<br/>${email}</div>
      ${notes ? `<div class="field-label">NOTES</div><div class="field-value">${notes}</div>` : ''}
    `;

        const userReceiptContent = `
      <p style="font-size:16px; color:#4B5563; line-height:1.6;">
        Our proprietary analysis engine is currently processing your quote request for the lane: <strong>${originCity} to ${destinationCity}</strong>. 
      </p>
      <p style="font-size:16px; color:#4B5563; line-height:1.6;">
        A specialized logistics analyst will contact you at <strong>${email}</strong> with a tailored rate within one business day.
      </p>
    `;

        // 1. Send Admin Notification
        const { error: adminError } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "noreply@apexfreightbrokerage.com",
            to: "info@apexfreightbrokerage.com",
            replyTo: email,
            subject: `[NEW QUOTE] ${referenceId} | ${originCity} to ${destinationCity}`,
            html: getEmailLayout("NEW QUOTE REQUEST", referenceId, adminContent),
        });

        if (adminError) throw adminError;

        // 2. Send User Receipt
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "noreply@apexfreightbrokerage.com",
            to: email,
            subject: `RECEIPT: Apex Quote Request [${referenceId}]`,
            html: getEmailLayout("QUOTE REQUEST RECEIVED", referenceId, userReceiptContent),
        });

        return NextResponse.json({ success: true, refId: referenceId });
    } catch (err) {
        console.error("API error:", err);
        return NextResponse.json({ error: "Transmission failed." }, { status: 500 });
    }
}

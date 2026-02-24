import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { generateRefId } from "../../lib/refid";

export async function POST(req: NextRequest) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error("Missing RESEND_API_KEY");
      return NextResponse.json(
        { error: "Email service is not configured yet." },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);

    const body = await req.json();
    const {
      organization,
      dispatcherName,
      email,
      mcDot,
      taxId,
      equipment,
    } = body;

    const referenceId = generateRefId('C');

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
      <div class="field-label">CARRIER ENTITY</div>
      <div class="field-value">${organization}</div>
      <div class="field-label">AUTHORITY & TAX ID</div>
      <div class="field-value">MC/DOT: ${mcDot}<br/>EIN: ${taxId}</div>
      <div class="field-label">EQUIPMENT PROFILE</div>
      <div class="field-value">${Array.isArray(equipment) ? equipment.join(", ") : equipment}</div>
      <div class="field-label">CONTACT PERSON</div>
      <div class="field-value">${dispatcherName}<br/>${email}</div>
    `;

    const userReceiptContent = `
      <p style="font-size:16px; color:#4B5563; line-height:1.6;">
        Your application to join the Apex Freight Brokerage network has been successfully received and logged under Reference ID: <strong>${referenceId}</strong>. 
      </p>
      <p style="font-size:16px; color:#4B5563; line-height:1.6;">
        Our compliance team is currently verifying your authority (MC/DOT: <strong>${mcDot}</strong>). You will receive a status update via <strong>${email}</strong> shortly.
      </p>
    `;

    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "noreply@apexfreightbrokerage.com";

    // 1) Admin notification
    const { error: adminError } = await resend.emails.send({
      from: fromEmail,
      to: "info@apexfreightbrokerage.com",
      replyTo: email,
      subject: `[CARRIER APP] ${referenceId} | ${mcDot}`,
      html: getEmailLayout("NEW CARRIER APPLICATION", referenceId, adminContent),
    });

    if (adminError) throw adminError;

    // 2) User receipt
    const { error: userError } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `RECEIPT: Apex Carrier Application [${referenceId}]`,
      html: getEmailLayout("APPLICATION RECEIVED", referenceId, userReceiptContent),
    });

    if (userError) throw userError;

    return NextResponse.json({ success: true, refId: referenceId });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Transmission failed." }, { status: 500 });
  }
}
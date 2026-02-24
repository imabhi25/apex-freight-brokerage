import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { generateRefId } from "../../lib/refid";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;
    const referenceId = generateRefId('N');

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { background:#000; margin:0; padding:40px; font-family: 'Courier New', Courier, monospace; color:#e5e5e5; }
    .container { max-width:620px; margin:0 auto; border:1px solid rgba(255,255,255,0.12); padding:40px; }
    .header { border-bottom:1px solid rgba(255,255,255,0.12); padding-bottom:24px; margin-bottom:32px; }
    .tag { font-size:10px; letter-spacing:0.3em; color:rgba(255,255,255,0.35); text-transform:uppercase; margin-bottom:12px; }
    .title { font-size:18px; letter-spacing:0.15em; color:#fff; text-transform:uppercase; }
    .field-label { font-size:10px; letter-spacing:0.3em; color:rgba(255,255,255,0.35); text-transform:uppercase; margin-bottom:6px; margin-top:24px; }
    .field-value { font-size:15px; color:#e5e5e5; line-height:1.6; white-space:pre-wrap; word-break:break-word; }
    .footer { margin-top:40px; padding-top:24px; border-top:1px solid rgba(255,255,255,0.12); font-size:10px; letter-spacing:0.2em; color:rgba(255,255,255,0.2); text-transform:uppercase; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="tag">Apex Freight Brokerage — Secure Transmission</div>
      <div class="title">NEW INQUIRY RECEIVED: ${timestamp}</div>
      ${referenceId ? `<div class="tag" style="margin-top:8px; color:rgba(255,255,255,0.5);">REF ID: ${referenceId}</div>` : ''}
    </div>
    <div class="field-label">SENDER NAME</div>
    <div class="field-value">${name}</div>
    <div class="field-label">SENDER EMAIL</div>
    <div class="field-value">${email}</div>
    <div class="field-label">MESSAGE BODY</div>
    <div class="field-value">${message.replace(/\n/g, "<br/>")}</div>
    <div class="footer">
      APEX FREIGHT BROKERAGE &nbsp;|&nbsp; MC #000000 &nbsp;|&nbsp; DOT #000000<br/>
      This is an automated dispatch from the contact terminal.
    </div>
  </div>
</body>
</html>
        `;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@apexfreightbrokerage.com",
      to: process.env.RESEND_TO_EMAIL || "info@apexfreightbrokerage.com",
      replyTo: email,
      subject: `NEW INQUIRY — ${name.toUpperCase()} [${referenceId || timestamp}]`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
    }

    return NextResponse.json({ success: true, refId: referenceId });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import path from 'path';
import dotenv from 'dotenv';

// Force load .env.local because Next.js auto-load might be confused by workspace root
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log("Current Working Directory:", process.cwd());

export async function POST(request: Request) {
    console.log("🔥 API ROUTE /api/send-alert HIT 🔥");
    try {
        const { binId, wasteType, location, userEmail, userPhone } = await request.json();

        // Access environment variables directly at runtime inside the function
        const SMTP_HOST = process.env.SMTP_HOST;
        const SMTP_PORT = process.env.SMTP_PORT || 587;
        const SMTP_USER = process.env.SMTP_USER;
        const SMTP_PASS = process.env.SMTP_PASS?.replace(/\s/g, ''); // Remove spaces from app password
        let EMAIL_FROM = process.env.EMAIL_FROM || '"R3Bin Alert" <alerts@fostride.com>';

        const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
        const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
        const TWILIO_FROM = process.env.TWILIO_PHONE_NUMBER;

        console.log("📧 Alert Route Env Check:", {
            SMTP_HOST: SMTP_HOST,
            SMTP_USER: SMTP_USER,
            SMTP_PASS_SET: !!SMTP_PASS,
            EMAIL_FROM: EMAIL_FROM
        });

        const timestamp = new Date().toLocaleString();
        const messageBody = `🚨 CRITICAL ALERT: ${wasteType} Bin is FULL at ${location} (Bin ID: ${binId}). Please schedule collection immediately. Time: ${timestamp}`;

        const results = {
            email: 'skipped',
            sms: 'skipped',
        };

        const targetEmail = userEmail;
        const targetPhone = userPhone;

        // 1. Send Email
        if (SMTP_HOST && SMTP_USER && SMTP_PASS && targetEmail) {
            console.log(`Attempting to send email to ${targetEmail} via ${SMTP_HOST}...`);
            const transporter = nodemailer.createTransport({
                host: SMTP_HOST,
                port: Number(SMTP_PORT),
                secure: false, // true for 465, false for other ports
                auth: {
                    user: SMTP_USER,
                    pass: SMTP_PASS,
                },
                debug: true, // Show debug output
                logger: true // Log to console
            });

            try {
                // Ensure from address formats are correct
                const cleanFrom = EMAIL_FROM.replace(/'/g, "").replace(/"/g, '');

                const info = await transporter.sendMail({
                    from: cleanFrom,
                    to: targetEmail,
                    subject: `[ACTION REQUIRED] Bin Full Alert - ${location}`,
                    text: messageBody,
                    html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #ef4444;">🚨 Bin Capacity Critical</h2>
            <p><strong>Bin ID:</strong> ${binId}</p>
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Waste Type:</strong> ${wasteType}</p>
            <p><strong>Status:</strong> <span style="color: #ef4444; font-weight: bold;">FULL</span></p>
            <p>Please dispatch a collection team immediately to ensure operations continue smoothly.</p>
            <hr />
            <p style="font-size: 12px; color: #64748b;">Fostride R3Bin Smart Management System</p>
          </div>
        `,
                });
                results.email = 'sent';
            } catch (err: any) {
                console.error("NOdeMailer Error:", err)
                results.email = 'failed_send';
            }
        } else if (!targetEmail) {
            console.log('Missing target email address.');
            results.email = 'skipped_no_email';
        } else {
            const missingVars = [];
            if (!SMTP_HOST) missingVars.push('SMTP_HOST');
            if (!SMTP_USER) missingVars.push('SMTP_USER');
            if (!SMTP_PASS) missingVars.push('SMTP_PASS');

            console.log("❌ CONFIG CHECK FAILED. Missing:", missingVars.join(', '));
            console.log("Full Environment Keys (filtered):", Object.keys(process.env).filter(k => k.startsWith('SMTP') || k.startsWith('NEXT')));

            results.email = `skipped_config_missing: ${missingVars.join(', ')}`;
        }


        // 2. Send SMS
        if (TWILIO_SID && TWILIO_TOKEN && TWILIO_FROM && targetPhone) {
            const client = twilio(TWILIO_SID, TWILIO_TOKEN);
            await client.messages.create({
                body: messageBody,
                from: TWILIO_FROM,
                to: targetPhone,
            });
            results.sms = 'sent';
        } else {
            console.log('Twilio configuration missing, skipping SMS alert.');
        }

        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        console.error('Error sending alert:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

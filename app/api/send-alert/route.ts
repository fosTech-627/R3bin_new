import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Environment variables should be set in .env.local
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || '"R3Bin Alert" <alerts@fostride.com>';
const EMAIL_TO = process.env.ALERT_EMAIL_TO; // Admin email to receive alerts

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM = process.env.TWILIO_PHONE_NUMBER;
const ADMIN_PHONE = process.env.ALERT_PHONE_NUMBER; // Admin phone to receive SMS

export async function POST(request: Request) {
    try {
        const { binId, wasteType, location, userEmail, userPhone } = await request.json();

        const timestamp = new Date().toLocaleString();
        const messageBody = `🚨 CRITICAL ALERT: ${wasteType} Bin is FULL at ${location} (Bin ID: ${binId}). Please schedule collection immediately. Time: ${timestamp}`;

        const results = {
            email: 'skipped',
            sms: 'skipped',
        };

        const targetEmail = userEmail || EMAIL_TO;
        const targetPhone = userPhone || ADMIN_PHONE;

        // 1. Send Email
        if (SMTP_HOST && SMTP_USER && SMTP_PASS && targetEmail) {
            const transporter = nodemailer.createTransport({
                host: SMTP_HOST,
                port: Number(SMTP_PORT),
                secure: false, // true for 465, false for other ports
                auth: {
                    user: SMTP_USER,
                    pass: SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: EMAIL_FROM,
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
        } else {
            console.log('Email configuration missing, skipping email alert.');
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

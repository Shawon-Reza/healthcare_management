// import nodemailer, { SendMailOptions } from "nodemailer";
import nodemailer, { SendMailOptions } from "nodemailer";
import { env } from "../../config/env";
import status from "http-status";
import { AppError } from "../../shared/apErrorClass";
import path from "node:path";
import ejs from "ejs";

// Create a transporter using SMTP
export const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});

export interface EmailOptions {
    to: string;
    subject: string;
    template?: string;
    templateName?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    templateData?: Record<string, any>;

    attachments?: SendMailOptions["attachments"];
}




export const sendEmail = async ({ to, subject, template, templateName, templateData, attachments }: EmailOptions) => {
    try {
        
        const templatePath = path.resolve(process.cwd(), `src/email_templates${templateName}.ejs`);

        const html = await ejs.renderFile(templatePath, templateData)


        const info = await transporter.sendMail({
            from: env.SMTP_USER, // sender address
            to: to, // list of recipients
            subject: subject, // subject line
            text: "Hello world?", // plain text body
            html: html, // HTML body
            attachments: templateData?.attachments
        });

        console.log("Message sent: %s", info.messageId);
        // Preview URL is only available when using an Ethereal test account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));



    } catch (error) {
        console.error("Error sending email:", error);
        throw new AppError(
            status.INTERNAL_SERVER_ERROR,
            ` ${error instanceof Error ? error.message : "Unknown error occurred while sending email."}`,
            "EmailError",
            "Path: src/modules/utils/email.ts , Fn: sendEmail"

        );
    }
}
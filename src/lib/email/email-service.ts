import sgMail from '@sendgrid/mail';

// Email template types
export type EmailTemplate =
  | 'welcome'
  | 'password-reset'
  | 'account-suspended'
  | 'notification'
  | 'custom';

interface EmailOptions {
  to: string;
  subject: string;
  template: EmailTemplate;
  templateData?: Record<string, any>;
  text?: string;
  html?: string;
}

interface BulkEmailOptions {
  to: string[];
  subject: string;
  template: EmailTemplate;
  templateData?: Record<string, any>;
  text?: string;
  html?: string;
}

class EmailService {
  private isConfigured: boolean = false;

  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (apiKey) {
      sgMail.setApiKey(apiKey);
      this.isConfigured = true;
    } else {
      console.warn('SENDGRID_API_KEY is not configured. Email sending will be disabled.');
    }
  }

  /**
   * Get HTML template for email
   */
  private getTemplate(template: EmailTemplate, data?: Record<string, any>): string {
    switch (template) {
      case 'welcome':
        return `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>환영합니다</title>
              <style>
                body { font-family: 'Malgun Gothic', sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #3B82F6; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>TOV에 오신 것을 환영합니다!</h1>
                </div>
                <div class="content">
                  <p>안녕하세요, ${data?.name || '회원'}님!</p>
                  <p>TOV 회원가입이 완료되었습니다.</p>
                  <p>앞으로 다양한 서비스를 이용하실 수 있습니다.</p>
                  <p>감사합니다.</p>
                </div>
                <div class="footer">
                  <p>© 2024 TOV. All rights reserved.</p>
                  <p>이 메일은 발신 전용입니다.</p>
                </div>
              </div>
            </body>
          </html>
        `;

      case 'password-reset':
        return `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>비밀번호 재설정</title>
              <style>
                body { font-family: 'Malgun Gothic', sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #3B82F6; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .button { display: inline-block; padding: 10px 20px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 5px; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>비밀번호 재설정</h1>
                </div>
                <div class="content">
                  <p>안녕하세요, ${data?.name || '회원'}님!</p>
                  <p>비밀번호 재설정을 요청하셨습니다.</p>
                  <p>아래 링크를 클릭하여 새 비밀번호를 설정해주세요:</p>
                  <p style="text-align: center; margin: 30px 0;">
                    <a href="${data?.resetLink || '#'}" class="button">비밀번호 재설정</a>
                  </p>
                  <p>이 링크는 24시간 동안만 유효합니다.</p>
                  <p>만약 요청하지 않으셨다면 이 메일을 무시해주세요.</p>
                </div>
                <div class="footer">
                  <p>© 2024 TOV. All rights reserved.</p>
                  <p>이 메일은 발신 전용입니다.</p>
                </div>
              </div>
            </body>
          </html>
        `;

      case 'account-suspended':
        return `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>계정 정지 안내</title>
              <style>
                body { font-family: 'Malgun Gothic', sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #DC2626; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>계정 정지 안내</h1>
                </div>
                <div class="content">
                  <p>안녕하세요, ${data?.name || '회원'}님</p>
                  <p>귀하의 계정이 다음과 같은 사유로 정지되었습니다:</p>
                  <div style="background: white; padding: 15px; margin: 20px 0; border-left: 4px solid #DC2626;">
                    <p><strong>정지 사유:</strong> ${data?.reason || '관리자 판단에 의한 정지'}</p>
                    <p><strong>정지 일시:</strong> ${data?.suspendedAt || new Date().toLocaleString('ko-KR')}</p>
                  </div>
                  <p>계정 정지 해제를 원하시면 고객센터로 문의해주세요.</p>
                </div>
                <div class="footer">
                  <p>© 2024 TOV. All rights reserved.</p>
                  <p>이 메일은 발신 전용입니다.</p>
                </div>
              </div>
            </body>
          </html>
        `;

      case 'notification':
        return `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>알림</title>
              <style>
                body { font-family: 'Malgun Gothic', sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #3B82F6; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>${data?.title || '알림'}</h1>
                </div>
                <div class="content">
                  ${data?.content || '<p>새로운 알림이 있습니다.</p>'}
                </div>
                <div class="footer">
                  <p>© 2024 TOV. All rights reserved.</p>
                  <p>이 메일은 발신 전용입니다.</p>
                </div>
              </div>
            </body>
          </html>
        `;

      case 'custom':
      default:
        return data?.html || '<p>내용이 없습니다.</p>';
    }
  }

  /**
   * Send a single email
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    const html = options.html || this.getTemplate(options.template, options.templateData);
    const text = options.text || this.stripHtml(html);

    if (!this.isConfigured) {
      console.warn('Email service is not configured. Using console output for testing.');

      // 개발 환경에서 콘솔 출력으로 대체
      console.log('================== EMAIL SIMULATION ==================');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('Template:', options.template);
      console.log('Template Data:', options.templateData);
      console.log('HTML Preview (first 500 chars):');
      console.log(html.substring(0, 500) + '...');
      console.log('=====================================================');

      return true; // 성공으로 처리
    }

    try {
      const msg = {
        to: options.to,
        from: process.env.EMAIL_FROM || 'noreply@tov.or.kr',
        subject: options.subject,
        text,
        html,
      };

      await sgMail.send(msg);
      console.log(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  /**
   * Send bulk emails
   */
  async sendBulkEmails(options: BulkEmailOptions): Promise<boolean> {
    const html = options.html || this.getTemplate(options.template, options.templateData);
    const text = options.text || this.stripHtml(html);

    if (!this.isConfigured) {
      console.warn('Email service is not configured. Using console output for testing.');

      // 개발 환경에서 콘솔 출력으로 대체
      console.log('=============== BULK EMAIL SIMULATION ===============');
      console.log('Recipients:', options.to.length, 'users');
      console.log('Emails:', options.to.slice(0, 5).join(', '), options.to.length > 5 ? '...' : '');
      console.log('Subject:', options.subject);
      console.log('Template:', options.template);
      console.log('Template Data:', options.templateData);
      console.log('HTML Preview (first 500 chars):');
      console.log(html.substring(0, 500) + '...');
      console.log('=====================================================');

      return true; // 성공으로 처리
    }

    try {
      const messages = options.to.map(recipient => ({
        to: recipient,
        from: process.env.EMAIL_FROM || 'noreply@tov.or.kr',
        subject: options.subject,
        text,
        html,
      }));

      // SendGrid allows up to 1000 recipients per request
      const batchSize = 1000;
      for (let i = 0; i < messages.length; i += batchSize) {
        const batch = messages.slice(i, i + batchSize);
        await sgMail.send(batch);
      }

      console.log(`Bulk emails sent successfully to ${options.to.length} recipients`);
      return true;
    } catch (error) {
      console.error('Error sending bulk emails:', error);
      return false;
    }
  }

  /**
   * Strip HTML tags from string
   */
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }
}

// Export singleton instance
export const emailService = new EmailService();
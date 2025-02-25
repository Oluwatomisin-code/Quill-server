import {mailCustomizer} from '../mailCustomizer';
import Mailer from '../mailer';
import {Mail} from '../mailer.types';

export default class verificationMailer extends Mailer {
  private mailOptions: Mail;
  constructor() {
    super();
  }
  async verifyEmail(
    receiver: string,
    token: string,
    userId: string,
    domain?: string,
    isTalentProfile?: boolean,
    name?: string
  ) {
    this.mailOptions = {
      to: receiver,
      subject: 'Verify Your Email on Zwilt',
      html: await mailCustomizer('./html/email-verification.html', {
        domain: domain,
        token: token,
        userId: userId,
        isTalentProfile: isTalentProfile,
        name: name,
      }),
    };
    this.sendMail(this.mailOptions);
  }

  async mailVerificationSuccessMailer(
    receiver: string,
    domain?: string,
    isTalentProfile?: boolean,
    name?: string
  ) {
    this.mailOptions = {
      to: receiver,
      subject: 'Email verification success',
      html: await mailCustomizer('./html/email-verification-success.html', {
        domain: domain,
        isTalentProfile: isTalentProfile,
        name: name,
      }),
    };
    this.sendMail(this.mailOptions);
  }
}

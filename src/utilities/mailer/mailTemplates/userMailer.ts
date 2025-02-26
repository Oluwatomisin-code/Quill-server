import {mailCustomizer} from '../mailCustomizer';
import Mailer from '../mailer';
import {Mail} from '../mailer.types';

export default class UserMailer extends Mailer {
  private mailOptions: Mail;

  constructor() {
    super();
  }

  async createUser({
    email,
    verificationToken,
    name,
  }: {
    email: string;
    name: string;
    verificationToken: string;
  }) {
    // this.template = require('../html/email-templates/email-confirmation.html');
    // console.log(this.template);
    this.mailOptions = {
      to: email,
      subject: `Account Creation Successful`,
      // html: await mailCustomizer('./html/email-confirmation.html', { //prod
      html: await mailCustomizer(
        '../mailer/html/email-templates/email-confirmation.html',
        {
          // inviteLink: `account created successfully, here is your verification ${verificationToken}`,
          inviteLink: `${verificationToken.toUpperCase()}`,
          name,
        }
      ),
    };
    this.sendMail(this.mailOptions);
  }
  async inviteUser({
    email,
    inviteToken,
    name,
  }: {
    email: string;
    name: string;
    inviteToken: string;
  }) {
    this.mailOptions = {
      to: email,
      subject: `Invitation to Punch LLC Productivity Suite`,
      html: await mailCustomizer('./html/invite.html', {
        inviteLink: `${process.env.CLIENT_SIDE_URL}/auth/signup?t=${inviteToken}`,
        name,
      }),
    };
    this.sendMail(this.mailOptions);
  }

  async forgotPassword({
    email,
    passwordResetToken,
    name,
  }: {
    email: string;
    passwordResetToken: string;
    name: string;
  }) {
    this.mailOptions = {
      to: email,
      subject: `Password reset notification - EzRealTour`,
      html: await mailCustomizer('./html/reset-password.html', {
        resetlink: passwordResetToken,
        name,
      }).catch(e => console.log(e)),
    };
    this.sendMail(this.mailOptions);
  }

  updateResetPassword({email, name}: {email: string; name: string}) {
    this.mailOptions = {
      to: email,
      subject: `Reset Password Successful - EzRealTour`,
      html: `
      <p>Hello ${name},</p>
      <p>You have successfully reset your password.
      <p>EzRealTour</p>
      `,
    };
    this.sendMail(this.mailOptions);
  }
}

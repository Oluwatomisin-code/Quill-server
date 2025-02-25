import nodemailer from 'nodemailer';
import {Mail} from './mailer.types';

export default class Mailer {
  transporter() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        // user: 'noreply@zwilt.com',
        user: 'tomisintomori@gmail.com',
        // pass: 'moetozpchjfbqkxe',
        pass: 'rmnt xifu zfee rseq',
      },
      //disable certificate verification
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendMail(mailOptions: Mail) {
    try {
      const transporter = this.transporter();
      await transporter.sendMail(mailOptions as any);
    } catch (error) {
      console.log(error);
    }
  }
}

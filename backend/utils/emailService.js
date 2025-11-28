/**
 * Mock Email Service
 * Logs emails to console instead of sending them
 * Replace this with a real email service (SendGrid, Mailgun, etc.) when ready
 */

const logger = require('./logger');

class EmailService {
  /**
   * Send verification email
   */
  static async sendVerificationEmail(email, name, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
    
    console.log('\n=================================');
    console.log('📧 VERIFICATION EMAIL (MOCK)');
    console.log('=================================');
    console.log('To:', email);
    console.log('Subject: Verify Your Email - Music Playlist Manager');
    console.log('\nEmail Content:');
    console.log(`Hi ${name},\n`);
    console.log('Thank you for registering with Music Playlist Manager!\n');
    console.log('Please verify your email by clicking the link below:\n');
    console.log(verificationUrl);
    console.log('\nThis link will expire in 24 hours.\n');
    console.log('If you did not create this account, please ignore this email.\n');
    console.log('=================================\n');

    logger.info(`Verification email sent to ${email}`);
    
    return {
      success: true,
      message: 'Verification email sent (mock)',
      verificationUrl // For testing purposes
    };
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(email, name, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    console.log('\n=================================');
    console.log('📧 PASSWORD RESET EMAIL (MOCK)');
    console.log('=================================');
    console.log('To:', email);
    console.log('Subject: Reset Your Password - Music Playlist Manager');
    console.log('\nEmail Content:');
    console.log(`Hi ${name},\n`);
    console.log('You requested to reset your password.\n');
    console.log('Please click the link below to reset your password:\n');
    console.log(resetUrl);
    console.log('\nThis link will expire in 1 hour.\n');
    console.log('If you did not request this, please ignore this email and your password will remain unchanged.\n');
    console.log('=================================\n');

    logger.info(`Password reset email sent to ${email}`);
    
    return {
      success: true,
      message: 'Password reset email sent (mock)',
      resetUrl // For testing purposes
    };
  }

  /**
   * Send welcome email (after verification)
   */
  static async sendWelcomeEmail(email, name) {
    console.log('\n=================================');
    console.log('📧 WELCOME EMAIL (MOCK)');
    console.log('=================================');
    console.log('To:', email);
    console.log('Subject: Welcome to Music Playlist Manager!');
    console.log('\nEmail Content:');
    console.log(`Hi ${name},\n`);
    console.log('Welcome to Music Playlist Manager! 🎵\n');
    console.log('Your email has been verified successfully.\n');
    console.log('You can now:\n');
    console.log('  • Create unlimited playlists');
    console.log('  • Add tracks via URL or file upload');
    console.log('  • Share playlists with friends');
    console.log('  • Track your listening history\n');
    console.log('Get started: http://localhost:3000/playlists\n');
    console.log('Enjoy your music! 🎶\n');
    console.log('=================================\n');

    logger.info(`Welcome email sent to ${email}`);
    
    return {
      success: true,
      message: 'Welcome email sent (mock)'
    };
  }

  /**
   * Send password changed confirmation email
   */
  static async sendPasswordChangedEmail(email, name) {
    console.log('\n=================================');
    console.log('📧 PASSWORD CHANGED EMAIL (MOCK)');
    console.log('=================================');
    console.log('To:', email);
    console.log('Subject: Your Password Has Been Changed');
    console.log('\nEmail Content:');
    console.log(`Hi ${name},\n`);
    console.log('This email confirms that your password has been changed successfully.\n');
    console.log('If you did not make this change, please contact support immediately.\n');
    console.log('=================================\n');

    logger.info(`Password changed email sent to ${email}`);
    
    return {
      success: true,
      message: 'Password changed email sent (mock)'
    };
  }
}

module.exports = EmailService;

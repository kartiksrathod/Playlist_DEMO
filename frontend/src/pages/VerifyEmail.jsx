import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState('');
  const { token } = useParams();
  const { verifyEmail, resendVerification } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      const result = await verifyEmail(token);
      
      if (result.success) {
        setStatus('success');
        setMessage('Your email has been verified successfully!');
        // Redirect to home after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(result.message || 'Verification failed. The link may have expired.');
        setCanResend(true);
      }
    };

    verify();
  }, [token]);

  const handleResend = async () => {
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    setResending(true);
    const result = await resendVerification(email);
    setResending(false);

    if (result.success) {
      setMessage('Verification email sent! Please check your inbox.');
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Glassmorphic Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl">
          {/* Header */}
          <div className="relative px-8 pt-8 pb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-2">
                Email Verification
              </h2>
              <p className="text-white/70 text-sm">
                {status === 'verifying' && 'Please wait while we verify your email...'}
                {status === 'success' && 'Your account is now active'}
                {status === 'error' && 'Verification failed'}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 pb-8">
            {status === 'verifying' && (
              <div className="text-center py-8">
                <Loader className="w-16 h-16 mx-auto mb-4 text-pink-500 animate-spin" />
                <p className="text-white/70">Verifying your email...</p>
              </div>
            )}

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Email Verified!
                </h3>
                <p className="text-white/70 text-sm mb-6">
                  {message}
                </p>
                <p className="text-white/50 text-xs mb-6">
                  You can now log in and start using Music Playlist Manager.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all shadow-lg shadow-pink-500/25"
                >
                  Go to Login
                </button>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Verification Failed
                </h3>
                <p className="text-white/70 text-sm mb-6">
                  {message}
                </p>

                {canResend && (
                  <div className="space-y-4">
                    <p className="text-white/50 text-sm">
                      Need a new verification link?
                    </p>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                    <button
                      onClick={handleResend}
                      disabled={resending}
                      className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all shadow-lg shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resending ? 'Sending...' : 'Resend Verification Email'}
                    </button>
                  </div>
                )}

                <button
                  onClick={() => navigate('/')}
                  className="mt-4 text-sm text-white/70 hover:text-white transition-colors"
                >
                  Back to Home
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;

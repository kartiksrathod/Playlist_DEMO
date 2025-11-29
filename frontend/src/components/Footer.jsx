import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { 
  Github, 
  Linkedin, 
  Music, 
  Heart,
  ExternalLink,
  Mail,
  Headphones,
  Radio,
  Mic,
  Disc3,
  Waves
} from 'lucide-react';

const Footer = () => {
  const { themeConfig } = useTheme();

  const toolCategories = [
    {
      title: 'Music Streaming',
      icon: <Headphones className="w-5 h-5" />,
      tools: [
        { name: 'Spotify', url: 'https://spotify.com' },
        { name: 'SoundCloud', url: 'https://soundcloud.com' },
        { name: 'Apple Music', url: 'https://music.apple.com' },
        { name: 'YouTube Music', url: 'https://music.youtube.com' },
      ]
    },
    {
      title: 'Audio Production',
      icon: <Mic className="w-5 h-5" />,
      tools: [
        { name: 'Audacity', url: 'https://www.audacityteam.org' },
        { name: 'FL Studio', url: 'https://www.image-line.com' },
        { name: 'Ableton Live', url: 'https://www.ableton.com' },
        { name: 'Logic Pro', url: 'https://www.apple.com/logic-pro' },
      ]
    },
    {
      title: 'Music Discovery',
      icon: <Radio className="w-5 h-5" />,
      tools: [
        { name: 'Last.fm', url: 'https://www.last.fm' },
        { name: 'Shazam', url: 'https://www.shazam.com' },
        { name: 'Genius', url: 'https://genius.com' },
        { name: 'Bandcamp', url: 'https://bandcamp.com' },
      ]
    }
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Playlists', path: '/playlists' },
    { name: 'Library', path: '/library' },
    { name: 'History', path: '/history' },
    { name: 'Favorites', path: '/favorites' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <footer className="relative mt-auto border-t border-white/10 bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Ambient glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute -top-40 right-1/4 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-700/50">
                  <Music className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Music Playlist Manager</h3>
                  <p className="text-sm text-violet-300">Your music, beautifully organized</p>
                </div>
              </div>
              <p className="text-violet-200/80 text-sm leading-relaxed mb-6">
                A modern, full-stack music playlist management application built with React, Node.js, and MongoDB. 
                Create, organize, and enjoy your music collection with an immersive interface.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-3">
                <motion.a
                  href="https://github.com/kartiksrathod"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-4 py-2 bg-slate-800/60 hover:bg-slate-700/60 backdrop-blur-xl border border-violet-700/30 hover:border-violet-500/50 rounded-lg transition-all"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="w-5 h-5 text-violet-300 group-hover:text-white transition-colors" />
                  <span className="text-sm text-violet-200 group-hover:text-white transition-colors">GitHub</span>
                </motion.a>

                <motion.a
                  href="https://www.linkedin.com/in/kartik-s-rathod-a98364389/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-4 py-2 bg-slate-800/60 hover:bg-slate-700/60 backdrop-blur-xl border border-fuchsia-700/30 hover:border-fuchsia-500/50 rounded-lg transition-all"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin className="w-5 h-5 text-fuchsia-300 group-hover:text-white transition-colors" />
                  <span className="text-sm text-fuchsia-200 group-hover:text-white transition-colors">LinkedIn</span>
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Disc3 className="w-4 h-4 text-violet-400" />
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <a
                    href={link.path}
                    className="text-violet-200/80 hover:text-white text-sm transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Recommended Tools - Split into 2 columns on large screens */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {toolCategories.map((category, idx) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + idx * 0.1 }}
              >
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span className="text-violet-400">{category.icon}</span>
                  {category.title}
                </h4>
                <ul className="space-y-2">
                  {category.tools.map((tool) => (
                    <li key={tool.name}>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-200/80 hover:text-white text-sm transition-colors inline-flex items-center gap-1 group"
                      >
                        <span>{tool.name}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-violet-800/30 mb-8"></div>

        {/* Bottom Bar */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-2 text-violet-200/60 text-sm">
            <span>© {new Date().getFullYear()} Music Playlist Manager</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-400 fill-red-400" /> by Kartik S Rathod
            </span>
          </div>

          <div className="flex items-center gap-6 text-violet-200/60 text-sm">
            <a href="/settings" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="/settings" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="mailto:contact@musicmanager.com" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <Mail className="w-3 h-3" />
              Contact
            </a>
          </div>
        </motion.div>

        {/* Tech Stack Badge */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/40 backdrop-blur-xl border border-violet-700/20 rounded-full text-xs text-violet-300">
            <Waves className="w-3 h-3" />
            <span>Built with React • Node.js • MongoDB • Tailwind CSS</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

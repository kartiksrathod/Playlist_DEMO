import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { User, Mail, Calendar, Music, ListMusic, Clock, Award, Camera, Upload } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { mockUser } from '@/data/mockData';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Profile = () => {
  const [profile, setProfile] = useState({
    name: mockUser.name,
    email: mockUser.email,
    joinedDate: new Date(mockUser.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    bio: mockUser.bio,
    avatar: mockUser.avatar,
  });

  const [stats, setStats] = useState({
    totalPlaylists: 0,
    totalTracks: 0,
    totalListeningTime: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch playlists
      const playlistsResponse = await axios.get(`${API}/playlists`);
      const playlists = playlistsResponse.data;
      
      // Fetch tracks for each playlist
      let totalTracks = 0;
      let totalDuration = 0;
      
      for (const playlist of playlists) {
        const tracksResponse = await axios.get(`${API}/playlists/${playlist.id}/tracks`);
        const tracks = tracksResponse.data;
        totalTracks += tracks.length;
        
        // Sum up duration (assuming duration is in seconds)
        tracks.forEach(track => {
          if (track.duration) {
            totalDuration += parseFloat(track.duration);
          }
        });
      }
      
      setStats({
        totalPlaylists: playlists.length,
        totalTracks: totalTracks,
        totalListeningTime: Math.round(totalDuration / 60), // Convert to minutes
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        toast.success('Avatar preview updated (demo mode)');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-950 px-8 py-12">
        {/* Header with Profile Picture */}
        <div className="mb-10">
          <div className="flex items-start gap-6">
            {/* Profile Picture with Upload */}
            <div className="relative group flex-shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden shadow-2xl shadow-blue-700/50 border-4 border-blue-600/30">
                {avatarPreview || profile.avatar ? (
                  <img 
                    src={avatarPreview || profile.avatar} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                    <User className="w-14 h-14 text-white" />
                  </div>
                )}
              </div>
              
              {/* Upload Button Overlay */}
              <label className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <div className="text-center">
                  <Camera className="w-6 h-6 text-white mx-auto mb-1" />
                  <span className="text-xs text-white font-medium">Change</span>
                </div>
              </label>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-light text-white mb-2">{profile.name}</h1>
              <div className="flex items-center gap-4 text-blue-200 mb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-light">{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-light">Joined {profile.joinedDate}</span>
                </div>
              </div>
              <p className="text-blue-100 font-light max-w-2xl">{profile.bio}</p>
              <div className="mt-4 inline-block px-4 py-2 bg-blue-700/30 backdrop-blur-sm rounded-full text-sm text-blue-200 border border-blue-600/30">
                ✨ Demo Profile - Avatar upload is UI preview only
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Playlists Stat */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-blue-800/30">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-700/50">
                  <ListMusic className="w-6 h-6 text-white" />
                </div>
                <Award className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl font-light text-white mb-1">{mockUser.stats.totalPlaylists}</div>
              <div className="text-sm text-blue-200 font-light">Total Playlists</div>
            </div>

            {/* Tracks Stat */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-purple-800/30">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg shadow-purple-700/50">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <Award className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-3xl font-light text-white mb-1">{mockUser.stats.totalTracks}</div>
              <div className="text-sm text-blue-200 font-light">Total Tracks</div>
            </div>

            {/* Listening Time Stat */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-cyan-800/30">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-600 to-cyan-800 shadow-lg shadow-cyan-700/50">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <Award className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-3xl font-light text-white mb-1">{mockUser.stats.listeningMinutes}</div>
              <div className="text-sm text-blue-200 font-light">Minutes of Music</div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-6 border border-blue-800/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-white">Profile Information</h2>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-700/30"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-blue-100 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-700/30"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-blue-700/30 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                ) : (
                  <div className="px-4 py-3 bg-slate-800/60 rounded-xl text-white border border-blue-800/30">{profile.name}</div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-blue-700/30 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                ) : (
                  <div className="px-4 py-3 bg-slate-800/60 rounded-xl text-white border border-blue-800/30">{profile.email}</div>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={editedProfile.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800 border border-blue-700/30 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
                  />
                ) : (
                  <div className="px-4 py-3 bg-slate-800/60 rounded-xl text-white border border-blue-800/30">{profile.bio}</div>
                )}
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-blue-800/30">
            <h2 className="text-xl font-medium text-white mb-6">Account Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left py-3 px-4 rounded-xl hover:bg-slate-800/60 transition-colors border border-blue-800/30">
                <div className="font-medium text-white">Change Password</div>
                <div className="text-sm text-blue-200 font-light">Update your account password</div>
              </button>
              
              <button className="w-full text-left py-3 px-4 rounded-xl hover:bg-slate-800/60 transition-colors border border-blue-800/30">
                <div className="font-medium text-white">Privacy Settings</div>
                <div className="text-sm text-blue-200 font-light">Manage your privacy preferences</div>
              </button>
              
              <button className="w-full text-left py-3 px-4 rounded-xl hover:bg-red-900/30 transition-colors border border-red-700/30 text-red-400">
                <div className="font-medium">Delete Account</div>
                <div className="text-sm font-light opacity-80">Permanently delete your account and data</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;

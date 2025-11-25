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

  return (
    <AppLayout>
      <div className="min-h-screen px-8 py-8">
        {/* Header with Profile Picture */}
        <div className="mb-10">
          <div className="flex items-start gap-6">
            {/* Profile Picture */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg flex-shrink-0">
              <User className="w-14 h-14 text-white" />
            </div>
            
            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-light text-gray-800 mb-2">{profile.name}</h1>
              <div className="flex items-center gap-4 text-gray-600 mb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-light">{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-light">Joined {profile.joinedDate}</span>
                </div>
              </div>
              <p className="text-gray-600 font-light max-w-2xl">{profile.bio}</p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Playlists Stat */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600">
                  <ListMusic className="w-6 h-6 text-white" />
                </div>
                <Award className="w-5 h-5 text-gray-300" />
              </div>
              <div className="text-3xl font-light text-gray-800 mb-1">{stats.totalPlaylists}</div>
              <div className="text-sm text-gray-600 font-light">Total Playlists</div>
            </div>

            {/* Tracks Stat */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <Award className="w-5 h-5 text-gray-300" />
              </div>
              <div className="text-3xl font-light text-gray-800 mb-1">{stats.totalTracks}</div>
              <div className="text-sm text-gray-600 font-light">Total Tracks</div>
            </div>

            {/* Listening Time Stat */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <Award className="w-5 h-5 text-gray-300" />
              </div>
              <div className="text-3xl font-light text-gray-800 mb-1">{stats.totalListeningTime}</div>
              <div className="text-sm text-gray-600 font-light">Minutes of Music</div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-gray-800">Profile Information</h2>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profile.name}</div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profile.email}</div>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={editedProfile.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profile.bio}</div>
                )}
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-medium text-gray-800 mb-6">Account Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200">
                <div className="font-medium text-gray-800">Change Password</div>
                <div className="text-sm text-gray-600 font-light">Update your account password</div>
              </button>
              
              <button className="w-full text-left py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200">
                <div className="font-medium text-gray-800">Privacy Settings</div>
                <div className="text-sm text-gray-600 font-light">Manage your privacy preferences</div>
              </button>
              
              <button className="w-full text-left py-3 px-4 rounded-xl hover:bg-red-50 transition-colors border border-red-200 text-red-600">
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

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Play, Plus, Clock, Music, Download, Globe, Users, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

const SharedPlaylistView = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [playlist, setPlaylist] = useState(null)
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (token) {
      fetchSharedPlaylist()
    }
  }, [token])

  const fetchSharedPlaylist = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/playlists/shared/${token}`)
      
      if (response.ok) {
        const data = await response.json()
        setPlaylist(data.playlist)
        setTracks(data.tracks || [])
      } else if (response.status === 404) {
        setError('Playlist not found or no longer available')
      } else {
        throw new Error('Failed to load shared playlist')
      }
    } catch (error) {
      setError('Failed to load playlist. Please check your connection and try again.')
      console.error('Fetch shared playlist error:', error)
    } finally {
      setLoading(false)
    }
  }

  const importPlaylist = async () => {
    try {
      setImporting(true)
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/playlists/import/${token}`, {
        method: 'POST',
      })
      
      if (response.ok) {
        const data = await response.json()
        toast.success(`Playlist imported to your library!`)
        navigate(`/playlists/${data.id}`)
      } else {
        throw new Error('Failed to import playlist')
      }
    } catch (error) {
      toast.error('Failed to import playlist')
      console.error('Import playlist error:', error)
    } finally {
      setImporting(false)
    }
  }

  const formatDuration = (duration) => {
    if (!duration) return '0:00'
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-lg">Loading shared playlist...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-destructive" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Playlist Not Found</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              {error}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/public')}>
              Browse Public Playlists
            </Button>
            <Button onClick={() => navigate('/playlists')}>
              My Playlists
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!playlist) {
    return null
  }

  const totalDuration = tracks.reduce((sum, track) => sum + (track.duration || 0), 0)
  const totalMinutes = Math.floor(totalDuration / 60)

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      {/* Navigation */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Playlist Header */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cover Image */}
        <div className="lg:w-80 lg:h-80 w-full aspect-square rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 overflow-hidden shadow-xl">
          {playlist.coverImage ? (
            <img
              src={playlist.coverImage}
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
              <Music className="h-24 w-24 text-muted-foreground/50" />
            </div>
          )}
        </div>

        {/* Playlist Info */}
        <div className="flex-1 space-y-6">
          <div>
            {/* Type Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 mb-4">
              <Globe className="h-4 w-4 mr-1" />
              Shared Playlist
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {playlist.name}
            </h1>
            
            {playlist.description && (
              <p className="text-xl text-muted-foreground mb-6">
                {playlist.description}
              </p>
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <span>{tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{totalMinutes} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Shared on {formatDate(playlist.createdAt)}</span>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex gap-3 flex-wrap">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              <Globe className="h-4 w-4 mr-1" />
              Public
            </div>
            {playlist.isCollaborative && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                <Users className="h-4 w-4 mr-1" />
                Collaborative
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={importPlaylist}
              disabled={importing}
              size="lg"
            >
              {importing ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Import to My Library
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              disabled={tracks.length === 0}
            >
              <Play className="h-5 w-5 mr-2" />
              Play All
            </Button>
          </div>
        </div>
      </div>

      {/* Tracks List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Tracks</h2>
        
        {tracks.length === 0 ? (
          <div className="text-center py-16 bg-card border rounded-xl">
            <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">No tracks yet</h3>
            <p className="text-muted-foreground">
              This playlist doesn't have any tracks yet.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                {/* Track Number */}
                <div className="w-8 text-center text-muted-foreground">
                  <span className="group-hover:hidden">{index + 1}</span>
                  <Play className="h-4 w-4 mx-auto hidden group-hover:block text-primary" />
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {track.songName}
                  </div>
                  {track.artist && (
                    <div className="text-sm text-muted-foreground truncate">
                      {track.artist}
                      {track.album && ` • ${track.album}`}
                    </div>
                  )}
                </div>

                {/* Duration */}
                <div className="text-sm text-muted-foreground">
                  {formatDuration(track.duration)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="text-center text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
        <p>
          This is a read-only view of a shared playlist. 
          Import it to your library to add, remove, or edit tracks.
        </p>
      </div>
    </div>
  )
}

export default SharedPlaylistView
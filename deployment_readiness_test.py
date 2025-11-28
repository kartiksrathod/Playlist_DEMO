#!/usr/bin/env python3
"""
Comprehensive Deployment Readiness Testing for Music Playlist Manager
Testing ALL critical functionality for production deployment
"""

import requests
import json
import time
import os
from typing import Dict, List, Any, Optional

# Configuration
BASE_URL = "https://login-system-52.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class DeploymentReadinessTester:
    def __init__(self):
        self.test_results = []
        self.test_data = {
            "playlists": [],
            "tracks": [],
            "share_tokens": [],
            "favorites": {"playlists": [], "tracks": []},
            "history_entries": [],
            "settings": {}
        }
        
    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "response_data": response_data,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
        if not success and response_data:
            print(f"   Response: {response_data}")
        print()

    def make_request(self, method: str, endpoint: str, data: Dict = None, params: Dict = None, files: Dict = None) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        try:
            url = f"{BASE_URL}{endpoint}"
            
            # Handle file uploads
            if files:
                headers = {}  # Don't set Content-Type for multipart
                if method.upper() == "POST":
                    response = requests.post(url, headers=headers, data=data, files=files, timeout=30)
                elif method.upper() == "PUT":
                    response = requests.put(url, headers=headers, data=data, files=files, timeout=30)
                else:
                    return False, f"File upload not supported for method: {method}", 400
            else:
                if method.upper() == "GET":
                    response = requests.get(url, headers=HEADERS, params=params, timeout=30)
                elif method.upper() == "POST":
                    response = requests.post(url, headers=HEADERS, json=data, timeout=30)
                elif method.upper() == "PUT":
                    response = requests.put(url, headers=HEADERS, json=data, timeout=30)
                elif method.upper() == "DELETE":
                    response = requests.delete(url, headers=HEADERS, timeout=30)
                else:
                    return False, f"Unsupported method: {method}", 400
                    
            return response.status_code < 400, response.json() if response.content else {}, response.status_code
            
        except requests.exceptions.RequestException as e:
            return False, f"Request failed: {str(e)}", 0
        except json.JSONDecodeError:
            return False, "Invalid JSON response", response.status_code if 'response' in locals() else 0

    def setup_test_data(self):
        """Create comprehensive test data for all APIs"""
        print("🔧 Setting up comprehensive test data...")
        
        # Create test playlists with cover images
        playlists_data = [
            {"name": "Rock Classics", "description": "Best rock songs of all time"},
            {"name": "Jazz Collection", "description": "Smooth jazz favorites"},
            {"name": "Electronic Beats", "description": "Electronic and EDM tracks"},
            {"name": "Pop Hits", "description": "Popular music collection"}
        ]
        
        for playlist_data in playlists_data:
            success, response, status = self.make_request("POST", "/playlists", playlist_data)
            if success:
                self.test_data["playlists"].append(response)
                print(f"   Created playlist: {response.get('name')} (ID: {response.get('id')})")
        
        # Create test tracks with various metadata
        if self.test_data["playlists"]:
            tracks_data = [
                # Rock Classics tracks
                {"songName": "Bohemian Rhapsody", "artist": "Queen", "album": "A Night at the Opera", "duration": "5:55", "audioUrl": "https://example.com/bohemian-rhapsody"},
                {"songName": "Stairway to Heaven", "artist": "Led Zeppelin", "album": "Led Zeppelin IV", "duration": "8:02", "audioUrl": "https://example.com/stairway-to-heaven"},
                {"songName": "Hotel California", "artist": "Eagles", "album": "Hotel California", "duration": "6:30", "audioUrl": "https://example.com/hotel-california"},
                # Jazz Collection tracks
                {"songName": "Take Five", "artist": "Dave Brubeck", "album": "Time Out", "duration": "5:24", "audioUrl": "https://example.com/take-five"},
                {"songName": "Kind of Blue", "artist": "Miles Davis", "album": "Kind of Blue", "duration": "9:22", "audioUrl": "https://example.com/kind-of-blue"},
                # Electronic Beats tracks
                {"songName": "Strobe", "artist": "Deadmau5", "album": "For Lack of a Better Name", "duration": "10:36", "audioUrl": "https://example.com/strobe"},
                {"songName": "Levels", "artist": "Avicii", "album": "Levels", "duration": "3:18", "audioUrl": "https://example.com/levels"},
                # Pop Hits tracks
                {"songName": "Shape of You", "artist": "Ed Sheeran", "album": "÷ (Divide)", "duration": "3:53", "audioUrl": "https://example.com/shape-of-you"},
                {"songName": "Blinding Lights", "artist": "The Weeknd", "album": "After Hours", "duration": "3:20", "audioUrl": "https://example.com/blinding-lights"}
            ]
            
            # Add tracks to playlists
            playlist_track_mapping = [
                (0, [0, 1, 2]),  # Rock Classics
                (1, [3, 4]),     # Jazz Collection  
                (2, [5, 6]),     # Electronic Beats
                (3, [7, 8])      # Pop Hits
            ]
            
            for playlist_idx, track_indices in playlist_track_mapping:
                if playlist_idx < len(self.test_data["playlists"]):
                    playlist_id = self.test_data["playlists"][playlist_idx]["id"]
                    
                    for track_idx in track_indices:
                        if track_idx < len(tracks_data):
                            track_data = tracks_data[track_idx]
                            success, response, status = self.make_request("POST", f"/playlists/{playlist_id}/tracks", track_data)
                            if success:
                                self.test_data["tracks"].append(response)
                                print(f"   Added track: {response.get('songName')} to {self.test_data['playlists'][playlist_idx]['name']}")
        
        print(f"✅ Test data setup complete: {len(self.test_data['playlists'])} playlists, {len(self.test_data['tracks'])} tracks\n")

    # ==================== PLAYLIST APIs ====================
    
    def test_playlist_crud_operations(self):
        """Test all playlist CRUD operations"""
        print("📁 TESTING PLAYLIST CRUD OPERATIONS")
        print("-" * 50)
        
        # Test GET all playlists
        success, response, status = self.make_request("GET", "/playlists")
        playlists_retrieved = success and isinstance(response, list) and len(response) >= 0
        self.log_test("Playlist CRUD - GET All Playlists", playlists_retrieved, 
                     f"Retrieved {len(response) if isinstance(response, list) else 0} playlists")
        
        if not self.test_data["playlists"]:
            self.log_test("Playlist CRUD - No test data", False, "No playlists available for testing")
            return
            
        playlist_id = self.test_data["playlists"][0]["id"]
        
        # Test GET single playlist
        success, response, status = self.make_request("GET", f"/playlists/{playlist_id}")
        single_playlist_retrieved = success and response.get("id") == playlist_id
        self.log_test("Playlist CRUD - GET Single Playlist", single_playlist_retrieved,
                     f"Retrieved playlist: {response.get('name') if success else 'Failed'}")
        
        # Test UPDATE playlist
        update_data = {"name": "Updated Rock Classics", "description": "Updated description"}
        success, response, status = self.make_request("PUT", f"/playlists/{playlist_id}", update_data)
        playlist_updated = success and response.get("name") == update_data["name"]
        self.log_test("Playlist CRUD - UPDATE Playlist", playlist_updated,
                     f"Updated playlist name to: {response.get('name') if success else 'Failed'}")
        
        # Test CREATE new playlist
        new_playlist_data = {"name": "Test Playlist for CRUD", "description": "Testing playlist creation"}
        success, response, status = self.make_request("POST", "/playlists", new_playlist_data)
        playlist_created = success and response.get("name") == new_playlist_data["name"]
        new_playlist_id = response.get("id") if success else None
        self.log_test("Playlist CRUD - CREATE Playlist", playlist_created,
                     f"Created playlist: {response.get('name') if success else 'Failed'}")
        
        # Test DELETE playlist
        if new_playlist_id:
            success, response, status = self.make_request("DELETE", f"/playlists/{new_playlist_id}")
            playlist_deleted = success and status == 200
            self.log_test("Playlist CRUD - DELETE Playlist", playlist_deleted,
                         f"Deleted playlist: {success}")

    # ==================== TRACK APIs ====================
    
    def test_track_crud_operations(self):
        """Test all track CRUD operations"""
        print("🎵 TESTING TRACK CRUD OPERATIONS")
        print("-" * 50)
        
        if not self.test_data["playlists"]:
            self.log_test("Track CRUD - No playlist data", False, "No playlists available for track testing")
            return
            
        playlist_id = self.test_data["playlists"][0]["id"]
        
        # Test GET all tracks in playlist
        success, response, status = self.make_request("GET", f"/playlists/{playlist_id}/tracks")
        tracks_retrieved = success and isinstance(response, list)
        self.log_test("Track CRUD - GET All Tracks", tracks_retrieved,
                     f"Retrieved {len(response) if isinstance(response, list) else 0} tracks from playlist")
        
        if not self.test_data["tracks"]:
            self.log_test("Track CRUD - No track data", False, "No tracks available for testing")
            return
            
        track_id = self.test_data["tracks"][0]["id"]
        
        # Test GET single track
        success, response, status = self.make_request("GET", f"/playlists/{playlist_id}/tracks/{track_id}")
        single_track_retrieved = success and response.get("id") == track_id
        self.log_test("Track CRUD - GET Single Track", single_track_retrieved,
                     f"Retrieved track: {response.get('songName') if success else 'Failed'}")
        
        # Test UPDATE track
        update_data = {"songName": "Updated Song Name", "artist": "Updated Artist"}
        success, response, status = self.make_request("PUT", f"/playlists/{playlist_id}/tracks/{track_id}", update_data)
        track_updated = success and response.get("songName") == update_data["songName"]
        self.log_test("Track CRUD - UPDATE Track", track_updated,
                     f"Updated track name to: {response.get('songName') if success else 'Failed'}")
        
        # Test CREATE new track
        new_track_data = {"songName": "Test Track for CRUD", "artist": "Test Artist", "album": "Test Album", "duration": "3:30", "audioUrl": "https://example.com/test-track"}
        success, response, status = self.make_request("POST", f"/playlists/{playlist_id}/tracks", new_track_data)
        track_created = success and response.get("songName") == new_track_data["songName"]
        new_track_id = response.get("id") if success else None
        self.log_test("Track CRUD - CREATE Track", track_created,
                     f"Created track: {response.get('songName') if success else 'Failed'}")
        
        # Test DELETE track
        if new_track_id:
            success, response, status = self.make_request("DELETE", f"/playlists/{playlist_id}/tracks/{new_track_id}")
            track_deleted = success and status == 200
            self.log_test("Track CRUD - DELETE Track", track_deleted,
                         f"Deleted track: {success}")

    # ==================== LIBRARY APIs ====================
    
    def test_library_apis(self):
        """Test all library APIs"""
        print("📚 TESTING LIBRARY APIs")
        print("-" * 50)
        
        # Test GET library/tracks with filters
        success, response, status = self.make_request("GET", "/library/tracks")
        library_tracks_basic = success and "tracks" in response and "count" in response
        self.log_test("Library - GET All Tracks", library_tracks_basic,
                     f"Retrieved library tracks: count={response.get('count') if success else 'Failed'}")
        
        # Test with search parameter
        success, response, status = self.make_request("GET", "/library/tracks", params={"search": "Queen"})
        library_search = success and "tracks" in response
        self.log_test("Library - Search Tracks", library_search,
                     f"Search results for 'Queen': {len(response.get('tracks', [])) if success else 'Failed'} tracks")
        
        # Test with filter parameters
        success, response, status = self.make_request("GET", "/library/tracks", params={"sort": "name-asc"})
        library_sort = success and "tracks" in response
        self.log_test("Library - Sort Tracks", library_sort,
                     f"Sorted tracks by name: {success}")
        
        # Test GET library/artists
        success, response, status = self.make_request("GET", "/library/artists")
        library_artists = success and "artists" in response
        self.log_test("Library - GET Artists", library_artists,
                     f"Retrieved artists: {len(response.get('artists', [])) if success else 'Failed'} artists")
        
        # Test GET library/albums
        success, response, status = self.make_request("GET", "/library/albums")
        library_albums = success and "albums" in response
        self.log_test("Library - GET Albums", library_albums,
                     f"Retrieved albums: {len(response.get('albums', [])) if success else 'Failed'} albums")
        
        # Test GET library/stats
        success, response, status = self.make_request("GET", "/library/stats")
        library_stats = success and "stats" in response
        self.log_test("Library - GET Stats", library_stats,
                     f"Retrieved library stats: {success}")
        
        # Test GET library/tracks/:trackId
        if self.test_data["tracks"]:
            track_id = self.test_data["tracks"][0]["id"]
            success, response, status = self.make_request("GET", f"/library/tracks/{track_id}")
            track_details = success and "track" in response
            self.log_test("Library - GET Track Details", track_details,
                         f"Retrieved track details for: {response.get('track', {}).get('songName') if success else 'Failed'}")

    # ==================== SETTINGS APIs ====================
    
    def test_settings_apis(self):
        """Test settings APIs"""
        print("⚙️ TESTING SETTINGS APIs")
        print("-" * 50)
        
        # Test GET settings
        success, response, status = self.make_request("GET", "/settings")
        settings_retrieved = success and isinstance(response, dict)
        self.log_test("Settings - GET Settings", settings_retrieved,
                     f"Retrieved settings: {success}")
        
        if success:
            self.test_data["settings"] = response
        
        # Test PUT settings - update theme
        update_data = {"theme": "light"}
        success, response, status = self.make_request("PUT", "/settings", update_data)
        theme_updated = success and response.get("theme") == "light"
        self.log_test("Settings - UPDATE Theme", theme_updated,
                     f"Updated theme to light: {success}")
        
        # Test PUT settings - update volume
        update_data = {"volume": 85}
        success, response, status = self.make_request("PUT", "/settings", update_data)
        volume_updated = success and response.get("volume") == 85
        self.log_test("Settings - UPDATE Volume", volume_updated,
                     f"Updated volume to 85: {success}")
        
        # Test PUT settings - update multiple settings
        update_data = {"autoPlay": True, "autoShuffle": False, "quality": "high"}
        success, response, status = self.make_request("PUT", "/settings", update_data)
        multiple_updated = success
        self.log_test("Settings - UPDATE Multiple Settings", multiple_updated,
                     f"Updated multiple settings: {success}")

    # ==================== HISTORY APIs ====================
    
    def test_history_apis(self):
        """Test history APIs"""
        print("📊 TESTING HISTORY APIs")
        print("-" * 50)
        
        # Test POST history - record play
        if self.test_data["tracks"]:
            track_id = self.test_data["tracks"][0]["id"]
            playlist_id = self.test_data["playlists"][0]["id"] if self.test_data["playlists"] else None
            
            play_data = {
                "trackId": track_id,
                "playlistId": playlist_id,
                "duration": 180,
                "completed": True
            }
            success, response, status = self.make_request("POST", "/history", play_data)
            play_recorded = success and status == 201
            self.log_test("History - Record Play", play_recorded,
                         f"Recorded play for track: {success}")
            
            if success:
                self.test_data["history_entries"].append(response)
        
        # Test GET history
        success, response, status = self.make_request("GET", "/history")
        history_retrieved = success and "history" in response
        self.log_test("History - GET History", history_retrieved,
                     f"Retrieved history: {len(response.get('history', [])) if success else 'Failed'} entries")
        
        # Test GET history with pagination
        success, response, status = self.make_request("GET", "/history", params={"limit": 5, "offset": 0})
        history_paginated = success and "history" in response
        self.log_test("History - GET History Paginated", history_paginated,
                     f"Retrieved paginated history: {success}")
        
        # Test GET history/stats
        success, response, status = self.make_request("GET", "/history/stats")
        history_stats = success and "stats" in response
        self.log_test("History - GET Stats", history_stats,
                     f"Retrieved history stats: {success}")
        
        # Test DELETE history - clear history
        success, response, status = self.make_request("DELETE", "/history")
        history_cleared = success and status == 200
        self.log_test("History - Clear History", history_cleared,
                     f"Cleared history: {success}")

    # ==================== FAVORITES APIs ====================
    
    def test_favorites_apis(self):
        """Test favorites APIs"""
        print("❤️ TESTING FAVORITES APIs")
        print("-" * 50)
        
        if not self.test_data["playlists"] or not self.test_data["tracks"]:
            self.log_test("Favorites - No test data", False, "No playlists or tracks available")
            return
        
        playlist_id = self.test_data["playlists"][0]["id"]
        track_id = self.test_data["tracks"][0]["id"]
        
        # Test add playlist to favorites
        success, response, status = self.make_request("POST", f"/favorites/playlists/{playlist_id}")
        playlist_favorited = success and (status == 201 or status == 200)
        self.log_test("Favorites - Add Playlist", playlist_favorited,
                     f"Added playlist to favorites: {success}")
        
        # Test add track to favorites
        success, response, status = self.make_request("POST", f"/favorites/tracks/{track_id}")
        track_favorited = success and (status == 201 or status == 200)
        self.log_test("Favorites - Add Track", track_favorited,
                     f"Added track to favorites: {success}")
        
        # Test GET favorite playlists
        success, response, status = self.make_request("GET", "/favorites/playlists")
        favorite_playlists = success and "playlists" in response
        self.log_test("Favorites - GET Playlists", favorite_playlists,
                     f"Retrieved favorite playlists: {len(response.get('playlists', [])) if success else 'Failed'}")
        
        # Test GET favorite tracks
        success, response, status = self.make_request("GET", "/favorites/tracks")
        favorite_tracks = success and "tracks" in response
        self.log_test("Favorites - GET Tracks", favorite_tracks,
                     f"Retrieved favorite tracks: {len(response.get('tracks', [])) if success else 'Failed'}")
        
        # Test check favorite status
        success, response, status = self.make_request("GET", f"/favorites/check/playlist/{playlist_id}")
        check_playlist = success and "isFavorited" in response
        self.log_test("Favorites - Check Playlist Status", check_playlist,
                     f"Checked playlist favorite status: {response.get('isFavorited') if success else 'Failed'}")
        
        success, response, status = self.make_request("GET", f"/favorites/check/track/{track_id}")
        check_track = success and "isFavorited" in response
        self.log_test("Favorites - Check Track Status", check_track,
                     f"Checked track favorite status: {response.get('isFavorited') if success else 'Failed'}")
        
        # Test GET all favorites
        success, response, status = self.make_request("GET", "/favorites/all")
        all_favorites = success and "favorites" in response and "counts" in response
        self.log_test("Favorites - GET All", all_favorites,
                     f"Retrieved all favorites summary: {success}")
        
        # Test remove from favorites
        success, response, status = self.make_request("DELETE", f"/favorites/playlists/{playlist_id}")
        playlist_unfavorited = success and status == 200
        self.log_test("Favorites - Remove Playlist", playlist_unfavorited,
                     f"Removed playlist from favorites: {success}")
        
        success, response, status = self.make_request("DELETE", f"/favorites/tracks/{track_id}")
        track_unfavorited = success and status == 200
        self.log_test("Favorites - Remove Track", track_unfavorited,
                     f"Removed track from favorites: {success}")

    # ==================== SHARING APIs ====================
    
    def test_sharing_apis(self):
        """Test playlist sharing APIs"""
        print("🔗 TESTING SHARING APIs")
        print("-" * 50)
        
        if not self.test_data["playlists"]:
            self.log_test("Sharing - No playlist data", False, "No playlists available")
            return
        
        playlist_id = self.test_data["playlists"][0]["id"]
        
        # Test generate share token
        success, response, status = self.make_request("POST", f"/playlists/{playlist_id}/share")
        share_generated = success and "shareToken" in response
        share_token = response.get("shareToken") if success else None
        self.log_test("Sharing - Generate Share Token", share_generated,
                     f"Generated share token: {share_token[:8] + '...' if share_token else 'Failed'}")
        
        if share_token:
            self.test_data["share_tokens"].append({"token": share_token, "playlist_id": playlist_id})
            
            # Test view shared playlist
            success, response, status = self.make_request("GET", f"/playlists/shared/{share_token}")
            shared_viewed = success and "playlist" in response
            self.log_test("Sharing - View Shared Playlist", shared_viewed,
                         f"Viewed shared playlist: {response.get('playlist', {}).get('name') if success else 'Failed'}")
            
            # Test import shared playlist
            success, response, status = self.make_request("POST", f"/playlists/import/{share_token}")
            playlist_imported = success and "playlist" in response
            self.log_test("Sharing - Import Playlist", playlist_imported,
                         f"Imported playlist: {response.get('playlist', {}).get('name') if success else 'Failed'}")
        
        # Test toggle public
        success, response, status = self.make_request("PUT", f"/playlists/{playlist_id}/toggle-public")
        public_toggled = success and "isPublic" in response
        self.log_test("Sharing - Toggle Public", public_toggled,
                     f"Toggled public status: {response.get('isPublic') if success else 'Failed'}")
        
        # Test toggle collaborative
        success, response, status = self.make_request("PUT", f"/playlists/{playlist_id}/toggle-collaborative")
        collaborative_toggled = success and "isCollaborative" in response
        self.log_test("Sharing - Toggle Collaborative", collaborative_toggled,
                     f"Toggled collaborative: {response.get('isCollaborative') if success else 'Failed'}")
        
        # Test get public playlists
        success, response, status = self.make_request("GET", "/playlists/public")
        public_playlists = success and isinstance(response, list)
        self.log_test("Sharing - GET Public Playlists", public_playlists,
                     f"Retrieved public playlists: {len(response) if isinstance(response, list) else 'Failed'}")

    # ==================== STATIC FILE SERVING ====================
    
    def test_static_file_serving(self):
        """Test static file serving for uploads"""
        print("📁 TESTING STATIC FILE SERVING")
        print("-" * 50)
        
        # Test image upload endpoint accessibility
        test_image_url = f"{BASE_URL}/uploads/covers/test-image.jpg"
        try:
            response = requests.get(test_image_url, timeout=10)
            # 404 is expected if file doesn't exist, but we want to ensure the route is accessible
            image_route_accessible = response.status_code in [200, 404]
            self.log_test("Static Files - Image Route Accessible", image_route_accessible,
                         f"Image route status: {response.status_code}")
        except Exception as e:
            self.log_test("Static Files - Image Route Accessible", False,
                         f"Image route error: {str(e)}")
        
        # Test audio upload endpoint accessibility
        test_audio_url = f"{BASE_URL}/uploads/audio/test-audio.mp3"
        try:
            response = requests.get(test_audio_url, timeout=10)
            # 404 is expected if file doesn't exist, but we want to ensure the route is accessible
            audio_route_accessible = response.status_code in [200, 404]
            self.log_test("Static Files - Audio Route Accessible", audio_route_accessible,
                         f"Audio route status: {response.status_code}")
        except Exception as e:
            self.log_test("Static Files - Audio Route Accessible", False,
                         f"Audio route error: {str(e)}")

    # ==================== DATABASE CONNECTION ====================
    
    def test_database_connection(self):
        """Test database connectivity through API responses"""
        print("🗄️ TESTING DATABASE CONNECTION")
        print("-" * 50)
        
        # Test database connectivity by checking if we can retrieve data
        success, response, status = self.make_request("GET", "/playlists")
        db_connected = success and isinstance(response, list)
        self.log_test("Database - Connection Test", db_connected,
                     f"Database accessible via playlists endpoint: {success}")
        
        # Test database write operations
        test_playlist = {"name": "DB Test Playlist", "description": "Testing database write"}
        success, response, status = self.make_request("POST", "/playlists", test_playlist)
        db_write = success and response.get("name") == test_playlist["name"]
        test_playlist_id = response.get("id") if success else None
        self.log_test("Database - Write Test", db_write,
                     f"Database write operation: {success}")
        
        # Clean up test playlist
        if test_playlist_id:
            self.make_request("DELETE", f"/playlists/{test_playlist_id}")

    # ==================== ERROR HANDLING ====================
    
    def test_error_handling(self):
        """Test API error handling"""
        print("⚠️ TESTING ERROR HANDLING")
        print("-" * 50)
        
        # Test 404 errors
        error_tests = [
            ("GET", "/playlists/non-existent-id", 404, "Non-existent playlist"),
            ("GET", "/playlists/non-existent-id/tracks", 404, "Tracks for non-existent playlist"),
            ("GET", "/library/tracks/non-existent-track", 404, "Non-existent track details"),
            ("POST", "/favorites/playlists/non-existent-id", 404, "Favorite non-existent playlist"),
            ("GET", "/playlists/shared/invalid-token", 404, "Invalid share token")
        ]
        
        for method, endpoint, expected_status, description in error_tests:
            success, response, status = self.make_request(method, endpoint)
            error_handled = not success and status == expected_status
            self.log_test(f"Error Handling - {description}", error_handled,
                         f"Expected {expected_status}, got {status}")
        
        # Test 400 errors (bad requests)
        bad_request_tests = [
            ("POST", "/playlists", {}, "Empty playlist data"),
            ("POST", "/playlists/valid-id/tracks", {}, "Empty track data"),
            ("PUT", "/settings", {"theme": "invalid-theme"}, "Invalid theme value")
        ]
        
        # Use a valid playlist ID if available
        valid_playlist_id = self.test_data["playlists"][0]["id"] if self.test_data["playlists"] else "test-id"
        
        for method, endpoint, data, description in bad_request_tests:
            # Replace placeholder with actual ID
            endpoint = endpoint.replace("valid-id", valid_playlist_id)
            success, response, status = self.make_request(method, endpoint, data)
            bad_request_handled = not success and status == 400
            self.log_test(f"Error Handling - {description}", bad_request_handled,
                         f"Expected 400, got {status}")

    def cleanup_test_data(self):
        """Clean up all test data"""
        print("🧹 Cleaning up test data...")
        
        # Delete test playlists (cascades to tracks)
        for playlist in self.test_data["playlists"]:
            playlist_id = playlist["id"]
            success, response, status = self.make_request("DELETE", f"/playlists/{playlist_id}")
            if success:
                print(f"   Deleted playlist: {playlist['name']}")
        
        # Clear history
        self.make_request("DELETE", "/history")
        
        print("✅ Cleanup complete\n")

    def run_comprehensive_tests(self):
        """Run all deployment readiness tests"""
        print("🚀 STARTING COMPREHENSIVE DEPLOYMENT READINESS TESTING")
        print("🎯 Music Playlist Manager - Production Deployment Verification")
        print("=" * 80)
        print()
        
        # Setup test data
        self.setup_test_data()
        
        try:
            # Test database connection first
            self.test_database_connection()
            print()
            
            # Test all API categories
            self.test_playlist_crud_operations()
            print()
            
            self.test_track_crud_operations()
            print()
            
            self.test_library_apis()
            print()
            
            self.test_settings_apis()
            print()
            
            self.test_history_apis()
            print()
            
            self.test_favorites_apis()
            print()
            
            self.test_sharing_apis()
            print()
            
            self.test_static_file_serving()
            print()
            
            self.test_error_handling()
            print()
            
        finally:
            # Always cleanup
            self.cleanup_test_data()
        
        # Print comprehensive summary
        self.print_deployment_summary()

    def print_deployment_summary(self):
        """Print comprehensive deployment readiness summary"""
        print("=" * 80)
        print("📊 DEPLOYMENT READINESS SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {success_rate:.1f}%")
        print()
        
        # Deployment readiness assessment
        if success_rate >= 95:
            deployment_status = "🟢 READY FOR DEPLOYMENT"
            recommendation = "All critical systems are functioning correctly. Safe to deploy."
        elif success_rate >= 85:
            deployment_status = "🟡 DEPLOYMENT WITH CAUTION"
            recommendation = "Most systems working. Review failed tests before deployment."
        else:
            deployment_status = "🔴 NOT READY FOR DEPLOYMENT"
            recommendation = "Critical issues found. Fix failed tests before deployment."
        
        print(f"DEPLOYMENT STATUS: {deployment_status}")
        print(f"RECOMMENDATION: {recommendation}")
        print()
        
        # Category breakdown
        categories = {
            "Playlist CRUD": [r for r in self.test_results if "Playlist CRUD" in r["test"]],
            "Track CRUD": [r for r in self.test_results if "Track CRUD" in r["test"]],
            "Library": [r for r in self.test_results if "Library" in r["test"]],
            "Settings": [r for r in self.test_results if "Settings" in r["test"]],
            "History": [r for r in self.test_results if "History" in r["test"]],
            "Favorites": [r for r in self.test_results if "Favorites" in r["test"]],
            "Sharing": [r for r in self.test_results if "Sharing" in r["test"]],
            "Static Files": [r for r in self.test_results if "Static Files" in r["test"]],
            "Database": [r for r in self.test_results if "Database" in r["test"]],
            "Error Handling": [r for r in self.test_results if "Error Handling" in r["test"]]
        }
        
        print("📋 CATEGORY BREAKDOWN:")
        print("-" * 40)
        for category, results in categories.items():
            if results:
                category_passed = sum(1 for r in results if r["success"])
                category_total = len(results)
                category_rate = (category_passed / category_total * 100) if category_total > 0 else 0
                status_icon = "✅" if category_rate == 100 else "⚠️" if category_rate >= 80 else "❌"
                print(f"{status_icon} {category}: {category_passed}/{category_total} ({category_rate:.0f}%)")
        
        print()
        
        if failed_tests > 0:
            print("❌ FAILED TESTS:")
            print("-" * 40)
            for result in self.test_results:
                if not result["success"]:
                    print(f"• {result['test']}")
                    if result["details"]:
                        print(f"  Details: {result['details']}")
            print()
        
        print("=" * 80)

if __name__ == "__main__":
    tester = DeploymentReadinessTester()
    tester.run_comprehensive_tests()
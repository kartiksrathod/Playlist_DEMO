#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Favorites System (Feature 5)
Tests all 8 API endpoints for the favorites functionality
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BASE_URL = "https://error-resolve-12.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class FavoritesAPITester:
    def __init__(self):
        self.test_results = []
        self.test_playlist_id = None
        self.test_track_id = None
        self.created_playlist_ids = []
        self.created_track_ids = []
        
    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "test": test_name,
            "status": status,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def setup_test_data(self):
        """Create test playlist and track for testing"""
        print("\n🔧 SETTING UP TEST DATA")
        
        # Create test playlist
        playlist_data = {
            "name": "Test Favorites Playlist",
            "description": "Playlist for testing favorites functionality"
        }
        
        try:
            response = requests.post(f"{BASE_URL}/playlists", json=playlist_data, headers=HEADERS)
            if response.status_code == 201:
                response_data = response.json()
                playlist = response_data.get('playlist', response_data)  # Handle different response formats
                self.test_playlist_id = playlist.get('id')
                if self.test_playlist_id:
                    self.created_playlist_ids.append(self.test_playlist_id)
                    print(f"✅ Created test playlist: {self.test_playlist_id}")
                else:
                    print(f"❌ No playlist ID in response: {response_data}")
                    return False
                
                # Create test track in the playlist
                track_data = {
                    "songName": "Test Favorite Song",
                    "artist": "Test Artist",
                    "album": "Test Album",
                    "duration": "3:45",
                    "audioUrl": "https://example.com/test-song.mp3"
                }
                
                track_response = requests.post(
                    f"{BASE_URL}/playlists/{self.test_playlist_id}/tracks", 
                    json=track_data, 
                    headers=HEADERS
                )
                
                if track_response.status_code == 201:
                    track_response_data = track_response.json()
                    track = track_response_data.get('track', track_response_data)  # Handle different response formats
                    self.test_track_id = track.get('id')
                    if self.test_track_id:
                        self.created_track_ids.append(self.test_track_id)
                        print(f"✅ Created test track: {self.test_track_id}")
                        return True
                    else:
                        print(f"❌ No track ID in response: {track_response_data}")
                        return False
                else:
                    print(f"❌ Failed to create test track: {track_response.status_code} - {track_response.text}")
                    return False
            else:
                print(f"❌ Failed to create test playlist: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Error setting up test data: {str(e)}")
            return False
    
    def cleanup_test_data(self):
        """Clean up created test data"""
        print("\n🧹 CLEANING UP TEST DATA")
        
        # Delete created tracks
        for track_id in self.created_track_ids:
            try:
                requests.delete(f"{BASE_URL}/playlists/{self.test_playlist_id}/tracks/{track_id}")
                print(f"✅ Deleted test track: {track_id}")
            except Exception as e:
                print(f"❌ Error deleting track {track_id}: {str(e)}")
        
        # Delete created playlists
        for playlist_id in self.created_playlist_ids:
            try:
                requests.delete(f"{BASE_URL}/playlists/{playlist_id}")
                print(f"✅ Deleted test playlist: {playlist_id}")
            except Exception as e:
                print(f"❌ Error deleting playlist {playlist_id}: {str(e)}")
    
    def test_add_playlist_to_favorites(self):
        """Test POST /api/favorites/playlists/:playlistId"""
        print("\n📋 TESTING: Add Playlist to Favorites")
        
        # Test 1: Add valid playlist to favorites
        try:
            response = requests.post(f"{BASE_URL}/favorites/playlists/{self.test_playlist_id}")
            
            if response.status_code == 201:
                data = response.json()
                if data.get('success') and data.get('message') == 'Added to favorites':
                    favorite = data.get('favorite', {})
                    if (favorite.get('itemType') == 'playlist' and 
                        favorite.get('itemId') == self.test_playlist_id and
                        favorite.get('userId') == 'default-user'):
                        self.log_test(
                            "Add Valid Playlist to Favorites",
                            True,
                            "Successfully added playlist to favorites with correct structure"
                        )
                    else:
                        self.log_test(
                            "Add Valid Playlist to Favorites",
                            False,
                            "Favorite record structure incorrect",
                            favorite
                        )
                else:
                    self.log_test(
                        "Add Valid Playlist to Favorites",
                        False,
                        "Response structure incorrect",
                        data
                    )
            else:
                self.log_test(
                    "Add Valid Playlist to Favorites",
                    False,
                    f"Expected 201, got {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Add Valid Playlist to Favorites",
                False,
                f"Request failed: {str(e)}"
            )
        
        # Test 2: Test duplicate prevention
        try:
            response = requests.post(f"{BASE_URL}/favorites/playlists/{self.test_playlist_id}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'Already in favorites' in data.get('message', ''):
                    self.log_test(
                        "Duplicate Prevention - Playlist",
                        True,
                        "Correctly prevented duplicate favorite"
                    )
                else:
                    self.log_test(
                        "Duplicate Prevention - Playlist",
                        False,
                        "Duplicate prevention message incorrect",
                        data
                    )
            else:
                self.log_test(
                    "Duplicate Prevention - Playlist",
                    False,
                    f"Expected 200, got {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Duplicate Prevention - Playlist",
                False,
                f"Request failed: {str(e)}"
            )
        
        # Test 3: Test non-existent playlist
        try:
            fake_id = "non-existent-playlist-id"
            response = requests.post(f"{BASE_URL}/favorites/playlists/{fake_id}")
            
            if response.status_code == 404:
                data = response.json()
                if not data.get('success') and 'not found' in data.get('message', '').lower():
                    self.log_test(
                        "Non-existent Playlist Validation",
                        True,
                        "Correctly returned 404 for non-existent playlist"
                    )
                else:
                    self.log_test(
                        "Non-existent Playlist Validation",
                        False,
                        "Error message incorrect",
                        data
                    )
            else:
                self.log_test(
                    "Non-existent Playlist Validation",
                    False,
                    f"Expected 404, got {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Non-existent Playlist Validation",
                False,
                f"Request failed: {str(e)}"
            )
    
    def test_add_track_to_favorites(self):
        """Test POST /api/favorites/tracks/:trackId"""
        print("\n🎵 TESTING: Add Track to Favorites")
        
        # Test 1: Add valid track to favorites
        try:
            response = requests.post(f"{BASE_URL}/favorites/tracks/{self.test_track_id}")
            
            if response.status_code == 201:
                data = response.json()
                if data.get('success') and data.get('message') == 'Added to favorites':
                    favorite = data.get('favorite', {})
                    if (favorite.get('itemType') == 'track' and 
                        favorite.get('itemId') == self.test_track_id and
                        favorite.get('userId') == 'default-user'):
                        self.log_test(
                            "Add Valid Track to Favorites",
                            True,
                            "Successfully added track to favorites with correct structure"
                        )
                    else:
                        self.log_test(
                            "Add Valid Track to Favorites",
                            False,
                            "Favorite record structure incorrect",
                            favorite
                        )
                else:
                    self.log_test(
                        "Add Valid Track to Favorites",
                        False,
                        "Response structure incorrect",
                        data
                    )
            else:
                self.log_test(
                    "Add Valid Track to Favorites",
                    False,
                    f"Expected 201, got {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Add Valid Track to Favorites",
                False,
                f"Request failed: {str(e)}"
            )
        
        # Test 2: Test duplicate prevention
        try:
            response = requests.post(f"{BASE_URL}/favorites/tracks/{self.test_track_id}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'Already in favorites' in data.get('message', ''):
                    self.log_test(
                        "Duplicate Prevention - Track",
                        True,
                        "Correctly prevented duplicate favorite"
                    )
                else:
                    self.log_test(
                        "Duplicate Prevention - Track",
                        False,
                        "Duplicate prevention message incorrect",
                        data
                    )
            else:
                self.log_test(
                    "Duplicate Prevention - Track",
                    False,
                    f"Expected 200, got {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Duplicate Prevention - Track",
                False,
                f"Request failed: {str(e)}"
            )
        
        # Test 3: Test non-existent track
        try:
            fake_id = "non-existent-track-id"
            response = requests.post(f"{BASE_URL}/favorites/tracks/{fake_id}")
            
            if response.status_code == 404:
                data = response.json()
                if not data.get('success') and 'not found' in data.get('message', '').lower():
                    self.log_test(
                        "Non-existent Track Validation",
                        True,
                        "Correctly returned 404 for non-existent track"
                    )
                else:
                    self.log_test(
                        "Non-existent Track Validation",
                        False,
                        "Error message incorrect",
                        data
                    )
            else:
                self.log_test(
                    "Non-existent Track Validation",
                    False,
                    f"Expected 404, got {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Non-existent Track Validation",
                False,
                f"Request failed: {str(e)}"
            )
    
    def test_get_favorite_playlists(self):
        """Test GET /api/favorites/playlists"""
        print("\n📋 TESTING: Get Favorite Playlists")
        
        try:
            response = requests.get(f"{BASE_URL}/favorites/playlists")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    playlists = data.get('playlists', [])
                    count = data.get('count', 0)
                    
                    if len(playlists) == count and count > 0:
                        # Check if our test playlist is in the favorites
                        test_playlist = next((p for p in playlists if p.get('id') == self.test_playlist_id), None)
                        
                        if test_playlist:
                            # Verify enrichment
                            required_fields = ['id', 'name', 'description', 'addedToFavoritesAt', 'trackCount']
                            missing_fields = [field for field in required_fields if field not in test_playlist]
                            
                            if not missing_fields:
                                self.log_test(
                                    "Get Favorite Playlists - Enrichment",
                                    True,
                                    f"Successfully retrieved {count} favorite playlists with proper enrichment"
                                )
                            else:
                                self.log_test(
                                    "Get Favorite Playlists - Enrichment",
                                    False,
                                    f"Missing enrichment fields: {missing_fields}",
                                    test_playlist
                                )
                        else:
                            self.log_test(
                                "Get Favorite Playlists - Content",
                                False,
                                "Test playlist not found in favorites list",
                                playlists
                            )
                    else:
                        self.log_test(
                            "Get Favorite Playlists - Structure",
                            False,
                            f"Count mismatch: playlists length {len(playlists)} != count {count}",
                            data
                        )
                else:
                    self.log_test(
                        "Get Favorite Playlists - Response",
                        False,
                        "Response success field is false",
                        data
                    )
            else:
                self.log_test(
                    "Get Favorite Playlists - Status",
                    False,
                    f"Expected 200, got {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Get Favorite Playlists - Request",
                False,
                f"Request failed: {str(e)}"
            )
    
    def test_get_favorite_tracks(self):
        """Test GET /api/favorites/tracks"""
        print("\n🎵 TESTING: Get Favorite Tracks")
        
        try:
            response = requests.get(f"{BASE_URL}/favorites/tracks")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    tracks = data.get('tracks', [])
                    count = data.get('count', 0)
                    
                    if len(tracks) == count and count > 0:
                        # Check if our test track is in the favorites
                        test_track = next((t for t in tracks if t.get('id') == self.test_track_id), None)
                        
                        if test_track:
                            # Verify enrichment
                            required_fields = ['id', 'songName', 'artist', 'album', 'duration', 'playlistName', 'addedToFavoritesAt']
                            missing_fields = [field for field in required_fields if field not in test_track]
                            
                            if not missing_fields:
                                self.log_test(
                                    "Get Favorite Tracks - Enrichment",
                                    True,
                                    f"Successfully retrieved {count} favorite tracks with proper enrichment"
                                )
                            else:
                                self.log_test(
                                    "Get Favorite Tracks - Enrichment",
                                    False,
                                    f"Missing enrichment fields: {missing_fields}",
                                    test_track
                                )
                        else:
                            self.log_test(
                                "Get Favorite Tracks - Content",
                                False,
                                "Test track not found in favorites list",
                                tracks
                            )
                    else:
                        self.log_test(
                            "Get Favorite Tracks - Structure",
                            False,
                            f"Count mismatch: tracks length {len(tracks)} != count {count}",
                            data
                        )
                else:
                    self.log_test(
                        "Get Favorite Tracks - Response",
                        False,
                        "Response success field is false",
                        data
                    )
            else:
                self.log_test(
                    "Get Favorite Tracks - Status",
                    False,
                    f"Expected 200, got {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Get Favorite Tracks - Request",
                False,
                f"Request failed: {str(e)}"
            )
    
    def test_get_all_favorites(self):
        """Test GET /api/favorites/all"""
        print("\n📊 TESTING: Get All Favorites Summary")
        
        try:
            response = requests.get(f"{BASE_URL}/favorites/all")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    favorites = data.get('favorites', {})
                    counts = data.get('counts', {})
                    
                    # Check structure
                    required_favorites_fields = ['playlists', 'tracks']
                    required_counts_fields = ['playlists', 'tracks', 'total']
                    
                    favorites_missing = [field for field in required_favorites_fields if field not in favorites]
                    counts_missing = [field for field in required_counts_fields if field not in counts]
                    
                    if not favorites_missing and not counts_missing:
                        # Verify our test items are included
                        playlist_ids = favorites.get('playlists', [])
                        track_ids = favorites.get('tracks', [])
                        
                        playlist_found = self.test_playlist_id in playlist_ids
                        track_found = self.test_track_id in track_ids
                        
                        # Verify counts match
                        playlist_count_match = len(playlist_ids) == counts.get('playlists', 0)
                        track_count_match = len(track_ids) == counts.get('tracks', 0)
                        total_count_match = (len(playlist_ids) + len(track_ids)) == counts.get('total', 0)
                        
                        if (playlist_found and track_found and 
                            playlist_count_match and track_count_match and total_count_match):
                            self.log_test(
                                "Get All Favorites Summary",
                                True,
                                f"Successfully retrieved favorites summary with correct structure and counts"
                            )
                        else:
                            issues = []
                            if not playlist_found: issues.append("test playlist not found")
                            if not track_found: issues.append("test track not found")
                            if not playlist_count_match: issues.append("playlist count mismatch")
                            if not track_count_match: issues.append("track count mismatch")
                            if not total_count_match: issues.append("total count mismatch")
                            
                            self.log_test(
                                "Get All Favorites Summary",
                                False,
                                f"Issues found: {', '.join(issues)}",
                                data
                            )
                    else:
                        missing_fields = favorites_missing + counts_missing
                        self.log_test(
                            "Get All Favorites Summary",
                            False,
                            f"Missing required fields: {missing_fields}",
                            data
                        )
                else:
                    self.log_test(
                        "Get All Favorites Summary",
                        False,
                        "Response success field is false",
                        data
                    )
            else:
                self.log_test(
                    "Get All Favorites Summary",
                    False,
                    f"Expected 200, got {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Get All Favorites Summary",
                False,
                f"Request failed: {str(e)}"
            )
    
    def test_check_favorite_status(self):
        """Test GET /api/favorites/check/:type/:id"""
        print("\n✅ TESTING: Check Favorite Status")
        
        # Test 1: Check favorited playlist
        try:
            response = requests.get(f"{BASE_URL}/favorites/check/playlist/{self.test_playlist_id}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('isFavorited') is True:
                    self.log_test(
                        "Check Favorited Playlist Status",
                        True,
                        "Correctly identified favorited playlist"
                    )
                else:
                    self.log_test(
                        "Check Favorited Playlist Status",
                        False,
                        "Failed to identify favorited playlist",
                        data
                    )
            else:
                self.log_test(
                    "Check Favorited Playlist Status",
                    False,
                    f"Expected 200, got {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Check Favorited Playlist Status",
                False,
                f"Request failed: {str(e)}"
            )
        
        # Test 2: Check favorited track
        try:
            response = requests.get(f"{BASE_URL}/favorites/check/track/{self.test_track_id}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('isFavorited') is True:
                    self.log_test(
                        "Check Favorited Track Status",
                        True,
                        "Correctly identified favorited track"
                    )
                else:
                    self.log_test(
                        "Check Favorited Track Status",
                        False,
                        "Failed to identify favorited track",
                        data
                    )
            else:
                self.log_test(
                    "Check Favorited Track Status",
                    False,
                    f"Expected 200, got {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Check Favorited Track Status",
                False,
                f"Request failed: {str(e)}"
            )
        
        # Test 3: Check non-favorited item
        try:
            fake_id = "non-favorited-playlist-id"
            response = requests.get(f"{BASE_URL}/favorites/check/playlist/{fake_id}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('isFavorited') is False:
                    self.log_test(
                        "Check Non-favorited Item Status",
                        True,
                        "Correctly identified non-favorited item"
                    )
                else:
                    self.log_test(
                        "Check Non-favorited Item Status",
                        False,
                        "Failed to identify non-favorited item",
                        data
                    )
            else:
                self.log_test(
                    "Check Non-favorited Item Status",
                    False,
                    f"Expected 200, got {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Check Non-favorited Item Status",
                False,
                f"Request failed: {str(e)}"
            )
        
        # Test 4: Check invalid type
        try:
            response = requests.get(f"{BASE_URL}/favorites/check/invalid/{self.test_playlist_id}")
            
            if response.status_code == 400:
                data = response.json()
                if not data.get('success') and 'invalid type' in data.get('message', '').lower():
                    self.log_test(
                        "Check Invalid Type Validation",
                        True,
                        "Correctly rejected invalid type parameter"
                    )
                else:
                    self.log_test(
                        "Check Invalid Type Validation",
                        False,
                        "Invalid type error message incorrect",
                        data
                    )
            else:
                self.log_test(
                    "Check Invalid Type Validation",
                    False,
                    f"Expected 400, got {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Check Invalid Type Validation",
                False,
                f"Request failed: {str(e)}"
            )
    
    def test_remove_favorites(self):
        """Test DELETE endpoints for removing favorites"""
        print("\n🗑️ TESTING: Remove Favorites")
        
        # Test 1: Remove favorited playlist
        try:
            response = requests.delete(f"{BASE_URL}/favorites/playlists/{self.test_playlist_id}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'removed from favorites' in data.get('message', '').lower():
                    self.log_test(
                        "Remove Favorited Playlist",
                        True,
                        "Successfully removed playlist from favorites"
                    )
                else:
                    self.log_test(
                        "Remove Favorited Playlist",
                        False,
                        "Remove success message incorrect",
                        data
                    )
            else:
                self.log_test(
                    "Remove Favorited Playlist",
                    False,
                    f"Expected 200, got {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Remove Favorited Playlist",
                False,
                f"Request failed: {str(e)}"
            )
        
        # Test 2: Remove favorited track
        try:
            response = requests.delete(f"{BASE_URL}/favorites/tracks/{self.test_track_id}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'removed from favorites' in data.get('message', '').lower():
                    self.log_test(
                        "Remove Favorited Track",
                        True,
                        "Successfully removed track from favorites"
                    )
                else:
                    self.log_test(
                        "Remove Favorited Track",
                        False,
                        "Remove success message incorrect",
                        data
                    )
            else:
                self.log_test(
                    "Remove Favorited Track",
                    False,
                    f"Expected 200, got {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Remove Favorited Track",
                False,
                f"Request failed: {str(e)}"
            )
        
        # Test 3: Remove non-favorited playlist (should handle gracefully)
        try:
            response = requests.delete(f"{BASE_URL}/favorites/playlists/{self.test_playlist_id}")
            
            if response.status_code == 404:
                data = response.json()
                if not data.get('success') and 'not found' in data.get('message', '').lower():
                    self.log_test(
                        "Remove Non-favorited Playlist",
                        True,
                        "Correctly handled removal of non-favorited playlist"
                    )
                else:
                    self.log_test(
                        "Remove Non-favorited Playlist",
                        False,
                        "Error message incorrect for non-favorited item",
                        data
                    )
            else:
                self.log_test(
                    "Remove Non-favorited Playlist",
                    False,
                    f"Expected 404, got {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Remove Non-favorited Playlist",
                False,
                f"Request failed: {str(e)}"
            )
    
    def test_empty_favorites(self):
        """Test endpoints with no favorites"""
        print("\n📭 TESTING: Empty Favorites State")
        
        # Test GET /api/favorites/playlists with no favorites
        try:
            response = requests.get(f"{BASE_URL}/favorites/playlists")
            
            if response.status_code == 200:
                data = response.json()
                if (data.get('success') and 
                    data.get('playlists') == [] and 
                    data.get('count') == 0):
                    self.log_test(
                        "Empty Favorite Playlists",
                        True,
                        "Correctly returned empty array for no favorite playlists"
                    )
                else:
                    self.log_test(
                        "Empty Favorite Playlists",
                        False,
                        "Empty state response incorrect",
                        data
                    )
            else:
                self.log_test(
                    "Empty Favorite Playlists",
                    False,
                    f"Expected 200, got {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Empty Favorite Playlists",
                False,
                f"Request failed: {str(e)}"
            )
        
        # Test GET /api/favorites/tracks with no favorites
        try:
            response = requests.get(f"{BASE_URL}/favorites/tracks")
            
            if response.status_code == 200:
                data = response.json()
                if (data.get('success') and 
                    data.get('tracks') == [] and 
                    data.get('count') == 0):
                    self.log_test(
                        "Empty Favorite Tracks",
                        True,
                        "Correctly returned empty array for no favorite tracks"
                    )
                else:
                    self.log_test(
                        "Empty Favorite Tracks",
                        False,
                        "Empty state response incorrect",
                        data
                    )
            else:
                self.log_test(
                    "Empty Favorite Tracks",
                    False,
                    f"Expected 200, got {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Empty Favorite Tracks",
                False,
                f"Request failed: {str(e)}"
            )
        
        # Test GET /api/favorites/all with no favorites
        try:
            response = requests.get(f"{BASE_URL}/favorites/all")
            
            if response.status_code == 200:
                data = response.json()
                favorites = data.get('favorites', {})
                counts = data.get('counts', {})
                
                if (data.get('success') and 
                    favorites.get('playlists') == [] and 
                    favorites.get('tracks') == [] and
                    counts.get('playlists') == 0 and
                    counts.get('tracks') == 0 and
                    counts.get('total') == 0):
                    self.log_test(
                        "Empty All Favorites Summary",
                        True,
                        "Correctly returned empty arrays and zero counts"
                    )
                else:
                    self.log_test(
                        "Empty All Favorites Summary",
                        False,
                        "Empty state response incorrect",
                        data
                    )
            else:
                self.log_test(
                    "Empty All Favorites Summary",
                    False,
                    f"Expected 200, got {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Empty All Favorites Summary",
                False,
                f"Request failed: {str(e)}"
            )
    
    def run_all_tests(self):
        """Run all favorites API tests"""
        print("🚀 STARTING COMPREHENSIVE FAVORITES SYSTEM BACKEND TESTING")
        print("=" * 70)
        
        # Setup test data
        if not self.setup_test_data():
            print("❌ Failed to setup test data. Aborting tests.")
            return
        
        # Run all tests in order
        self.test_add_playlist_to_favorites()
        self.test_add_track_to_favorites()
        self.test_get_favorite_playlists()
        self.test_get_favorite_tracks()
        self.test_get_all_favorites()
        self.test_check_favorite_status()
        self.test_remove_favorites()
        self.test_empty_favorites()
        
        # Cleanup
        self.cleanup_test_data()
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print test results summary"""
        print("\n" + "=" * 70)
        print("📊 FAVORITES SYSTEM BACKEND TESTING SUMMARY")
        print("=" * 70)
        
        passed = sum(1 for result in self.test_results if "✅ PASS" in result["status"])
        failed = sum(1 for result in self.test_results if "❌ FAIL" in result["status"])
        total = len(self.test_results)
        
        success_rate = (passed / total * 100) if total > 0 else 0
        
        print(f"📈 SUCCESS RATE: {success_rate:.1f}% ({passed}/{total} tests passed)")
        print(f"✅ PASSED: {passed}")
        print(f"❌ FAILED: {failed}")
        
        if failed > 0:
            print(f"\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if "❌ FAIL" in result["status"]:
                    print(f"   • {result['test']}: {result['message']}")
        
        print(f"\n🎯 ENDPOINT COVERAGE:")
        endpoints_tested = [
            "POST /api/favorites/playlists/:playlistId",
            "DELETE /api/favorites/playlists/:playlistId", 
            "POST /api/favorites/tracks/:trackId",
            "DELETE /api/favorites/tracks/:trackId",
            "GET /api/favorites/playlists",
            "GET /api/favorites/tracks", 
            "GET /api/favorites/all",
            "GET /api/favorites/check/:type/:id"
        ]
        
        for endpoint in endpoints_tested:
            print(f"   ✅ {endpoint}")
        
        print(f"\n📋 DETAILED RESULTS:")
        for result in self.test_results:
            print(f"   {result['status']}: {result['test']}")

if __name__ == "__main__":
    tester = FavoritesAPITester()
    tester.run_all_tests()
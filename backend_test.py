#!/usr/bin/env python3
"""
Backend API Testing for Music Playlist Manager
Testing Favorites System APIs (Feature 5)
"""

import requests
import json
import time
from typing import Dict, List, Any, Optional

# Configuration
BASE_URL = "https://theme-selector-ui.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class BackendTester:
    def __init__(self):
        self.test_results = []
        self.test_data = {
            "playlists": [],
            "tracks": [],
            "share_tokens": [],
            "favorites": {
                "playlists": [],
                "tracks": []
            }
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

    def make_request(self, method: str, endpoint: str, data: Dict = None, params: Dict = None) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        try:
            url = f"{BASE_URL}{endpoint}"
            
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
        """Create test playlists and tracks for testing"""
        print("🔧 Setting up test data...")
        
        # Create test playlists
        playlists_data = [
            {
                "name": "Rock Classics",
                "description": "Best rock songs of all time"
            },
            {
                "name": "Jazz Collection", 
                "description": "Smooth jazz favorites"
            },
            {
                "name": "Electronic Beats",
                "description": "Electronic and EDM tracks"
            }
        ]
        
        for playlist_data in playlists_data:
            success, response, status = self.make_request("POST", "/playlists", playlist_data)
            if success:
                self.test_data["playlists"].append(response)
                print(f"   Created playlist: {response.get('name')} (ID: {response.get('id')})")
            else:
                print(f"   Failed to create playlist: {playlist_data['name']}")
        
        # Create test tracks
        if self.test_data["playlists"]:
            tracks_data = [
                # Rock Classics tracks
                {
                    "songName": "Bohemian Rhapsody",
                    "artist": "Queen",
                    "album": "A Night at the Opera",
                    "duration": "5:55",
                    "audioUrl": "https://example.com/bohemian-rhapsody"
                },
                {
                    "songName": "Stairway to Heaven",
                    "artist": "Led Zeppelin", 
                    "album": "Led Zeppelin IV",
                    "duration": "8:02",
                    "audioUrl": "https://example.com/stairway-to-heaven"
                },
                {
                    "songName": "Hotel California",
                    "artist": "Eagles",
                    "album": "Hotel California",
                    "duration": "6:30",
                    "audioUrl": "https://example.com/hotel-california"
                },
                # Jazz Collection tracks
                {
                    "songName": "Take Five",
                    "artist": "Dave Brubeck",
                    "album": "Time Out",
                    "duration": "5:24",
                    "audioUrl": "https://example.com/take-five"
                },
                {
                    "songName": "Kind of Blue",
                    "artist": "Miles Davis",
                    "album": "Kind of Blue",
                    "duration": "9:22",
                    "audioUrl": "https://example.com/kind-of-blue"
                },
                # Electronic Beats tracks
                {
                    "songName": "Strobe",
                    "artist": "Deadmau5",
                    "album": "For Lack of a Better Name",
                    "duration": "10:36",
                    "audioUrl": "https://example.com/strobe"
                }
            ]
            
            # Add tracks to playlists
            playlist_track_mapping = [
                (0, [0, 1, 2]),  # Rock Classics gets first 3 tracks
                (1, [3, 4]),     # Jazz Collection gets next 2 tracks  
                (2, [5])         # Electronic Beats gets last track
            ]
            
            for playlist_idx, track_indices in playlist_track_mapping:
                if playlist_idx < len(self.test_data["playlists"]):
                    playlist_id = self.test_data["playlists"][playlist_idx]["id"]
                    
                    for track_idx in track_indices:
                        if track_idx < len(tracks_data):
                            track_data = tracks_data[track_idx]
                            success, response, status = self.make_request(
                                "POST", 
                                f"/playlists/{playlist_id}/tracks", 
                                track_data
                            )
                            if success:
                                self.test_data["tracks"].append(response)
                                print(f"   Added track: {response.get('songName')} to {self.test_data['playlists'][playlist_idx]['name']}")
        
        print(f"✅ Test data setup complete: {len(self.test_data['playlists'])} playlists, {len(self.test_data['tracks'])} tracks\n")

    def test_favorites_add_playlist(self):
        """Test adding playlist to favorites"""
        if not self.test_data["playlists"]:
            self.log_test("Favorites - Add Playlist", False, "No test playlists available")
            return
            
        playlist_id = self.test_data["playlists"][0]["id"]
        success, response, status = self.make_request("POST", f"/favorites/playlists/{playlist_id}")
        
        if success and status == 201:
            # Verify response structure
            structure_valid = (
                "success" in response and
                "message" in response and
                "favorite" in response and
                response["success"] is True
            )
            
            if structure_valid and response.get("favorite"):
                favorite = response["favorite"]
                favorite_valid = (
                    "id" in favorite and
                    "userId" in favorite and
                    "itemType" in favorite and
                    "itemId" in favorite and
                    favorite["userId"] == "default-user" and
                    favorite["itemType"] == "playlist" and
                    favorite["itemId"] == playlist_id
                )
                
                if favorite_valid:
                    self.test_data["favorites"]["playlists"].append(favorite)
            else:
                favorite_valid = False
            
            self.log_test(
                "Favorites - Add Playlist",
                structure_valid and favorite_valid,
                f"Added playlist {playlist_id} to favorites: structure={structure_valid}, favorite_data={favorite_valid}",
                {"playlist_id": playlist_id, "status": status, "response": response}
            )
            
            # Test duplicate prevention
            success2, response2, status2 = self.make_request("POST", f"/favorites/playlists/{playlist_id}")
            
            duplicate_handled = (
                success2 and status2 == 200 and
                response2.get("message") == "Already in favorites"
            )
            
            self.log_test(
                "Favorites - Add Playlist Duplicate Prevention",
                duplicate_handled,
                f"Duplicate add correctly handled: status={status2}, message='{response2.get('message')}'",
                {"status": status2, "response": response2}
            )
        else:
            self.log_test(
                "Favorites - Add Playlist",
                False,
                f"Failed to add playlist to favorites: status={status}, response={response}",
                {"playlist_id": playlist_id, "status": status, "response": response}
            )
        
        # Test invalid playlist ID
        success, response, status = self.make_request("POST", "/favorites/playlists/invalid-playlist-id")
        
        invalid_handled = not success and status == 404
        
        self.log_test(
            "Favorites - Add Invalid Playlist",
            invalid_handled,
            f"Invalid playlist ID correctly returned 404: {status}",
            {"status": status, "response": response}
        )

    def test_favorites_remove_playlist(self):
        """Test removing playlist from favorites"""
        if not self.test_data["playlists"]:
            self.log_test("Favorites - Remove Playlist", False, "No test playlists available")
            return
            
        playlist_id = self.test_data["playlists"][0]["id"]
        
        # First ensure playlist is in favorites
        self.make_request("POST", f"/favorites/playlists/{playlist_id}")
        
        # Now remove it
        success, response, status = self.make_request("DELETE", f"/favorites/playlists/{playlist_id}")
        
        if success and status == 200:
            structure_valid = (
                "success" in response and
                "message" in response and
                response["success"] is True and
                response["message"] == "Removed from favorites"
            )
            
            self.log_test(
                "Favorites - Remove Playlist",
                structure_valid,
                f"Removed playlist {playlist_id} from favorites: {response.get('message')}",
                {"playlist_id": playlist_id, "status": status, "response": response}
            )
        else:
            self.log_test(
                "Favorites - Remove Playlist",
                False,
                f"Failed to remove playlist from favorites: status={status}, response={response}",
                {"playlist_id": playlist_id, "status": status, "response": response}
            )
        
        # Test removing non-favorited playlist
        success, response, status = self.make_request("DELETE", f"/favorites/playlists/{playlist_id}")
        
        not_found_handled = not success and status == 404
        
        self.log_test(
            "Favorites - Remove Non-Favorited Playlist",
            not_found_handled,
            f"Non-favorited playlist correctly returned 404: {status}",
            {"status": status, "response": response}
        )

    def test_favorites_add_track(self):
        """Test adding track to favorites"""
        if not self.test_data["tracks"]:
            self.log_test("Favorites - Add Track", False, "No test tracks available")
            return
            
        track_id = self.test_data["tracks"][0]["id"]
        success, response, status = self.make_request("POST", f"/favorites/tracks/{track_id}")
        
        if success and status == 201:
            # Verify response structure
            structure_valid = (
                "success" in response and
                "message" in response and
                "favorite" in response and
                response["success"] is True
            )
            
            if structure_valid and response.get("favorite"):
                favorite = response["favorite"]
                favorite_valid = (
                    "id" in favorite and
                    "userId" in favorite and
                    "itemType" in favorite and
                    "itemId" in favorite and
                    favorite["userId"] == "default-user" and
                    favorite["itemType"] == "track" and
                    favorite["itemId"] == track_id
                )
                
                if favorite_valid:
                    self.test_data["favorites"]["tracks"].append(favorite)
            else:
                favorite_valid = False
            
            self.log_test(
                "Favorites - Add Track",
                structure_valid and favorite_valid,
                f"Added track {track_id} to favorites: structure={structure_valid}, favorite_data={favorite_valid}",
                {"track_id": track_id, "status": status, "response": response}
            )
            
            # Test duplicate prevention
            success2, response2, status2 = self.make_request("POST", f"/favorites/tracks/{track_id}")
            
            duplicate_handled = (
                success2 and status2 == 200 and
                response2.get("message") == "Already in favorites"
            )
            
            self.log_test(
                "Favorites - Add Track Duplicate Prevention",
                duplicate_handled,
                f"Duplicate add correctly handled: status={status2}, message='{response2.get('message')}'",
                {"status": status2, "response": response2}
            )
        else:
            self.log_test(
                "Favorites - Add Track",
                False,
                f"Failed to add track to favorites: status={status}, response={response}",
                {"track_id": track_id, "status": status, "response": response}
            )
        
        # Test invalid track ID
        success, response, status = self.make_request("POST", "/favorites/tracks/invalid-track-id")
        
        invalid_handled = not success and status == 404
        
        self.log_test(
            "Favorites - Add Invalid Track",
            invalid_handled,
            f"Invalid track ID correctly returned 404: {status}",
            {"status": status, "response": response}
        )

    def test_favorites_remove_track(self):
        """Test removing track from favorites"""
        if not self.test_data["tracks"]:
            self.log_test("Favorites - Remove Track", False, "No test tracks available")
            return
            
        track_id = self.test_data["tracks"][0]["id"]
        
        # First ensure track is in favorites
        self.make_request("POST", f"/favorites/tracks/{track_id}")
        
        # Now remove it
        success, response, status = self.make_request("DELETE", f"/favorites/tracks/{track_id}")
        
        if success and status == 200:
            structure_valid = (
                "success" in response and
                "message" in response and
                response["success"] is True and
                response["message"] == "Removed from favorites"
            )
            
            self.log_test(
                "Favorites - Remove Track",
                structure_valid,
                f"Removed track {track_id} from favorites: {response.get('message')}",
                {"track_id": track_id, "status": status, "response": response}
            )
        else:
            self.log_test(
                "Favorites - Remove Track",
                False,
                f"Failed to remove track from favorites: status={status}, response={response}",
                {"track_id": track_id, "status": status, "response": response}
            )
        
        # Test removing non-favorited track
        success, response, status = self.make_request("DELETE", f"/favorites/tracks/{track_id}")
        
        not_found_handled = not success and status == 404
        
        self.log_test(
            "Favorites - Remove Non-Favorited Track",
            not_found_handled,
            f"Non-favorited track correctly returned 404: {status}",
            {"status": status, "response": response}
        )

    def test_favorites_get_playlists(self):
        """Test getting favorite playlists"""
        # First add some playlists to favorites
        for i, playlist in enumerate(self.test_data["playlists"][:2]):  # Add first 2 playlists
            self.make_request("POST", f"/favorites/playlists/{playlist['id']}")
        
        success, response, status = self.make_request("GET", "/favorites/playlists")
        
        if success and status == 200:
            playlists = response.get("playlists", [])
            count = response.get("count", 0)
            
            # Verify response structure
            structure_valid = (
                "success" in response and
                "playlists" in response and
                "count" in response and
                response["success"] is True and
                isinstance(playlists, list) and
                isinstance(count, int)
            )
            
            # Verify enrichment
            enrichment_valid = True
            if playlists:
                first_playlist = playlists[0]
                enrichment_valid = (
                    "addedToFavoritesAt" in first_playlist and
                    "trackCount" in first_playlist and
                    "id" in first_playlist and
                    "name" in first_playlist
                )
            
            # Verify sorting (should be by createdAt descending)
            sorting_valid = True
            if len(playlists) > 1:
                dates = [p.get("addedToFavoritesAt") for p in playlists if p.get("addedToFavoritesAt")]
                if len(dates) > 1:
                    sorting_valid = dates == sorted(dates, reverse=True)
            
            self.log_test(
                "Favorites - Get Playlists",
                structure_valid and enrichment_valid,
                f"Retrieved {count} favorite playlists: structure={structure_valid}, enrichment={enrichment_valid}, sorting={sorting_valid}",
                {"count": count, "structure_valid": structure_valid, "enrichment_valid": enrichment_valid}
            )
        else:
            self.log_test(
                "Favorites - Get Playlists",
                False,
                f"Failed to get favorite playlists: status={status}, response={response}",
                {"status": status, "response": response}
            )
        
        # Test with no favorites
        # Clear favorites first
        for playlist in self.test_data["playlists"]:
            self.make_request("DELETE", f"/favorites/playlists/{playlist['id']}")
        
        success, response, status = self.make_request("GET", "/favorites/playlists")
        
        empty_handled = (
            success and status == 200 and
            response.get("playlists") == [] and
            response.get("count") == 0
        )
        
        self.log_test(
            "Favorites - Get Playlists (Empty)",
            empty_handled,
            f"Empty favorites correctly returned: count={response.get('count')}, playlists={len(response.get('playlists', []))}",
            {"response": response}
        )

    def test_favorites_get_tracks(self):
        """Test getting favorite tracks"""
        # First add some tracks to favorites
        for i, track in enumerate(self.test_data["tracks"][:2]):  # Add first 2 tracks
            self.make_request("POST", f"/favorites/tracks/{track['id']}")
        
        success, response, status = self.make_request("GET", "/favorites/tracks")
        
        if success and status == 200:
            tracks = response.get("tracks", [])
            count = response.get("count", 0)
            
            # Verify response structure
            structure_valid = (
                "success" in response and
                "tracks" in response and
                "count" in response and
                response["success"] is True and
                isinstance(tracks, list) and
                isinstance(count, int)
            )
            
            # Verify enrichment
            enrichment_valid = True
            if tracks:
                first_track = tracks[0]
                enrichment_valid = (
                    "addedToFavoritesAt" in first_track and
                    "playlistName" in first_track and
                    "playlistCover" in first_track and
                    "id" in first_track and
                    "songName" in first_track
                )
            
            # Verify sorting (should be by createdAt descending)
            sorting_valid = True
            if len(tracks) > 1:
                dates = [t.get("addedToFavoritesAt") for t in tracks if t.get("addedToFavoritesAt")]
                if len(dates) > 1:
                    sorting_valid = dates == sorted(dates, reverse=True)
            
            self.log_test(
                "Favorites - Get Tracks",
                structure_valid and enrichment_valid,
                f"Retrieved {count} favorite tracks: structure={structure_valid}, enrichment={enrichment_valid}, sorting={sorting_valid}",
                {"count": count, "structure_valid": structure_valid, "enrichment_valid": enrichment_valid}
            )
        else:
            self.log_test(
                "Favorites - Get Tracks",
                False,
                f"Failed to get favorite tracks: status={status}, response={response}",
                {"status": status, "response": response}
            )
        
        # Test with no favorites
        # Clear favorites first
        for track in self.test_data["tracks"]:
            self.make_request("DELETE", f"/favorites/tracks/{track['id']}")
        
        success, response, status = self.make_request("GET", "/favorites/tracks")
        
        empty_handled = (
            success and status == 200 and
            response.get("tracks") == [] and
            response.get("count") == 0
        )
        
        self.log_test(
            "Favorites - Get Tracks (Empty)",
            empty_handled,
            f"Empty favorites correctly returned: count={response.get('count')}, tracks={len(response.get('tracks', []))}",
            {"response": response}
        )

    def test_favorites_get_all(self):
        """Test getting all favorites summary"""
        # First add some favorites
        if self.test_data["playlists"]:
            self.make_request("POST", f"/favorites/playlists/{self.test_data['playlists'][0]['id']}")
        if self.test_data["tracks"]:
            self.make_request("POST", f"/favorites/tracks/{self.test_data['tracks'][0]['id']}")
        
        success, response, status = self.make_request("GET", "/favorites/all")
        
        if success and status == 200:
            favorites = response.get("favorites", {})
            counts = response.get("counts", {})
            
            # Verify response structure
            structure_valid = (
                "success" in response and
                "favorites" in response and
                "counts" in response and
                response["success"] is True and
                isinstance(favorites, dict) and
                isinstance(counts, dict)
            )
            
            # Verify favorites structure
            favorites_valid = (
                "playlists" in favorites and
                "tracks" in favorites and
                isinstance(favorites["playlists"], list) and
                isinstance(favorites["tracks"], list)
            )
            
            # Verify counts structure
            counts_valid = (
                "playlists" in counts and
                "tracks" in counts and
                "total" in counts and
                isinstance(counts["playlists"], int) and
                isinstance(counts["tracks"], int) and
                isinstance(counts["total"], int) and
                counts["total"] == counts["playlists"] + counts["tracks"]
            )
            
            self.log_test(
                "Favorites - Get All Summary",
                structure_valid and favorites_valid and counts_valid,
                f"All favorites summary: playlists={counts.get('playlists')}, tracks={counts.get('tracks')}, total={counts.get('total')}",
                {"structure_valid": structure_valid, "favorites_valid": favorites_valid, "counts_valid": counts_valid, "counts": counts}
            )
        else:
            self.log_test(
                "Favorites - Get All Summary",
                False,
                f"Failed to get all favorites: status={status}, response={response}",
                {"status": status, "response": response}
            )
        
        # Test with no favorites
        # Clear all favorites first
        for playlist in self.test_data["playlists"]:
            self.make_request("DELETE", f"/favorites/playlists/{playlist['id']}")
        for track in self.test_data["tracks"]:
            self.make_request("DELETE", f"/favorites/tracks/{track['id']}")
        
        success, response, status = self.make_request("GET", "/favorites/all")
        
        empty_handled = (
            success and status == 200 and
            response.get("favorites", {}).get("playlists") == [] and
            response.get("favorites", {}).get("tracks") == [] and
            response.get("counts", {}).get("total") == 0
        )
        
        self.log_test(
            "Favorites - Get All Summary (Empty)",
            empty_handled,
            f"Empty favorites summary correctly returned: total={response.get('counts', {}).get('total')}",
            {"response": response}
        )

    def test_favorites_check_item(self):
        """Test checking if item is favorited"""
        if not self.test_data["playlists"] or not self.test_data["tracks"]:
            self.log_test("Favorites - Check Item", False, "No test data available")
            return
        
        playlist_id = self.test_data["playlists"][0]["id"]
        track_id = self.test_data["tracks"][0]["id"]
        
        # Test checking playlist that is NOT favorited
        success, response, status = self.make_request("GET", f"/favorites/check/playlist/{playlist_id}")
        
        if success and status == 200:
            not_favorited_valid = (
                "success" in response and
                "isFavorited" in response and
                response["success"] is True and
                response["isFavorited"] is False
            )
            
            self.log_test(
                "Favorites - Check Playlist (Not Favorited)",
                not_favorited_valid,
                f"Playlist {playlist_id} correctly reported as not favorited: {response.get('isFavorited')}",
                {"playlist_id": playlist_id, "response": response}
            )
        else:
            self.log_test(
                "Favorites - Check Playlist (Not Favorited)",
                False,
                f"Failed to check playlist favorite status: status={status}, response={response}",
                {"status": status, "response": response}
            )
        
        # Add playlist to favorites
        self.make_request("POST", f"/favorites/playlists/{playlist_id}")
        
        # Test checking playlist that IS favorited
        success, response, status = self.make_request("GET", f"/favorites/check/playlist/{playlist_id}")
        
        if success and status == 200:
            favorited_valid = (
                "success" in response and
                "isFavorited" in response and
                response["success"] is True and
                response["isFavorited"] is True
            )
            
            self.log_test(
                "Favorites - Check Playlist (Favorited)",
                favorited_valid,
                f"Playlist {playlist_id} correctly reported as favorited: {response.get('isFavorited')}",
                {"playlist_id": playlist_id, "response": response}
            )
        else:
            self.log_test(
                "Favorites - Check Playlist (Favorited)",
                False,
                f"Failed to check favorited playlist status: status={status}, response={response}",
                {"status": status, "response": response}
            )
        
        # Test checking track that is NOT favorited
        success, response, status = self.make_request("GET", f"/favorites/check/track/{track_id}")
        
        if success and status == 200:
            track_not_favorited_valid = (
                "success" in response and
                "isFavorited" in response and
                response["success"] is True and
                response["isFavorited"] is False
            )
            
            self.log_test(
                "Favorites - Check Track (Not Favorited)",
                track_not_favorited_valid,
                f"Track {track_id} correctly reported as not favorited: {response.get('isFavorited')}",
                {"track_id": track_id, "response": response}
            )
        else:
            self.log_test(
                "Favorites - Check Track (Not Favorited)",
                False,
                f"Failed to check track favorite status: status={status}, response={response}",
                {"status": status, "response": response}
            )
        
        # Add track to favorites
        self.make_request("POST", f"/favorites/tracks/{track_id}")
        
        # Test checking track that IS favorited
        success, response, status = self.make_request("GET", f"/favorites/check/track/{track_id}")
        
        if success and status == 200:
            track_favorited_valid = (
                "success" in response and
                "isFavorited" in response and
                response["success"] is True and
                response["isFavorited"] is True
            )
            
            self.log_test(
                "Favorites - Check Track (Favorited)",
                track_favorited_valid,
                f"Track {track_id} correctly reported as favorited: {response.get('isFavorited')}",
                {"track_id": track_id, "response": response}
            )
        else:
            self.log_test(
                "Favorites - Check Track (Favorited)",
                False,
                f"Failed to check favorited track status: status={status}, response={response}",
                {"status": status, "response": response}
            )
        
        # Test invalid type
        success, response, status = self.make_request("GET", f"/favorites/check/invalid/{playlist_id}")
        
        invalid_type_handled = not success and status == 400
        
        self.log_test(
            "Favorites - Check Invalid Type",
            invalid_type_handled,
            f"Invalid type correctly returned 400: {status}",
            {"status": status, "response": response}
        )

    def test_favorites_database_persistence(self):
        """Test that favorites persist in database"""
        if not self.test_data["playlists"] or not self.test_data["tracks"]:
            self.log_test("Favorites - Database Persistence", False, "No test data available")
            return
        
        playlist_id = self.test_data["playlists"][0]["id"]
        track_id = self.test_data["tracks"][0]["id"]
        
        # Add favorites
        self.make_request("POST", f"/favorites/playlists/{playlist_id}")
        self.make_request("POST", f"/favorites/tracks/{track_id}")
        
        # Verify they exist by checking
        success1, response1, status1 = self.make_request("GET", f"/favorites/check/playlist/{playlist_id}")
        success2, response2, status2 = self.make_request("GET", f"/favorites/check/track/{track_id}")
        
        persistence_valid = (
            success1 and success2 and
            response1.get("isFavorited") is True and
            response2.get("isFavorited") is True
        )
        
        # Also verify they appear in the lists
        success3, response3, status3 = self.make_request("GET", "/favorites/playlists")
        success4, response4, status4 = self.make_request("GET", "/favorites/tracks")
        
        lists_valid = (
            success3 and success4 and
            response3.get("count", 0) > 0 and
            response4.get("count", 0) > 0
        )
        
        self.log_test(
            "Favorites - Database Persistence",
            persistence_valid and lists_valid,
            f"Favorites persist correctly: check_valid={persistence_valid}, lists_valid={lists_valid}",
            {
                "playlist_favorited": response1.get("isFavorited") if success1 else None,
                "track_favorited": response2.get("isFavorited") if success2 else None,
                "playlist_count": response3.get("count") if success3 else None,
                "track_count": response4.get("count") if success4 else None
            }
        )

    def test_favorites_error_handling(self):
        """Test error handling for favorites APIs"""
        # Test adding non-existent playlist
        success, response, status = self.make_request("POST", "/favorites/playlists/non-existent-playlist")
        
        playlist_404_handled = not success and status == 404
        
        self.log_test(
            "Favorites - Add Non-Existent Playlist",
            playlist_404_handled,
            f"Non-existent playlist correctly returned 404: {status}",
            {"status": status, "response": response}
        )
        
        # Test adding non-existent track
        success, response, status = self.make_request("POST", "/favorites/tracks/non-existent-track")
        
        track_404_handled = not success and status == 404
        
        self.log_test(
            "Favorites - Add Non-Existent Track",
            track_404_handled,
            f"Non-existent track correctly returned 404: {status}",
            {"status": status, "response": response}
        )
        
        # Test removing non-existent favorite playlist
        success, response, status = self.make_request("DELETE", "/favorites/playlists/non-existent-playlist")
        
        remove_playlist_404_handled = not success and status == 404
        
        self.log_test(
            "Favorites - Remove Non-Existent Playlist Favorite",
            remove_playlist_404_handled,
            f"Non-existent playlist favorite correctly returned 404: {status}",
            {"status": status, "response": response}
        )
        
        # Test removing non-existent favorite track
        success, response, status = self.make_request("DELETE", "/favorites/tracks/non-existent-track")
        
        remove_track_404_handled = not success and status == 404
        
        self.log_test(
            "Favorites - Remove Non-Existent Track Favorite",
            remove_track_404_handled,
            f"Non-existent track favorite correctly returned 404: {status}",
            {"status": status, "response": response}
        )
        
        # Test check with invalid type
        success, response, status = self.make_request("GET", "/favorites/check/invalid-type/some-id")
        
        invalid_type_handled = not success and status == 400
        
        self.log_test(
            "Favorites - Check Invalid Type",
            invalid_type_handled,
            f"Invalid type correctly returned 400: {status}",
            {"status": status, "response": response}
        )

    # Removed old test methods - now focused on Favorites system testing

    def test_playlist_toggle_public(self):
        """Test toggling playlist public/private status"""
        if not self.test_data["playlists"]:
            self.log_test("Playlist Sharing - Toggle Public", False, "No test playlists available")
            return
            
        # Use first playlist if we only have one, otherwise use second
        playlist_idx = min(1, len(self.test_data["playlists"]) - 1) if len(self.test_data["playlists"]) > 1 else 0
        playlist_id = self.test_data["playlists"][playlist_idx]["id"]
        
        # Toggle to public
        success, response, status = self.make_request("PUT", f"/playlists/{playlist_id}/toggle-public")
        
        if success:
            is_public = response.get("isPublic")
            message = response.get("message")
            
            structure_valid = (
                "message" in response and
                "isPublic" in response and
                isinstance(is_public, bool)
            )
            
            self.log_test(
                "Playlist Sharing - Toggle Public (First)",
                structure_valid,
                f"Toggled playlist {playlist_id} public status: {is_public}, message: {message}",
                {"playlist_id": playlist_id, "is_public": is_public, "message": message}
            )
            
            # Toggle again to test switching
            success2, response2, status2 = self.make_request("PUT", f"/playlists/{playlist_id}/toggle-public")
            
            if success2:
                is_public2 = response2.get("isPublic")
                toggle_worked = is_public2 != is_public
                
                self.log_test(
                    "Playlist Sharing - Toggle Public (Second)",
                    toggle_worked,
                    f"Second toggle changed status from {is_public} to {is_public2}: {toggle_worked}",
                    {"playlist_id": playlist_id, "first_status": is_public, "second_status": is_public2}
                )
            else:
                self.log_test(
                    "Playlist Sharing - Toggle Public (Second)",
                    False,
                    f"Second toggle failed: {response2}",
                    response2
                )
        else:
            self.log_test(
                "Playlist Sharing - Toggle Public (First)",
                False,
                f"Failed to toggle public status for {playlist_id}: {response}",
                response
            )

    def test_playlist_toggle_collaborative(self):
        """Test toggling playlist collaborative mode"""
        if not self.test_data["playlists"]:
            self.log_test("Playlist Sharing - Toggle Collaborative", False, "No test playlists available")
            return
            
        # Use first playlist if we only have one, otherwise use third (or last available)
        playlist_idx = min(2, len(self.test_data["playlists"]) - 1) if len(self.test_data["playlists"]) > 2 else 0
        playlist_id = self.test_data["playlists"][playlist_idx]["id"]
        
        # Toggle collaborative mode
        success, response, status = self.make_request("PUT", f"/playlists/{playlist_id}/toggle-collaborative")
        
        if success:
            is_collaborative = response.get("isCollaborative")
            message = response.get("message")
            
            structure_valid = (
                "message" in response and
                "isCollaborative" in response and
                isinstance(is_collaborative, bool)
            )
            
            self.log_test(
                "Playlist Sharing - Toggle Collaborative (First)",
                structure_valid,
                f"Toggled playlist {playlist_id} collaborative mode: {is_collaborative}, message: {message}",
                {"playlist_id": playlist_id, "is_collaborative": is_collaborative, "message": message}
            )
            
            # Toggle again to test switching
            success2, response2, status2 = self.make_request("PUT", f"/playlists/{playlist_id}/toggle-collaborative")
            
            if success2:
                is_collaborative2 = response2.get("isCollaborative")
                toggle_worked = is_collaborative2 != is_collaborative
                
                self.log_test(
                    "Playlist Sharing - Toggle Collaborative (Second)",
                    toggle_worked,
                    f"Second toggle changed collaborative mode from {is_collaborative} to {is_collaborative2}: {toggle_worked}",
                    {"playlist_id": playlist_id, "first_status": is_collaborative, "second_status": is_collaborative2}
                )
            else:
                self.log_test(
                    "Playlist Sharing - Toggle Collaborative (Second)",
                    False,
                    f"Second collaborative toggle failed: {response2}",
                    response2
                )
        else:
            self.log_test(
                "Playlist Sharing - Toggle Collaborative (First)",
                False,
                f"Failed to toggle collaborative mode for {playlist_id}: {response}",
                response
            )

    def test_playlist_import_shared(self):
        """Test importing/copying shared playlist"""
        if not self.test_data["share_tokens"]:
            self.log_test("Playlist Sharing - Import Shared", False, "No share tokens available")
            return
            
        share_token = self.test_data["share_tokens"][0]["token"]
        original_playlist_id = self.test_data["share_tokens"][0]["playlist_id"]
        
        success, response, status = self.make_request("POST", f"/playlists/import/{share_token}")
        
        if success:
            playlist = response.get("playlist")
            tracks_count = response.get("tracksCount")
            message = response.get("message")
            
            # Verify structure
            structure_valid = (
                "message" in response and
                "playlist" in response and
                "tracksCount" in response and
                playlist and
                isinstance(tracks_count, int)
            )
            
            # Verify imported playlist properties
            if playlist:
                playlist_valid = (
                    "id" in playlist and
                    "name" in playlist and
                    playlist["id"] != original_playlist_id and  # New UUID
                    "(Copy)" in playlist["name"] and  # Name has (Copy) suffix
                    playlist.get("isPublic") is False and  # Private by default
                    playlist.get("isCollaborative") is False and  # Not collaborative
                    playlist.get("originalPlaylistId") == original_playlist_id  # References original
                )
            else:
                playlist_valid = False
            
            self.log_test(
                "Playlist Sharing - Import Shared",
                structure_valid and playlist_valid,
                f"Imported playlist from token {share_token}: new_id={playlist.get('id') if playlist else 'None'}, tracks={tracks_count}, structure={structure_valid}, playlist_data={playlist_valid}",
                {
                    "share_token": share_token,
                    "original_id": original_playlist_id,
                    "new_id": playlist.get("id") if playlist else None,
                    "new_name": playlist.get("name") if playlist else None,
                    "tracks_count": tracks_count
                }
            )
            
            # Verify tracks were copied by checking the new playlist
            if playlist and playlist.get("id"):
                new_playlist_id = playlist["id"]
                success2, response2, status2 = self.make_request("GET", f"/playlists/{new_playlist_id}/tracks")
                
                if success2:
                    copied_tracks = response2 if isinstance(response2, list) else []
                    tracks_copied_correctly = len(copied_tracks) == tracks_count
                    
                    self.log_test(
                        "Playlist Sharing - Import Tracks Verification",
                        tracks_copied_correctly,
                        f"Imported playlist has {len(copied_tracks)} tracks, expected {tracks_count}",
                        {"expected": tracks_count, "actual": len(copied_tracks)}
                    )
                else:
                    self.log_test(
                        "Playlist Sharing - Import Tracks Verification",
                        False,
                        f"Failed to verify imported tracks: {response2}",
                        response2
                    )
        else:
            self.log_test(
                "Playlist Sharing - Import Shared",
                False,
                f"Failed to import shared playlist {share_token}: {response}",
                response
            )
        
        # Test invalid token import
        success, response, status = self.make_request("POST", "/playlists/import/invalid-token")
        
        self.log_test(
            "Playlist Sharing - Import Invalid Token",
            not success and status == 404,
            f"Invalid token import correctly returned 404: {status}",
            {"status": status, "response": response}
        )

    def test_playlist_get_public(self):
        """Test getting all public playlists"""
        success, response, status = self.make_request("GET", "/playlists/public")
        
        if success:
            playlists = response if isinstance(response, list) else []
            
            # Verify structure
            structure_valid = isinstance(playlists, list)
            
            # Verify all returned playlists are public
            all_public = all(playlist.get("isPublic") is True for playlist in playlists)
            
            self.log_test(
                "Playlist Sharing - Get Public Playlists",
                structure_valid and all_public,
                f"Retrieved {len(playlists)} public playlists, all public: {all_public}",
                {"count": len(playlists), "playlists": [p.get("name") for p in playlists]}
            )
        else:
            self.log_test(
                "Playlist Sharing - Get Public Playlists",
                False,
                f"Failed to get public playlists: {response}",
                response
            )

    def test_error_cases(self):
        """Test error handling for invalid requests"""
        # Test 404 cases
        error_tests = [
            ("GET", "/library/tracks/invalid-track-id", 404, "Invalid track ID"),
            ("POST", "/playlists/invalid-playlist-id/share", 404, "Invalid playlist ID for sharing"),
            ("PUT", "/playlists/invalid-playlist-id/toggle-public", 404, "Invalid playlist ID for toggle public"),
            ("PUT", "/playlists/invalid-playlist-id/toggle-collaborative", 404, "Invalid playlist ID for toggle collaborative"),
        ]
        
        for method, endpoint, expected_status, description in error_tests:
            success, response, status = self.make_request(method, endpoint)
            
            error_handled_correctly = not success and status == expected_status
            
            self.log_test(
                f"Error Handling - {description}",
                error_handled_correctly,
                f"Expected {expected_status}, got {status}: {error_handled_correctly}",
                {"expected_status": expected_status, "actual_status": status, "response": response}
            )

    def cleanup_test_data(self):
        """Clean up test data"""
        print("🧹 Cleaning up test data...")
        
        # Delete test playlists (this will cascade delete tracks)
        for playlist in self.test_data["playlists"]:
            playlist_id = playlist["id"]
            success, response, status = self.make_request("DELETE", f"/playlists/{playlist_id}")
            if success:
                print(f"   Deleted playlist: {playlist['name']} (ID: {playlist_id})")
            else:
                print(f"   Failed to delete playlist: {playlist['name']} (ID: {playlist_id})")
        
        print("✅ Cleanup complete\n")

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Backend API Testing for Music Playlist Manager")
        print("🎯 COMPREHENSIVE FAVORITES SYSTEM TESTING (Feature 5)")
        print("=" * 80)
        print()
        
        # Setup test data
        self.setup_test_data()
        
        try:
            # FAVORITES SYSTEM TESTING (Feature 5)
            print("❤️  TESTING FAVORITES SYSTEM APIs (Feature 5)")
            print("-" * 60)
            
            # Test adding favorites
            print("📝 Testing Add to Favorites...")
            self.test_favorites_add_playlist()
            self.test_favorites_add_track()
            
            print()
            
            # Test removing favorites
            print("🗑️  Testing Remove from Favorites...")
            self.test_favorites_remove_playlist()
            self.test_favorites_remove_track()
            
            print()
            
            # Test getting favorites
            print("📋 Testing Get Favorites...")
            self.test_favorites_get_playlists()
            self.test_favorites_get_tracks()
            self.test_favorites_get_all()
            
            print()
            
            # Test checking favorites
            print("🔍 Testing Check Favorites...")
            self.test_favorites_check_item()
            
            print()
            
            # Test database persistence
            print("💾 Testing Database Persistence...")
            self.test_favorites_database_persistence()
            
            print()
            
            # Test error handling
            print("⚠️  Testing Error Handling...")
            self.test_favorites_error_handling()
            
        finally:
            # Always cleanup
            self.cleanup_test_data()
        
        # Print summary
        self.print_summary()

    def print_summary(self):
        """Print test results summary"""
        print("=" * 80)
        print("📊 TEST RESULTS SUMMARY")
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
        
        if failed_tests > 0:
            print("❌ FAILED TESTS:")
            print("-" * 40)
            for result in self.test_results:
                if not result["success"]:
                    print(f"• {result['test']}")
                    if result["details"]:
                        print(f"  Details: {result['details']}")
            print()
        
        print("✅ PASSED TESTS:")
        print("-" * 40)
        for result in self.test_results:
            if result["success"]:
                print(f"• {result['test']}")
        
        print()
        print("=" * 80)

if __name__ == "__main__":
    tester = BackendTester()
    tester.run_all_tests()
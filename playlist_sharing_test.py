#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Playlist Sharing & Collaboration APIs (Feature 4)
Testing all 6 playlist sharing APIs with detailed test cases and edge case validation
"""

import requests
import json
import time
import uuid
from typing import Dict, List, Any, Optional

# Configuration
BASE_URL = "https://animate-all-comps.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class PlaylistSharingTester:
    def __init__(self):
        self.test_results = []
        self.test_data = {
            "playlists": [],
            "tracks": [],
            "share_tokens": []
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

    def setup_comprehensive_test_data(self):
        """Create comprehensive test data for playlist sharing tests"""
        print("🔧 Setting up comprehensive test data for playlist sharing...")
        
        # Create multiple playlists with different characteristics
        playlists_data = [
            {
                "name": "Rock Legends Collection",
                "description": "The greatest rock songs of all time with legendary artists"
            },
            {
                "name": "Jazz Masters Anthology", 
                "description": "Smooth jazz classics from the masters of the genre"
            },
            {
                "name": "Electronic Fusion",
                "description": "Modern electronic beats and synthesized melodies"
            }
        ]
        
        for playlist_data in playlists_data:
            success, response, status = self.make_request("POST", "/playlists", playlist_data)
            if success:
                self.test_data["playlists"].append(response)
                print(f"   Created playlist: {response.get('name')} (ID: {response.get('id')})")
            else:
                print(f"   Failed to create playlist: {playlist_data['name']} - {response}")
        
        # Create comprehensive track data with mix of audioUrl and audioFile references
        if self.test_data["playlists"]:
            tracks_data = [
                # Rock Legends Collection tracks (mix of audioUrl and audioFile)
                {
                    "songName": "Bohemian Rhapsody",
                    "artist": "Queen",
                    "album": "A Night at the Opera",
                    "duration": "5:55",
                    "audioUrl": "https://example.com/audio/bohemian-rhapsody.mp3"
                },
                {
                    "songName": "Stairway to Heaven",
                    "artist": "Led Zeppelin", 
                    "album": "Led Zeppelin IV",
                    "duration": "8:02",
                    "audioUrl": "https://example.com/audio/stairway-to-heaven.mp3"
                },
                {
                    "songName": "Hotel California",
                    "artist": "Eagles",
                    "album": "Hotel California",
                    "duration": "6:30",
                    "audioUrl": "https://example.com/audio/hotel-california.mp3"
                },
                # Jazz Masters tracks
                {
                    "songName": "Take Five",
                    "artist": "Dave Brubeck",
                    "album": "Time Out",
                    "duration": "5:24",
                    "audioUrl": "https://example.com/audio/take-five.mp3"
                },
                {
                    "songName": "Kind of Blue",
                    "artist": "Miles Davis",
                    "album": "Kind of Blue",
                    "duration": "9:22",
                    "audioUrl": "https://example.com/audio/kind-of-blue.mp3"
                },
                # Electronic Fusion tracks
                {
                    "songName": "Strobe",
                    "artist": "Deadmau5",
                    "album": "For Lack of a Better Name",
                    "duration": "10:36",
                    "audioUrl": "https://example.com/audio/strobe.mp3"
                }
            ]
            
            # Add tracks to playlists
            playlist_track_mapping = [
                (0, [0, 1, 2]),  # Rock Legends gets first 3 tracks
                (1, [3, 4]),     # Jazz Masters gets next 2 tracks  
                (2, [5])         # Electronic Fusion gets last track
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
        
        print(f"✅ Comprehensive test data setup complete: {len(self.test_data['playlists'])} playlists, {len(self.test_data['tracks'])} tracks\n")

    def test_1_generate_share_token(self):
        """Test 1: POST /api/playlists/:id/share - Generate Share Token"""
        print("🔗 TEST 1: Generate Share Token")
        print("-" * 40)
        
        if not self.test_data["playlists"]:
            self.log_test("1.1 Generate Share Token - No Playlists", False, "No test playlists available")
            return
            
        playlist = self.test_data["playlists"][0]
        playlist_id = playlist["id"]
        
        # Test Case 1.1: Generate share token for valid playlist
        success, response, status = self.make_request("POST", f"/playlists/{playlist_id}/share")
        
        if success:
            share_token = response.get("shareToken")
            share_url = response.get("shareUrl")
            message = response.get("message")
            
            # Verify response structure
            structure_valid = (
                "message" in response and
                "shareToken" in response and
                "shareUrl" in response and
                share_token and
                share_url and
                message
            )
            
            # Verify shareToken is UUID format
            try:
                uuid.UUID(share_token)
                uuid_valid = True
            except (ValueError, TypeError):
                uuid_valid = False
            
            # Verify shareUrl format
            url_valid = share_url.startswith("/shared/") and share_token in share_url
            
            if structure_valid and uuid_valid and url_valid:
                self.test_data["share_tokens"].append({
                    "playlist_id": playlist_id,
                    "token": share_token,
                    "url": share_url
                })
            
            self.log_test(
                "1.1 Generate Share Token - Valid Playlist",
                structure_valid and uuid_valid and url_valid,
                f"Generated token: {share_token}, URL: {share_url}, UUID valid: {uuid_valid}, URL format valid: {url_valid}",
                {"playlist_id": playlist_id, "share_token": share_token, "share_url": share_url}
            )
            
            # Test Case 1.2: Test idempotency - calling again should return same token
            success2, response2, status2 = self.make_request("POST", f"/playlists/{playlist_id}/share")
            
            if success2:
                same_token = response2.get("shareToken") == share_token
                same_url = response2.get("shareUrl") == share_url
                
                self.log_test(
                    "1.2 Generate Share Token - Idempotency",
                    same_token and same_url,
                    f"Second call returned same token: {same_token}, same URL: {same_url}",
                    {"original_token": share_token, "second_token": response2.get("shareToken")}
                )
            else:
                self.log_test(
                    "1.2 Generate Share Token - Idempotency",
                    False,
                    f"Second share call failed: {response2}",
                    response2
                )
        else:
            self.log_test(
                "1.1 Generate Share Token - Valid Playlist",
                False,
                f"Failed to generate share token for {playlist_id}: {response}",
                response
            )
        
        # Test Case 1.3: Test 404 for non-existent playlist ID
        fake_playlist_id = str(uuid.uuid4())
        success, response, status = self.make_request("POST", f"/playlists/{fake_playlist_id}/share")
        
        self.log_test(
            "1.3 Generate Share Token - Non-existent Playlist",
            not success and status == 404,
            f"Non-existent playlist correctly returned 404: {status}",
            {"status": status, "response": response}
        )
        
        # Test Case 1.4: Verify shareToken saved in database by checking playlist
        if self.test_data["share_tokens"]:
            playlist_id = self.test_data["share_tokens"][0]["playlist_id"]
            success, response, status = self.make_request("GET", f"/playlists/{playlist_id}")
            
            if success:
                db_share_token = response.get("shareToken")
                expected_token = self.test_data["share_tokens"][0]["token"]
                token_persisted = db_share_token == expected_token
                
                self.log_test(
                    "1.4 Generate Share Token - Database Persistence",
                    token_persisted,
                    f"Share token persisted in database: {token_persisted}",
                    {"expected": expected_token, "actual": db_share_token}
                )
            else:
                self.log_test(
                    "1.4 Generate Share Token - Database Persistence",
                    False,
                    f"Failed to verify token persistence: {response}",
                    response
                )

    def test_2_view_shared_playlist(self):
        """Test 2: GET /api/playlists/shared/:token - View Shared Playlist"""
        print("👀 TEST 2: View Shared Playlist")
        print("-" * 40)
        
        if not self.test_data["share_tokens"]:
            self.log_test("2.1 View Shared Playlist - No Tokens", False, "No share tokens available")
            return
            
        share_data = self.test_data["share_tokens"][0]
        share_token = share_data["token"]
        original_playlist_id = share_data["playlist_id"]
        
        # Test Case 2.1: View shared playlist with valid token
        success, response, status = self.make_request("GET", f"/playlists/shared/{share_token}")
        
        if success:
            playlist = response.get("playlist")
            tracks = response.get("tracks", [])
            is_shared = response.get("isShared")
            
            # Verify response structure
            structure_valid = (
                "playlist" in response and
                "tracks" in response and
                "isShared" in response and
                playlist and
                isinstance(tracks, list) and
                is_shared is True
            )
            
            # Verify playlist details
            playlist_details_valid = False
            if playlist:
                playlist_details_valid = (
                    "id" in playlist and
                    "name" in playlist and
                    "description" in playlist and
                    "coverImage" in playlist and
                    "createdAt" in playlist and
                    "updatedAt" in playlist and
                    playlist["id"] == original_playlist_id
                )
            
            # Verify tracks are enriched with track data
            tracks_enriched = True
            track_count_correct = True
            if tracks:
                for track in tracks:
                    if not all(field in track for field in ["id", "songName", "artist", "album", "duration"]):
                        tracks_enriched = False
                        break
                
                # Verify track count matches expected
                expected_tracks = len([t for t in self.test_data["tracks"] if t.get("playlistId") == original_playlist_id])
                track_count_correct = len(tracks) == expected_tracks
            
            self.log_test(
                "2.1 View Shared Playlist - Valid Token",
                structure_valid and playlist_details_valid and tracks_enriched and track_count_correct,
                f"Playlist: {playlist.get('name') if playlist else 'None'}, Tracks: {len(tracks)}, Structure: {structure_valid}, Details: {playlist_details_valid}, Enriched: {tracks_enriched}, Count: {track_count_correct}",
                {
                    "share_token": share_token,
                    "playlist_name": playlist.get("name") if playlist else None,
                    "tracks_count": len(tracks),
                    "expected_tracks": expected_tracks if 'expected_tracks' in locals() else 0
                }
            )
            
            # Test Case 2.2: Verify trackCount is correct
            if playlist:
                # Get actual track count from tracks array
                actual_track_count = len(tracks)
                
                self.log_test(
                    "2.2 View Shared Playlist - Track Count Verification",
                    actual_track_count > 0,
                    f"Track count verification: {actual_track_count} tracks returned",
                    {"track_count": actual_track_count}
                )
            
            # Test Case 2.3: Verify response structure matches expected format
            expected_fields = ["playlist", "tracks", "isShared"]
            all_fields_present = all(field in response for field in expected_fields)
            
            self.log_test(
                "2.3 View Shared Playlist - Response Structure",
                all_fields_present,
                f"All expected fields present: {all_fields_present}",
                {"expected_fields": expected_fields, "actual_fields": list(response.keys())}
            )
            
        else:
            self.log_test(
                "2.1 View Shared Playlist - Valid Token",
                False,
                f"Failed to view shared playlist {share_token}: {response}",
                response
            )
        
        # Test Case 2.4: Test 404 for invalid/non-existent share token
        invalid_token = str(uuid.uuid4())
        success, response, status = self.make_request("GET", f"/playlists/shared/{invalid_token}")
        
        self.log_test(
            "2.4 View Shared Playlist - Invalid Token",
            not success and status == 404,
            f"Invalid token correctly returned 404: {status}",
            {"status": status, "response": response}
        )

    def test_3_toggle_public_private(self):
        """Test 3: PUT /api/playlists/:id/toggle-public - Toggle Public/Private"""
        print("🌐 TEST 3: Toggle Public/Private")
        print("-" * 40)
        
        if len(self.test_data["playlists"]) < 2:
            self.log_test("3.1 Toggle Public - Insufficient Playlists", False, "Need at least 2 playlists for testing")
            return
            
        # Use second playlist for public/private testing
        playlist = self.test_data["playlists"][1]
        playlist_id = playlist["id"]
        
        # Test Case 3.1: Create a new playlist (verify default isPublic: false)
        success, response, status = self.make_request("GET", f"/playlists/{playlist_id}")
        
        if success:
            initial_public_status = response.get("isPublic", False)
            
            self.log_test(
                "3.1 Toggle Public - Default Status Check",
                initial_public_status is False,
                f"Default isPublic status is False: {initial_public_status is False}",
                {"initial_status": initial_public_status}
            )
        
        # Test Case 3.2: Toggle to public (verify isPublic becomes true)
        success, response, status = self.make_request("PUT", f"/playlists/{playlist_id}/toggle-public")
        
        if success:
            is_public = response.get("isPublic")
            message = response.get("message")
            
            structure_valid = (
                "message" in response and
                "isPublic" in response and
                isinstance(is_public, bool)
            )
            
            became_public = is_public is True
            
            self.log_test(
                "3.2 Toggle Public - To Public",
                structure_valid and became_public,
                f"Toggled to public: {became_public}, Message: {message}",
                {"playlist_id": playlist_id, "is_public": is_public, "message": message}
            )
            
            # Test Case 3.3: Toggle again (verify isPublic becomes false)
            success2, response2, status2 = self.make_request("PUT", f"/playlists/{playlist_id}/toggle-public")
            
            if success2:
                is_public2 = response2.get("isPublic")
                message2 = response2.get("message")
                
                became_private = is_public2 is False
                toggle_worked = is_public2 != is_public
                
                self.log_test(
                    "3.3 Toggle Public - To Private",
                    became_private and toggle_worked,
                    f"Toggled back to private: {became_private}, Toggle worked: {toggle_worked}, Message: {message2}",
                    {"playlist_id": playlist_id, "first_status": is_public, "second_status": is_public2}
                )
            else:
                self.log_test(
                    "3.3 Toggle Public - To Private",
                    False,
                    f"Second toggle failed: {response2}",
                    response2
                )
            
            # Test Case 3.4: Verify response returns new isPublic status
            final_status = is_public2 if 'is_public2' in locals() else None
            status_returned = final_status is not None
            
            self.log_test(
                "3.4 Toggle Public - Status Return Verification",
                status_returned,
                f"Response returns isPublic status: {status_returned}",
                {"final_status": final_status}
            )
            
            # Test Case 3.5: Verify isPublic field persists in database
            success3, response3, status3 = self.make_request("GET", f"/playlists/{playlist_id}")
            
            if success3:
                db_public_status = response3.get("isPublic")
                persistence_verified = db_public_status == final_status
                
                self.log_test(
                    "3.5 Toggle Public - Database Persistence",
                    persistence_verified,
                    f"isPublic persisted in database: {persistence_verified}",
                    {"expected": final_status, "actual": db_public_status}
                )
            else:
                self.log_test(
                    "3.5 Toggle Public - Database Persistence",
                    False,
                    f"Failed to verify database persistence: {response3}",
                    response3
                )
        else:
            self.log_test(
                "3.2 Toggle Public - To Public",
                False,
                f"Failed to toggle public status for {playlist_id}: {response}",
                response
            )
        
        # Test Case 3.6: Test 404 for non-existent playlist ID
        fake_playlist_id = str(uuid.uuid4())
        success, response, status = self.make_request("PUT", f"/playlists/{fake_playlist_id}/toggle-public")
        
        self.log_test(
            "3.6 Toggle Public - Non-existent Playlist",
            not success and status == 404,
            f"Non-existent playlist correctly returned 404: {status}",
            {"status": status, "response": response}
        )

    def test_4_toggle_collaborative(self):
        """Test 4: PUT /api/playlists/:id/toggle-collaborative - Toggle Collaborative"""
        print("🤝 TEST 4: Toggle Collaborative")
        print("-" * 40)
        
        if len(self.test_data["playlists"]) < 3:
            # Use first playlist if we don't have 3
            playlist_idx = 0
        else:
            playlist_idx = 2
            
        playlist = self.test_data["playlists"][playlist_idx]
        playlist_id = playlist["id"]
        
        # Test Case 4.1: Create a new playlist (verify default isCollaborative: false)
        success, response, status = self.make_request("GET", f"/playlists/{playlist_id}")
        
        if success:
            initial_collaborative_status = response.get("isCollaborative", False)
            
            self.log_test(
                "4.1 Toggle Collaborative - Default Status Check",
                initial_collaborative_status is False,
                f"Default isCollaborative status is False: {initial_collaborative_status is False}",
                {"initial_status": initial_collaborative_status}
            )
        
        # Test Case 4.2: Toggle to collaborative (verify isCollaborative becomes true)
        success, response, status = self.make_request("PUT", f"/playlists/{playlist_id}/toggle-collaborative")
        
        if success:
            is_collaborative = response.get("isCollaborative")
            message = response.get("message")
            
            structure_valid = (
                "message" in response and
                "isCollaborative" in response and
                isinstance(is_collaborative, bool)
            )
            
            became_collaborative = is_collaborative is True
            
            self.log_test(
                "4.2 Toggle Collaborative - To Collaborative",
                structure_valid and became_collaborative,
                f"Toggled to collaborative: {became_collaborative}, Message: {message}",
                {"playlist_id": playlist_id, "is_collaborative": is_collaborative, "message": message}
            )
            
            # Test Case 4.3: Toggle again (verify isCollaborative becomes false)
            success2, response2, status2 = self.make_request("PUT", f"/playlists/{playlist_id}/toggle-collaborative")
            
            if success2:
                is_collaborative2 = response2.get("isCollaborative")
                message2 = response2.get("message")
                
                became_non_collaborative = is_collaborative2 is False
                toggle_worked = is_collaborative2 != is_collaborative
                
                self.log_test(
                    "4.3 Toggle Collaborative - To Non-Collaborative",
                    became_non_collaborative and toggle_worked,
                    f"Toggled back to non-collaborative: {became_non_collaborative}, Toggle worked: {toggle_worked}, Message: {message2}",
                    {"playlist_id": playlist_id, "first_status": is_collaborative, "second_status": is_collaborative2}
                )
            else:
                self.log_test(
                    "4.3 Toggle Collaborative - To Non-Collaborative",
                    False,
                    f"Second collaborative toggle failed: {response2}",
                    response2
                )
            
            # Test Case 4.4: Verify response returns new isCollaborative status
            final_status = is_collaborative2 if 'is_collaborative2' in locals() else None
            status_returned = final_status is not None
            
            self.log_test(
                "4.4 Toggle Collaborative - Status Return Verification",
                status_returned,
                f"Response returns isCollaborative status: {status_returned}",
                {"final_status": final_status}
            )
            
            # Test Case 4.5: Verify isCollaborative field persists in database
            success3, response3, status3 = self.make_request("GET", f"/playlists/{playlist_id}")
            
            if success3:
                db_collaborative_status = response3.get("isCollaborative")
                persistence_verified = db_collaborative_status == final_status
                
                self.log_test(
                    "4.5 Toggle Collaborative - Database Persistence",
                    persistence_verified,
                    f"isCollaborative persisted in database: {persistence_verified}",
                    {"expected": final_status, "actual": db_collaborative_status}
                )
            else:
                self.log_test(
                    "4.5 Toggle Collaborative - Database Persistence",
                    False,
                    f"Failed to verify database persistence: {response3}",
                    response3
                )
        else:
            self.log_test(
                "4.2 Toggle Collaborative - To Collaborative",
                False,
                f"Failed to toggle collaborative mode for {playlist_id}: {response}",
                response
            )
        
        # Test Case 4.6: Test 404 for non-existent playlist ID
        fake_playlist_id = str(uuid.uuid4())
        success, response, status = self.make_request("PUT", f"/playlists/{fake_playlist_id}/toggle-collaborative")
        
        self.log_test(
            "4.6 Toggle Collaborative - Non-existent Playlist",
            not success and status == 404,
            f"Non-existent playlist correctly returned 404: {status}",
            {"status": status, "response": response}
        )

    def test_5_import_shared_playlist(self):
        """Test 5: POST /api/playlists/import/:token - Import/Copy Shared Playlist"""
        print("📥 TEST 5: Import/Copy Shared Playlist")
        print("-" * 40)
        
        if not self.test_data["share_tokens"]:
            self.log_test("5.1 Import Shared Playlist - No Tokens", False, "No share tokens available")
            return
            
        share_data = self.test_data["share_tokens"][0]
        share_token = share_data["token"]
        original_playlist_id = share_data["playlist_id"]
        
        # Get original playlist details for comparison
        success_orig, orig_response, _ = self.make_request("GET", f"/playlists/{original_playlist_id}")
        original_playlist = orig_response if success_orig else {}
        
        # Get original tracks count
        success_tracks, tracks_response, _ = self.make_request("GET", f"/playlists/{original_playlist_id}/tracks")
        original_tracks = tracks_response if success_tracks and isinstance(tracks_response, list) else []
        original_tracks_count = len(original_tracks)
        
        # Test Case 5.1: Import playlist using valid share token
        success, response, status = self.make_request("POST", f"/playlists/import/{share_token}")
        
        if success:
            playlist = response.get("playlist")
            tracks_count = response.get("tracksCount")
            message = response.get("message")
            
            # Verify response structure
            structure_valid = (
                "message" in response and
                "playlist" in response and
                "tracksCount" in response and
                playlist and
                isinstance(tracks_count, int)
            )
            
            # Test Case 5.2: Verify new playlist created with name ending in "(Copy)"
            name_has_copy = False
            new_uuid_generated = False
            if playlist:
                name_has_copy = "(Copy)" in playlist.get("name", "")
                new_uuid_generated = playlist.get("id") != original_playlist_id
            
            # Test Case 5.3: Verify imported playlist is private (isPublic: false)
            is_private = playlist.get("isPublic") is False if playlist else False
            
            # Test Case 5.4: Verify originalPlaylistId field set correctly
            original_id_set = playlist.get("originalPlaylistId") == original_playlist_id if playlist else False
            
            # Test Case 5.5: Verify all tracks copied with new UUIDs
            tracks_count_matches = tracks_count == original_tracks_count
            
            self.log_test(
                "5.1 Import Shared Playlist - Basic Import",
                structure_valid and name_has_copy and new_uuid_generated and is_private and original_id_set and tracks_count_matches,
                f"Structure: {structure_valid}, Name has (Copy): {name_has_copy}, New UUID: {new_uuid_generated}, Private: {is_private}, Original ID set: {original_id_set}, Tracks count matches: {tracks_count_matches}",
                {
                    "share_token": share_token,
                    "original_id": original_playlist_id,
                    "new_id": playlist.get("id") if playlist else None,
                    "new_name": playlist.get("name") if playlist else None,
                    "tracks_count": tracks_count,
                    "original_tracks_count": original_tracks_count
                }
            )
            
            # Test Case 5.6: Verify track metadata preserved and new UUIDs generated
            if playlist and playlist.get("id"):
                new_playlist_id = playlist["id"]
                success_new_tracks, new_tracks_response, _ = self.make_request("GET", f"/playlists/{new_playlist_id}/tracks")
                
                if success_new_tracks and isinstance(new_tracks_response, list):
                    new_tracks = new_tracks_response
                    
                    # Verify track count
                    track_count_correct = len(new_tracks) == original_tracks_count
                    
                    # Verify new UUIDs generated (not same as original)
                    original_track_ids = {track.get("id") for track in original_tracks}
                    new_track_ids = {track.get("id") for track in new_tracks}
                    uuids_different = len(original_track_ids.intersection(new_track_ids)) == 0
                    
                    # Verify metadata preserved
                    metadata_preserved = True
                    if len(new_tracks) == len(original_tracks):
                        for i, (orig_track, new_track) in enumerate(zip(original_tracks, new_tracks)):
                            metadata_fields = ["songName", "artist", "album", "duration"]
                            for field in metadata_fields:
                                if orig_track.get(field) != new_track.get(field):
                                    metadata_preserved = False
                                    break
                            if not metadata_preserved:
                                break
                    
                    # Verify audioUrl tracks work (URLs copied)
                    audio_urls_copied = True
                    for orig_track, new_track in zip(original_tracks, new_tracks):
                        if orig_track.get("audioUrl") != new_track.get("audioUrl"):
                            audio_urls_copied = False
                            break
                    
                    self.log_test(
                        "5.2 Import Shared Playlist - Track Verification",
                        track_count_correct and uuids_different and metadata_preserved and audio_urls_copied,
                        f"Count correct: {track_count_correct}, UUIDs different: {uuids_different}, Metadata preserved: {metadata_preserved}, URLs copied: {audio_urls_copied}",
                        {
                            "original_count": len(original_tracks),
                            "new_count": len(new_tracks),
                            "original_ids": list(original_track_ids),
                            "new_ids": list(new_track_ids)
                        }
                    )
                else:
                    self.log_test(
                        "5.2 Import Shared Playlist - Track Verification",
                        False,
                        f"Failed to get imported tracks: {new_tracks_response}",
                        new_tracks_response
                    )
            
            # Test Case 5.7: Verify both playlists exist independently in database
            success_orig_check, orig_check_response, _ = self.make_request("GET", f"/playlists/{original_playlist_id}")
            success_new_check, new_check_response, _ = self.make_request("GET", f"/playlists/{playlist.get('id') if playlist else 'invalid'}")
            
            both_exist = success_orig_check and success_new_check
            
            self.log_test(
                "5.3 Import Shared Playlist - Independence Verification",
                both_exist,
                f"Both playlists exist independently: {both_exist}",
                {"original_exists": success_orig_check, "new_exists": success_new_check}
            )
            
        else:
            self.log_test(
                "5.1 Import Shared Playlist - Basic Import",
                False,
                f"Failed to import shared playlist {share_token}: {response}",
                response
            )
        
        # Test Case 5.8: Test 404 for invalid share token
        invalid_token = str(uuid.uuid4())
        success, response, status = self.make_request("POST", f"/playlists/import/{invalid_token}")
        
        self.log_test(
            "5.4 Import Shared Playlist - Invalid Token",
            not success and status == 404,
            f"Invalid token import correctly returned 404: {status}",
            {"status": status, "response": response}
        )

    def test_6_get_public_playlists(self):
        """Test 6: GET /api/playlists/public - Get All Public Playlists"""
        print("🌍 TEST 6: Get All Public Playlists")
        print("-" * 40)
        
        # Test Case 6.1: Start with no public playlists (verify empty array)
        success, response, status = self.make_request("GET", "/playlists/public")
        
        if success:
            playlists = response if isinstance(response, list) else []
            
            # Count current public playlists
            current_public_count = len(playlists)
            
            self.log_test(
                "6.1 Get Public Playlists - Initial State",
                isinstance(playlists, list),
                f"Returns array with {current_public_count} public playlists",
                {"count": current_public_count, "playlists": [p.get("name") for p in playlists]}
            )
        else:
            self.log_test(
                "6.1 Get Public Playlists - Initial State",
                False,
                f"Failed to get public playlists: {response}",
                response
            )
            return
        
        # Test Case 6.2: Create playlists with different public/private status
        if len(self.test_data["playlists"]) >= 2:
            # Make first playlist public
            playlist1_id = self.test_data["playlists"][0]["id"]
            success1, _, _ = self.make_request("PUT", f"/playlists/{playlist1_id}/toggle-public")
            
            # Make second playlist public if we have it
            if len(self.test_data["playlists"]) >= 2:
                playlist2_id = self.test_data["playlists"][1]["id"]
                success2, _, _ = self.make_request("PUT", f"/playlists/{playlist2_id}/toggle-public")
            else:
                success2 = False
            
            # Keep third playlist private (if exists)
            
            # Test Case 6.3: Verify only public playlists returned
            success, response, status = self.make_request("GET", "/playlists/public")
            
            if success:
                playlists = response if isinstance(response, list) else []
                
                # Verify all returned playlists are public
                all_public = all(playlist.get("isPublic") is True for playlist in playlists)
                
                # Verify private playlists NOT included
                playlist_ids = {p.get("id") for p in playlists}
                private_playlist_excluded = True
                if len(self.test_data["playlists"]) >= 3:
                    private_playlist_id = self.test_data["playlists"][2]["id"]
                    private_playlist_excluded = private_playlist_id not in playlist_ids
                
                # Verify response includes playlist details
                details_included = True
                required_fields = ["id", "name", "description", "createdAt"]
                for playlist in playlists:
                    if not all(field in playlist for field in required_fields):
                        details_included = False
                        break
                
                expected_public_count = sum([success1, success2]) + current_public_count
                actual_count = len(playlists)
                count_matches = actual_count >= expected_public_count  # Allow for existing public playlists
                
                self.log_test(
                    "6.2 Get Public Playlists - With Public Playlists",
                    all_public and private_playlist_excluded and details_included and count_matches,
                    f"All public: {all_public}, Private excluded: {private_playlist_excluded}, Details included: {details_included}, Count reasonable: {count_matches} (expected >= {expected_public_count}, got {actual_count})",
                    {
                        "count": len(playlists),
                        "all_public": all_public,
                        "playlist_names": [p.get("name") for p in playlists]
                    }
                )
                
                # Test Case 6.4: Verify playlists sorted by createdAt descending
                if len(playlists) >= 2:
                    sorted_correctly = True
                    for i in range(len(playlists) - 1):
                        current_date = playlists[i].get("createdAt", "")
                        next_date = playlists[i + 1].get("createdAt", "")
                        if current_date < next_date:  # Should be descending
                            sorted_correctly = False
                            break
                    
                    self.log_test(
                        "6.3 Get Public Playlists - Sorting",
                        sorted_correctly,
                        f"Playlists sorted by createdAt descending: {sorted_correctly}",
                        {"playlist_dates": [p.get("createdAt") for p in playlists]}
                    )
                
                # Test Case 6.5: Verify response structure correct
                structure_correct = isinstance(playlists, list)
                
                self.log_test(
                    "6.4 Get Public Playlists - Response Structure",
                    structure_correct,
                    f"Response is array: {structure_correct}",
                    {"response_type": type(playlists).__name__}
                )
                
            else:
                self.log_test(
                    "6.2 Get Public Playlists - With Public Playlists",
                    False,
                    f"Failed to get public playlists after making some public: {response}",
                    response
                )

    def cleanup_test_data(self):
        """Clean up test data"""
        print("🧹 Cleaning up comprehensive test data...")
        
        # Delete test playlists (this will cascade delete tracks)
        for playlist in self.test_data["playlists"]:
            playlist_id = playlist["id"]
            success, response, status = self.make_request("DELETE", f"/playlists/{playlist_id}")
            if success:
                print(f"   Deleted playlist: {playlist['name']} (ID: {playlist_id})")
            else:
                print(f"   Failed to delete playlist: {playlist['name']} (ID: {playlist_id})")
        
        # Also clean up any imported playlists (they would have "(Copy)" in name)
        success, all_playlists, _ = self.make_request("GET", "/playlists")
        if success and isinstance(all_playlists, list):
            for playlist in all_playlists:
                if "(Copy)" in playlist.get("name", ""):
                    playlist_id = playlist["id"]
                    success, response, status = self.make_request("DELETE", f"/playlists/{playlist_id}")
                    if success:
                        print(f"   Deleted imported playlist: {playlist['name']} (ID: {playlist_id})")
        
        print("✅ Comprehensive cleanup complete\n")

    def run_comprehensive_tests(self):
        """Run all comprehensive playlist sharing tests"""
        print("🚀 Starting Comprehensive Backend Testing for Playlist Sharing & Collaboration APIs")
        print("=" * 90)
        print()
        
        # Setup comprehensive test data
        self.setup_comprehensive_test_data()
        
        try:
            # Run all 6 API tests in order
            self.test_1_generate_share_token()
            self.test_2_view_shared_playlist()
            self.test_3_toggle_public_private()
            self.test_4_toggle_collaborative()
            self.test_5_import_shared_playlist()
            self.test_6_get_public_playlists()
            
        finally:
            # Always cleanup
            self.cleanup_test_data()
        
        # Print comprehensive summary
        self.print_comprehensive_summary()

    def print_comprehensive_summary(self):
        """Print comprehensive test results summary"""
        print("=" * 90)
        print("📊 COMPREHENSIVE TEST RESULTS SUMMARY - PLAYLIST SHARING & COLLABORATION")
        print("=" * 90)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {success_rate:.1f}%")
        print()
        
        # Group results by API
        api_groups = {
            "1. Generate Share Token": [],
            "2. View Shared Playlist": [],
            "3. Toggle Public/Private": [],
            "4. Toggle Collaborative": [],
            "5. Import Shared Playlist": [],
            "6. Get Public Playlists": []
        }
        
        for result in self.test_results:
            test_name = result["test"]
            if "Generate Share Token" in test_name or "1." in test_name:
                api_groups["1. Generate Share Token"].append(result)
            elif "View Shared" in test_name or "2." in test_name:
                api_groups["2. View Shared Playlist"].append(result)
            elif "Toggle Public" in test_name or "3." in test_name:
                api_groups["3. Toggle Public/Private"].append(result)
            elif "Toggle Collaborative" in test_name or "4." in test_name:
                api_groups["4. Toggle Collaborative"].append(result)
            elif "Import" in test_name or "5." in test_name:
                api_groups["5. Import Shared Playlist"].append(result)
            elif "Public Playlists" in test_name or "6." in test_name:
                api_groups["6. Get Public Playlists"].append(result)
        
        if failed_tests > 0:
            print("❌ FAILED TESTS BY API:")
            print("-" * 50)
            for api_name, results in api_groups.items():
                failed_in_api = [r for r in results if not r["success"]]
                if failed_in_api:
                    print(f"\n{api_name}:")
                    for result in failed_in_api:
                        print(f"  • {result['test']}")
                        if result["details"]:
                            print(f"    Details: {result['details']}")
            print()
        
        print("✅ PASSED TESTS BY API:")
        print("-" * 50)
        for api_name, results in api_groups.items():
            passed_in_api = [r for r in results if r["success"]]
            if passed_in_api:
                print(f"\n{api_name}: {len(passed_in_api)}/{len(results)} tests passed")
                for result in passed_in_api:
                    print(f"  • {result['test']}")
        
        print()
        print("🎯 API COVERAGE SUMMARY:")
        print("-" * 50)
        for api_name, results in api_groups.items():
            if results:
                passed = len([r for r in results if r["success"]])
                total = len(results)
                rate = (passed / total * 100) if total > 0 else 0
                status = "✅" if rate == 100 else "⚠️" if rate >= 80 else "❌"
                print(f"{status} {api_name}: {passed}/{total} ({rate:.1f}%)")
        
        print()
        print("=" * 90)

if __name__ == "__main__":
    tester = PlaylistSharingTester()
    tester.run_comprehensive_tests()
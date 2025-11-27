#!/usr/bin/env python3
"""
COMPREHENSIVE BACKEND TESTING - Playlist Sharing & Collaboration APIs (Feature 4)
Testing all 6 API endpoints as requested in the review
"""

import requests
import json
import time
from typing import Dict, List, Any, Optional

# Configuration
BASE_URL = "https://button-revamp-1.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class ComprehensiveSharingTester:
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

    def setup_test_data(self):
        """Create test playlists and tracks for comprehensive testing"""
        print("🔧 Setting up test data for comprehensive playlist sharing tests...")
        
        # Create main test playlist
        playlist_data = {
            "name": "My Awesome Playlist",
            "description": "A collection of amazing tracks for sharing tests"
        }
        
        success, response, status = self.make_request("POST", "/playlists", playlist_data)
        if success:
            self.test_data["playlists"].append(response)
            print(f"   Created playlist: {response.get('name')} (ID: {response.get('id')})")
            
            # Add 3-4 tracks to the playlist for better testing
            tracks_data = [
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
                {
                    "songName": "Sweet Child O' Mine",
                    "artist": "Guns N' Roses",
                    "album": "Appetite for Destruction",
                    "duration": "5:03",
                    "audioUrl": "https://example.com/sweet-child-o-mine"
                }
            ]
            
            playlist_id = response["id"]
            for track_data in tracks_data:
                success, track_response, status = self.make_request(
                    "POST", 
                    f"/playlists/{playlist_id}/tracks", 
                    track_data
                )
                if success:
                    self.test_data["tracks"].append(track_response)
                    print(f"   Added track: {track_response.get('songName')} by {track_response.get('artist')}")
        else:
            print(f"   Failed to create test playlist: {response}")
        
        print(f"✅ Test data setup complete: {len(self.test_data['playlists'])} playlists, {len(self.test_data['tracks'])} tracks\n")

    def test_1_generate_share_token(self):
        """Test 1: POST /api/playlists/:id/share - Generate Share Token"""
        print("🔗 TEST 1: POST /api/playlists/:id/share - Generate Share Token")
        print("-" * 60)
        
        if not self.test_data["playlists"]:
            self.log_test("1.1 Generate Share Token", False, "No test playlists available")
            return
            
        playlist_id = self.test_data["playlists"][0]["id"]
        
        # Test generating share token
        success, response, status = self.make_request("POST", f"/playlists/{playlist_id}/share")
        
        if success:
            share_token = response.get("shareToken")
            share_url = response.get("shareUrl")
            
            # Verify response contains shareToken (UUID format) and shareUrl
            structure_valid = (
                "message" in response and
                "shareToken" in response and
                "shareUrl" in response and
                share_token and
                share_url
            )
            
            # Verify shareToken is UUID format (36 characters with hyphens)
            token_format_valid = (
                isinstance(share_token, str) and
                len(share_token) == 36 and
                share_token.count('-') == 4
            )
            
            if structure_valid and token_format_valid:
                self.test_data["share_tokens"].append({
                    "playlist_id": playlist_id,
                    "token": share_token,
                    "url": share_url
                })
            
            self.log_test(
                "1.1 Generate Share Token - Basic",
                structure_valid and token_format_valid,
                f"Generated share token: {share_token}, URL: {share_url}, structure_valid: {structure_valid}, token_format_valid: {token_format_valid}",
                {"playlist_id": playlist_id, "share_token": share_token, "share_url": share_url}
            )
            
            # Test idempotency: Call again with same playlist, should return existing token
            success2, response2, status2 = self.make_request("POST", f"/playlists/{playlist_id}/share")
            
            if success2:
                same_token = response2.get("shareToken") == share_token
                self.log_test(
                    "1.2 Generate Share Token - Idempotency",
                    same_token,
                    f"Second call returned same token: {same_token}",
                    {"original_token": share_token, "second_token": response2.get("shareToken")}
                )
            else:
                self.log_test(
                    "1.2 Generate Share Token - Idempotency",
                    False,
                    f"Second share call failed: {response2}",
                    response2
                )
                
            # Verify token is stored in database
            success3, playlist_check, status3 = self.make_request("GET", f"/playlists/{playlist_id}")
            if success3:
                db_token = playlist_check.get("shareToken")
                token_stored = db_token == share_token
                self.log_test(
                    "1.3 Generate Share Token - Database Storage",
                    token_stored,
                    f"Token stored in database: {token_stored}",
                    {"expected": share_token, "actual": db_token}
                )
        else:
            self.log_test(
                "1.1 Generate Share Token - Basic",
                False,
                f"Failed to generate share token for {playlist_id}: {response}",
                response
            )
        
        # Test 404 for non-existent playlist ID
        success, response, status = self.make_request("POST", "/playlists/non-existent-id/share")
        
        self.log_test(
            "1.4 Generate Share Token - 404 Test",
            not success and status == 404,
            f"Non-existent playlist correctly returned 404: {status}",
            {"status": status, "response": response}
        )

    def test_2_view_shared_playlist(self):
        """Test 2: GET /api/playlists/shared/:token - View Shared Playlist"""
        print("👀 TEST 2: GET /api/playlists/shared/:token - View Shared Playlist")
        print("-" * 60)
        
        if not self.test_data["share_tokens"]:
            self.log_test("2.1 View Shared Playlist", False, "No share tokens available")
            return
            
        share_token = self.test_data["share_tokens"][0]["token"]
        
        # Test viewing shared playlist
        success, response, status = self.make_request("GET", f"/playlists/shared/{share_token}")
        
        if success:
            playlist = response.get("playlist")
            tracks = response.get("tracks", [])
            is_shared = response.get("isShared")
            
            # Verify response contains playlist details and all tracks
            structure_valid = (
                "playlist" in response and
                "tracks" in response and
                "isShared" in response and
                playlist and
                isinstance(tracks, list) and
                is_shared is True
            )
            
            # Verify playlist details (name, description, coverImage)
            playlist_details_valid = (
                "id" in playlist and
                "name" in playlist and
                "description" in playlist and
                "coverImage" in playlist
            )
            
            # Verify all tracks in the playlist are included
            expected_tracks = len(self.test_data["tracks"])
            tracks_included = len(tracks) == expected_tracks
            
            # Verify track enrichment includes song names, artists, etc.
            track_enrichment_valid = True
            if tracks:
                first_track = tracks[0]
                track_enrichment_valid = (
                    "songName" in first_track and
                    "artist" in first_track and
                    "album" in first_track and
                    "duration" in first_track and
                    "audioUrl" in first_track and
                    "id" in first_track
                )
            
            self.log_test(
                "2.1 View Shared Playlist - Basic",
                structure_valid and playlist_details_valid and tracks_included and track_enrichment_valid,
                f"Viewed shared playlist: name='{playlist.get('name')}', tracks_count={len(tracks)}, expected={expected_tracks}, structure_valid={structure_valid}, playlist_details_valid={playlist_details_valid}, tracks_included={tracks_included}, track_enrichment_valid={track_enrichment_valid}",
                {
                    "share_token": share_token,
                    "playlist_name": playlist.get("name"),
                    "tracks_count": len(tracks),
                    "expected_tracks": expected_tracks,
                    "sample_track": tracks[0] if tracks else None
                }
            )
            
        else:
            self.log_test(
                "2.1 View Shared Playlist - Basic",
                False,
                f"Failed to view shared playlist {share_token}: {response}",
                response
            )
        
        # Test with invalid token (should return 404)
        success, response, status = self.make_request("GET", "/playlists/shared/invalid-token-12345")
        
        self.log_test(
            "2.2 View Shared Playlist - Invalid Token",
            not success and status == 404,
            f"Invalid token correctly returned 404: {status}",
            {"status": status, "response": response}
        )

    def test_3_toggle_public_private(self):
        """Test 3: PUT /api/playlists/:id/toggle-public - Toggle Public/Private"""
        print("🌐 TEST 3: PUT /api/playlists/:id/toggle-public - Toggle Public/Private")
        print("-" * 60)
        
        if not self.test_data["playlists"]:
            self.log_test("3.1 Toggle Public/Private", False, "No test playlists available")
            return
            
        playlist_id = self.test_data["playlists"][0]["id"]
        
        # Start with a private playlist (default isPublic: false)
        success, current_state, status = self.make_request("GET", f"/playlists/{playlist_id}")
        
        if success:
            initial_public_state = current_state.get("isPublic", False)
            self.log_test(
                "3.1 Toggle Public - Initial State Check",
                initial_public_state is False,
                f"Playlist starts as private (isPublic: {initial_public_state})",
                {"playlist_id": playlist_id, "initial_isPublic": initial_public_state}
            )
        
        # Toggle to public, verify response shows isPublic: true
        success, response, status = self.make_request("PUT", f"/playlists/{playlist_id}/toggle-public")
        
        if success:
            is_public = response.get("isPublic")
            message = response.get("message")
            
            structure_valid = (
                "message" in response and
                "isPublic" in response and
                isinstance(is_public, bool)
            )
            
            # Should be True after first toggle
            first_toggle_correct = is_public is True
            
            self.log_test(
                "3.2 Toggle Public - To Public",
                structure_valid and first_toggle_correct,
                f"Toggled to public: isPublic={is_public}, message='{message}', structure_valid={structure_valid}",
                {"playlist_id": playlist_id, "is_public": is_public, "message": message}
            )
            
            # Toggle back to private, verify response shows isPublic: false
            success2, response2, status2 = self.make_request("PUT", f"/playlists/{playlist_id}/toggle-public")
            
            if success2:
                is_public2 = response2.get("isPublic")
                message2 = response2.get("message")
                
                # Should be False after second toggle
                second_toggle_correct = is_public2 is False
                toggle_worked = is_public2 != is_public
                
                self.log_test(
                    "3.3 Toggle Public - To Private",
                    second_toggle_correct and toggle_worked,
                    f"Toggled back to private: isPublic={is_public2}, message='{message2}', toggle_worked={toggle_worked}",
                    {"playlist_id": playlist_id, "first_status": is_public, "second_status": is_public2}
                )
                
                # Verify changes persist in database
                success3, final_state, status3 = self.make_request("GET", f"/playlists/{playlist_id}")
                
                if success3:
                    final_public_state = final_state.get("isPublic")
                    persistence_correct = final_public_state == is_public2
                    
                    self.log_test(
                        "3.4 Toggle Public - Persistence Check",
                        persistence_correct,
                        f"Public state persisted correctly: expected={is_public2}, actual={final_public_state}",
                        {"expected": is_public2, "actual": final_public_state}
                    )
            else:
                self.log_test(
                    "3.3 Toggle Public - To Private",
                    False,
                    f"Second toggle failed: {response2}",
                    response2
                )
        else:
            self.log_test(
                "3.2 Toggle Public - To Public",
                False,
                f"Failed to toggle public status for {playlist_id}: {response}",
                response
            )
        
        # Test 404 for non-existent playlist ID
        success, response, status = self.make_request("PUT", "/playlists/non-existent-id/toggle-public")
        
        self.log_test(
            "3.5 Toggle Public - 404 Test",
            not success and status == 404,
            f"Non-existent playlist correctly returned 404: {status}",
            {"status": status, "response": response}
        )

    def test_4_toggle_collaborative(self):
        """Test 4: PUT /api/playlists/:id/toggle-collaborative - Toggle Collaborative"""
        print("🤝 TEST 4: PUT /api/playlists/:id/toggle-collaborative - Toggle Collaborative")
        print("-" * 60)
        
        if not self.test_data["playlists"]:
            self.log_test("4.1 Toggle Collaborative", False, "No test playlists available")
            return
            
        playlist_id = self.test_data["playlists"][0]["id"]
        
        # Start with non-collaborative playlist (default isCollaborative: false)
        success, current_state, status = self.make_request("GET", f"/playlists/{playlist_id}")
        
        if success:
            initial_collaborative_state = current_state.get("isCollaborative", False)
            self.log_test(
                "4.1 Toggle Collaborative - Initial State Check",
                initial_collaborative_state is False,
                f"Playlist starts as non-collaborative (isCollaborative: {initial_collaborative_state})",
                {"playlist_id": playlist_id, "initial_isCollaborative": initial_collaborative_state}
            )
        
        # Toggle to collaborative, verify response shows isCollaborative: true
        success, response, status = self.make_request("PUT", f"/playlists/{playlist_id}/toggle-collaborative")
        
        if success:
            is_collaborative = response.get("isCollaborative")
            message = response.get("message")
            
            structure_valid = (
                "message" in response and
                "isCollaborative" in response and
                isinstance(is_collaborative, bool)
            )
            
            # Should be True after first toggle
            first_toggle_correct = is_collaborative is True
            
            self.log_test(
                "4.2 Toggle Collaborative - To Collaborative",
                structure_valid and first_toggle_correct,
                f"Toggled to collaborative: isCollaborative={is_collaborative}, message='{message}', structure_valid={structure_valid}",
                {"playlist_id": playlist_id, "is_collaborative": is_collaborative, "message": message}
            )
            
            # Toggle back to non-collaborative, verify response shows isCollaborative: false
            success2, response2, status2 = self.make_request("PUT", f"/playlists/{playlist_id}/toggle-collaborative")
            
            if success2:
                is_collaborative2 = response2.get("isCollaborative")
                message2 = response2.get("message")
                
                # Should be False after second toggle
                second_toggle_correct = is_collaborative2 is False
                toggle_worked = is_collaborative2 != is_collaborative
                
                self.log_test(
                    "4.3 Toggle Collaborative - To Non-Collaborative",
                    second_toggle_correct and toggle_worked,
                    f"Toggled back to non-collaborative: isCollaborative={is_collaborative2}, message='{message2}', toggle_worked={toggle_worked}",
                    {"playlist_id": playlist_id, "first_status": is_collaborative, "second_status": is_collaborative2}
                )
                
                # Verify changes persist in database
                success3, final_state, status3 = self.make_request("GET", f"/playlists/{playlist_id}")
                
                if success3:
                    final_collaborative_state = final_state.get("isCollaborative")
                    persistence_correct = final_collaborative_state == is_collaborative2
                    
                    self.log_test(
                        "4.4 Toggle Collaborative - Persistence Check",
                        persistence_correct,
                        f"Collaborative state persisted correctly: expected={is_collaborative2}, actual={final_collaborative_state}",
                        {"expected": is_collaborative2, "actual": final_collaborative_state}
                    )
            else:
                self.log_test(
                    "4.3 Toggle Collaborative - To Non-Collaborative",
                    False,
                    f"Second collaborative toggle failed: {response2}",
                    response2
                )
        else:
            self.log_test(
                "4.2 Toggle Collaborative - To Collaborative",
                False,
                f"Failed to toggle collaborative mode for {playlist_id}: {response}",
                response
            )
        
        # Test 404 for non-existent playlist ID
        success, response, status = self.make_request("PUT", "/playlists/non-existent-id/toggle-collaborative")
        
        self.log_test(
            "4.5 Toggle Collaborative - 404 Test",
            not success and status == 404,
            f"Non-existent playlist correctly returned 404: {status}",
            {"status": status, "response": response}
        )

    def test_5_import_shared_playlist(self):
        """Test 5: POST /api/playlists/import/:token - Import/Copy Shared Playlist"""
        print("📥 TEST 5: POST /api/playlists/import/:token - Import/Copy Shared Playlist")
        print("-" * 60)
        
        if not self.test_data["share_tokens"]:
            self.log_test("5.1 Import Shared Playlist", False, "No share tokens available")
            return
            
        share_token = self.test_data["share_tokens"][0]["token"]
        original_playlist_id = self.test_data["share_tokens"][0]["playlist_id"]
        original_playlist_name = self.test_data["playlists"][0]["name"]
        
        # Import the shared playlist
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
            
            # Verify new playlist is created with name "My Awesome Playlist (Copy)"
            if playlist:
                new_playlist_id = playlist.get("id")
                new_playlist_name = playlist.get("name")
                
                name_correct = new_playlist_name == f"{original_playlist_name} (Copy)"
                new_uuid = new_playlist_id != original_playlist_id
                private_by_default = playlist.get("isPublic") is False
                original_playlist_id_set = playlist.get("originalPlaylistId") == original_playlist_id
                
                playlist_properties_valid = (
                    name_correct and
                    new_uuid and
                    private_by_default and
                    original_playlist_id_set
                )
                
                self.log_test(
                    "5.1 Import Shared Playlist - Basic Properties",
                    structure_valid and playlist_properties_valid,
                    f"Imported playlist: new_id={new_playlist_id}, new_name='{new_playlist_name}', name_correct={name_correct}, new_uuid={new_uuid}, private_by_default={private_by_default}, original_playlist_id_set={original_playlist_id_set}",
                    {
                        "share_token": share_token,
                        "original_id": original_playlist_id,
                        "new_id": new_playlist_id,
                        "original_name": original_playlist_name,
                        "new_name": new_playlist_name,
                        "tracks_count": tracks_count
                    }
                )
                
                # Verify all tracks are copied with NEW UUIDs (not same as original)
                if new_playlist_id:
                    success2, tracks_response, status2 = self.make_request("GET", f"/playlists/{new_playlist_id}/tracks")
                    
                    if success2:
                        copied_tracks = tracks_response if isinstance(tracks_response, list) else []
                        
                        # Check track count
                        expected_tracks_count = len(self.test_data["tracks"])
                        track_count_matches = len(copied_tracks) == expected_tracks_count
                        
                        # Check that all tracks have new UUIDs (different from original)
                        original_track_ids = {track["id"] for track in self.test_data["tracks"]}
                        copied_track_ids = {track["id"] for track in copied_tracks}
                        
                        new_uuids_generated = len(original_track_ids.intersection(copied_track_ids)) == 0
                        
                        # Check that track content is copied correctly
                        content_copied_correctly = True
                        if copied_tracks and self.test_data["tracks"]:
                            # Compare track content (excluding IDs and playlistId)
                            for i, copied_track in enumerate(copied_tracks):
                                if i < len(self.test_data["tracks"]):
                                    original_track = self.test_data["tracks"][i]
                                    if not (
                                        copied_track.get("songName") == original_track.get("songName") and
                                        copied_track.get("artist") == original_track.get("artist") and
                                        copied_track.get("album") == original_track.get("album") and
                                        copied_track.get("playlistId") == new_playlist_id
                                    ):
                                        content_copied_correctly = False
                                        break
                        
                        self.log_test(
                            "5.2 Import Shared Playlist - Track Verification",
                            track_count_matches and new_uuids_generated and content_copied_correctly,
                            f"Track verification: count_matches={track_count_matches} ({len(copied_tracks)}/{expected_tracks_count}), new_uuids={new_uuids_generated}, content_copied={content_copied_correctly}",
                            {
                                "expected_count": expected_tracks_count,
                                "actual_count": len(copied_tracks),
                                "original_track_ids": list(original_track_ids),
                                "copied_track_ids": list(copied_track_ids)
                            }
                        )
                    else:
                        self.log_test(
                            "5.2 Import Shared Playlist - Track Verification",
                            False,
                            f"Failed to get tracks from imported playlist: {tracks_response}",
                            tracks_response
                        )
                
                # Verify source playlist remains unchanged
                success3, original_check, status3 = self.make_request("GET", f"/playlists/{original_playlist_id}")
                
                if success3:
                    original_unchanged = (
                        original_check.get("name") == original_playlist_name and
                        original_check.get("id") == original_playlist_id
                    )
                    
                    self.log_test(
                        "5.3 Import Shared Playlist - Source Unchanged",
                        original_unchanged,
                        f"Source playlist unchanged: name='{original_check.get('name')}', id={original_check.get('id')}",
                        {"original_name": original_playlist_name, "current_name": original_check.get("name")}
                    )
            else:
                self.log_test(
                    "5.1 Import Shared Playlist - Basic Properties",
                    False,
                    "No playlist data in response",
                    response
                )
        else:
            self.log_test(
                "5.1 Import Shared Playlist - Basic Properties",
                False,
                f"Failed to import shared playlist {share_token}: {response}",
                response
            )
        
        # Test with invalid token (should return 404)
        success, response, status = self.make_request("POST", "/playlists/import/invalid-token-12345")
        
        self.log_test(
            "5.4 Import Shared Playlist - Invalid Token",
            not success and status == 404,
            f"Invalid token correctly returned 404: {status}",
            {"status": status, "response": response}
        )
        
        # Test importing same playlist twice (should create 2 separate copies)
        success, response2, status = self.make_request("POST", f"/playlists/import/{share_token}")
        
        if success:
            second_playlist = response2.get("playlist")
            if second_playlist and playlist:
                second_copy_created = (
                    second_playlist.get("id") != playlist.get("id") and
                    "(Copy)" in second_playlist.get("name", "")
                )
                
                self.log_test(
                    "5.5 Import Shared Playlist - Multiple Imports",
                    second_copy_created,
                    f"Second import created separate copy: id={second_playlist.get('id')}, name='{second_playlist.get('name')}'",
                    {"first_copy_id": playlist.get("id"), "second_copy_id": second_playlist.get("id")}
                )

    def test_6_get_public_playlists(self):
        """Test 6: GET /api/playlists/public - Get All Public Playlists"""
        print("🌍 TEST 6: GET /api/playlists/public - Get All Public Playlists")
        print("-" * 60)
        
        # Test with no public playlists (all private) - should return empty array
        success, response, status = self.make_request("GET", "/playlists/public")
        
        if success:
            playlists = response if isinstance(response, list) else []
            
            # Should return empty array when no public playlists
            no_public_initially = len(playlists) == 0
            
            self.log_test(
                "6.1 Get Public Playlists - No Public Initially",
                no_public_initially,
                f"No public playlists initially (all private by default): {len(playlists)} playlists returned",
                {"count": len(playlists), "playlists": [p.get("name") for p in playlists]}
            )
        else:
            self.log_test(
                "6.1 Get Public Playlists - No Public Initially",
                False,
                f"Failed to get public playlists: {response}",
                response
            )
        
        # Create additional playlists and make some public for testing
        if self.test_data["playlists"]:
            # Create 2 more playlists
            additional_playlists = [
                {"name": "Jazz Collection", "description": "Smooth jazz favorites"},
                {"name": "Electronic Beats", "description": "Electronic and EDM tracks"}
            ]
            
            created_additional = []
            for playlist_data in additional_playlists:
                success, response, status = self.make_request("POST", "/playlists", playlist_data)
                if success:
                    created_additional.append(response)
                    print(f"   Created additional playlist: {response.get('name')} (ID: {response.get('id')})")
            
            # Make 2 playlists public (original + first additional)
            public_playlist_ids = []
            playlists_to_make_public = [self.test_data["playlists"][0]] + created_additional[:1]
            
            for playlist in playlists_to_make_public:
                playlist_id = playlist["id"]
                
                # Toggle to public
                success, toggle_response, status = self.make_request("PUT", f"/playlists/{playlist_id}/toggle-public")
                
                if success and toggle_response.get("isPublic") is True:
                    public_playlist_ids.append(playlist_id)
                    print(f"   Made playlist {playlist['name']} public")
            
            # Now test getting public playlists
            success, response, status = self.make_request("GET", "/playlists/public")
            
            if success:
                playlists = response if isinstance(response, list) else []
                
                # Verify structure
                structure_valid = isinstance(playlists, list)
                
                # Verify only the 2 public playlists are returned
                expected_count = len(public_playlist_ids)
                count_correct = len(playlists) == expected_count
                
                # Verify all returned playlists are public
                all_public = all(playlist.get("isPublic") is True for playlist in playlists)
                
                # Verify private playlists are NOT included
                returned_ids = {playlist.get("id") for playlist in playlists}
                expected_ids = set(public_playlist_ids)
                ids_match = returned_ids == expected_ids
                
                # Verify results are sorted by creation date (newest first)
                sorting_correct = True
                if len(playlists) > 1:
                    # Check if sorted by createdAt descending
                    dates = [playlist.get("createdAt") for playlist in playlists if playlist.get("createdAt")]
                    if len(dates) > 1:
                        sorting_correct = all(dates[i] >= dates[i+1] for i in range(len(dates)-1))
                
                self.log_test(
                    "6.2 Get Public Playlists - With Public Data",
                    structure_valid and count_correct and all_public and ids_match and sorting_correct,
                    f"Retrieved {len(playlists)} public playlists: structure_valid={structure_valid}, count_correct={count_correct} ({len(playlists)}/{expected_count}), all_public={all_public}, ids_match={ids_match}, sorting_correct={sorting_correct}",
                    {
                        "count": len(playlists),
                        "expected_count": expected_count,
                        "returned_ids": list(returned_ids),
                        "expected_ids": list(expected_ids),
                        "playlists": [{"name": p.get("name"), "isPublic": p.get("isPublic")} for p in playlists]
                    }
                )
                
                # Verify private playlists are NOT included by checking all playlists
                success2, all_playlists_response, status2 = self.make_request("GET", "/playlists")
                
                if success2:
                    all_playlists = all_playlists_response if isinstance(all_playlists_response, list) else []
                    private_playlists = [p for p in all_playlists if p.get("isPublic") is False]
                    private_ids = {p.get("id") for p in private_playlists}
                    
                    # None of the private playlist IDs should be in the public list
                    no_private_in_public = len(returned_ids.intersection(private_ids)) == 0
                    
                    self.log_test(
                        "6.3 Get Public Playlists - Private Excluded",
                        no_private_in_public,
                        f"Private playlists correctly excluded: {len(private_playlists)} private playlists not in public list",
                        {
                            "private_count": len(private_playlists),
                            "private_ids": list(private_ids),
                            "public_ids": list(returned_ids),
                            "intersection": list(returned_ids.intersection(private_ids))
                        }
                    )

    def cleanup_test_data(self):
        """Clean up test data"""
        print("🧹 Cleaning up test data...")
        
        # Get all playlists and delete them
        success, all_playlists, status = self.make_request("GET", "/playlists")
        if success:
            playlists = all_playlists if isinstance(all_playlists, list) else []
            for playlist in playlists:
                playlist_id = playlist["id"]
                success, response, status = self.make_request("DELETE", f"/playlists/{playlist_id}")
                if success:
                    print(f"   Deleted playlist: {playlist['name']} (ID: {playlist_id})")
                else:
                    print(f"   Failed to delete playlist: {playlist['name']} (ID: {playlist_id})")
        
        print("✅ Cleanup complete\n")

    def run_comprehensive_tests(self):
        """Run all comprehensive playlist sharing tests"""
        print("🚀 COMPREHENSIVE BACKEND TESTING - Playlist Sharing & Collaboration APIs (Feature 4)")
        print("=" * 90)
        print("Testing all 6 API endpoints as requested in the review")
        print()
        
        # Setup test data
        self.setup_test_data()
        
        try:
            # Run all 6 API endpoint tests in order
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
        """Print detailed test results summary"""
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
        
        # Group results by API endpoint
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
            for group_name in api_groups.keys():
                if test_name.startswith(group_name.split(".")[0]):
                    api_groups[group_name].append(result)
                    break
        
        # Print results by API endpoint
        for group_name, group_results in api_groups.items():
            if group_results:
                group_passed = sum(1 for r in group_results if r["success"])
                group_total = len(group_results)
                group_rate = (group_passed / group_total * 100) if group_total > 0 else 0
                
                status_icon = "✅" if group_passed == group_total else "⚠️" if group_passed > 0 else "❌"
                print(f"{status_icon} {group_name}: {group_passed}/{group_total} ({group_rate:.1f}%)")
                
                for result in group_results:
                    status = "✅" if result["success"] else "❌"
                    print(f"   {status} {result['test']}")
                    if not result["success"] and result["details"]:
                        print(f"      Details: {result['details']}")
                print()
        
        # Critical validations summary
        print("🔍 CRITICAL VALIDATIONS SUMMARY:")
        print("-" * 50)
        
        critical_checks = [
            ("Share tokens are unique UUIDs", "1.1 Generate Share Token - Basic"),
            ("Share token idempotency works", "1.2 Generate Share Token - Idempotency"),
            ("Share token stored in database", "1.3 Generate Share Token - Database Storage"),
            ("Shared playlist viewing works", "2.1 View Shared Playlist - Basic"),
            ("Public/private toggle works", "3.2 Toggle Public - To Public"),
            ("Public state persists", "3.4 Toggle Public - Persistence Check"),
            ("Collaborative toggle works", "4.2 Toggle Collaborative - To Collaborative"),
            ("Collaborative state persists", "4.4 Toggle Collaborative - Persistence Check"),
            ("Playlist import creates copy", "5.1 Import Shared Playlist - Basic Properties"),
            ("Imported tracks have new UUIDs", "5.2 Import Shared Playlist - Track Verification"),
            ("Source playlist unchanged", "5.3 Import Shared Playlist - Source Unchanged"),
            ("Public playlists only returned", "6.2 Get Public Playlists - With Public Data"),
            ("Private playlists excluded", "6.3 Get Public Playlists - Private Excluded")
        ]
        
        for check_name, test_name in critical_checks:
            result = next((r for r in self.test_results if r["test"] == test_name), None)
            if result:
                status = "✅ PASS" if result["success"] else "❌ FAIL"
                print(f"{status}: {check_name}")
        
        print()
        print("=" * 90)
        
        # Final assessment
        if success_rate >= 95:
            print("🎉 EXCELLENT: All playlist sharing APIs are working perfectly!")
        elif success_rate >= 85:
            print("✅ GOOD: Most playlist sharing APIs are working with minor issues.")
        elif success_rate >= 70:
            print("⚠️  MODERATE: Playlist sharing APIs have some issues that need attention.")
        else:
            print("❌ CRITICAL: Playlist sharing APIs have significant issues requiring immediate fixes.")
        
        print("=" * 90)

if __name__ == "__main__":
    tester = ComprehensiveSharingTester()
    tester.run_comprehensive_tests()
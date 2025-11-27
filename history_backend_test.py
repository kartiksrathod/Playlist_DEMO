#!/usr/bin/env python3
"""
Listen History Tracking Backend API Testing
Feature 3: Real Listen History Tracking - Comprehensive Test Suite
Tests all history-related endpoints with real data scenarios
"""

import requests
import json
import uuid
import time
from datetime import datetime, timedelta

# Configuration
BASE_URL = "https://tunehub-1045.preview.emergentagent.com/api"

class HistoryAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.created_playlists = []
        self.created_tracks = []
        self.test_results = {
            'passed': 0,
            'failed': 0,
            'errors': []
        }
    
    def log_result(self, test_name, success, message=""):
        """Log test result"""
        if success:
            self.test_results['passed'] += 1
            print(f"✅ {test_name}: PASSED {message}")
        else:
            self.test_results['failed'] += 1
            self.test_results['errors'].append(f"{test_name}: {message}")
            print(f"❌ {test_name}: FAILED - {message}")
    
    def test_health_check(self):
        """Test if backend is responding"""
        try:
            response = self.session.get(f"{BASE_URL}/playlists", timeout=10)
            if response.status_code == 200:
                self.log_result("Health Check", True, f"Backend API responding: {response.status_code}")
                return True
            else:
                self.log_result("Health Check", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_result("Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def create_test_playlist_and_tracks(self):
        """Create test playlist and tracks for history testing"""
        try:
            # Create playlist
            playlist_data = {
                'name': 'History Test Playlist',
                'description': 'For testing listen history functionality'
            }
            response = self.session.post(f"{BASE_URL}/playlists", data=playlist_data)
            if response.status_code != 201:
                self.log_result("Create Test Data", False, f"Failed to create playlist: {response.status_code}")
                return None, []
            
            playlist = response.json()
            playlist_id = playlist['id']
            self.created_playlists.append(playlist_id)
            
            # Create multiple tracks for comprehensive testing
            tracks = []
            track_data_list = [
                {
                    'songName': 'Bohemian Rhapsody',
                    'artist': 'Queen',
                    'album': 'A Night at the Opera',
                    'duration': '5:55'
                },
                {
                    'songName': 'Hotel California',
                    'artist': 'Eagles',
                    'album': 'Hotel California',
                    'duration': '6:30'
                },
                {
                    'songName': 'Stairway to Heaven',
                    'artist': 'Led Zeppelin',
                    'album': 'Led Zeppelin IV',
                    'duration': '8:02'
                }
            ]
            
            for track_data in track_data_list:
                track_response = self.session.post(f"{BASE_URL}/playlists/{playlist_id}/tracks", data=track_data)
                if track_response.status_code == 201:
                    track = track_response.json()
                    tracks.append(track)
                    self.created_tracks.append((playlist_id, track['id']))
                else:
                    self.log_result("Create Test Data", False, f"Failed to create track: {track_response.status_code}")
            
            self.log_result("Create Test Data", True, f"Created playlist with {len(tracks)} tracks")
            return playlist, tracks
            
        except Exception as e:
            self.log_result("Create Test Data", False, f"Error: {str(e)}")
            return None, []
    
    def test_record_play_basic(self, track_id, playlist_id=None):
        """Test POST /api/history - Record a basic track play"""
        try:
            play_data = {
                'trackId': track_id
            }
            if playlist_id:
                play_data['playlistId'] = playlist_id
            
            response = self.session.post(f"{BASE_URL}/history", json=play_data)
            
            if response.status_code == 201:
                data = response.json()
                required_fields = ['message', 'history']
                
                # Validate response structure
                missing_fields = [field for field in required_fields if field not in data]
                if missing_fields:
                    self.log_result("Record Play (Basic)", False, f"Missing fields: {missing_fields}")
                    return None
                
                history = data['history']
                history_fields = ['id', 'trackId', 'playlistId', 'playedAt', 'duration', 'completed']
                missing_history_fields = [field for field in history_fields if field not in history]
                if missing_history_fields:
                    self.log_result("Record Play (Basic)", False, f"Missing history fields: {missing_history_fields}")
                    return None
                
                # Validate field values
                if history['trackId'] != track_id:
                    self.log_result("Record Play (Basic)", False, f"Track ID mismatch: {history['trackId']}")
                    return None
                
                if playlist_id and history['playlistId'] != playlist_id:
                    self.log_result("Record Play (Basic)", False, f"Playlist ID mismatch: {history['playlistId']}")
                    return None
                
                # Validate UUID format for history ID
                try:
                    uuid.UUID(history['id'])
                except ValueError:
                    self.log_result("Record Play (Basic)", False, f"Invalid UUID format: {history['id']}")
                    return None
                
                # Validate timestamp is recent (within last minute)
                played_at = datetime.fromisoformat(history['playedAt'].replace('Z', '+00:00'))
                now = datetime.now(played_at.tzinfo)
                if abs((now - played_at).total_seconds()) > 60:
                    self.log_result("Record Play (Basic)", False, f"Timestamp not recent: {history['playedAt']}")
                    return None
                
                self.log_result("Record Play (Basic)", True, f"Recorded play for track: {track_id}")
                return history
            else:
                self.log_result("Record Play (Basic)", False, f"Status: {response.status_code}, Response: {response.text}")
                return None
        except Exception as e:
            self.log_result("Record Play (Basic)", False, f"Error: {str(e)}")
            return None
    
    def test_record_play_with_details(self, track_id, playlist_id=None):
        """Test POST /api/history - Record play with duration and completed status"""
        try:
            play_data = {
                'trackId': track_id,
                'duration': 180,  # 3 minutes
                'completed': True
            }
            if playlist_id:
                play_data['playlistId'] = playlist_id
            
            response = self.session.post(f"{BASE_URL}/history", json=play_data)
            
            if response.status_code == 201:
                data = response.json()
                history = data['history']
                
                # Validate duration and completed fields
                if history['duration'] != 180:
                    self.log_result("Record Play (With Details)", False, f"Duration mismatch: {history['duration']}")
                    return None
                
                if history['completed'] != True:
                    self.log_result("Record Play (With Details)", False, f"Completed mismatch: {history['completed']}")
                    return None
                
                self.log_result("Record Play (With Details)", True, f"Recorded detailed play for track: {track_id}")
                return history
            else:
                self.log_result("Record Play (With Details)", False, f"Status: {response.status_code}, Response: {response.text}")
                return None
        except Exception as e:
            self.log_result("Record Play (With Details)", False, f"Error: {str(e)}")
            return None
    
    def test_record_play_validation_errors(self):
        """Test POST /api/history validation errors"""
        # Test missing trackId
        try:
            response = self.session.post(f"{BASE_URL}/history", json={})
            if response.status_code == 400:
                self.log_result("Record Play Validation (Missing Track ID)", True, "Correctly rejected missing trackId")
            else:
                self.log_result("Record Play Validation (Missing Track ID)", False, f"Expected 400, got {response.status_code}")
        except Exception as e:
            self.log_result("Record Play Validation (Missing Track ID)", False, f"Error: {str(e)}")
        
        # Test non-existent track
        try:
            fake_track_id = str(uuid.uuid4())
            play_data = {'trackId': fake_track_id}
            response = self.session.post(f"{BASE_URL}/history", json=play_data)
            if response.status_code == 404:
                self.log_result("Record Play Validation (Non-existent Track)", True, "Correctly rejected non-existent track")
            else:
                self.log_result("Record Play Validation (Non-existent Track)", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_result("Record Play Validation (Non-existent Track)", False, f"Error: {str(e)}")
    
    def test_get_history_empty(self):
        """Test GET /api/history when no history exists"""
        try:
            response = self.session.get(f"{BASE_URL}/history")
            if response.status_code == 200:
                data = response.json()
                required_fields = ['history', 'pagination']
                
                # Validate response structure
                missing_fields = [field for field in required_fields if field not in data]
                if missing_fields:
                    self.log_result("GET History (Empty)", False, f"Missing fields: {missing_fields}")
                    return False
                
                if len(data['history']) == 0 and data['pagination']['total'] == 0:
                    self.log_result("GET History (Empty)", True, "Correctly returned empty history")
                    return True
                else:
                    self.log_result("GET History (Empty)", False, f"Expected empty history, got: {len(data['history'])} items")
                    return False
            else:
                self.log_result("GET History (Empty)", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_result("GET History (Empty)", False, f"Error: {str(e)}")
            return False
    
    def test_get_history_with_data(self):
        """Test GET /api/history with existing history data"""
        try:
            response = self.session.get(f"{BASE_URL}/history")
            if response.status_code == 200:
                data = response.json()
                
                if len(data['history']) > 0:
                    # Validate enriched data structure
                    for entry in data['history']:
                        required_fields = ['id', 'trackId', 'track', 'playlistId', 'playlist', 'playedAt', 'duration', 'completed']
                        missing_fields = [field for field in required_fields if field not in entry]
                        if missing_fields:
                            self.log_result("GET History (With Data)", False, f"Missing entry fields: {missing_fields}")
                            return False
                        
                        # Validate track enrichment
                        if entry['track']:
                            track_fields = ['id', 'songName', 'artist', 'album', 'duration', 'audioUrl', 'audioFile']
                            missing_track_fields = [field for field in track_fields if field not in entry['track']]
                            if missing_track_fields:
                                self.log_result("GET History (With Data)", False, f"Missing track fields: {missing_track_fields}")
                                return False
                        
                        # Validate playlist enrichment (if exists)
                        if entry['playlist']:
                            playlist_fields = ['id', 'name', 'coverImage']
                            missing_playlist_fields = [field for field in playlist_fields if field not in entry['playlist']]
                            if missing_playlist_fields:
                                self.log_result("GET History (With Data)", False, f"Missing playlist fields: {missing_playlist_fields}")
                                return False
                    
                    # Check sorting (should be by playedAt descending - most recent first)
                    if len(data['history']) > 1:
                        for i in range(len(data['history']) - 1):
                            current_time = data['history'][i]['playedAt']
                            next_time = data['history'][i + 1]['playedAt']
                            if current_time < next_time:
                                self.log_result("GET History (With Data)", False, "History not sorted by playedAt descending")
                                return False
                    
                    # Validate pagination
                    pagination = data['pagination']
                    pagination_fields = ['total', 'limit', 'offset', 'hasMore']
                    missing_pagination_fields = [field for field in pagination_fields if field not in pagination]
                    if missing_pagination_fields:
                        self.log_result("GET History (With Data)", False, f"Missing pagination fields: {missing_pagination_fields}")
                        return False
                    
                    self.log_result("GET History (With Data)", True, f"Retrieved {len(data['history'])} enriched history entries, properly sorted")
                    return data
                else:
                    self.log_result("GET History (With Data)", False, "Expected history data but got empty array")
                    return False
            else:
                self.log_result("GET History (With Data)", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_result("GET History (With Data)", False, f"Error: {str(e)}")
            return False
    
    def test_get_history_pagination(self):
        """Test GET /api/history with pagination parameters"""
        try:
            # Test with limit and offset
            response = self.session.get(f"{BASE_URL}/history?limit=2&offset=0")
            if response.status_code == 200:
                data = response.json()
                
                if len(data['history']) <= 2:  # Should respect limit
                    pagination = data['pagination']
                    if pagination['limit'] == 2 and pagination['offset'] == 0:
                        self.log_result("GET History (Pagination)", True, f"Pagination working correctly: limit={pagination['limit']}, offset={pagination['offset']}")
                        return True
                    else:
                        self.log_result("GET History (Pagination)", False, f"Pagination values incorrect: {pagination}")
                        return False
                else:
                    self.log_result("GET History (Pagination)", False, f"Limit not respected: got {len(data['history'])} items")
                    return False
            else:
                self.log_result("GET History (Pagination)", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_result("GET History (Pagination)", False, f"Error: {str(e)}")
            return False
    
    def test_get_stats_empty(self):
        """Test GET /api/history/stats when no history exists"""
        try:
            response = self.session.get(f"{BASE_URL}/history/stats")
            if response.status_code == 200:
                data = response.json()
                required_fields = ['totalPlays', 'completedPlays', 'uniqueTracks', 'playsThisWeek', 'mostPlayed']
                
                # Validate response structure
                missing_fields = [field for field in required_fields if field not in data]
                if missing_fields:
                    self.log_result("GET Stats (Empty)", False, f"Missing fields: {missing_fields}")
                    return False
                
                # All stats should be 0 or empty for empty history
                if (data['totalPlays'] == 0 and 
                    data['completedPlays'] == 0 and 
                    data['uniqueTracks'] == 0 and 
                    data['playsThisWeek'] == 0 and 
                    len(data['mostPlayed']) == 0):
                    self.log_result("GET Stats (Empty)", True, "All stats correctly show 0/empty for empty history")
                    return True
                else:
                    self.log_result("GET Stats (Empty)", False, f"Expected all zeros, got: {data}")
                    return False
            else:
                self.log_result("GET Stats (Empty)", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_result("GET Stats (Empty)", False, f"Error: {str(e)}")
            return False
    
    def test_get_stats_with_data(self):
        """Test GET /api/history/stats with existing history data"""
        try:
            response = self.session.get(f"{BASE_URL}/history/stats")
            if response.status_code == 200:
                data = response.json()
                
                # Validate mostPlayed structure
                if len(data['mostPlayed']) > 0:
                    for item in data['mostPlayed']:
                        required_fields = ['trackId', 'playCount', 'track']
                        missing_fields = [field for field in required_fields if field not in item]
                        if missing_fields:
                            self.log_result("GET Stats (With Data)", False, f"Missing mostPlayed fields: {missing_fields}")
                            return False
                        
                        # Validate track enrichment
                        if item['track']:
                            track_fields = ['id', 'songName', 'artist', 'album']
                            missing_track_fields = [field for field in track_fields if field not in item['track']]
                            if missing_track_fields:
                                self.log_result("GET Stats (With Data)", False, f"Missing track fields in mostPlayed: {missing_track_fields}")
                                return False
                    
                    # Check sorting (should be by playCount descending)
                    if len(data['mostPlayed']) > 1:
                        for i in range(len(data['mostPlayed']) - 1):
                            current_count = data['mostPlayed'][i]['playCount']
                            next_count = data['mostPlayed'][i + 1]['playCount']
                            if current_count < next_count:
                                self.log_result("GET Stats (With Data)", False, "mostPlayed not sorted by playCount descending")
                                return False
                    
                    # Validate that mostPlayed is limited to 10 items
                    if len(data['mostPlayed']) > 10:
                        self.log_result("GET Stats (With Data)", False, f"mostPlayed should be limited to 10, got {len(data['mostPlayed'])}")
                        return False
                
                # Validate that stats make sense
                if data['totalPlays'] >= data['uniqueTracks'] and data['totalPlays'] >= data['completedPlays']:
                    self.log_result("GET Stats (With Data)", True, f"Stats retrieved correctly: {data['totalPlays']} total plays, {data['uniqueTracks']} unique tracks, {len(data['mostPlayed'])} most played tracks")
                    return data
                else:
                    self.log_result("GET Stats (With Data)", False, f"Stats don't make sense: {data}")
                    return False
            else:
                self.log_result("GET Stats (With Data)", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_result("GET Stats (With Data)", False, f"Error: {str(e)}")
            return False
    
    def test_clear_history(self):
        """Test DELETE /api/history - Clear all history"""
        try:
            response = self.session.delete(f"{BASE_URL}/history")
            
            if response.status_code == 200:
                data = response.json()
                if 'message' in data and 'success' in data['message'].lower():
                    # Verify history is actually cleared
                    get_response = self.session.get(f"{BASE_URL}/history")
                    if get_response.status_code == 200:
                        get_data = get_response.json()
                        if len(get_data['history']) == 0 and get_data['pagination']['total'] == 0:
                            # Verify stats are also cleared
                            stats_response = self.session.get(f"{BASE_URL}/history/stats")
                            if stats_response.status_code == 200:
                                stats_data = stats_response.json()
                                if (stats_data['totalPlays'] == 0 and 
                                    stats_data['uniqueTracks'] == 0 and 
                                    len(stats_data['mostPlayed']) == 0):
                                    self.log_result("Clear History", True, "History and stats successfully cleared")
                                    return True
                                else:
                                    self.log_result("Clear History", False, f"Stats not cleared: {stats_data}")
                                    return False
                            else:
                                self.log_result("Clear History", False, f"Failed to verify stats after clear: {stats_response.status_code}")
                                return False
                        else:
                            self.log_result("Clear History", False, f"History not cleared: {len(get_data['history'])} items remain")
                            return False
                    else:
                        self.log_result("Clear History", False, f"Failed to verify clear: {get_response.status_code}")
                        return False
                else:
                    self.log_result("Clear History", False, f"Invalid response message: {data}")
                    return False
            else:
                self.log_result("Clear History", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_result("Clear History", False, f"Error: {str(e)}")
            return False
    
    def test_history_edge_cases(self, track_id):
        """Test edge cases for history tracking"""
        # Test record play without playlist
        try:
            play_data = {
                'trackId': track_id,
                'playlistId': None,
                'duration': 0,
                'completed': False
            }
            response = self.session.post(f"{BASE_URL}/history", json=play_data)
            if response.status_code == 201:
                data = response.json()
                if data['history']['playlistId'] is None:
                    self.log_result("History Edge Cases (No Playlist)", True, "Successfully recorded play without playlist")
                else:
                    self.log_result("History Edge Cases (No Playlist)", False, f"Playlist ID should be null: {data['history']['playlistId']}")
            else:
                self.log_result("History Edge Cases (No Playlist)", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("History Edge Cases (No Playlist)", False, f"Error: {str(e)}")
        
        # Test with large limit parameter
        try:
            response = self.session.get(f"{BASE_URL}/history?limit=1000")
            if response.status_code == 200:
                data = response.json()
                if data['pagination']['limit'] == 1000:
                    self.log_result("History Edge Cases (Large Limit)", True, "Large limit parameter handled correctly")
                else:
                    self.log_result("History Edge Cases (Large Limit)", False, f"Limit not set correctly: {data['pagination']['limit']}")
            else:
                self.log_result("History Edge Cases (Large Limit)", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("History Edge Cases (Large Limit)", False, f"Error: {str(e)}")
        
        # Test with negative offset (should handle gracefully)
        try:
            response = self.session.get(f"{BASE_URL}/history?offset=-1")
            if response.status_code == 200:
                data = response.json()
                # Should either default to 0 or handle gracefully
                self.log_result("History Edge Cases (Negative Offset)", True, "Negative offset handled gracefully")
            else:
                self.log_result("History Edge Cases (Negative Offset)", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("History Edge Cases (Negative Offset)", False, f"Error: {str(e)}")
    
    def cleanup(self):
        """Clean up created test data"""
        print(f"\n🧹 Cleaning up {len(self.created_tracks)} test tracks...")
        for playlist_id, track_id in self.created_tracks.copy():
            try:
                response = self.session.delete(f"{BASE_URL}/playlists/{playlist_id}/tracks/{track_id}")
                if response.status_code == 200:
                    print(f"✅ Cleaned up track: {track_id}")
                else:
                    print(f"⚠️  Failed to clean up track: {track_id}")
            except Exception as e:
                print(f"❌ Error cleaning up track {track_id}: {str(e)}")
        
        print(f"\n🧹 Cleaning up {len(self.created_playlists)} test playlists...")
        for playlist_id in self.created_playlists.copy():
            try:
                response = self.session.delete(f"{BASE_URL}/playlists/{playlist_id}")
                if response.status_code == 200:
                    print(f"✅ Cleaned up playlist: {playlist_id}")
                else:
                    print(f"⚠️  Failed to clean up playlist: {playlist_id}")
            except Exception as e:
                print(f"❌ Error cleaning up playlist {playlist_id}: {str(e)}")
    
    def run_comprehensive_history_tests(self):
        """Run comprehensive listen history tracking tests"""
        print("🎧 Starting Listen History Tracking API Tests - Feature 3")
        print("=" * 60)
        
        # Health check first
        if not self.test_health_check():
            print("❌ Backend not responding. Aborting tests.")
            return False
        
        # Clear any existing history first
        print("\n🧹 Clearing existing history...")
        self.session.delete(f"{BASE_URL}/history")
        
        # Test empty history state
        print("\n📊 TESTING EMPTY HISTORY STATE")
        print("-" * 40)
        self.test_get_history_empty()
        self.test_get_stats_empty()
        
        # Create test data
        print("\n🎵 CREATING TEST DATA")
        print("-" * 40)
        playlist, tracks = self.create_test_playlist_and_tracks()
        
        if not playlist or not tracks:
            print("❌ Failed to create test data. Aborting history tests.")
            return False
        
        # Test record play validation
        print("\n🔍 TESTING RECORD PLAY VALIDATION")
        print("-" * 40)
        self.test_record_play_validation_errors()
        
        # Test basic play recording
        print("\n📝 TESTING PLAY RECORDING")
        print("-" * 40)
        
        # Record plays for different scenarios
        track1, track2, track3 = tracks[0], tracks[1], tracks[2]
        
        # Basic play recording
        play1 = self.test_record_play_basic(track1['id'], playlist['id'])
        
        # Play recording with details
        play2 = self.test_record_play_with_details(track1['id'], playlist['id'])
        
        # Record multiple plays for the same track (for mostPlayed testing)
        for i in range(3):
            self.test_record_play_basic(track1['id'], playlist['id'])
        
        # Record plays for different tracks
        self.test_record_play_basic(track2['id'], playlist['id'])
        self.test_record_play_with_details(track2['id'], playlist['id'])
        self.test_record_play_basic(track3['id'])  # Without playlist
        
        # Test history retrieval
        print("\n📚 TESTING HISTORY RETRIEVAL")
        print("-" * 40)
        history_data = self.test_get_history_with_data()
        
        # Test pagination
        self.test_get_history_pagination()
        
        # Test stats
        print("\n📈 TESTING STATISTICS")
        print("-" * 40)
        stats_data = self.test_get_stats_with_data()
        
        # Test edge cases
        print("\n🔧 TESTING EDGE CASES")
        print("-" * 40)
        self.test_history_edge_cases(track1['id'])
        
        # Test clear history (do this last)
        print("\n🗑️  TESTING CLEAR HISTORY")
        print("-" * 40)
        self.test_clear_history()
        
        # Cleanup
        self.cleanup()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 LISTEN HISTORY TEST SUMMARY")
        print("=" * 60)
        print(f"✅ Passed: {self.test_results['passed']}")
        print(f"❌ Failed: {self.test_results['failed']}")
        
        if self.test_results['passed'] + self.test_results['failed'] > 0:
            success_rate = (self.test_results['passed'] / (self.test_results['passed'] + self.test_results['failed']) * 100)
            print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.test_results['errors']:
            print(f"\n❌ FAILED TESTS ({len(self.test_results['errors'])}):")
            for error in self.test_results['errors']:
                print(f"   • {error}")
        
        print("\n🎉 Listen History API testing completed!")
        
        return self.test_results['failed'] == 0

if __name__ == "__main__":
    tester = HistoryAPITester()
    success = tester.run_comprehensive_history_tests()
    exit(0 if success else 1)
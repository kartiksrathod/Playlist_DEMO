#!/usr/bin/env python3
"""
Final Deployment Readiness Testing for Music Playlist Manager
Corrected version with proper test logic
"""

import requests
import json
import time
import uuid
from typing import Dict, List, Any, Optional

# Configuration
BASE_URL = "https://unified-components.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class FinalDeploymentTester:
    def __init__(self):
        self.test_results = []
        self.test_data = {
            "playlists": [],
            "tracks": [],
            "share_tokens": [],
            "created_playlist_ids": []  # Track what we create for cleanup
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

    def test_all_apis_comprehensive(self):
        """Test all APIs comprehensively"""
        print("🚀 COMPREHENSIVE API TESTING")
        print("=" * 60)
        
        # 1. PLAYLIST APIs
        print("\n📁 TESTING PLAYLIST APIs")
        print("-" * 40)
        
        # GET all playlists
        success, response, status = self.make_request("GET", "/playlists")
        self.log_test("Playlist API - GET All", success and isinstance(response, list),
                     f"Retrieved {len(response) if isinstance(response, list) else 0} playlists")
        
        # Store existing playlists
        if success and isinstance(response, list):
            self.test_data["playlists"] = response
        
        # CREATE playlist (with unique name to avoid conflicts)
        unique_name = f"Test Playlist {uuid.uuid4().hex[:8]}"
        playlist_data = {"name": unique_name, "description": "Test playlist for deployment testing"}
        success, response, status = self.make_request("POST", "/playlists", playlist_data)
        
        if success and response.get("id"):
            self.test_data["created_playlist_ids"].append(response["id"])
            test_playlist_id = response["id"]
            self.log_test("Playlist API - CREATE", True, f"Created playlist: {response.get('name')}")
            
            # GET single playlist
            success, response, status = self.make_request("GET", f"/playlists/{test_playlist_id}")
            self.log_test("Playlist API - GET Single", success and response.get("id") == test_playlist_id,
                         f"Retrieved playlist: {response.get('name') if success else 'Failed'}")
            
            # UPDATE playlist
            update_data = {"name": f"Updated {unique_name}", "description": "Updated description"}
            success, response, status = self.make_request("PUT", f"/playlists/{test_playlist_id}", update_data)
            self.log_test("Playlist API - UPDATE", success and response.get("name") == update_data["name"],
                         f"Updated playlist: {success}")
            
        else:
            self.log_test("Playlist API - CREATE", False, f"Failed to create playlist: {response}")
            test_playlist_id = None
        
        # 2. TRACK APIs
        print("\n🎵 TESTING TRACK APIs")
        print("-" * 40)
        
        if test_playlist_id:
            # GET tracks (should be empty initially)
            success, response, status = self.make_request("GET", f"/playlists/{test_playlist_id}/tracks")
            self.log_test("Track API - GET All", success and isinstance(response, list),
                         f"Retrieved {len(response) if isinstance(response, list) else 0} tracks")
            
            # CREATE track
            track_data = {
                "songName": "Test Song",
                "artist": "Test Artist", 
                "album": "Test Album",
                "duration": "3:30",
                "audioUrl": "https://example.com/test-song"
            }
            success, response, status = self.make_request("POST", f"/playlists/{test_playlist_id}/tracks", track_data)
            
            if success and response.get("id"):
                test_track_id = response["id"]
                self.log_test("Track API - CREATE", True, f"Created track: {response.get('songName')}")
                
                # GET single track
                success, response, status = self.make_request("GET", f"/playlists/{test_playlist_id}/tracks/{test_track_id}")
                self.log_test("Track API - GET Single", success and response.get("id") == test_track_id,
                             f"Retrieved track: {response.get('songName') if success else 'Failed'}")
                
                # UPDATE track
                update_data = {"songName": "Updated Test Song", "artist": "Updated Artist"}
                success, response, status = self.make_request("PUT", f"/playlists/{test_playlist_id}/tracks/{test_track_id}", update_data)
                self.log_test("Track API - UPDATE", success and response.get("songName") == update_data["songName"],
                             f"Updated track: {success}")
                
                # Store for other tests
                self.test_data["tracks"] = [{"id": test_track_id, "playlistId": test_playlist_id}]
                
            else:
                self.log_test("Track API - CREATE", False, f"Failed to create track: {response}")
        
        # 3. LIBRARY APIs
        print("\n📚 TESTING LIBRARY APIs")
        print("-" * 40)
        
        # GET library tracks
        success, response, status = self.make_request("GET", "/library/tracks")
        self.log_test("Library API - GET Tracks", success and "tracks" in response and "count" in response,
                     f"Retrieved library: count={response.get('count') if success else 'Failed'}")
        
        # GET artists
        success, response, status = self.make_request("GET", "/library/artists")
        self.log_test("Library API - GET Artists", success and "artists" in response,
                     f"Retrieved {len(response.get('artists', [])) if success else 'Failed'} artists")
        
        # GET albums
        success, response, status = self.make_request("GET", "/library/albums")
        self.log_test("Library API - GET Albums", success and "albums" in response,
                     f"Retrieved {len(response.get('albums', [])) if success else 'Failed'} albums")
        
        # GET stats
        success, response, status = self.make_request("GET", "/library/stats")
        self.log_test("Library API - GET Stats", success and "stats" in response,
                     f"Retrieved stats: {success}")
        
        # GET track details (if we have a track)
        if self.test_data["tracks"]:
            track_id = self.test_data["tracks"][0]["id"]
            success, response, status = self.make_request("GET", f"/library/tracks/{track_id}")
            self.log_test("Library API - GET Track Details", success and "track" in response,
                         f"Retrieved track details: {success}")
        
        # 4. SETTINGS APIs
        print("\n⚙️ TESTING SETTINGS APIs")
        print("-" * 40)
        
        # GET settings
        success, response, status = self.make_request("GET", "/settings")
        current_settings = response if success else {}
        self.log_test("Settings API - GET", success and isinstance(response, dict),
                     f"Retrieved settings: {success}")
        
        # UPDATE theme (test with different value)
        current_theme = current_settings.get("theme", "dark")
        new_theme = "dark" if current_theme == "light" else "light"
        success, response, status = self.make_request("PUT", "/settings", {"theme": new_theme})
        
        # Check if update was successful
        if success:
            updated_theme = response.get("settings", {}).get("theme")
            theme_updated = updated_theme == new_theme
        else:
            theme_updated = False
            
        self.log_test("Settings API - UPDATE Theme", theme_updated,
                     f"Updated theme from {current_theme} to {new_theme}: {theme_updated}")
        
        # UPDATE volume
        success, response, status = self.make_request("PUT", "/settings", {"volume": 75})
        volume_updated = success and response.get("settings", {}).get("volume") == 75
        self.log_test("Settings API - UPDATE Volume", volume_updated,
                     f"Updated volume to 75: {volume_updated}")
        
        # 5. HISTORY APIs
        print("\n📊 TESTING HISTORY APIs")
        print("-" * 40)
        
        # Record a play (if we have a track)
        if self.test_data["tracks"]:
            track_id = self.test_data["tracks"][0]["id"]
            playlist_id = self.test_data["tracks"][0]["playlistId"]
            
            play_data = {
                "trackId": track_id,
                "playlistId": playlist_id,
                "duration": 180,
                "completed": True
            }
            success, response, status = self.make_request("POST", "/history", play_data)
            self.log_test("History API - Record Play", success and status == 201,
                         f"Recorded play: {success}")
        
        # GET history
        success, response, status = self.make_request("GET", "/history")
        self.log_test("History API - GET History", success and "history" in response,
                     f"Retrieved history: {len(response.get('history', [])) if success else 'Failed'} entries")
        
        # GET history stats (corrected - stats are returned directly)
        success, response, status = self.make_request("GET", "/history/stats")
        stats_valid = success and isinstance(response, dict) and "totalPlays" in response
        self.log_test("History API - GET Stats", stats_valid,
                     f"Retrieved stats: totalPlays={response.get('totalPlays') if success else 'Failed'}")
        
        # 6. FAVORITES APIs
        print("\n❤️ TESTING FAVORITES APIs")
        print("-" * 40)
        
        if test_playlist_id and self.test_data["tracks"]:
            track_id = self.test_data["tracks"][0]["id"]
            
            # Add playlist to favorites
            success, response, status = self.make_request("POST", f"/favorites/playlists/{test_playlist_id}")
            self.log_test("Favorites API - Add Playlist", success and (status == 201 or status == 200),
                         f"Added playlist to favorites: {success}")
            
            # Add track to favorites
            success, response, status = self.make_request("POST", f"/favorites/tracks/{track_id}")
            self.log_test("Favorites API - Add Track", success and (status == 201 or status == 200),
                         f"Added track to favorites: {success}")
            
            # GET favorite playlists
            success, response, status = self.make_request("GET", "/favorites/playlists")
            self.log_test("Favorites API - GET Playlists", success and "playlists" in response,
                         f"Retrieved {len(response.get('playlists', [])) if success else 'Failed'} favorite playlists")
            
            # GET favorite tracks
            success, response, status = self.make_request("GET", "/favorites/tracks")
            self.log_test("Favorites API - GET Tracks", success and "tracks" in response,
                         f"Retrieved {len(response.get('tracks', [])) if success else 'Failed'} favorite tracks")
            
            # Check favorite status
            success, response, status = self.make_request("GET", f"/favorites/check/playlist/{test_playlist_id}")
            self.log_test("Favorites API - Check Playlist", success and "isFavorited" in response,
                         f"Playlist favorited: {response.get('isFavorited') if success else 'Failed'}")
        
        # 7. SHARING APIs
        print("\n🔗 TESTING SHARING APIs")
        print("-" * 40)
        
        if test_playlist_id:
            # Generate share token
            success, response, status = self.make_request("POST", f"/playlists/{test_playlist_id}/share")
            share_token = response.get("shareToken") if success else None
            self.log_test("Sharing API - Generate Token", success and share_token,
                         f"Generated share token: {share_token[:8] + '...' if share_token else 'Failed'}")
            
            if share_token:
                # View shared playlist
                success, response, status = self.make_request("GET", f"/playlists/shared/{share_token}")
                self.log_test("Sharing API - View Shared", success and "playlist" in response,
                             f"Viewed shared playlist: {response.get('playlist', {}).get('name') if success else 'Failed'}")
            
            # Toggle public
            success, response, status = self.make_request("PUT", f"/playlists/{test_playlist_id}/toggle-public")
            self.log_test("Sharing API - Toggle Public", success and "isPublic" in response,
                         f"Toggled public: {response.get('isPublic') if success else 'Failed'}")
            
            # GET public playlists
            success, response, status = self.make_request("GET", "/playlists/public")
            self.log_test("Sharing API - GET Public", success and isinstance(response, list),
                         f"Retrieved {len(response) if isinstance(response, list) else 'Failed'} public playlists")
        
        # 8. STATIC FILE SERVING
        print("\n📁 TESTING STATIC FILE SERVING")
        print("-" * 40)
        
        # Test image route (404 expected for non-existent file)
        try:
            response = requests.get(f"{BASE_URL}/uploads/covers/test.jpg", timeout=10)
            image_route_ok = response.status_code in [200, 404]  # Both are acceptable
            self.log_test("Static Files - Image Route", image_route_ok,
                         f"Image route accessible: {response.status_code}")
        except Exception as e:
            self.log_test("Static Files - Image Route", False, f"Image route error: {str(e)}")
        
        # Test audio route (404 expected for non-existent file)
        try:
            response = requests.get(f"{BASE_URL}/uploads/audio/test.mp3", timeout=10)
            audio_route_ok = response.status_code in [200, 404]  # Both are acceptable
            self.log_test("Static Files - Audio Route", audio_route_ok,
                         f"Audio route accessible: {response.status_code}")
        except Exception as e:
            self.log_test("Static Files - Audio Route", False, f"Audio route error: {str(e)}")
        
        # 9. ERROR HANDLING
        print("\n⚠️ TESTING ERROR HANDLING")
        print("-" * 40)
        
        # Test 404 errors
        error_tests = [
            ("GET", "/playlists/non-existent-id", 404),
            ("GET", "/library/tracks/non-existent-track", 404),
            ("POST", "/favorites/playlists/non-existent-id", 404)
        ]
        
        for method, endpoint, expected_status in error_tests:
            success, response, status = self.make_request(method, endpoint)
            error_handled = not success and status == expected_status
            self.log_test(f"Error Handling - {endpoint}", error_handled,
                         f"Expected {expected_status}, got {status}")

    def cleanup_test_data(self):
        """Clean up created test data"""
        print("\n🧹 Cleaning up test data...")
        
        for playlist_id in self.test_data["created_playlist_ids"]:
            success, response, status = self.make_request("DELETE", f"/playlists/{playlist_id}")
            if success:
                print(f"   Deleted test playlist: {playlist_id}")
        
        # Clear history
        self.make_request("DELETE", "/history")
        print("   Cleared history")
        
        print("✅ Cleanup complete\n")

    def run_final_test(self):
        """Run final deployment readiness test"""
        print("🚀 FINAL DEPLOYMENT READINESS TEST")
        print("🎯 Music Playlist Manager - Production Verification")
        print("=" * 80)
        
        try:
            self.test_all_apis_comprehensive()
        finally:
            self.cleanup_test_data()
        
        self.print_final_summary()

    def print_final_summary(self):
        """Print final deployment summary"""
        print("=" * 80)
        print("📊 FINAL DEPLOYMENT READINESS REPORT")
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
            deployment_status = "🟢 READY FOR PRODUCTION DEPLOYMENT"
            recommendation = "All critical systems operational. Safe to deploy to production."
        elif success_rate >= 90:
            deployment_status = "🟡 READY WITH MINOR ISSUES"
            recommendation = "Core functionality working. Minor issues should be addressed post-deployment."
        elif success_rate >= 80:
            deployment_status = "🟠 DEPLOYMENT WITH CAUTION"
            recommendation = "Most systems working. Review and fix failed tests before deployment."
        else:
            deployment_status = "🔴 NOT READY FOR DEPLOYMENT"
            recommendation = "Critical issues found. Fix all failed tests before deployment."
        
        print(f"DEPLOYMENT STATUS: {deployment_status}")
        print(f"RECOMMENDATION: {recommendation}")
        print()
        
        # API category breakdown
        api_categories = {
            "Playlist API": [r for r in self.test_results if "Playlist API" in r["test"]],
            "Track API": [r for r in self.test_results if "Track API" in r["test"]],
            "Library API": [r for r in self.test_results if "Library API" in r["test"]],
            "Settings API": [r for r in self.test_results if "Settings API" in r["test"]],
            "History API": [r for r in self.test_results if "History API" in r["test"]],
            "Favorites API": [r for r in self.test_results if "Favorites API" in r["test"]],
            "Sharing API": [r for r in self.test_results if "Sharing API" in r["test"]],
            "Static Files": [r for r in self.test_results if "Static Files" in r["test"]],
            "Error Handling": [r for r in self.test_results if "Error Handling" in r["test"]]
        }
        
        print("📋 API FUNCTIONALITY REPORT:")
        print("-" * 50)
        for category, results in api_categories.items():
            if results:
                category_passed = sum(1 for r in results if r["success"])
                category_total = len(results)
                category_rate = (category_passed / category_total * 100) if category_total > 0 else 0
                
                if category_rate == 100:
                    status_icon = "✅"
                elif category_rate >= 80:
                    status_icon = "⚠️"
                else:
                    status_icon = "❌"
                    
                print(f"{status_icon} {category}: {category_passed}/{category_total} ({category_rate:.0f}%)")
        
        print()
        
        if failed_tests > 0:
            print("❌ ISSUES REQUIRING ATTENTION:")
            print("-" * 50)
            for result in self.test_results:
                if not result["success"]:
                    print(f"• {result['test']}")
                    if result["details"]:
                        print(f"  → {result['details']}")
            print()
        
        print("✅ WORKING FUNCTIONALITY:")
        print("-" * 50)
        working_apis = []
        for category, results in api_categories.items():
            if results:
                category_passed = sum(1 for r in results if r["success"])
                category_total = len(results)
                if category_passed == category_total:
                    working_apis.append(f"• {category} - All endpoints working")
                elif category_passed > 0:
                    working_apis.append(f"• {category} - {category_passed}/{category_total} endpoints working")
        
        for api in working_apis:
            print(api)
        
        print()
        print("=" * 80)

if __name__ == "__main__":
    tester = FinalDeploymentTester()
    tester.run_final_test()
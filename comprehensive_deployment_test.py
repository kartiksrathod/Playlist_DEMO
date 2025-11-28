#!/usr/bin/env python3
"""
Comprehensive Deployment Readiness Test - Music Playlist Manager
Focus on testing existing functionality and overall system health
"""

import requests
import json
import time
from typing import Dict, List, Any

# Configuration
BASE_URL = "https://theme-switcher-20.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class ComprehensiveDeploymentTester:
    def __init__(self):
        self.test_results = []
        self.critical_failures = []
        self.minor_issues = []
        
    def log_test(self, test_name: str, success: bool, details: str = "", critical: bool = False):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "critical": critical,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        self.test_results.append(result)
        
        if not success:
            if critical:
                self.critical_failures.append(result)
            else:
                self.minor_issues.append(result)
        
        status = "✅ PASS" if success else ("🔴 CRITICAL FAIL" if critical else "⚠️ MINOR ISSUE")
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
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

    def test_core_functionality(self):
        """Test core system functionality"""
        print("🔧 TESTING CORE SYSTEM FUNCTIONALITY")
        print("=" * 60)
        
        # 1. Database Connectivity Test
        print("\n🗄️ Database Connectivity")
        print("-" * 30)
        
        success, response, status = self.make_request("GET", "/playlists")
        self.log_test("Database Connection", success and isinstance(response, list),
                     f"Database accessible, retrieved {len(response) if isinstance(response, list) else 0} playlists",
                     critical=True)
        
        existing_playlists = response if success and isinstance(response, list) else []
        
        # 2. Playlist Read Operations
        print("\n📁 Playlist Read Operations")
        print("-" * 30)
        
        # Test GET all playlists
        self.log_test("GET All Playlists", success and isinstance(response, list),
                     f"Retrieved {len(existing_playlists)} playlists", critical=True)
        
        # Test GET single playlist (if any exist)
        if existing_playlists:
            playlist_id = existing_playlists[0]["id"]
            success, response, status = self.make_request("GET", f"/playlists/{playlist_id}")
            self.log_test("GET Single Playlist", success and response.get("id") == playlist_id,
                         f"Retrieved playlist: {response.get('name') if success else 'Failed'}", critical=True)
            
            # Test playlist tracks
            success, response, status = self.make_request("GET", f"/playlists/{playlist_id}/tracks")
            tracks = response if success and isinstance(response, list) else []
            self.log_test("GET Playlist Tracks", success and isinstance(response, list),
                         f"Retrieved {len(tracks)} tracks from playlist", critical=True)
            
            # Test single track (if any exist)
            if tracks:
                track_id = tracks[0]["id"]
                success, response, status = self.make_request("GET", f"/playlists/{playlist_id}/tracks/{track_id}")
                self.log_test("GET Single Track", success and response.get("id") == track_id,
                             f"Retrieved track: {response.get('songName') if success else 'Failed'}", critical=True)

    def test_library_functionality(self):
        """Test library APIs"""
        print("\n📚 LIBRARY FUNCTIONALITY")
        print("=" * 60)
        
        # Test library tracks
        success, response, status = self.make_request("GET", "/library/tracks")
        tracks_working = success and "tracks" in response and "count" in response
        self.log_test("Library Tracks API", tracks_working,
                     f"Library tracks: count={response.get('count') if success else 'Failed'}", critical=True)
        
        # Test with search
        success, response, status = self.make_request("GET", "/library/tracks", params={"search": "test"})
        search_working = success and "tracks" in response
        self.log_test("Library Search", search_working,
                     f"Search functionality working: {success}", critical=False)
        
        # Test with sorting
        success, response, status = self.make_request("GET", "/library/tracks", params={"sort": "name-asc"})
        sort_working = success and "tracks" in response
        self.log_test("Library Sorting", sort_working,
                     f"Sort functionality working: {success}", critical=False)
        
        # Test artists endpoint
        success, response, status = self.make_request("GET", "/library/artists")
        artists_working = success and "artists" in response
        self.log_test("Library Artists API", artists_working,
                     f"Artists: {len(response.get('artists', [])) if success else 'Failed'}", critical=True)
        
        # Test albums endpoint
        success, response, status = self.make_request("GET", "/library/albums")
        albums_working = success and "albums" in response
        self.log_test("Library Albums API", albums_working,
                     f"Albums: {len(response.get('albums', [])) if success else 'Failed'}", critical=True)
        
        # Test stats endpoint
        success, response, status = self.make_request("GET", "/library/stats")
        stats_working = success and "stats" in response
        self.log_test("Library Stats API", stats_working,
                     f"Stats API working: {success}", critical=True)

    def test_settings_functionality(self):
        """Test settings APIs"""
        print("\n⚙️ SETTINGS FUNCTIONALITY")
        print("=" * 60)
        
        # Test GET settings
        success, response, status = self.make_request("GET", "/settings")
        settings_get = success and isinstance(response, dict)
        current_settings = response if success else {}
        self.log_test("GET Settings", settings_get,
                     f"Settings retrieved: {success}", critical=True)
        
        if settings_get:
            # Test theme update
            current_theme = current_settings.get("theme", "dark")
            new_theme = "light" if current_theme == "dark" else "dark"
            success, response, status = self.make_request("PUT", "/settings", {"theme": new_theme})
            
            if success and "settings" in response:
                updated_theme = response["settings"].get("theme")
                theme_updated = updated_theme == new_theme
            else:
                theme_updated = False
                
            self.log_test("UPDATE Settings Theme", theme_updated,
                         f"Theme updated from {current_theme} to {new_theme}: {theme_updated}", critical=False)
            
            # Test volume update
            success, response, status = self.make_request("PUT", "/settings", {"volume": 80})
            volume_updated = success and response.get("settings", {}).get("volume") == 80
            self.log_test("UPDATE Settings Volume", volume_updated,
                         f"Volume updated to 80: {volume_updated}", critical=False)

    def test_history_functionality(self):
        """Test history APIs"""
        print("\n📊 HISTORY FUNCTIONALITY")
        print("=" * 60)
        
        # Test GET history
        success, response, status = self.make_request("GET", "/history")
        history_get = success and "history" in response
        self.log_test("GET History", history_get,
                     f"History retrieved: {len(response.get('history', [])) if success else 'Failed'} entries", critical=True)
        
        # Test GET history stats
        success, response, status = self.make_request("GET", "/history/stats")
        stats_get = success and isinstance(response, dict) and "totalPlays" in response
        self.log_test("GET History Stats", stats_get,
                     f"Stats retrieved: totalPlays={response.get('totalPlays') if success else 'Failed'}", critical=True)
        
        # Test history with pagination
        success, response, status = self.make_request("GET", "/history", params={"limit": 10, "offset": 0})
        pagination_working = success and "history" in response
        self.log_test("History Pagination", pagination_working,
                     f"Pagination working: {success}", critical=False)

    def test_favorites_functionality(self):
        """Test favorites APIs"""
        print("\n❤️ FAVORITES FUNCTIONALITY")
        print("=" * 60)
        
        # Test GET favorite playlists
        success, response, status = self.make_request("GET", "/favorites/playlists")
        fav_playlists = success and "playlists" in response and "count" in response
        self.log_test("GET Favorite Playlists", fav_playlists,
                     f"Favorite playlists: {response.get('count') if success else 'Failed'}", critical=True)
        
        # Test GET favorite tracks
        success, response, status = self.make_request("GET", "/favorites/tracks")
        fav_tracks = success and "tracks" in response and "count" in response
        self.log_test("GET Favorite Tracks", fav_tracks,
                     f"Favorite tracks: {response.get('count') if success else 'Failed'}", critical=True)
        
        # Test GET all favorites
        success, response, status = self.make_request("GET", "/favorites/all")
        all_favorites = success and "favorites" in response and "counts" in response
        self.log_test("GET All Favorites", all_favorites,
                     f"All favorites summary: {success}", critical=True)

    def test_sharing_functionality(self):
        """Test sharing APIs with existing playlists"""
        print("\n🔗 SHARING FUNCTIONALITY")
        print("=" * 60)
        
        # Get existing playlists
        success, response, status = self.make_request("GET", "/playlists")
        existing_playlists = response if success and isinstance(response, list) else []
        
        if existing_playlists:
            playlist_id = existing_playlists[0]["id"]
            
            # Test share token generation
            success, response, status = self.make_request("POST", f"/playlists/{playlist_id}/share")
            share_token = response.get("shareToken") if success else None
            self.log_test("Generate Share Token", success and share_token,
                         f"Share token generated: {share_token[:8] + '...' if share_token else 'Failed'}", critical=False)
            
            if share_token:
                # Test view shared playlist
                success, response, status = self.make_request("GET", f"/playlists/shared/{share_token}")
                shared_view = success and "playlist" in response
                self.log_test("View Shared Playlist", shared_view,
                             f"Shared playlist viewed: {response.get('playlist', {}).get('name') if success else 'Failed'}", critical=False)
            
            # Test toggle public
            success, response, status = self.make_request("PUT", f"/playlists/{playlist_id}/toggle-public")
            public_toggle = success and "isPublic" in response
            self.log_test("Toggle Public Status", public_toggle,
                         f"Public toggle: {response.get('isPublic') if success else 'Failed'}", critical=False)
            
            # Test toggle collaborative
            success, response, status = self.make_request("PUT", f"/playlists/{playlist_id}/toggle-collaborative")
            collab_toggle = success and "isCollaborative" in response
            self.log_test("Toggle Collaborative", collab_toggle,
                         f"Collaborative toggle: {response.get('isCollaborative') if success else 'Failed'}", critical=False)
        
        # Test GET public playlists
        success, response, status = self.make_request("GET", "/playlists/public")
        public_playlists = success and isinstance(response, list)
        self.log_test("GET Public Playlists", public_playlists,
                     f"Public playlists: {len(response) if isinstance(response, list) else 'Failed'}", critical=False)

    def test_static_file_serving(self):
        """Test static file serving"""
        print("\n📁 STATIC FILE SERVING")
        print("=" * 60)
        
        # Test image route accessibility
        try:
            response = requests.get(f"{BASE_URL}/uploads/covers/test.jpg", timeout=10)
            image_accessible = response.status_code in [200, 404]  # Both acceptable
            self.log_test("Image Upload Route", image_accessible,
                         f"Image route accessible (status: {response.status_code})", critical=True)
        except Exception as e:
            self.log_test("Image Upload Route", False, f"Image route error: {str(e)}", critical=True)
        
        # Test audio route accessibility
        try:
            response = requests.get(f"{BASE_URL}/uploads/audio/test.mp3", timeout=10)
            audio_accessible = response.status_code in [200, 404]  # Both acceptable
            self.log_test("Audio Upload Route", audio_accessible,
                         f"Audio route accessible (status: {response.status_code})", critical=True)
        except Exception as e:
            self.log_test("Audio Upload Route", False, f"Audio route error: {str(e)}", critical=True)

    def test_error_handling(self):
        """Test API error handling"""
        print("\n⚠️ ERROR HANDLING")
        print("=" * 60)
        
        # Test 404 error handling
        error_tests = [
            ("GET", "/playlists/non-existent-playlist-id", 404, "Non-existent playlist"),
            ("GET", "/playlists/invalid-id/tracks", 404, "Tracks for invalid playlist"),
            ("GET", "/library/tracks/non-existent-track-id", 404, "Non-existent track details"),
            ("POST", "/favorites/playlists/invalid-playlist-id", 404, "Favorite invalid playlist"),
            ("GET", "/playlists/shared/invalid-share-token", 404, "Invalid share token")
        ]
        
        for method, endpoint, expected_status, description in error_tests:
            success, response, status = self.make_request(method, endpoint)
            error_handled = not success and status == expected_status
            self.log_test(f"Error Handling - {description}", error_handled,
                         f"Expected {expected_status}, got {status}", critical=False)

    def test_data_integrity(self):
        """Test data integrity and relationships"""
        print("\n🔍 DATA INTEGRITY")
        print("=" * 60)
        
        # Test library tracks have proper enrichment
        success, response, status = self.make_request("GET", "/library/tracks")
        if success and response.get("tracks"):
            tracks = response["tracks"]
            if tracks:
                first_track = tracks[0]
                has_enrichment = (
                    "playlistName" in first_track and
                    "songName" in first_track and
                    "artist" in first_track
                )
                self.log_test("Track Data Enrichment", has_enrichment,
                             f"Tracks properly enriched with playlist data: {has_enrichment}", critical=False)
        
        # Test settings data structure
        success, response, status = self.make_request("GET", "/settings")
        if success:
            required_fields = ["theme", "volume", "autoPlay", "quality"]
            has_required_fields = all(field in response for field in required_fields)
            self.log_test("Settings Data Structure", has_required_fields,
                         f"Settings has all required fields: {has_required_fields}", critical=False)

    def run_comprehensive_test(self):
        """Run all deployment readiness tests"""
        print("🚀 COMPREHENSIVE DEPLOYMENT READINESS TESTING")
        print("🎯 Music Playlist Manager - Production Deployment Assessment")
        print("=" * 80)
        print()
        
        # Run all test categories
        self.test_core_functionality()
        self.test_library_functionality()
        self.test_settings_functionality()
        self.test_history_functionality()
        self.test_favorites_functionality()
        self.test_sharing_functionality()
        self.test_static_file_serving()
        self.test_error_handling()
        self.test_data_integrity()
        
        # Generate comprehensive report
        self.generate_deployment_report()

    def generate_deployment_report(self):
        """Generate comprehensive deployment readiness report"""
        print("\n" + "=" * 80)
        print("📊 COMPREHENSIVE DEPLOYMENT READINESS REPORT")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        critical_failures = len(self.critical_failures)
        minor_issues = len(self.minor_issues)
        
        print(f"📈 OVERALL METRICS:")
        print(f"   Total Tests: {total_tests}")
        print(f"   Passed: {passed_tests} ✅")
        print(f"   Failed: {failed_tests} ❌")
        print(f"   Success Rate: {success_rate:.1f}%")
        print(f"   Critical Failures: {critical_failures} 🔴")
        print(f"   Minor Issues: {minor_issues} ⚠️")
        print()
        
        # Deployment readiness assessment
        if critical_failures == 0 and success_rate >= 95:
            deployment_status = "🟢 READY FOR PRODUCTION DEPLOYMENT"
            recommendation = "All critical systems operational. Excellent deployment readiness."
        elif critical_failures == 0 and success_rate >= 90:
            deployment_status = "🟢 READY FOR DEPLOYMENT"
            recommendation = "Core systems working well. Minor issues can be addressed post-deployment."
        elif critical_failures <= 2 and success_rate >= 85:
            deployment_status = "🟡 DEPLOYMENT WITH MONITORING"
            recommendation = "Most systems working. Monitor critical issues closely after deployment."
        elif critical_failures <= 5 and success_rate >= 75:
            deployment_status = "🟠 DEPLOYMENT WITH CAUTION"
            recommendation = "Several issues present. Consider fixing critical issues before deployment."
        else:
            deployment_status = "🔴 NOT READY FOR DEPLOYMENT"
            recommendation = "Too many critical issues. Fix major problems before deployment."
        
        print(f"🎯 DEPLOYMENT STATUS: {deployment_status}")
        print(f"💡 RECOMMENDATION: {recommendation}")
        print()
        
        # Feature functionality breakdown
        feature_categories = {
            "Core Database & Playlists": ["Database Connection", "GET All Playlists", "GET Single Playlist", "GET Playlist Tracks", "GET Single Track"],
            "Content Library": ["Library Tracks API", "Library Artists API", "Library Albums API", "Library Stats API"],
            "User Settings": ["GET Settings", "UPDATE Settings Theme", "UPDATE Settings Volume"],
            "Listen History": ["GET History", "GET History Stats", "History Pagination"],
            "Favorites System": ["GET Favorite Playlists", "GET Favorite Tracks", "GET All Favorites"],
            "Playlist Sharing": ["Generate Share Token", "View Shared Playlist", "Toggle Public Status", "Toggle Collaborative", "GET Public Playlists"],
            "File Management": ["Image Upload Route", "Audio Upload Route"],
            "Error Handling": ["Error Handling - Non-existent playlist", "Error Handling - Tracks for invalid playlist", "Error Handling - Non-existent track details"],
            "Data Quality": ["Track Data Enrichment", "Settings Data Structure"]
        }
        
        print("📋 FEATURE FUNCTIONALITY REPORT:")
        print("-" * 60)
        
        for category, test_names in feature_categories.items():
            category_results = [r for r in self.test_results if r["test"] in test_names]
            if category_results:
                category_passed = sum(1 for r in category_results if r["success"])
                category_total = len(category_results)
                category_rate = (category_passed / category_total * 100) if category_total > 0 else 0
                
                # Determine status icon
                if category_rate == 100:
                    status_icon = "✅"
                elif category_rate >= 80:
                    status_icon = "⚠️"
                else:
                    status_icon = "❌"
                
                # Check for critical failures in this category
                category_critical = any(r for r in category_results if not r["success"] and r.get("critical", False))
                if category_critical:
                    status_icon = "🔴"
                
                print(f"{status_icon} {category}: {category_passed}/{category_total} ({category_rate:.0f}%)")
        
        print()
        
        # Critical issues section
        if self.critical_failures:
            print("🔴 CRITICAL ISSUES REQUIRING IMMEDIATE ATTENTION:")
            print("-" * 60)
            for failure in self.critical_failures:
                print(f"• {failure['test']}")
                print(f"  → {failure['details']}")
            print()
        
        # Minor issues section
        if self.minor_issues:
            print("⚠️ MINOR ISSUES (Can be addressed post-deployment):")
            print("-" * 60)
            for issue in self.minor_issues:
                print(f"• {issue['test']}")
                print(f"  → {issue['details']}")
            print()
        
        # Working systems summary
        working_categories = []
        for category, test_names in feature_categories.items():
            category_results = [r for r in self.test_results if r["test"] in test_names]
            if category_results:
                category_passed = sum(1 for r in category_results if r["success"])
                category_total = len(category_results)
                if category_passed == category_total:
                    working_categories.append(category)
        
        if working_categories:
            print("✅ FULLY FUNCTIONAL SYSTEMS:")
            print("-" * 60)
            for category in working_categories:
                print(f"• {category}")
            print()
        
        # Final deployment score
        deployment_score = success_rate - (critical_failures * 10) - (minor_issues * 2)
        deployment_score = max(0, min(100, deployment_score))  # Clamp between 0-100
        
        print(f"🏆 DEPLOYMENT READINESS SCORE: {deployment_score:.1f}/100")
        print()
        print("=" * 80)

if __name__ == "__main__":
    tester = ComprehensiveDeploymentTester()
    tester.run_comprehensive_test()
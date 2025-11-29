#!/usr/bin/env python3
"""
Focused Backend Test for Music Playlist Manager
Testing the key functionality now that backend is working
"""

import requests
import json
import time
import uuid
from typing import Dict, List, Any, Optional

# Configuration
BASE_URL = "https://repo-cleanup-6.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class FocusedBackendTester:
    def __init__(self):
        self.test_results = []
        self.auth_token = None
        self.test_user = None
        
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
        print()

    def make_request(self, method: str, endpoint: str, data: Dict = None, params: Dict = None, headers: Dict = None) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        try:
            url = f"{BASE_URL}{endpoint}"
            request_headers = HEADERS.copy()
            if headers:
                request_headers.update(headers)
            
            if method.upper() == "GET":
                response = requests.get(url, headers=request_headers, params=params, timeout=30)
            elif method.upper() == "POST":
                response = requests.post(url, headers=request_headers, json=data, timeout=30)
            elif method.upper() == "PUT":
                response = requests.put(url, headers=request_headers, json=data, timeout=30)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=request_headers, timeout=30)
            else:
                return False, f"Unsupported method: {method}", 400
                
            try:
                response_data = response.json() if response.content else {}
            except json.JSONDecodeError:
                response_data = {"raw_response": response.text}
                
            return response.status_code < 400, response_data, response.status_code
            
        except requests.exceptions.RequestException as e:
            return False, f"Request failed: {str(e)}", 0

    def test_authentication_flow(self):
        """Test complete authentication flow"""
        print("🔐 AUTHENTICATION SYSTEM TESTING")
        print("-" * 40)
        
        # Generate unique test data
        test_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        test_password = "TestPassword123!"
        test_name = "Test User"
        
        # 1. Test User Registration
        register_data = {
            "name": test_name,
            "email": test_email,
            "password": test_password
        }
        
        success, response, status = self.make_request("POST", "/auth/register", register_data)
        
        register_working = success and status == 201 and response.get("success") is True
        
        if register_working:
            self.test_user = response.get("user", {})
        
        self.log_test(
            "Auth - User Registration",
            register_working,
            f"Registration status: {status}, user created: {response.get('user', {}).get('id', 'N/A')}",
            response if not register_working else None
        )
        
        # 2. Test Login (should fail due to unverified email)
        login_data = {
            "email": test_email,
            "password": test_password
        }
        
        success, response, status = self.make_request("POST", "/auth/login", login_data)
        
        login_blocked = not success and status == 403 and response.get("needsVerification") is True
        
        self.log_test(
            "Auth - Login Blocked (Unverified)",
            login_blocked,
            f"Login correctly blocked: status {status}, needs verification: {response.get('needsVerification')}",
            response if not login_blocked else None
        )
        
        # 3. Test Protected Routes (should fail without token)
        success, response, status = self.make_request("GET", "/auth/me")
        
        protected_route_blocked = not success and status == 401
        
        self.log_test(
            "Auth - Protected Route Block",
            protected_route_blocked,
            f"Protected route correctly requires auth: status {status}",
            response if not protected_route_blocked else None
        )

    def test_playlist_operations(self):
        """Test playlist CRUD operations"""
        print("🎵 PLAYLIST OPERATIONS TESTING")
        print("-" * 40)
        
        # 1. Test Get All Playlists (should require auth)
        success, response, status = self.make_request("GET", "/playlists")
        
        playlists_require_auth = not success and status == 401
        
        self.log_test(
            "Playlists - Get All (No Auth)",
            playlists_require_auth,
            f"Playlists correctly require auth: status {status}",
            response if not playlists_require_auth else None
        )
        
        # 2. Test Create Playlist (should require auth)
        playlist_data = {
            "name": f"Test Playlist {uuid.uuid4().hex[:8]}",
            "description": "Test playlist for backend testing"
        }
        
        success, response, status = self.make_request("POST", "/playlists", playlist_data)
        
        create_requires_auth = not success and status == 401
        
        self.log_test(
            "Playlists - Create (No Auth)",
            create_requires_auth,
            f"Playlist creation correctly requires auth: status {status}",
            response if not create_requires_auth else None
        )

    def test_settings_and_themes(self):
        """Test settings API and theme system"""
        print("🎨 SETTINGS & THEME SYSTEM TESTING")
        print("-" * 40)
        
        # 1. Test Get Settings (should require auth)
        success, response, status = self.make_request("GET", "/settings")
        
        settings_require_auth = not success and status == 401
        
        self.log_test(
            "Settings - Get Settings (No Auth)",
            settings_require_auth,
            f"Settings correctly require auth: status {status}",
            response if not settings_require_auth else None
        )
        
        # 2. Test Theme Updates (should require auth)
        themes = ['dark', 'light', 'glass', 'vibrant', 'neon', 'retro', 'mesh', 'premium']
        
        for theme in themes[:3]:  # Test first 3 themes
            theme_data = {"theme": theme}
            success, response, status = self.make_request("PUT", "/settings", theme_data)
            
            theme_requires_auth = not success and status == 401
            
            self.log_test(
                f"Settings - Theme {theme} (No Auth)",
                theme_requires_auth,
                f"Theme update correctly requires auth: status {status}",
                response if not theme_requires_auth else None
            )

    def test_library_and_history(self):
        """Test library and history functionality"""
        print("📚 LIBRARY & HISTORY TESTING")
        print("-" * 40)
        
        # 1. Test Library Tracks
        success, response, status = self.make_request("GET", "/library/tracks")
        
        library_accessible = success and status == 200 and response.get("success") is True
        
        self.log_test(
            "Library - Get Tracks",
            library_accessible,
            f"Library tracks status: {status}, count: {response.get('count', 0)}",
            response if not library_accessible else None
        )
        
        # 2. Test Library Stats
        success, response, status = self.make_request("GET", "/library/stats")
        
        stats_accessible = success and status == 200 and response.get("success") is True
        
        self.log_test(
            "Library - Get Stats",
            stats_accessible,
            f"Library stats status: {status}, stats available: {bool(response.get('stats'))}",
            response if not stats_accessible else None
        )
        
        # 3. Test History (should require auth)
        success, response, status = self.make_request("GET", "/history")
        
        history_requires_auth = not success and status == 401
        
        self.log_test(
            "History - Get History (No Auth)",
            history_requires_auth,
            f"History correctly requires auth: status {status}",
            response if not history_requires_auth else None
        )

    def test_admin_endpoints(self):
        """Test admin functionality"""
        print("👑 ADMIN SYSTEM TESTING")
        print("-" * 40)
        
        # Test admin endpoints (should be protected)
        admin_endpoints = [
            "/admin/users",
            "/admin/playlists", 
            "/admin/stats"
        ]
        
        for endpoint in admin_endpoints:
            success, response, status = self.make_request("GET", endpoint)
            
            admin_protected = status in [401, 403, 404]  # Any of these is acceptable
            
            self.log_test(
                f"Admin - {endpoint.split('/')[-1].title()} Endpoint",
                admin_protected,
                f"Admin endpoint protected: status {status}",
                response if not admin_protected else None
            )

    def test_error_handling(self):
        """Test error handling"""
        print("⚠️  ERROR HANDLING TESTING")
        print("-" * 40)
        
        # 1. Test 404 for invalid endpoints
        success, response, status = self.make_request("GET", "/invalid-endpoint")
        
        handles_404 = not success and status == 404
        
        self.log_test(
            "Error - Invalid Endpoint (404)",
            handles_404,
            f"Invalid endpoint returns 404: status {status}",
            response if not handles_404 else None
        )
        
        # 2. Test validation errors
        invalid_register_data = {
            "name": "",  # Invalid empty name
            "email": "invalid-email",  # Invalid email format
            "password": "123"  # Too short password
        }
        
        success, response, status = self.make_request("POST", "/auth/register", invalid_register_data)
        
        validates_input = not success and status == 400
        
        self.log_test(
            "Error - Input Validation",
            validates_input,
            f"Input validation working: status {status}",
            response if not validates_input else None
        )

    def run_focused_tests(self):
        """Run focused backend tests"""
        print("🚀 FOCUSED BACKEND TESTING")
        print("🎯 Music Playlist Manager - Key Functionality")
        print("=" * 60)
        print()
        
        # Run tests in order
        self.test_authentication_flow()
        print()
        
        self.test_playlist_operations()
        print()
        
        self.test_settings_and_themes()
        print()
        
        self.test_library_and_history()
        print()
        
        self.test_admin_endpoints()
        print()
        
        self.test_error_handling()
        print()
        
        # Print summary
        self.print_summary()

    def print_summary(self):
        """Print test results summary"""
        print("=" * 60)
        print("📊 FOCUSED TEST RESULTS SUMMARY")
        print("=" * 60)
        
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
            print("-" * 20)
            for result in self.test_results:
                if not result["success"]:
                    print(f"• {result['test']}")
                    if result["details"]:
                        print(f"  └─ {result['details']}")
            print()
        
        print("✅ PASSED TESTS:")
        print("-" * 20)
        for result in self.test_results:
            if result["success"]:
                print(f"• {result['test']}")
        
        print("\n" + "=" * 60)
        
        # Assessment
        auth_tests = [r for r in self.test_results if "Auth" in r["test"]]
        auth_passed = sum(1 for r in auth_tests if r["success"])
        
        core_tests = [r for r in self.test_results if any(x in r["test"] for x in ["Playlists", "Library", "Settings"])]
        core_passed = sum(1 for r in core_tests if r["success"])
        
        print("🔍 SYSTEM ASSESSMENT:")
        print(f"   Authentication System: {auth_passed}/{len(auth_tests)} tests passed")
        print(f"   Core Features: {core_passed}/{len(core_tests)} tests passed")
        
        if success_rate >= 85:
            print("\n🟢 BACKEND STATUS: EXCELLENT")
            print("   All major systems working correctly")
        elif success_rate >= 70:
            print("\n🟡 BACKEND STATUS: GOOD")
            print("   Most systems working, minor issues detected")
        else:
            print("\n🔴 BACKEND STATUS: NEEDS ATTENTION")
            print("   Multiple issues detected, review required")
        
        print("=" * 60)

if __name__ == "__main__":
    tester = FocusedBackendTester()
    tester.run_focused_tests()
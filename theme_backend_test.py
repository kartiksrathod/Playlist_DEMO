#!/usr/bin/env python3
"""
Theme Toggle Backend API Testing for Music Playlist Manager
Tests the UserSettings model theme field and settings API endpoints
"""

import requests
import json
import uuid

# Configuration
BASE_URL = "https://music-favorites-hub.preview.emergentagent.com/api"

class ThemeToggleAPITester:
    def __init__(self):
        self.session = requests.Session()
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
            response = self.session.get(f"{BASE_URL}/settings", timeout=10)
            if response.status_code in [200, 404]:  # 404 is ok, means endpoint exists
                self.log_result("Health Check", True, f"Backend API responding: {response.status_code}")
                return True
            else:
                self.log_result("Health Check", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_result("Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def test_get_settings_default_theme(self):
        """Test GET /api/settings returns default theme"""
        try:
            response = self.session.get(f"{BASE_URL}/settings")
            if response.status_code == 200:
                settings = response.json()
                required_fields = ['id', 'volume', 'autoPlay', 'shuffle', 'repeat', 'theme', 'lastUpdated']
                
                # Validate response structure
                missing_fields = [field for field in required_fields if field not in settings]
                if missing_fields:
                    self.log_result("GET Settings (Default Theme)", False, f"Missing fields: {missing_fields}")
                    return None
                
                # Validate default theme
                if settings['theme'] != 'dark':
                    self.log_result("GET Settings (Default Theme)", False, f"Expected default theme 'dark', got '{settings['theme']}'")
                    return None
                
                self.log_result("GET Settings (Default Theme)", True, f"Default theme correctly set to 'dark'")
                return settings
            else:
                self.log_result("GET Settings (Default Theme)", False, f"Status: {response.status_code}, Response: {response.text}")
                return None
        except Exception as e:
            self.log_result("GET Settings (Default Theme)", False, f"Error: {str(e)}")
            return None
    
    def test_update_theme_valid_options(self):
        """Test PUT /api/settings with all valid theme options"""
        valid_themes = ['dark', 'light', 'glass', 'vibrant', 'neon', 'retro', 'mesh', 'premium']
        
        for theme in valid_themes:
            try:
                update_data = {'theme': theme}
                response = self.session.put(f"{BASE_URL}/settings", json=update_data)
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get('settings', {}).get('theme') == theme:
                        self.log_result(f"Update Theme ({theme})", True, f"Successfully updated theme to '{theme}'")
                    else:
                        self.log_result(f"Update Theme ({theme})", False, f"Theme not updated correctly: {result}")
                else:
                    self.log_result(f"Update Theme ({theme})", False, f"Status: {response.status_code}, Response: {response.text}")
            except Exception as e:
                self.log_result(f"Update Theme ({theme})", False, f"Error: {str(e)}")
    
    def test_update_theme_invalid_option(self):
        """Test PUT /api/settings with invalid theme option"""
        try:
            update_data = {'theme': 'invalid_theme'}
            response = self.session.put(f"{BASE_URL}/settings", json=update_data)
            
            if response.status_code == 400:
                self.log_result("Update Theme (Invalid)", True, "Correctly rejected invalid theme")
            else:
                self.log_result("Update Theme (Invalid)", False, f"Expected 400, got {response.status_code}")
        except Exception as e:
            self.log_result("Update Theme (Invalid)", False, f"Error: {str(e)}")
    
    def test_theme_persistence(self):
        """Test that theme persists across requests"""
        try:
            # Set theme to 'light'
            update_data = {'theme': 'light'}
            response = self.session.put(f"{BASE_URL}/settings", json=update_data)
            
            if response.status_code != 200:
                self.log_result("Theme Persistence", False, f"Failed to set theme: {response.status_code}")
                return False
            
            # Fetch settings to verify persistence
            get_response = self.session.get(f"{BASE_URL}/settings")
            
            if get_response.status_code == 200:
                settings = get_response.json()
                if settings.get('theme') == 'light':
                    # Update to another theme
                    update_data2 = {'theme': 'neon'}
                    response2 = self.session.put(f"{BASE_URL}/settings", json=update_data2)
                    
                    if response2.status_code == 200:
                        # Fetch again to verify new theme persists
                        get_response2 = self.session.get(f"{BASE_URL}/settings")
                        
                        if get_response2.status_code == 200:
                            settings2 = get_response2.json()
                            if settings2.get('theme') == 'neon':
                                self.log_result("Theme Persistence", True, "Theme persists correctly across requests")
                                return True
                            else:
                                self.log_result("Theme Persistence", False, f"Second theme not persisted: {settings2.get('theme')}")
                                return False
                        else:
                            self.log_result("Theme Persistence", False, f"Failed to fetch settings after second update: {get_response2.status_code}")
                            return False
                    else:
                        self.log_result("Theme Persistence", False, f"Failed to update to second theme: {response2.status_code}")
                        return False
                else:
                    self.log_result("Theme Persistence", False, f"First theme not persisted: {settings.get('theme')}")
                    return False
            else:
                self.log_result("Theme Persistence", False, f"Failed to fetch settings: {get_response.status_code}")
                return False
        except Exception as e:
            self.log_result("Theme Persistence", False, f"Error: {str(e)}")
            return False
    
    def test_reset_settings_theme_default(self):
        """Test POST /api/settings/reset resets theme to default"""
        try:
            # First set theme to something other than default
            update_data = {'theme': 'premium'}
            response = self.session.put(f"{BASE_URL}/settings", json=update_data)
            
            if response.status_code != 200:
                self.log_result("Reset Settings Theme", False, f"Failed to set initial theme: {response.status_code}")
                return False
            
            # Reset settings
            reset_response = self.session.post(f"{BASE_URL}/settings/reset")
            
            if reset_response.status_code == 200:
                result = reset_response.json()
                if result.get('settings', {}).get('theme') == 'dark':
                    # Verify by fetching settings
                    get_response = self.session.get(f"{BASE_URL}/settings")
                    if get_response.status_code == 200:
                        settings = get_response.json()
                        if settings.get('theme') == 'dark':
                            self.log_result("Reset Settings Theme", True, "Theme correctly reset to 'dark'")
                            return True
                        else:
                            self.log_result("Reset Settings Theme", False, f"Theme not reset correctly: {settings.get('theme')}")
                            return False
                    else:
                        self.log_result("Reset Settings Theme", False, f"Failed to fetch settings after reset: {get_response.status_code}")
                        return False
                else:
                    self.log_result("Reset Settings Theme", False, f"Reset response theme incorrect: {result.get('settings', {}).get('theme')}")
                    return False
            else:
                self.log_result("Reset Settings Theme", False, f"Status: {reset_response.status_code}, Response: {reset_response.text}")
                return False
        except Exception as e:
            self.log_result("Reset Settings Theme", False, f"Error: {str(e)}")
            return False
    
    def test_partial_update_theme_only(self):
        """Test updating only theme field while preserving other settings"""
        try:
            # First set some initial settings
            initial_data = {
                'volume': 85,
                'autoPlay': False,
                'theme': 'light'
            }
            response = self.session.put(f"{BASE_URL}/settings", json=initial_data)
            
            if response.status_code != 200:
                self.log_result("Partial Update Theme", False, f"Failed to set initial settings: {response.status_code}")
                return False
            
            # Update only theme
            theme_update = {'theme': 'vibrant'}
            response2 = self.session.put(f"{BASE_URL}/settings", json=theme_update)
            
            if response2.status_code == 200:
                # Fetch settings to verify other fields preserved
                get_response = self.session.get(f"{BASE_URL}/settings")
                
                if get_response.status_code == 200:
                    settings = get_response.json()
                    
                    # Check theme updated
                    if settings.get('theme') != 'vibrant':
                        self.log_result("Partial Update Theme", False, f"Theme not updated: {settings.get('theme')}")
                        return False
                    
                    # Check other settings preserved
                    if settings.get('volume') != 85:
                        self.log_result("Partial Update Theme", False, f"Volume not preserved: {settings.get('volume')}")
                        return False
                    
                    if settings.get('autoPlay') != False:
                        self.log_result("Partial Update Theme", False, f"AutoPlay not preserved: {settings.get('autoPlay')}")
                        return False
                    
                    self.log_result("Partial Update Theme", True, "Theme updated while preserving other settings")
                    return True
                else:
                    self.log_result("Partial Update Theme", False, f"Failed to fetch settings: {get_response.status_code}")
                    return False
            else:
                self.log_result("Partial Update Theme", False, f"Status: {response2.status_code}, Response: {response2.text}")
                return False
        except Exception as e:
            self.log_result("Partial Update Theme", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all theme-related tests"""
        print("🚀 Starting Theme Toggle Backend API Testing for Music Playlist Manager")
        print("=" * 80)
        
        # Health check first
        if not self.test_health_check():
            print("❌ Backend is not responding. Aborting tests.")
            return
        
        print("\n" + "=" * 50)
        print("THEME TOGGLE SYSTEM TESTS")
        print("=" * 50)
        
        # Test 1: Default theme
        print("\n1️⃣ Testing GET /api/settings - Default Theme...")
        self.test_get_settings_default_theme()
        
        # Test 2: All valid theme options
        print("\n2️⃣ Testing PUT /api/settings - All Valid Themes...")
        self.test_update_theme_valid_options()
        
        # Test 3: Invalid theme
        print("\n3️⃣ Testing PUT /api/settings - Invalid Theme...")
        self.test_update_theme_invalid_option()
        
        # Test 4: Theme persistence
        print("\n4️⃣ Testing Theme Persistence Across Requests...")
        self.test_theme_persistence()
        
        # Test 5: Reset functionality
        print("\n5️⃣ Testing POST /api/settings/reset - Theme Reset...")
        self.test_reset_settings_theme_default()
        
        # Test 6: Partial updates
        print("\n6️⃣ Testing Partial Theme Update...")
        self.test_partial_update_theme_only()
        
        # Final results
        print("\n" + "=" * 80)
        print("🏁 THEME TOGGLE BACKEND TESTING COMPLETE")
        print("=" * 80)
        print(f"✅ PASSED: {self.test_results['passed']}")
        print(f"❌ FAILED: {self.test_results['failed']}")
        
        if self.test_results['errors']:
            print(f"\n🔍 FAILED TESTS:")
            for error in self.test_results['errors']:
                print(f"   • {error}")
        
        success_rate = (self.test_results['passed'] / (self.test_results['passed'] + self.test_results['failed'])) * 100 if (self.test_results['passed'] + self.test_results['failed']) > 0 else 0
        print(f"\n📊 SUCCESS RATE: {success_rate:.1f}%")
        
        if success_rate >= 95:
            print("🎉 EXCELLENT! Theme Toggle backend is production ready!")
        elif success_rate >= 85:
            print("✅ GOOD! Minor issues to address.")
        else:
            print("⚠️  NEEDS ATTENTION! Several issues found.")
        
        return success_rate >= 95


if __name__ == "__main__":
    tester = ThemeToggleAPITester()
    success = tester.run_all_tests()
    
    if success:
        print(f"\n🎉 All Theme Toggle tests passed! Backend API is working correctly.")
        exit(0)
    else:
        print(f"\n💥 Some tests failed. Check the errors above.")
        exit(1)
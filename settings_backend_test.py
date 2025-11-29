#!/usr/bin/env python3
"""
Settings Backend API Testing for Music Playlist Manager
Tests all settings endpoints with comprehensive validation
"""

import requests
import json
import time

# Configuration
BASE_URL = "https://admin-music-control.preview.emergentagent.com/api"

class SettingsAPITester:
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
    
    def test_get_settings_default(self):
        """Test GET /api/settings - should return default settings"""
        try:
            response = self.session.get(f"{BASE_URL}/settings")
            if response.status_code == 200:
                settings = response.json()
                
                # Check required fields
                required_fields = ['id', 'volume', 'autoPlay', 'autoShuffle', 'shuffle', 'repeat', 'crossfade', 'quality', 'notifications', 'theme', 'lastUpdated']
                missing_fields = [field for field in required_fields if field not in settings]
                if missing_fields:
                    self.log_result("GET Settings (Default)", False, f"Missing fields: {missing_fields}")
                    return None
                
                # Check default values
                expected_defaults = {
                    'volume': 75,
                    'autoPlay': True,
                    'autoShuffle': False,
                    'shuffle': False,
                    'repeat': 'off',
                    'crossfade': False,
                    'quality': 'high',
                    'notifications': True,
                    'theme': 'dark'
                }
                
                for field, expected_value in expected_defaults.items():
                    if settings[field] != expected_value:
                        self.log_result("GET Settings (Default)", False, f"{field} default mismatch: expected {expected_value}, got {settings[field]}")
                        return None
                
                self.log_result("GET Settings (Default)", True, "All default settings returned correctly")
                return settings
            else:
                self.log_result("GET Settings (Default)", False, f"Status: {response.status_code}, Response: {response.text}")
                return None
        except Exception as e:
            self.log_result("GET Settings (Default)", False, f"Error: {str(e)}")
            return None
    
    def test_update_settings_individual_fields(self):
        """Test PUT /api/settings - update individual fields"""
        test_cases = [
            # Volume tests
            {'volume': 50, 'expected': 50, 'description': 'Volume to 50'},
            {'volume': 0, 'expected': 0, 'description': 'Volume to 0 (minimum)'},
            {'volume': 100, 'expected': 100, 'description': 'Volume to 100 (maximum)'},
            
            # Boolean toggles
            {'autoPlay': False, 'expected': False, 'description': 'AutoPlay to false'},
            {'autoShuffle': True, 'expected': True, 'description': 'AutoShuffle to true'},
            {'crossfade': True, 'expected': True, 'description': 'Crossfade to true'},
            {'notifications': False, 'expected': False, 'description': 'Notifications to false'},
            
            # Quality options
            {'quality': 'low', 'expected': 'low', 'description': 'Quality to low'},
            {'quality': 'medium', 'expected': 'medium', 'description': 'Quality to medium'},
            {'quality': 'high', 'expected': 'high', 'description': 'Quality to high'},
            
            # Repeat options
            {'repeat': 'one', 'expected': 'one', 'description': 'Repeat to one'},
            {'repeat': 'all', 'expected': 'all', 'description': 'Repeat to all'},
            {'repeat': 'off', 'expected': 'off', 'description': 'Repeat to off'},
            
            # Theme options
            {'theme': 'light', 'expected': 'light', 'description': 'Theme to light'},
            {'theme': 'glass', 'expected': 'glass', 'description': 'Theme to glass'},
            {'theme': 'vibrant', 'expected': 'vibrant', 'description': 'Theme to vibrant'},
            {'theme': 'neon', 'expected': 'neon', 'description': 'Theme to neon'},
            {'theme': 'retro', 'expected': 'retro', 'description': 'Theme to retro'},
            {'theme': 'mesh', 'expected': 'mesh', 'description': 'Theme to mesh'},
            {'theme': 'premium', 'expected': 'premium', 'description': 'Theme to premium'},
            {'theme': 'dark', 'expected': 'dark', 'description': 'Theme back to dark'},
        ]
        
        for test_case in test_cases:
            try:
                field_name = list(test_case.keys())[0]  # Get the field being tested
                field_value = test_case[field_name]
                expected_value = test_case['expected']
                description = test_case['description']
                
                response = self.session.put(f"{BASE_URL}/settings", json={field_name: field_value})
                
                if response.status_code == 200:
                    data = response.json()
                    if 'settings' in data and data['settings'][field_name] == expected_value:
                        self.log_result(f"Update Settings ({description})", True, f"Successfully updated {field_name} to {field_value}")
                    else:
                        self.log_result(f"Update Settings ({description})", False, f"Field not updated correctly: {data}")
                else:
                    self.log_result(f"Update Settings ({description})", False, f"Status: {response.status_code}, Response: {response.text}")
            except Exception as e:
                self.log_result(f"Update Settings ({description})", False, f"Error: {str(e)}")
    
    def test_update_settings_multiple_fields(self):
        """Test PUT /api/settings - update multiple fields at once"""
        try:
            update_data = {
                'volume': 85,
                'autoPlay': False,
                'quality': 'medium',
                'theme': 'vibrant',
                'notifications': False
            }
            
            response = self.session.put(f"{BASE_URL}/settings", json=update_data)
            
            if response.status_code == 200:
                data = response.json()
                if 'settings' in data:
                    settings = data['settings']
                    all_correct = True
                    
                    for field, expected_value in update_data.items():
                        if settings[field] != expected_value:
                            self.log_result("Update Settings (Multiple Fields)", False, f"{field} not updated: expected {expected_value}, got {settings[field]}")
                            all_correct = False
                            break
                    
                    if all_correct:
                        self.log_result("Update Settings (Multiple Fields)", True, "All fields updated correctly")
                        return True
                else:
                    self.log_result("Update Settings (Multiple Fields)", False, f"Invalid response structure: {data}")
                    return False
            else:
                self.log_result("Update Settings (Multiple Fields)", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_result("Update Settings (Multiple Fields)", False, f"Error: {str(e)}")
            return False
    
    def test_settings_validation_errors(self):
        """Test PUT /api/settings validation errors"""
        validation_tests = [
            # Invalid volume
            {'volume': -10, 'description': 'Negative volume'},
            {'volume': 150, 'description': 'Volume over 100'},
            
            # Invalid quality
            {'quality': 'ultra', 'description': 'Invalid quality value'},
            {'quality': 'best', 'description': 'Invalid quality value'},
            
            # Invalid theme
            {'theme': 'rainbow', 'description': 'Invalid theme value'},
            {'theme': 'custom', 'description': 'Invalid theme value'},
            
            # Invalid repeat
            {'repeat': 'always', 'description': 'Invalid repeat value'},
            {'repeat': 'never', 'description': 'Invalid repeat value'},
        ]
        
        for test_case in validation_tests:
            try:
                field_name = list(test_case.keys())[0]  # Get the field being tested
                field_value = test_case[field_name]
                description = test_case['description']
                
                response = self.session.put(f"{BASE_URL}/settings", json={field_name: field_value})
                
                if response.status_code == 400:
                    self.log_result(f"Settings Validation ({description})", True, "Correctly rejected invalid value")
                else:
                    self.log_result(f"Settings Validation ({description})", False, f"Expected 400, got {response.status_code}")
            except Exception as e:
                self.log_result(f"Settings Validation ({description})", False, f"Error: {str(e)}")
    
    def test_settings_persistence(self):
        """Test that settings persist across requests"""
        try:
            # Set specific values
            test_settings = {
                'volume': 42,
                'autoPlay': False,
                'quality': 'low',
                'theme': 'neon',
                'crossfade': True
            }
            
            # Update settings
            update_response = self.session.put(f"{BASE_URL}/settings", json=test_settings)
            if update_response.status_code != 200:
                self.log_result("Settings Persistence", False, f"Failed to update settings: {update_response.status_code}")
                return False
            
            # Fetch settings again
            get_response = self.session.get(f"{BASE_URL}/settings")
            if get_response.status_code != 200:
                self.log_result("Settings Persistence", False, f"Failed to fetch settings: {get_response.status_code}")
                return False
            
            settings = get_response.json()
            
            # Verify all values persisted
            for field, expected_value in test_settings.items():
                if settings[field] != expected_value:
                    self.log_result("Settings Persistence", False, f"{field} not persisted: expected {expected_value}, got {settings[field]}")
                    return False
            
            self.log_result("Settings Persistence", True, "All settings persisted correctly across requests")
            return True
            
        except Exception as e:
            self.log_result("Settings Persistence", False, f"Error: {str(e)}")
            return False
    
    def test_reset_settings(self):
        """Test POST /api/settings/reset"""
        try:
            # First, set some non-default values
            custom_settings = {
                'volume': 25,
                'autoPlay': False,
                'quality': 'low',
                'theme': 'premium',
                'notifications': False
            }
            
            update_response = self.session.put(f"{BASE_URL}/settings", json=custom_settings)
            if update_response.status_code != 200:
                self.log_result("Reset Settings", False, f"Failed to set custom settings: {update_response.status_code}")
                return False
            
            # Reset to defaults
            reset_response = self.session.post(f"{BASE_URL}/settings/reset")
            
            if reset_response.status_code == 200:
                data = reset_response.json()
                if 'settings' in data:
                    settings = data['settings']
                    
                    # Check that all values are back to defaults
                    expected_defaults = {
                        'volume': 75,
                        'autoPlay': True,
                        'autoShuffle': False,
                        'shuffle': False,
                        'repeat': 'off',
                        'crossfade': False,
                        'quality': 'high',
                        'notifications': True,
                        'theme': 'dark'
                    }
                    
                    for field, expected_value in expected_defaults.items():
                        if settings[field] != expected_value:
                            self.log_result("Reset Settings", False, f"{field} not reset: expected {expected_value}, got {settings[field]}")
                            return False
                    
                    self.log_result("Reset Settings", True, "All settings reset to defaults correctly")
                    return True
                else:
                    self.log_result("Reset Settings", False, f"Invalid response structure: {data}")
                    return False
            else:
                self.log_result("Reset Settings", False, f"Status: {reset_response.status_code}, Response: {reset_response.text}")
                return False
                
        except Exception as e:
            self.log_result("Reset Settings", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all settings API tests"""
        print("🚀 Starting Settings Backend API Testing for Music Playlist Manager")
        print("=" * 80)
        
        # Health check first
        if not self.test_health_check():
            print("❌ Backend is not responding. Aborting tests.")
            return
        
        print("\n" + "=" * 50)
        print("SETTINGS API TESTS")
        print("=" * 50)
        
        # Test settings functionality
        self.test_get_settings_default()
        self.test_update_settings_individual_fields()
        self.test_update_settings_multiple_fields()
        self.test_settings_validation_errors()
        self.test_settings_persistence()
        self.test_reset_settings()
        
        # Print summary
        print("\n" + "=" * 80)
        print("🎯 SETTINGS TEST SUMMARY")
        print("=" * 80)
        print(f"✅ Passed: {self.test_results['passed']}")
        print(f"❌ Failed: {self.test_results['failed']}")
        print(f"📊 Success Rate: {(self.test_results['passed'] / (self.test_results['passed'] + self.test_results['failed']) * 100):.1f}%")
        
        if self.test_results['errors']:
            print(f"\n❌ Failed Tests:")
            for error in self.test_results['errors']:
                print(f"   • {error}")
        
        print("\n🏁 Settings Backend API Testing Complete!")
        return self.test_results

if __name__ == "__main__":
    tester = SettingsAPITester()
    tester.run_all_tests()
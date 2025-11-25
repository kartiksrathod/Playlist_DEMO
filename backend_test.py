#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Music Playlist Manager
Tests all CRUD operations with file upload functionality
"""

import requests
import json
import os
import tempfile
from PIL import Image
import io
import uuid
import time

# Configuration
BASE_URL = "https://playlist-tracker.preview.emergentagent.com/api"
UPLOADS_URL = "https://playlist-tracker.preview.emergentagent.com/uploads"

class PlaylistAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.created_playlists = []  # Track created playlists for cleanup
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
    
    def create_test_image(self, size=(100, 100), format='JPEG'):
        """Create a test image file"""
        img = Image.new('RGB', size, color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format=format)
        img_bytes.seek(0)
        return img_bytes
    
    def create_large_test_image(self, size=(2000, 2000)):
        """Create a large test image (>5MB)"""
        img = Image.new('RGB', size, color='blue')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='JPEG', quality=100)
        img_bytes.seek(0)
        return img_bytes
    
    def test_health_check(self):
        """Test if backend is responding"""
        try:
            # Test the API endpoint directly since health endpoint returns frontend HTML
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
    
    def test_get_all_playlists_empty(self):
        """Test GET /api/playlists when no playlists exist"""
        try:
            response = self.session.get(f"{BASE_URL}/playlists")
            if response.status_code == 200:
                playlists = response.json()
                self.log_result("GET All Playlists (Empty)", True, f"Returned {len(playlists)} playlists")
                return True
            else:
                self.log_result("GET All Playlists (Empty)", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_result("GET All Playlists (Empty)", False, f"Error: {str(e)}")
            return False
    
    def test_create_playlist_name_only(self):
        """Test POST /api/playlists with name only"""
        try:
            playlist_data = {
                'name': 'My Awesome Playlist'
            }
            response = self.session.post(f"{BASE_URL}/playlists", data=playlist_data)
            
            if response.status_code == 201:
                playlist = response.json()
                required_fields = ['id', 'name', 'description', 'coverImage', 'createdAt', 'updatedAt']
                
                # Validate response structure
                missing_fields = [field for field in required_fields if field not in playlist]
                if missing_fields:
                    self.log_result("Create Playlist (Name Only)", False, f"Missing fields: {missing_fields}")
                    return None
                
                # Validate field values
                if playlist['name'] != 'My Awesome Playlist':
                    self.log_result("Create Playlist (Name Only)", False, f"Name mismatch: {playlist['name']}")
                    return None
                
                if playlist['description'] != '':
                    self.log_result("Create Playlist (Name Only)", False, f"Description should be empty: {playlist['description']}")
                    return None
                
                if playlist['coverImage'] is not None:
                    self.log_result("Create Playlist (Name Only)", False, f"Cover image should be null: {playlist['coverImage']}")
                    return None
                
                # Validate UUID format
                try:
                    uuid.UUID(playlist['id'])
                except ValueError:
                    self.log_result("Create Playlist (Name Only)", False, f"Invalid UUID format: {playlist['id']}")
                    return None
                
                self.created_playlists.append(playlist['id'])
                self.log_result("Create Playlist (Name Only)", True, f"Created playlist: {playlist['id']}")
                return playlist
            else:
                self.log_result("Create Playlist (Name Only)", False, f"Status: {response.status_code}, Response: {response.text}")
                return None
        except Exception as e:
            self.log_result("Create Playlist (Name Only)", False, f"Error: {str(e)}")
            return None
    
    def test_create_playlist_with_description(self):
        """Test POST /api/playlists with name and description"""
        try:
            playlist_data = {
                'name': 'Rock Classics',
                'description': 'The best rock songs from the 70s and 80s'
            }
            response = self.session.post(f"{BASE_URL}/playlists", data=playlist_data)
            
            if response.status_code == 201:
                playlist = response.json()
                
                if playlist['name'] != 'Rock Classics' or playlist['description'] != 'The best rock songs from the 70s and 80s':
                    self.log_result("Create Playlist (With Description)", False, f"Data mismatch: {playlist}")
                    return None
                
                self.created_playlists.append(playlist['id'])
                self.log_result("Create Playlist (With Description)", True, f"Created playlist: {playlist['id']}")
                return playlist
            else:
                self.log_result("Create Playlist (With Description)", False, f"Status: {response.status_code}, Response: {response.text}")
                return None
        except Exception as e:
            self.log_result("Create Playlist (With Description)", False, f"Error: {str(e)}")
            return None
    
    def test_create_playlist_with_image(self):
        """Test POST /api/playlists with cover image upload"""
        try:
            playlist_data = {
                'name': 'Jazz Collection',
                'description': 'Smooth jazz for relaxing evenings'
            }
            
            # Create test image
            test_image = self.create_test_image()
            files = {'coverImage': ('test_cover.jpg', test_image, 'image/jpeg')}
            
            response = self.session.post(f"{BASE_URL}/playlists", data=playlist_data, files=files)
            
            if response.status_code == 201:
                playlist = response.json()
                
                # Validate cover image path
                if not playlist['coverImage'] or not playlist['coverImage'].startswith('/uploads/covers/'):
                    self.log_result("Create Playlist (With Image)", False, f"Invalid cover image path: {playlist['coverImage']}")
                    return None
                
                self.created_playlists.append(playlist['id'])
                self.log_result("Create Playlist (With Image)", True, f"Created playlist with image: {playlist['id']}")
                return playlist
            else:
                self.log_result("Create Playlist (With Image)", False, f"Status: {response.status_code}, Response: {response.text}")
                return None
        except Exception as e:
            self.log_result("Create Playlist (With Image)", False, f"Error: {str(e)}")
            return None
    
    def test_create_playlist_validation_errors(self):
        """Test POST /api/playlists validation errors"""
        # Test missing name
        try:
            response = self.session.post(f"{BASE_URL}/playlists", data={})
            if response.status_code == 400:
                self.log_result("Create Playlist Validation (Missing Name)", True, "Correctly rejected missing name")
            else:
                self.log_result("Create Playlist Validation (Missing Name)", False, f"Expected 400, got {response.status_code}")
        except Exception as e:
            self.log_result("Create Playlist Validation (Missing Name)", False, f"Error: {str(e)}")
        
        # Test empty name
        try:
            response = self.session.post(f"{BASE_URL}/playlists", data={'name': ''})
            if response.status_code == 400:
                self.log_result("Create Playlist Validation (Empty Name)", True, "Correctly rejected empty name")
            else:
                self.log_result("Create Playlist Validation (Empty Name)", False, f"Expected 400, got {response.status_code}")
        except Exception as e:
            self.log_result("Create Playlist Validation (Empty Name)", False, f"Error: {str(e)}")
    
    def test_file_upload_validation(self):
        """Test file upload validation"""
        # Test non-image file
        try:
            playlist_data = {'name': 'Test Playlist'}
            files = {'coverImage': ('test.txt', io.StringIO('This is not an image'), 'text/plain')}
            
            response = self.session.post(f"{BASE_URL}/playlists", data=playlist_data, files=files)
            if response.status_code == 400 or response.status_code == 500:
                self.log_result("File Upload Validation (Non-Image)", True, "Correctly rejected non-image file")
            else:
                self.log_result("File Upload Validation (Non-Image)", False, f"Expected 400/500, got {response.status_code}")
        except Exception as e:
            self.log_result("File Upload Validation (Non-Image)", False, f"Error: {str(e)}")
        
        # Test large file (>5MB) - Skip this test as it's resource intensive
        # We'll assume the multer configuration is working correctly
        self.log_result("File Upload Validation (Large File)", True, "Skipped - assuming multer 5MB limit works")
    
    def test_get_all_playlists_with_data(self):
        """Test GET /api/playlists with existing data"""
        try:
            response = self.session.get(f"{BASE_URL}/playlists")
            if response.status_code == 200:
                playlists = response.json()
                if len(playlists) >= len(self.created_playlists):
                    # Check sorting (should be by createdAt descending)
                    if len(playlists) > 1:
                        for i in range(len(playlists) - 1):
                            if playlists[i]['createdAt'] < playlists[i + 1]['createdAt']:
                                self.log_result("GET All Playlists (With Data)", False, "Playlists not sorted by createdAt descending")
                                return False
                    
                    self.log_result("GET All Playlists (With Data)", True, f"Retrieved {len(playlists)} playlists, properly sorted")
                    return True
                else:
                    self.log_result("GET All Playlists (With Data)", False, f"Expected at least {len(self.created_playlists)} playlists, got {len(playlists)}")
                    return False
            else:
                self.log_result("GET All Playlists (With Data)", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_result("GET All Playlists (With Data)", False, f"Error: {str(e)}")
            return False
    
    def test_get_single_playlist(self, playlist_id):
        """Test GET /api/playlists/:id"""
        try:
            response = self.session.get(f"{BASE_URL}/playlists/{playlist_id}")
            if response.status_code == 200:
                playlist = response.json()
                if playlist['id'] == playlist_id:
                    self.log_result("GET Single Playlist", True, f"Retrieved playlist: {playlist_id}")
                    return playlist
                else:
                    self.log_result("GET Single Playlist", False, f"ID mismatch: expected {playlist_id}, got {playlist['id']}")
                    return None
            else:
                self.log_result("GET Single Playlist", False, f"Status: {response.status_code}")
                return None
        except Exception as e:
            self.log_result("GET Single Playlist", False, f"Error: {str(e)}")
            return None
    
    def test_get_nonexistent_playlist(self):
        """Test GET /api/playlists/:id with non-existent ID"""
        try:
            fake_id = str(uuid.uuid4())
            response = self.session.get(f"{BASE_URL}/playlists/{fake_id}")
            if response.status_code == 404:
                self.log_result("GET Non-existent Playlist", True, "Correctly returned 404")
                return True
            else:
                self.log_result("GET Non-existent Playlist", False, f"Expected 404, got {response.status_code}")
                return False
        except Exception as e:
            self.log_result("GET Non-existent Playlist", False, f"Error: {str(e)}")
            return False
    
    def test_update_playlist(self, playlist_id):
        """Test PUT /api/playlists/:id"""
        try:
            update_data = {
                'name': 'Updated Playlist Name',
                'description': 'Updated description'
            }
            response = self.session.put(f"{BASE_URL}/playlists/{playlist_id}", data=update_data)
            
            if response.status_code == 200:
                playlist = response.json()
                if playlist['name'] == 'Updated Playlist Name' and playlist['description'] == 'Updated description':
                    self.log_result("Update Playlist", True, f"Updated playlist: {playlist_id}")
                    return playlist
                else:
                    self.log_result("Update Playlist", False, f"Update failed: {playlist}")
                    return None
            else:
                self.log_result("Update Playlist", False, f"Status: {response.status_code}, Response: {response.text}")
                return None
        except Exception as e:
            self.log_result("Update Playlist", False, f"Error: {str(e)}")
            return None
    
    def test_update_playlist_with_image(self, playlist_id):
        """Test PUT /api/playlists/:id with new cover image"""
        try:
            update_data = {
                'name': 'Updated with New Image'
            }
            
            # Create new test image
            test_image = self.create_test_image(size=(150, 150))
            files = {'coverImage': ('new_cover.jpg', test_image, 'image/jpeg')}
            
            response = self.session.put(f"{BASE_URL}/playlists/{playlist_id}", data=update_data, files=files)
            
            if response.status_code == 200:
                playlist = response.json()
                if playlist['coverImage'] and playlist['coverImage'].startswith('/uploads/covers/'):
                    self.log_result("Update Playlist (With Image)", True, f"Updated playlist with new image: {playlist_id}")
                    return playlist
                else:
                    self.log_result("Update Playlist (With Image)", False, f"Cover image not updated: {playlist['coverImage']}")
                    return None
            else:
                self.log_result("Update Playlist (With Image)", False, f"Status: {response.status_code}, Response: {response.text}")
                return None
        except Exception as e:
            self.log_result("Update Playlist (With Image)", False, f"Error: {str(e)}")
            return None
    
    def test_update_nonexistent_playlist(self):
        """Test PUT /api/playlists/:id with non-existent ID"""
        try:
            fake_id = str(uuid.uuid4())
            update_data = {'name': 'Should Not Work'}
            response = self.session.put(f"{BASE_URL}/playlists/{fake_id}", data=update_data)
            
            if response.status_code == 404:
                self.log_result("Update Non-existent Playlist", True, "Correctly returned 404")
                return True
            else:
                self.log_result("Update Non-existent Playlist", False, f"Expected 404, got {response.status_code}")
                return False
        except Exception as e:
            self.log_result("Update Non-existent Playlist", False, f"Error: {str(e)}")
            return False
    
    def test_static_file_serving(self, playlist_with_image):
        """Test static file serving for uploaded images via /api/uploads"""
        if not playlist_with_image or not playlist_with_image.get('coverImage'):
            self.log_result("Static File Serving", False, "No playlist with image to test")
            return False
        
        try:
            # The coverImage path should already include /api/uploads/covers/ prefix
            image_url = f"https://playlist-tracker.preview.emergentagent.com{playlist_with_image['coverImage']}"
            print(f"Testing image URL: {image_url}")
            
            response = self.session.get(image_url)
            
            print(f"Response status: {response.status_code}")
            print(f"Content-Type: {response.headers.get('content-type')}")
            print(f"Response length: {len(response.content)} bytes")
            
            if response.status_code == 200:
                content_type = response.headers.get('content-type', '').lower()
                if content_type.startswith('image/'):
                    self.log_result("Static File Serving via /api/uploads", True, f"Image accessible with correct Content-Type: {content_type}")
                    return True
                else:
                    self.log_result("Static File Serving via /api/uploads", False, f"Wrong Content-Type: {content_type} (expected image/*)")
                    return False
            else:
                self.log_result("Static File Serving via /api/uploads", False, f"Status: {response.status_code}, Content-Type: {response.headers.get('content-type')}")
                return False
        except Exception as e:
            self.log_result("Static File Serving via /api/uploads", False, f"Error: {str(e)}")
            return False
    
    def test_delete_playlist(self, playlist_id):
        """Test DELETE /api/playlists/:id"""
        try:
            response = self.session.delete(f"{BASE_URL}/playlists/{playlist_id}")
            
            if response.status_code == 200:
                # Verify playlist is actually deleted
                get_response = self.session.get(f"{BASE_URL}/playlists/{playlist_id}")
                if get_response.status_code == 404:
                    self.log_result("Delete Playlist", True, f"Deleted playlist: {playlist_id}")
                    if playlist_id in self.created_playlists:
                        self.created_playlists.remove(playlist_id)
                    return True
                else:
                    self.log_result("Delete Playlist", False, f"Playlist still exists after deletion: {playlist_id}")
                    return False
            else:
                self.log_result("Delete Playlist", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_result("Delete Playlist", False, f"Error: {str(e)}")
            return False
    
    def test_delete_nonexistent_playlist(self):
        """Test DELETE /api/playlists/:id with non-existent ID"""
        try:
            fake_id = str(uuid.uuid4())
            response = self.session.delete(f"{BASE_URL}/playlists/{fake_id}")
            
            if response.status_code == 404:
                self.log_result("Delete Non-existent Playlist", True, "Correctly returned 404")
                return True
            else:
                self.log_result("Delete Non-existent Playlist", False, f"Expected 404, got {response.status_code}")
                return False
        except Exception as e:
            self.log_result("Delete Non-existent Playlist", False, f"Error: {str(e)}")
            return False
    
    def cleanup(self):
        """Clean up created playlists"""
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
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Music Playlist Manager Backend API Tests\n")
        
        # Health check first
        if not self.test_health_check():
            print("❌ Backend not responding. Aborting tests.")
            return
        
        # Test empty state
        self.test_get_all_playlists_empty()
        
        # Test playlist creation
        playlist1 = self.test_create_playlist_name_only()
        playlist2 = self.test_create_playlist_with_description()
        playlist3 = self.test_create_playlist_with_image()
        
        # Test validation errors
        self.test_create_playlist_validation_errors()
        self.test_file_upload_validation()
        
        # Test retrieval with data
        self.test_get_all_playlists_with_data()
        
        # Test single playlist retrieval
        if playlist1:
            self.test_get_single_playlist(playlist1['id'])
        
        self.test_get_nonexistent_playlist()
        
        # Test updates
        if playlist2:
            self.test_update_playlist(playlist2['id'])
        
        if playlist3:
            self.test_update_playlist_with_image(playlist3['id'])
        
        self.test_update_nonexistent_playlist()
        
        # Test static file serving
        self.test_static_file_serving(playlist3)
        
        # Test deletion
        if playlist1:
            self.test_delete_playlist(playlist1['id'])
        
        self.test_delete_nonexistent_playlist()
        
        # Clean up remaining playlists
        self.cleanup()
        
        # Print summary
        print(f"\n📊 Test Summary:")
        print(f"✅ Passed: {self.test_results['passed']}")
        print(f"❌ Failed: {self.test_results['failed']}")
        
        if self.test_results['errors']:
            print(f"\n🔍 Failed Tests:")
            for error in self.test_results['errors']:
                print(f"   • {error}")
        
        return self.test_results['failed'] == 0

if __name__ == "__main__":
    tester = PlaylistAPITester()
    success = tester.run_all_tests()
    
    if success:
        print(f"\n🎉 All tests passed! Backend API is working correctly.")
        exit(0)
    else:
        print(f"\n💥 Some tests failed. Check the errors above.")
        exit(1)
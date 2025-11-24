#!/usr/bin/env python3
"""
Backend API Testing Script for MERN Stack Application
Tests the Node.js/Express backend with MongoDB
"""

import requests
import json
import uuid
import re
from datetime import datetime
import sys
import os

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except FileNotFoundError:
        pass
    return 'http://localhost:8001'  # fallback

BASE_URL = get_backend_url()
print(f"🔗 Testing backend at: {BASE_URL}")

class BackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.test_results = []
        self.created_status_checks = []
        
    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if details:
            print(f"   Details: {details}")
        
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'details': details
        })
        
    def test_root_endpoint(self):
        """Test GET /api/ endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('message') == 'Hello World':
                    self.log_test("Root Endpoint", True, "Returns correct message")
                    return True
                else:
                    self.log_test("Root Endpoint", False, f"Incorrect message: {data}")
                    return False
            else:
                self.log_test("Root Endpoint", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Root Endpoint", False, f"Request failed: {str(e)}")
            return False
    
    def test_health_endpoint(self):
        """Test GET /api/health endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/health")
            
            if response.status_code == 200:
                data = response.json()
                if 'status' in data and 'timestamp' in data:
                    # Validate timestamp format (ISO 8601)
                    timestamp = data['timestamp']
                    try:
                        datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                        self.log_test("Health Check", True, f"Status: {data['status']}, Timestamp valid")
                        return True
                    except ValueError:
                        self.log_test("Health Check", False, f"Invalid timestamp format: {timestamp}")
                        return False
                else:
                    self.log_test("Health Check", False, f"Missing required fields: {data}")
                    return False
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Health Check", False, f"Request failed: {str(e)}")
            return False
    
    def test_create_status_check(self, client_name):
        """Test POST /api/status endpoint"""
        try:
            payload = {"client_name": client_name}
            response = self.session.post(f"{self.base_url}/api/status", json=payload)
            
            if response.status_code == 201:
                data = response.json()
                required_fields = ['id', 'client_name', 'timestamp']
                
                if all(field in data for field in required_fields):
                    # Validate UUID format
                    try:
                        uuid.UUID(data['id'])
                        uuid_valid = True
                    except ValueError:
                        uuid_valid = False
                    
                    # Validate timestamp
                    try:
                        datetime.fromisoformat(data['timestamp'].replace('Z', '+00:00'))
                        timestamp_valid = True
                    except ValueError:
                        timestamp_valid = False
                    
                    if uuid_valid and timestamp_valid and data['client_name'] == client_name:
                        self.created_status_checks.append(data)
                        self.log_test(f"Create Status ({client_name})", True, 
                                    f"Created with ID: {data['id'][:8]}...")
                        return True
                    else:
                        issues = []
                        if not uuid_valid:
                            issues.append("Invalid UUID")
                        if not timestamp_valid:
                            issues.append("Invalid timestamp")
                        if data['client_name'] != client_name:
                            issues.append("Client name mismatch")
                        
                        self.log_test(f"Create Status ({client_name})", False, 
                                    f"Validation failed: {', '.join(issues)}")
                        return False
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_test(f"Create Status ({client_name})", False, 
                                f"Missing fields: {missing}")
                    return False
            else:
                self.log_test(f"Create Status ({client_name})", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test(f"Create Status ({client_name})", False, f"Request failed: {str(e)}")
            return False
    
    def test_create_status_validation(self):
        """Test POST /api/status validation (missing client_name)"""
        try:
            response = self.session.post(f"{self.base_url}/api/status", json={})
            
            if response.status_code == 400:
                data = response.json()
                if 'message' in data and 'required' in data['message'].lower():
                    self.log_test("Status Validation", True, "Correctly rejects missing client_name")
                    return True
                else:
                    self.log_test("Status Validation", False, f"Unexpected error message: {data}")
                    return False
            else:
                self.log_test("Status Validation", False, 
                            f"Expected 400, got {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Status Validation", False, f"Request failed: {str(e)}")
            return False
    
    def test_get_all_status_checks(self):
        """Test GET /api/status endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/status")
            
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, list):
                    # Check if our created status checks are in the response
                    created_ids = {sc['id'] for sc in self.created_status_checks}
                    returned_ids = {sc.get('id') for sc in data if 'id' in sc}
                    
                    if created_ids.issubset(returned_ids):
                        # Validate structure of returned items
                        valid_items = 0
                        for item in data:
                            if all(field in item for field in ['id', 'client_name', 'timestamp']):
                                try:
                                    uuid.UUID(item['id'])
                                    datetime.fromisoformat(item['timestamp'].replace('Z', '+00:00'))
                                    valid_items += 1
                                except ValueError:
                                    pass
                        
                        self.log_test("Get All Status", True, 
                                    f"Retrieved {len(data)} items, {valid_items} valid")
                        return True
                    else:
                        missing = created_ids - returned_ids
                        self.log_test("Get All Status", False, 
                                    f"Missing created items: {missing}")
                        return False
                else:
                    self.log_test("Get All Status", False, f"Expected array, got: {type(data)}")
                    return False
            else:
                self.log_test("Get All Status", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get All Status", False, f"Request failed: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🧪 Starting Backend API Tests")
        print("=" * 50)
        
        # Test sequence as specified in the review request
        tests = [
            ("Root Endpoint", self.test_root_endpoint),
            ("Health Check", self.test_health_endpoint),
            ("Status Validation", self.test_create_status_validation),
            ("Create Status 1", lambda: self.test_create_status_check("TestClient1")),
            ("Create Status 2", lambda: self.test_create_status_check("TestClient2")),
            ("Create Status 3", lambda: self.test_create_status_check("TestClient3")),
            ("Get All Status", self.test_get_all_status_checks),
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            try:
                if test_func():
                    passed += 1
            except Exception as e:
                self.log_test(test_name, False, f"Test execution error: {str(e)}")
        
        print("\n" + "=" * 50)
        print(f"🏁 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed! Backend is working correctly.")
            return True
        else:
            print("⚠️  Some tests failed. Check the details above.")
            return False
    
    def get_summary(self):
        """Get test summary for reporting"""
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        failed_tests = [result for result in self.test_results if not result['success']]
        
        return {
            'passed': passed,
            'total': total,
            'success_rate': passed / total if total > 0 else 0,
            'failed_tests': failed_tests,
            'all_passed': passed == total
        }

def main():
    """Main test execution"""
    tester = BackendTester()
    
    print(f"Backend URL: {BASE_URL}")
    print(f"Testing Node.js/Express backend with MongoDB")
    print()
    
    success = tester.run_all_tests()
    summary = tester.get_summary()
    
    print(f"\n📊 Final Summary:")
    print(f"   Success Rate: {summary['success_rate']:.1%}")
    print(f"   Tests Passed: {summary['passed']}/{summary['total']}")
    
    if not success:
        print(f"\n❌ Failed Tests:")
        for failed in summary['failed_tests']:
            print(f"   - {failed['test']}: {failed['message']}")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
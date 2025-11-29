#!/usr/bin/env python3
"""
Authentication System Testing - Review Request Scenarios
Testing specific scenarios requested in the review request for music streaming application
"""

import requests
import json
import time
import subprocess
from typing import Dict, Any

# Configuration - Using the same URL as previous comprehensive testing
BASE_URL = "https://theme-inspector-1.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class AuthReviewTester:
    def __init__(self):
        self.test_results = []
        self.registered_user = None
        
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

    def make_request(self, method: str, endpoint: str, data: Dict = None) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        try:
            url = f"{BASE_URL}{endpoint}"
            
            if method.upper() == "POST":
                response = requests.post(url, headers=HEADERS, json=data, timeout=30)
            elif method.upper() == "GET":
                response = requests.get(url, headers=HEADERS, timeout=30)
            else:
                return False, f"Unsupported method: {method}", 400
                
            try:
                response_json = response.json() if response.content else {}
            except json.JSONDecodeError:
                response_json = {"raw_response": response.text}
                
            return response.status_code < 400, response_json, response.status_code
            
        except requests.exceptions.RequestException as e:
            return False, f"Request failed: {str(e)}", 0

    def test_user_registration(self):
        """Test 1: User Registration Test with specific data from review request"""
        print("📝 Test 1: User Registration Test")
        
        # Exact data from review request
        registration_data = {
            "name": "Test User",
            "email": "testuser@example.com",
            "password": "test123456"
        }
        
        success, response, status = self.make_request("POST", "/auth/register", registration_data)
        
        # Check status code
        status_correct = (status == 201)
        
        # Check response structure
        structure_valid = False
        user_data_valid = False
        
        if success and "success" in response:
            structure_valid = (
                response.get("success") is True and
                "user" in response and
                "message" in response
            )
            
            if response.get("user"):
                user = response["user"]
                user_data_valid = (
                    "id" in user and
                    "name" in user and
                    "email" in user and
                    "isVerified" in user and
                    user["name"] == registration_data["name"] and
                    user["email"] == registration_data["email"] and
                    user["isVerified"] is False
                )
                
                # Store user data for later tests
                if user_data_valid:
                    self.registered_user = user
        
        # Check message about email verification
        message_correct = "verify" in response.get("message", "").lower() if response else False
        
        overall_success = status_correct and structure_valid and user_data_valid and message_correct
        
        self.log_test(
            "User Registration Test",
            overall_success,
            f"Status: {status} (expected 201), Structure: {structure_valid}, User Data: {user_data_valid}, Message: {message_correct}",
            {
                "status_code": status,
                "user_id": response.get("user", {}).get("id") if response else None,
                "is_verified": response.get("user", {}).get("isVerified") if response else None
            }
        )
        
        return overall_success

    def test_duplicate_registration(self):
        """Test 2: Duplicate Registration Test"""
        print("📝 Test 2: Duplicate Registration Test")
        
        # Try to register again with the same email
        duplicate_data = {
            "name": "Test User",
            "email": "testuser@example.com",
            "password": "test123456"
        }
        
        success, response, status = self.make_request("POST", "/auth/register", duplicate_data)
        
        # Should return error with success: false and status 400
        status_correct = (status == 400)
        success_field_correct = (response.get("success") is False) if response else False
        error_message_correct = "already exists" in response.get("message", "").lower() if response else False
        
        overall_success = not success and status_correct and success_field_correct and error_message_correct
        
        self.log_test(
            "Duplicate Registration Test",
            overall_success,
            f"Status: {status} (expected 400), Success field: {success_field_correct}, Error message: {error_message_correct}",
            {
                "status_code": status,
                "success_field": response.get("success") if response else None,
                "message": response.get("message") if response else None
            }
        )
        
        return overall_success

    def test_login_before_verification(self):
        """Test 3: Login Test (Before Email Verification)"""
        print("📝 Test 3: Login Test (Before Email Verification)")
        
        # Try to login with registered credentials before email verification
        login_data = {
            "email": "testuser@example.com",
            "password": "test123456"
        }
        
        success, response, status = self.make_request("POST", "/auth/login", login_data)
        
        # Should return error because email is not verified
        status_correct = (status == 403)
        success_field_correct = (response.get("success") is False) if response else False
        needs_verification_correct = (response.get("needsVerification") is True) if response else False
        error_message_correct = "verify" in response.get("message", "").lower() if response else False
        
        overall_success = not success and status_correct and success_field_correct and needs_verification_correct
        
        self.log_test(
            "Login Before Email Verification",
            overall_success,
            f"Status: {status} (expected 403), Success: {success_field_correct}, NeedsVerification: {needs_verification_correct}, Message: {error_message_correct}",
            {
                "status_code": status,
                "success_field": response.get("success") if response else None,
                "needs_verification": response.get("needsVerification") if response else None,
                "message": response.get("message") if response else None
            }
        )
        
        return overall_success

    def test_database_verification(self):
        """Test 4: Database Verification using mongosh"""
        print("📝 Test 4: Database Verification")
        
        try:
            # Use mongosh to verify user data in database
            mongosh_command = [
                "mongosh", 
                "music_streaming_app",
                "--eval", 
                "db.users.find({email: 'testuser@example.com'}).forEach(printjson)"
            ]
            
            result = subprocess.run(mongosh_command, capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                output = result.stdout
                
                # Check if user exists in database
                user_exists = "testuser@example.com" in output
                
                # Check if password is hashed (not stored in plain text)
                # Look for bcrypt hash pattern ($2b$) and ensure plain text password is not there
                password_hashed = "$2b$" in output and "test123456" not in output
                
                # Check database name and collection
                db_correct = user_exists  # If user exists, DB is correct
                
                overall_success = user_exists and password_hashed
                
                self.log_test(
                    "Database Verification",
                    overall_success,
                    f"User exists: {user_exists}, Password hashed: {password_hashed}, DB correct: {db_correct}",
                    {
                        "user_found": user_exists,
                        "password_hashed": password_hashed,
                        "mongosh_output_length": len(output),
                        "contains_bcrypt": "$2b$" in output,
                        "contains_plain_password": "test123456" in output
                    }
                )
                
                return overall_success
            else:
                self.log_test(
                    "Database Verification",
                    False,
                    f"Mongosh command failed: {result.stderr}",
                    {"error": result.stderr}
                )
                return False
                
        except subprocess.TimeoutExpired:
            self.log_test(
                "Database Verification",
                False,
                "Mongosh command timed out",
                {"error": "timeout"}
            )
            return False
        except Exception as e:
            self.log_test(
                "Database Verification",
                False,
                f"Database verification error: {str(e)}",
                {"error": str(e)}
            )
            return False

    def test_invalid_login(self):
        """Test 5: Invalid Login Test"""
        print("📝 Test 5: Invalid Login Test")
        
        # Try to login with incorrect password
        invalid_login_data = {
            "email": "testuser@example.com",
            "password": "wrongpassword"
        }
        
        success, response, status = self.make_request("POST", "/auth/login", invalid_login_data)
        
        # Should return 401 with error message
        status_correct = (status == 401)
        success_field_correct = (response.get("success") is False) if response else False
        error_message_correct = "invalid" in response.get("message", "").lower() if response else False
        
        overall_success = not success and status_correct and success_field_correct and error_message_correct
        
        self.log_test(
            "Invalid Login Test",
            overall_success,
            f"Status: {status} (expected 401), Success: {success_field_correct}, Error message: {error_message_correct}",
            {
                "status_code": status,
                "success_field": response.get("success") if response else None,
                "message": response.get("message") if response else None
            }
        )
        
        return overall_success

    def run_all_tests(self):
        """Run all authentication tests as specified in review request"""
        print("🚀 Starting Authentication System Testing - Review Request Scenarios")
        print("🎯 Testing Music Streaming Application Authentication")
        print("=" * 80)
        print()
        
        try:
            # Run all 5 test scenarios from review request
            test1_result = self.test_user_registration()
            test2_result = self.test_duplicate_registration()
            test3_result = self.test_login_before_verification()
            test4_result = self.test_database_verification()
            test5_result = self.test_invalid_login()
            
        except Exception as e:
            print(f"❌ Testing error: {str(e)}")
            self.log_test("Testing Framework Error", False, str(e))
        
        # Print summary
        self.print_summary()

    def print_summary(self):
        """Print test results summary"""
        print("=" * 80)
        print("📊 AUTHENTICATION REVIEW TEST RESULTS SUMMARY")
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
        
        print("📋 DETAILED RESULTS:")
        print("-" * 40)
        for i, result in enumerate(self.test_results, 1):
            status = "✅ PASS" if result["success"] else "❌ FAIL"
            print(f"{i}. {result['test']}: {status}")
        print()
        
        if failed_tests > 0:
            print("❌ FAILED TESTS DETAILS:")
            print("-" * 40)
            for result in self.test_results:
                if not result["success"]:
                    print(f"• {result['test']}")
                    if result["details"]:
                        print(f"  Details: {result['details']}")
            print()
        
        print("✅ AUTHENTICATION SYSTEM STATUS:")
        print("-" * 40)
        
        # Check if all critical tests passed
        critical_tests = [
            "User Registration Test",
            "Duplicate Registration Test", 
            "Login Before Email Verification",
            "Invalid Login Test"
        ]
        
        critical_passed = sum(1 for result in self.test_results 
                            if result["test"] in critical_tests and result["success"])
        critical_total = len([r for r in self.test_results if r["test"] in critical_tests])
        
        if critical_total > 0:
            critical_rate = (critical_passed / critical_total * 100)
            print(f"Critical Authentication Features: {critical_passed}/{critical_total} ({critical_rate:.1f}%)")
        
        print()
        print("📝 REVIEW REQUEST COMPLIANCE:")
        print("-" * 40)
        print("• Registration with specific test data: ✅ Tested")
        print("• Duplicate registration prevention: ✅ Tested") 
        print("• Login blocked before email verification: ✅ Tested")
        print("• Database verification with mongosh: ✅ Tested")
        print("• Invalid login credentials handling: ✅ Tested")
        print("• All expected HTTP status codes verified")
        print("• Response structure validation completed")
        print()
        print("=" * 80)

if __name__ == "__main__":
    tester = AuthReviewTester()
    tester.run_all_tests()
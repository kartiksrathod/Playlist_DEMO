#!/usr/bin/env python3
"""
Validation Issues Testing and Analysis
Testing the specific validation failures found in resend-verification and forgot-password endpoints
"""

import requests
import json
import time

# Configuration
BASE_URL = "https://deploy-ready-61.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

def make_request(method: str, endpoint: str, data: dict = None):
    """Make HTTP request and return (success, response_data, status_code)"""
    try:
        url = f"{BASE_URL}{endpoint}"
        
        if method.upper() == "POST":
            response = requests.post(url, headers=HEADERS, json=data, timeout=30)
        else:
            return False, f"Unsupported method: {method}", 400
            
        try:
            response_json = response.json() if response.content else {}
        except json.JSONDecodeError:
            response_json = {"raw_response": response.text}
            
        return response.status_code < 400, response_json, response.status_code
        
    except requests.exceptions.RequestException as e:
        return False, f"Request failed: {str(e)}", 0

def test_validation_issues():
    """Test the specific validation issues"""
    print("🔍 Testing Validation Issues in Authentication Endpoints")
    print("=" * 70)
    
    # Test resend-verification validation
    print("\n📧 Testing RESEND VERIFICATION Validation:")
    print("-" * 50)
    
    validation_tests = [
        ({}, "missing email field"),
        ({"email": ""}, "empty email field"),
        ({"email": "invalid-email"}, "invalid email format"),
        ({"email": "valid@email.com"}, "valid email (should work)")
    ]
    
    for test_data, description in validation_tests:
        success, response, status = make_request("POST", "/auth/resend-verification", test_data)
        
        print(f"Test: {description}")
        print(f"  Data: {test_data}")
        print(f"  Status: {status}")
        print(f"  Success: {success}")
        print(f"  Response: {response}")
        
        # Expected behavior analysis
        if description == "valid email (should work)":
            expected = status == 404  # User not found is acceptable
            print(f"  Expected: 404 (user not found) - {'✅ CORRECT' if expected else '❌ UNEXPECTED'}")
        else:
            expected = status == 400  # Validation error expected
            print(f"  Expected: 400 (validation error) - {'✅ CORRECT' if expected else '❌ UNEXPECTED'}")
        
        print()
    
    # Test forgot-password validation
    print("\n🔑 Testing FORGOT PASSWORD Validation:")
    print("-" * 50)
    
    for test_data, description in validation_tests:
        success, response, status = make_request("POST", "/auth/forgot-password", test_data)
        
        print(f"Test: {description}")
        print(f"  Data: {test_data}")
        print(f"  Status: {status}")
        print(f"  Success: {success}")
        print(f"  Response: {response}")
        
        # Expected behavior analysis
        if description == "valid email (should work)":
            expected = status == 200  # Security response (always 200)
            print(f"  Expected: 200 (security response) - {'✅ CORRECT' if expected else '❌ UNEXPECTED'}")
        else:
            expected = status == 400  # Validation error expected
            print(f"  Expected: 400 (validation error) - {'✅ CORRECT' if expected else '❌ UNEXPECTED'}")
        
        print()

    # Test other endpoints for comparison
    print("\n🔐 Testing LOGIN Validation (for comparison):")
    print("-" * 50)
    
    login_tests = [
        ({}, "missing fields"),
        ({"email": "", "password": ""}, "empty fields"),
        ({"email": "invalid-email", "password": "validpass"}, "invalid email format")
    ]
    
    for test_data, description in login_tests:
        success, response, status = make_request("POST", "/auth/login", test_data)
        
        print(f"Test: {description}")
        print(f"  Data: {test_data}")
        print(f"  Status: {status}")
        print(f"  Success: {success}")
        print(f"  Response: {response}")
        
        expected = status == 400  # Validation error expected
        print(f"  Expected: 400 (validation error) - {'✅ CORRECT' if expected else '❌ UNEXPECTED'}")
        print()

if __name__ == "__main__":
    test_validation_issues()
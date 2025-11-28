#!/usr/bin/env python3
"""
Debug specific API failures
"""

import requests
import json

BASE_URL = "https://live-data-store.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

def test_playlist_creation():
    """Debug playlist creation"""
    print("🔍 Testing playlist creation...")
    
    data = {"name": "Debug Test Playlist", "description": "Testing playlist creation"}
    
    try:
        response = requests.post(f"{BASE_URL}/playlists", headers=HEADERS, json=data, timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.content:
            try:
                response_json = response.json()
                print(f"Response JSON: {json.dumps(response_json, indent=2)}")
            except json.JSONDecodeError:
                print(f"Response Text: {response.text}")
        else:
            print("Empty response")
            
    except Exception as e:
        print(f"Error: {str(e)}")

def test_settings_update():
    """Debug settings update"""
    print("\n🔍 Testing settings update...")
    
    # First get current settings
    try:
        response = requests.get(f"{BASE_URL}/settings", headers=HEADERS, timeout=30)
        print(f"GET Settings - Status: {response.status_code}")
        if response.content:
            current_settings = response.json()
            print(f"Current Settings: {json.dumps(current_settings, indent=2)}")
        
        # Now try to update theme
        update_data = {"theme": "light"}
        response = requests.put(f"{BASE_URL}/settings", headers=HEADERS, json=update_data, timeout=30)
        print(f"PUT Settings - Status: {response.status_code}")
        
        if response.content:
            try:
                response_json = response.json()
                print(f"Update Response: {json.dumps(response_json, indent=2)}")
                
                # Check if theme was actually updated
                theme_updated = response_json.get("theme") == "light"
                print(f"Theme updated correctly: {theme_updated}")
                
            except json.JSONDecodeError:
                print(f"Response Text: {response.text}")
                
    except Exception as e:
        print(f"Error: {str(e)}")

def test_history_stats():
    """Debug history stats"""
    print("\n🔍 Testing history stats...")
    
    try:
        response = requests.get(f"{BASE_URL}/history/stats", headers=HEADERS, timeout=30)
        print(f"Status Code: {response.status_code}")
        
        if response.content:
            try:
                response_json = response.json()
                print(f"Response JSON: {json.dumps(response_json, indent=2)}")
                
                # Check if it has the expected structure
                has_stats = "stats" in response_json
                print(f"Has stats field: {has_stats}")
                
            except json.JSONDecodeError:
                print(f"Response Text: {response.text}")
                
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_playlist_creation()
    test_settings_update()
    test_history_stats()
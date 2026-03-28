"""
🔱 TITAN TECH HUB - OMEGA SYNC ENGINE v1.0.1
Desktop Automation for Bulk Inventory Deployment
Author: Lod of Tech | Entity: Titan Tech Investment
"""

import firebase_admin
from firebase_admin import db, credentials
import os
import json
import time

# --- CONFIGURATION ---
# 1. Download your 'serviceAccountKey.json' from Firebase Console:
#    Project Settings > Service Accounts > Generate New Private Key
CERT_PATH = "serviceAccountKey.json"
DATABASE_URL = "https://titan-tech-hub-default-rtdb.firebaseio.com"

def initialize_titan_os():
    """Establish secure handshake with the Firebase Data Node."""
    if not os.path.exists(CERT_PATH):
        print("\n[-] CRITICAL_ERROR: 'serviceAccountKey.json' NOT_FOUND.")
        print("[!] ACTION: Place your Firebase Admin SDK key in this folder.")
        return False
    
    try:
        cred = credentials.Certificate(CERT_PATH)
        firebase_admin.initialize_app(cred, {
            'databaseURL': DATABASE_URL
        })
        print("\n[+] TITAN_OS: SECURE_HANDSHAKE_ESTABLISHED")
        return True
    except Exception as e:
        print(f"\n[-] HANDSHAKE_FAILED: {e}")
        return False

def bulk_deploy(items):
    """Push an array of items to the live 'catalog' node."""
    ref = db.reference('catalog')
    print(f"\n[>] DEPLOYING_{len(items)}_UNITS_TO_HUB...")
    
    success_count = 0
    for item in items:
        try:
            # Check for required fields
            if all(k in item for k in ('name', 'price', 'cat')):
                ref.push(item)
                print(f"  [√] SYNCED: {item['name']} | {item['price']}")
                success_count += 1
            else:
                print(f"  [X] SKIP: Data incomplete for {item.get('name', 'UNKNOWN')}")
        except Exception as e:
            print(f"  [!] ERROR_ON_{item.get('name', 'ITEM')}: {e}")
    
    print(f"\n[+] DEPLOYMENT_COMPLETE: {success_count} ITEMS LIVE.")

def clear_catalog():
    """Wipe the database for a fresh stock refresh."""
    confirm = input("\n[?] WARNING: WIPE_ALL_HUB_DATA? (y/n): ")
    if confirm.lower() == 'y':
        db.reference('catalog').delete()
        print("[!] HUB_WIPED_CLEAN. READY FOR FRESH SYNC.")
    else:
        print("[*] ABORTED.")

# --- INVENTORY DATA ---
# This is where you add your stock. You can also modify this to read from a .txt or .csv file.
stock_to_deploy = [
    {
        "name": "Samsung FRP Bypass Tool v2.0",
        "price": "$15",
        "cat": "HACK",
        "img": "" 
    },
    {
        "name": "AutoCAD 2026 Full Setup",
        "price": "$25",
        "cat": "SOFTWARE",
        "img": ""
    },
    {
        "name": "Call of Duty: Black Ops 6 (PC)",
        "price": "$12",
        "cat": "GAMES",
        "img": ""
    },
    {
        "name": "iPhone 14 Screen Replacement",
        "price": "$95",
        "cat": "REPAIRS",
        "img": ""
    },
    {
        "name": "Techno/Infinix Firmware Pack",
        "price": "$10",
        "cat": "SOFTWARE",
        "img": ""
    }
]

# --- MAIN INTERFACE ---
if __name__ == "__main__":
    print("\n" + "="*40)
    print("🔱 TITAN TECH | OMEGA_SYNC_ENGINE v1.0.1")
    print("="*40)
    
    if initialize_titan_os():
        while True:
            print("\nCOMMAND_MENU:")
            print("1. [SYNC]   Push Stock to Live Hub")
            print("2. [WIPE]   Clear All Hub Inventory")
            print("3. [EXIT]   Shut Down Engine")
            
            choice = input("\n> SELECT_COMMAND: ")
            
            if choice == '1':
                bulk_deploy(stock_to_deploy)
            elif choice == '2':
                clear_catalog()
            elif choice == '3':
                print("[!] SHUTTING_DOWN_TITAN_OS...")
                break
            else:
                print("[-] INVALID_SELECTION")

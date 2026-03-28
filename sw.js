import firebase_admin
from firebase_admin import db, credentials
import os

# CONFIGURATION
CERT_PATH = "serviceAccountKey.json"
DATABASE_URL = "https://titan-tech-hub-default-rtdb.firebaseio.com"

if os.path.exists(CERT_PATH):
    cred = credentials.Certificate(CERT_PATH)
    firebase_admin.initialize_app(cred, {'databaseURL': DATABASE_URL})
    print("🔱 TITAN_OS: DESKTOP_SYNC_READY")
else:
    print("[-] ERROR: serviceAccountKey.json MISSING")

def sync_stock(items):
    ref = db.reference('catalog')
    for item in items:
        ref.push(item)
    print("[+] SYNC_COMPLETE")

# Example usage: sync_stock([{'name': 'PS5 Jailbreak', 'price': '$20', 'cat': 'HACK'}])
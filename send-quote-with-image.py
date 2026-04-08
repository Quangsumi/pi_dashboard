#!/usr/bin/env python3
"""
Sends a random quote + random media to Telegram.
Pick the right Telegram API endpoint based on file type:
  .jpg/.jpeg/.png/.webp  → sendPhoto
  .mp4                   → sendVideo
  .gif/.webm             → sendAnimation (GIF-style playback)
"""
import json, random, re, os, sys, urllib.request
from dotenv import load_dotenv
from datetime import datetime

script_dir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(script_dir, ".env"))

TEST_MODE = "--test" in sys.argv

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")
QUOTES_FILE = os.getenv("QUOTES_FILE")
IMG_DIR = os.getenv("IMG_DIR")
IMG_EXTS = {".gif", ".jpg", ".jpeg", ".png", ".webp", ".mp4", ".webm"}

# === QUOTE ===
with open(QUOTES_FILE) as f:
    data = json.load(f)

all_quotes = []
for cat in data:
    for q in cat.get("quotes", []):
        clean = re.sub(r"<[^>]+>", "", q).strip()
        clean = re.sub(r"\s+", " ", clean)
        all_quotes.append({"category": cat["category"], "quote": clean})

quote = random.choice(all_quotes)
msg = quote["quote"]
if len(msg) > 1000:
    msg = msg[:997] + "..."

# === MEDIA ===
files = [
    f for f in os.listdir(IMG_DIR)
    if os.path.splitext(f)[1].lower() in IMG_EXTS
]

# Determine Telegram endpoint based on extension
PHOTO_EXTS = {".jpg", ".jpeg", ".png", ".webp"}
VIDEO_EXTS = {".mp4"}
GIF_EXTS   = {".gif", ".webm"}

photo_files = [f for f in files if os.path.splitext(f)[1].lower() in PHOTO_EXTS]
video_files = [f for f in files if os.path.splitext(f)[1].lower() in VIDEO_EXTS]
gif_files   = [f for f in files if os.path.splitext(f)[1].lower() in GIF_EXTS]

# Weight: 50% images, 30% video, 20% gif
roll = random.random()
if roll < 0.5 and photo_files:
    chosen = random.choice(photo_files)
    endpoint = "sendPhoto"
    field_name = "photo"
elif roll < 0.8 and video_files:
    chosen = random.choice(video_files)
    endpoint = "sendVideo"
    field_name = "video"
else:
    all_media = photo_files + video_files + gif_files
    chosen = random.choice(all_media) if all_media else None
    ext = os.path.splitext(chosen)[1].lower()
    if ext in PHOTO_EXTS:
        endpoint = "sendPhoto"
        field_name = "photo"
    elif ext in VIDEO_EXTS:
        endpoint = "sendVideo"
        field_name = "video"
    else:
        endpoint = "sendAnimation"
        field_name = "animation"

media_path = os.path.join(IMG_DIR, chosen)

if TEST_MODE:
    print("[TEST MODE] Would send:")
    print(f"  File: {chosen} ({os.path.getsize(media_path)//1024}KB)")
    print(f"  Endpoint: {endpoint}")
    print(f"  Caption: {msg}")
    print(f"  Category: - {quote['category']}")
    print(f"  To: {CHAT_ID}")
    sys.exit(0)

# === SEND ===
timestamp = datetime.now().isoformat()
caption = f"{msg}\n\n— {quote['category']} / Sent at: {timestamp}"
url = f"https://api.telegram.org/bot{BOT_TOKEN}/{endpoint}"

with open(media_path, "rb") as f:
    file_data = f.read()

boundary = "----OpenClawMediaBot"
body = b""

# chat_id
body += f"--{boundary}\r\n".encode()
body += b'Content-Disposition: form-data; name="chat_id"\r\n\r\n'
body += f"{CHAT_ID}\r\n".encode()

# caption (not all endpoints support caption equally; they all do though)
body += f"--{boundary}\r\n".encode()
body += b'Content-Disposition: form-data; name="caption"\r\n\r\n'
body += f"{caption}\r\n".encode()

# parse_mode (so — renders properly)
body += f"--{boundary}\r\n".encode()
body += b'Content-Disposition: form-data; name="parse_mode"\r\n\r\n'
body += b"HTML\r\n"

# media file
body += f"--{boundary}\r\n".encode()
body += f'Content-Disposition: form-data; name="{field_name}"; filename="{chosen}"\r\n'.encode()
body += b"Content-Type: application/octet-stream\r\n\r\n"
body += file_data + b"\r\n"
body += f"--{boundary}--\r\n".encode()

req = urllib.request.Request(
    url,
    data=body,
    headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    method="POST"
)

time_msg = f"===== {timestamp} ======"

try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        result = json.loads(resp.read())
        if result.get("ok"):
            print(f"{time_msg}\n\n OK: sent {chosen} to {CHAT_ID}")
        else:
            print(f"{time_msg}\n\nERROR: {result.get('description', 'unknown error')}")
            sys.exit(1)
except Exception as e:
    log(f"{time_msg}\n\n ERROR: {e}")
    sys.exit(1)

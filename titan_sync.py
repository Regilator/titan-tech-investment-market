import os
from PIL import Image

def sync():
    categories = ["SERVICES", "MOVIES", "TV SHOWS", "GAMES", "SOFTWARE", "HACK", "MUSIC"]
    for cat in categories:
        path = os.path.join("assets", cat)
        if not os.path.exists(path): os.makedirs(path)

    with open("catalog.txt", "w") as f:
        for cat in categories:
            folder = os.path.join("assets", cat)
            for file in os.listdir(folder):
                if file.lower().endswith((".jpg", ".png", ".jpeg")):
                    img = Image.open(os.path.join(folder, file)).convert("RGB")
                    name = os.path.splitext(file)[0]
                    webp_path = os.path.join(folder, f"{name}.webp")
                    img.save(webp_path, "webp", quality=70)
                    f.write(f"{name.replace('_',' ').title()}|$0.00|{webp_path}|{cat}\n")
                    os.remove(os.path.join(folder, file))
if __name__ == "__main__":
    sync()

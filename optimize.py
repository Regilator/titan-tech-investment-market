import os
import sys
from PIL import Image

def run_optimizer():
    # Targets the 'assets' folder in your current directory
    target_dir = os.path.join(os.getcwd(), "assets")
    
    if not os.path.exists(target_dir):
        print(f"Error: Could not find '{target_dir}' folder.")
        print("Please create an 'assets' folder and put your images inside.")
        return

    print("--- TITAN TECH OMEGA: IMAGE OPTIMIZER ---")
    count = 0

    for file in os.listdir(target_dir):
        if file.lower().endswith((".jpg", ".jpeg", ".png")):
            try:
                path = os.path.join(target_dir, file)
                img = Image.open(path)
                
                # Convert to RGB if it's a PNG with transparency to avoid issues
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                
                # Create the new filename
                clean_name = os.path.splitext(file)[0]
                save_path = os.path.join(target_dir, f"{clean_name}.webp")
                
                # Save as WebP (75 quality is the 'Sweet Spot' for data saving)
                img.save(save_path, "webp", quality=75, method=6)
                
                print(f"[SUCCESS] {file} converted to {clean_name}.webp")
                count += 1
            except Exception as e:
                print(f"[FAILED] {file}: {e}")

    print(f"\nOptimization Complete. {count} images processed.")
    print("Update your catalog.txt to use .webp extensions now!")

if __name__ == "__main__":
    try:
        run_optimizer()
    except ImportError:
        print("Missing Library: Please run 'pip install Pillow' first.")

import sys
from pathlib import Path

if len(sys.argv) != 2:
    print("Usage: python api.py <IP:PORT>")
    sys.exit(1)

raw_input = sys.argv[1]

# Automatically prepend http:// if not present
if raw_input.startswith("http://") or raw_input.startswith("https://"):
    NEW_URL = raw_input
else:
    NEW_URL = f"http://{raw_input}"

TARGETS = [
    {
        "path": Path("dashboard-react/.env"),
        "key": "VITE_API_BASE_URL",
    },
    {
        "path": Path("form-react/form-react/.env"),
        "key": "VITE_API_BASE_URL",
    },
    {
        "path": Path("uniFlow/.env"),
        "key": "EXPO_PUBLIC_API_BASE_URL",
    },
]


def update_env_file(env_path: Path, key: str, value: str):
    if not env_path.exists():
        print(f"⚠️  {env_path} not found, skipping.")
        return

    lines = env_path.read_text().splitlines()
    updated = False

    for i, line in enumerate(lines):
        if line.startswith(f"{key}="):
            lines[i] = f"{key}={value}"
            updated = True
            break

    if not updated:
        lines.append(f"{key}={value}")

    env_path.write_text("\n".join(lines) + "\n")
    print(f"✅ Updated {env_path} → {key}={value}")


for target in TARGETS:
    update_env_file(target["path"], target["key"], NEW_URL)

print(f"\n🎉 API base URL set to {NEW_URL} in all projects.")


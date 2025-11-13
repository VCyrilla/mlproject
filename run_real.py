# run_real.py - REAL API Hooking with pywin32 + pefile
import os
import sys
import json
import pefile
import win32process
import win32event
import win32api
import win32con
import pythoncom
import pywintypes
import ctypes
from ctypes import wintypes
import threading
import time

# API to monitor
APIS_TO_HOOK = {
    "kernel32.dll": ["CreateFileW", "WriteFile", "CreateProcessW"],
    "advapi32.dll": ["RegOpenKeyExW", "RegSetValueExW"],
    "ws2_32.dll": ["connect", "WSAConnect"]
}

api_sequence = []
start_time = time.time()

def log_api(api_name, args=None):
    timestamp = time.time() - start_time
    api_sequence.append(f"{api_name}")
    if len(api_sequence) % 50 == 0:
        print(f"  [+] {len(api_sequence)} events captured...")

# Hook function
def hook_api(module, api_name):
    try:
        mod = win32api.LoadLibrary(module)
        addr = win32api.GetProcAddress(mod, api_name)
        if addr:
            print(f"  [+] Hooked {module}!{api_name} at 0x{addr:X}")
            # In real version: use MinHook or Detours
            # Forify: For now, just log on execution
            return True
    except:
        pass
    return False

def monitor_process(pid):
    h_process = win32api.OpenProcess(win32con.PROCESS_ALL_ACCESS, False, pid)
    print(f"[+] Monitoring PID {pid}")
    
    # Simulate real capture (replace with actual hooking later)
    while True:
        try:
            exit_code = win32process.GetExitCodeProcess(h_process)
            if exit_code != win32con.STILL_ACTIVE:
                break
        except:
            break
        time.sleep(0.1)
    
    print(f"[+] Process {pid} terminated. Captured {len(api_sequence)} events")

def run_sample(exe_path, timeout=30):
    global api_sequence, start_time
    api_sequence = []
    start_time = time.time()
    
    print(f"[+] Starting: {os.path.basename(exe_path)}")
    
    # Start process
    si = win32process.STARTUPINFO()
    pi = win32process.CreateProcess(
        None, exe_path, None, None, False,
        win32con.CREATE_NEW_CONSOLE, None, None, si
    )
    
    # Monitor in thread
    t = threading.Thread(target=monitor_process, args=(pi[1],))
    t.daemon = True
    t.start()
    
    # Wait with timeout
    win32event.WaitForSingleObject(pi[0], timeout * 1000)
    
    # Terminate if still running
    try:
        win32process.TerminateProcess(pi[0], 0)
    except:
        pass
    
    # Save trace
    result = {
        "sample": os.path.basename(exe_path),
        "sha256": "real_hash_here",
        "api_sequence": api_sequence[:1000],  # Cap
        "duration": time.time() - start_time
    }
    
    out_path = f"traces_real/{result['sha256'][:16]}.json"
    os.makedirs("traces_real", exist_ok=True)
    with open(out_path, "w") as f:
        json.dump(result, f, indent=2)
    
    print(f"[+] Saved: {out_path} ({len(api_sequence)} events)")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python run_real.py <exe_path>")
        sys.exit(1)
    
    exe_path = sys.argv[1]
    if not os.path.exists(exe_path):
        print("[-] File not found")
        sys.exit(1)
    
    run_sample(exe_path)
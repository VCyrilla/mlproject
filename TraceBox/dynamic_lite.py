# dynamic_lite.py
import os
import json
import time
import hashlib
import subprocess
import psutil
from datetime import datetime

# ----------------------------------------------------------------------
# Optional: registry monitoring (requires pywin32)
# ----------------------------------------------------------------------
try:
    import winreg
    REG_ENABLED = True
except Exception:
    REG_ENABLED = False

# ----------------------------------------------------------------------
class TraceBoxLite:
    def __init__(self):
        self.events = {
            "sample": "",
            "sha256": "",
            "execution_time": 0.0,
            "api_sequence": [],        # for ML
            "files": [],              # full paths
            "processes": [],          # child processes
            "registry": [],           # (key, value) if enabled
            "network": []             # (src_ip, dst_ip, port)
        }

    # ------------------------------------------------------------------
    def _sha256(self, path: str) -> str:
        h = hashlib.sha256()
        with open(path, "rb") as f:
            for chunk in iter(lambda: f.read(8192), b""):
                h.update(chunk)
        return h.hexdigest()

    # ------------------------------------------------------------------
    def _monitor_files(self, pid: int):
        """Very light file-touch detection in %TEMP%, %APPDATA%, %LOCALAPPDATA%"""
        dirs = [
            os.getenv("TEMP", ""),
            os.getenv("APPDATA", ""),
            os.getenv("LOCALAPPDATA", ""),
            os.path.dirname(__file__)          # current folder
        ]
        now = time.time()
        for base in dirs:
            if not base or not os.path.isdir(base):
                continue
            try:
                for root, _, files in os.walk(base):
                    for f in files:
                        fp = os.path.join(root, f)
                        if os.path.getmtime(fp) > now - 30:   # created in last 30 s
                            self.events["files"].append(fp)
                            self.events["api_sequence"].append("CreateFile")
            except Exception:
                pass

    # ------------------------------------------------------------------
    def _monitor_processes(self, pid: int):
        try:
            p = psutil.Process(pid)
            children = p.children(recursive=True)
            for c in children:
                self.events["processes"].append({
                    "pid": c.pid,
                    "name": c.name(),
                    "exe": c.exe(),
                    "cmdline": " ".join(c.cmdline())
                })
                self.events["api_sequence"].append("CreateProcess")
        except Exception:
            pass

    # ------------------------------------------------------------------
    def _monitor_registry(self, pid: int):
        if not REG_ENABLED:
            return
        # This is a **very small** example – hook only HKCU\Software
        try:
            key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software", 0, winreg.KEY_READ)
            i = 0
            while True:
                sub = winreg.EnumKey(key, i)
                self.events["registry"].append(f"HKCU\\Software\\{sub}")
                self.events["api_sequence"].append("RegOpenKey")
                i += 1
        except OSError:
            pass
        finally:
            winreg.CloseKey(key)

    # ------------------------------------------------------------------
    def _monitor_network(self, pid: int):
        """Capture outbound connections via psutil (TCP only)"""
        try:
            p = psutil.Process(pid)
            conns = p.connections(kind="inet")
            for c in conns:
                if c.status == psutil.CONN_ESTABLISHED and c.raddr:
                    self.events["network"].append({
                        "dst_ip": c.raddr.ip,
                        "dst_port": c.raddr.port,
                        "type": c.type.name
                    })
                    self.events["api_sequence"].append("TCP Connect")
        except Exception:
            pass

    # ------------------------------------------------------------------
    def analyze(self, exe_path: str, timeout: int = 30) -> dict:
        exe_name = os.path.basename(exe_path)
        print(f"\n[+] Analyzing: {exe_name}")

        # ---- start target ------------------------------------------------
        proc = subprocess.Popen(
            [exe_path],
            cwd=os.path.dirname(exe_path) or ".",
            creationflags=subprocess.CREATE_NO_WINDOW
        )
        pid = proc.pid
        print(f"[+] PID: {pid}")

        start_time = time.time()

        # ---- give the program a moment to settle -----------------------
        time.sleep(2)

        # ---- collect traces --------------------------------------------
        self._monitor_processes(pid)
        self._monitor_files(pid)
        self._monitor_registry(pid)
        self._monitor_network(pid)

        # ---- wait for termination (or kill) ----------------------------
        try:
            proc.wait(timeout=timeout)
        except subprocess.TimeoutExpired:
            proc.terminate()
            try:
                proc.wait(5)
            except:
                proc.kill()

        # ---- finalize ---------------------------------------------------
        self.events["execution_time"] = time.time() - start_time
        self.events["sample"] = exe_name
        self.events["sha256"] = self._sha256(exe_path)

        return self.events
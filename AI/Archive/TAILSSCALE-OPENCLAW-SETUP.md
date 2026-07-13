# Tailscale Serve Setup for OpenClaw Gateway

## Run on Windows pb-legion (PowerShell as Administrator)

```powershell
# Install Tailscale CLI if not present
scoop install tailscale

# Expose OpenClaw gateway (WSL IP: 172.20.234.118) on port 18789
tailscale serve --bg --https / http://172.20.234.118:18789

# Verify
tailscale serve status
```

## Alternative: Direct IP access for phone on same WiFi

If your phone is on the same WiFi as pb-legion:
- Server: `http://192.168.4.107:18789` (or whatever Windows LAN IP)
- Token: `085a8618c06ca6a1ba5309f4586936d99da7ed8b535eeca1`

## Find Windows LAN IP

```powershell
# Windows PowerShell
ipconfig | findstr "IPv4"
```

## Tailscale HTTPS Endpoint

After config, access via:
- `https://pb-legion.tail587e7c.ts.net/`
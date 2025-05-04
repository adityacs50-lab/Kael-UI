# KAEL UI Deployment Guide

This guide explains how to deploy KAEL UI for online and offline use.

## Quick Start

For the easiest deployment, simply run:

```
deploy.bat
```

This will:
1. Build the KAEL UI frontend
2. Start the standalone server with embedded API keys
3. Open your browser to the KAEL interface

## Manual Deployment

If you prefer to deploy manually, follow these steps:

### 1. Build the Frontend

```bash
npm run build
```

This creates optimized production files in the `dist` directory.

### 2. Start the Standalone Server

```bash
python standalone_server.py
```

The standalone server:
- Has the Gemini API key embedded (no .env file needed)
- Serves the static frontend files
- Provides offline fallbacks for all features
- Opens your browser automatically

## Accessing KAEL

Once deployed, KAEL is available at:
- **Local access**: http://localhost:5000
- **Network access**: http://[your-ip-address]:5000 (accessible from other devices on your network)

## Offline Capabilities

The standalone server includes offline fallbacks for:
- Weather information (simulated)
- News updates (pre-defined)
- Web searches (common knowledge database)
- Gemini AI (falls back to built-in responses)

## Customization

To customize the deployment:

1. **Change the API key**: Edit `standalone_server.py` and update the `GEMINI_API_KEY` variable
2. **Disable features**: Set any of these variables to `False` in `standalone_server.py`:
   - `SEARCH_ENABLED`
   - `NEWS_ENABLED`
   - `WEATHER_ENABLED`
   - `GEMINI_ENABLED`
3. **Change the port**: Edit the `app.run()` line at the bottom of `standalone_server.py`

## Troubleshooting

If you encounter issues:

1. **Server won't start**: Make sure you have all required Python packages installed:
   ```
   pip install flask flask-cors requests
   ```

2. **Frontend not loading**: Check that the build completed successfully and the `dist` directory exists

3. **API errors**: The standalone server will automatically fall back to offline mode if APIs are unavailable

4. **Browser doesn't open**: Manually navigate to http://localhost:5000
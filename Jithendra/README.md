# FarmHub

One launcher for four farm apps. Click a card and the app opens inside FarmHub.

| App | What it does | Folder |
|---|---|---|
| FarmVet | Livestock health, vaccines, medicines, appointments, breeding, nutrition | `apps/farmvet` |
| FarmLink | Rent and share farm machinery, bookings, community, messages | `apps/farmlink` |
| CropDoctor AI | Crop disease scan (demo analysis), library, history | `apps/cropdoctor-ai` |
| AgriSmart | Crops, fields, tasks, finance, livestock, inventory, weather | `apps/agrismart` |

## Run
Unzip, then open `index.html` in a browser. There is no build step or backend.

For CropDoctor's camera (needs https or localhost), run a local server instead:

    cd farmhub
    python3 -m http.server 8000
    # visit http://localhost:8000

## Using the hub
- Click any card to open that app. Use **← FarmHub** to go back.
- The chips in the top bar switch between apps. Each app keeps its place while you switch.
- **↗ New tab** opens the current app on its own.
- Links like `index.html#/agrismart` open an app directly.

## Notes
- The apps are unchanged from your originals and live under `apps/`.
- Their saved data uses separate localStorage keys (`fv_*`, `cd_*`, `agrismart`), so they don't overwrite each other.
- AgriSmart's charts and the Google Fonts need an internet connection.
- To add a fifth app, copy its folder into `apps/` and add one entry to the `APPS` list in `index.html`.

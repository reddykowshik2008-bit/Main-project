# CropDoctor AI - Detect. Diagnose. Protect.

Demo AI crop disease detection app (HTML, CSS, JavaScript). No backend needed.

## Run
Open `index.html` in a browser. Camera access needs https or localhost
(e.g. `python3 -m http.server` then visit http://localhost:8000).

## Structure
- `index.html` - app shell (dashboard, scanner, library, history, profile, settings are views rendered by JS)
- `css/style.css` - styles, dark mode via CSS variables
- `js/app.js` - all logic; scan history, profile, settings and theme are stored in localStorage
- `images/` - reserved for crop photos and logo

## Connect a real AI model
Replace the body of `analyzeCropImage(file, crop)` in `js/app.js` with:

    const fd = new FormData(); fd.append('image', file); fd.append('crop', crop);
    const res = await fetch('/api/predict', {method:'POST', body: fd});
    return res.json(); // {crop, dis, conf, alts:[{n,p}], demo:false}

Never put API keys in frontend code; keep them on your server.

## Notes
Results are simulated and labelled "Demo AI Analysis". AI output is an indication only;
consult an agricultural expert before applying chemical treatments.

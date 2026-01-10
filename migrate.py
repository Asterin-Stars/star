
import re

with open('restore_index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract CSS
css_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
css_content = ""
if css_match:
    css_content = css_match.group(1)
    # Remove the old Preloader CSS
    css_content = re.sub(r'/\* =+.*?PRELOADER.*?=+\s*\*/.*?#starPreloader.*?\{.*?\}\s*#starPreloader\.loaded.*?\{.*?\}', '', css_content, flags=re.DOTALL)
    # Remove the generic preloader css blocks roughly
    css_content = re.sub(r'#starPreloader\b.*?\}(?=\s*[.#@])', '', css_content, flags=re.DOTALL)

# Extract JS
js_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
js_content = ""
if js_match:
    js_content = js_match.group(1)

# Clean HTML
html_content = re.sub(r'<style>.*?</style>', '', content, flags=re.DOTALL)
html_content = re.sub(r'<script>.*?</script>', '<script src="src/js/app.js"></script>', html_content, flags=re.DOTALL)

# Inject New Preloader
new_preloader = '''
    <!-- VISUAL ENGINE: PRELOADER -->
    <div id="preloader">
      <div class="loader-glow"></div>
      <div class="loader-star">✦</div>
    </div>

    <!-- APP CONTAINER (INITIALLY HIDDEN) -->
    <section id="view-welcome" class="view">
        <div class="glass-card fade-in-up">
          <h1 class="hero-title">Star ✦ Oracle</h1>
          <p class="hero-subtitle">The stars align to reveal your path.</p>
          <button id="btn-start" class="btn-holo">
            <span>Begin Journey</span>
          </button>
        </div>
    </section>
'''

# Replace old preloader with new one
html_content = re.sub(r'<div id="starPreloader">.*?</div>', new_preloader, html_content, flags=re.DOTALL)

# Update Link to CSS
html_content = re.sub(r'</head>', '<link rel="stylesheet" href="src/css/main.css">\n</head>', html_content)

# Save Files
with open('src/css/main.css', 'w', encoding='utf-8') as f:
    f.write("@import 'variables.css';\n@import 'preloader.css';\n@import 'welcome.css';\n\n" + css_content)

with open('src/js/app.js', 'w', encoding='utf-8') as f:
    # Inject our new logic at the top or replace the load listener
    # We'll just prepend the new load logic and maybe the old one will run too?
    # Better to control it.
    
    preloader_logic = '''
console.log("Star ✦ Oracle: System Initializing...");

window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");

  // Simulate minimum load time for effect and to ensure smoothness
  setTimeout(() => {
    if (preloader) {
      preloader.classList.add("hidden");
      console.log("Star ✦ Oracle: Visual Engine Ready.");
      
      // Activate Welcome View
      setTimeout(() => {
        const welcomeView = document.getElementById("view-welcome");
        if (welcomeView) welcomeView.classList.add("active");
      }, 500); 
    }
    
    // Auto-trigger old initialization if needed
    if (typeof prepareOracle === 'function') prepareOracle();
    if (typeof init3DCardEffect === 'function') init3DCardEffect();
    if (typeof initFloatingStars === 'function') initFloatingStars();
    if (typeof initGyroscopeBorders === 'function') initGyroscopeBorders();
    if (typeof initSettingsControls === 'function') initSettingsControls();

  }, 2000); 
});

// Listener for Start Button
document.addEventListener('DOMContentLoaded', () => {
    const btnStart = document.getElementById('btn-start');
    if(btnStart) {
        btnStart.addEventListener('click', () => {
            const welcome = document.getElementById('view-welcome');
            if(welcome) {
                welcome.style.opacity = '0';
                setTimeout(() => {
                    welcome.style.display = 'none';
                    // Show the main interface
                    // The old interface might be hidden by body.loading css?
                    document.body.classList.remove('loading');
                }, 500);
            }
        });
    }
});

'''
    # We need to strip the old window.onload from extracted JS to avoid conflict
    js_content = re.sub(r'window\.addEventListener\(\'load\',.*?\}\);', '', js_content, flags=re.DOTALL)
    
    f.write(preloader_logic + js_content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Migration Complete")

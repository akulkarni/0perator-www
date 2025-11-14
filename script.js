// =============================================================================
// Copy Install Command
// =============================================================================

const copyBtn = document.getElementById('copyBtn');
const installCommand = document.getElementById('installCommand');

if (copyBtn && installCommand) {
    copyBtn.addEventListener('click', async function() {
        const text = installCommand.textContent.trim();

        try {
            await navigator.clipboard.writeText(text);

            // Visual feedback
            this.classList.add('copied');
            const originalHTML = this.innerHTML;

            this.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;

            setTimeout(() => {
                this.classList.remove('copied');
                this.innerHTML = originalHTML;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    });
}


// =============================================================================
// Terminal Typewriter Animation
// =============================================================================

const terminalPrompt = "Build a task management app with user authentication and database";
const typedPromptElement = document.getElementById('typedPrompt');
const terminalOutputElement = document.getElementById('terminalOutput');
const terminalStatsElement = document.getElementById('terminalStats');

const outputLines = [
    { text: "⚡ 0perator initialized", delay: 800, type: 'init' },
    { text: "", delay: 200 },
    { text: "→ Provisioning Postgres database on TigerData...", delay: 600, type: 'action' },
    { text: "  ✓ Database created: <span class='terminal-url'>postgres://tiger-db-xj4k.cloud</span>", delay: 1000, type: 'success' },
    { text: "", delay: 200 },
    { text: "→ Scaffolding Node/TypeScript application...", delay: 600, type: 'action' },
    { text: "  ✓ Template initialized", delay: 400, type: 'success' },
    { text: "  ✓ Dependencies installed", delay: 400, type: 'success' },
    { text: "  ✓ Auth configured", delay: 400, type: 'success' },
    { text: "  ✓ Database models generated", delay: 400, type: 'success' },
    { text: "", delay: 200 },
    { text: "→ Deploying application...", delay: 600, type: 'action' },
    { text: "  ✓ Server started on <span class='terminal-url'>http://localhost:3000</span>", delay: 800, type: 'success' },
    { text: "", delay: 400 },
];

let charIndex = 0;
let lineIndex = 0;
let isTypingPrompt = true;
let startTime = null;

function typePrompt() {
    if (charIndex < terminalPrompt.length) {
        typedPromptElement.textContent = terminalPrompt.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typePrompt, 50);
    } else {
        // Finished typing prompt, hide cursor and start output
        setTimeout(() => {
            const cursor = document.querySelector('.cursor-blink');
            if (cursor) {
                cursor.style.display = 'none';
            }
            isTypingPrompt = false;
            startTime = Date.now();
            displayOutput();
        }, 500);
    }
}

function displayOutput() {
    if (lineIndex < outputLines.length) {
        const line = outputLines[lineIndex];
        const lineElement = document.createElement('div');
        lineElement.innerHTML = line.text;

        // Apply styling based on type
        if (line.type === 'init') {
            lineElement.className = 'terminal-line-init';
        } else if (line.type === 'action') {
            lineElement.className = 'terminal-line-action';
        } else if (line.type === 'success') {
            lineElement.className = 'terminal-line-success';
        }

        terminalOutputElement.appendChild(lineElement);

        lineIndex++;
        setTimeout(displayOutput, line.delay);
    } else {
        // All output displayed, show final stats
        showFinalStats();
    }
}

function showFinalStats() {
    const endTime = Date.now();
    const elapsed = ((endTime - startTime) / 1000).toFixed(1);

    terminalStatsElement.textContent = `✓ Deployment complete — Total time: ${elapsed}s`;
    terminalStatsElement.style.animation = 'fadeIn 0.6s forwards';
}

function animateCounter(target) {
    let current = 0;
    const increment = target / 60; // 60 frames
    const counterElement = terminalStatsElement.querySelector('span:last-child');

    function updateCounter() {
        current += increment;
        if (current < target) {
            counterElement.textContent = `Total time: ${current.toFixed(1)}s`;
            requestAnimationFrame(updateCounter);
        } else {
            counterElement.textContent = `Total time: ${target}s`;
        }
    }

    updateCounter();
}

// =============================================================================
// Intersection Observer for Stat Counters
// =============================================================================

function animateStatNumber(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const start = 0;
    const startTime = performance.now();

    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.floor(start + (target - start) * easeOutExpo);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(updateNumber);
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                if (!stat.hasAttribute('data-animated')) {
                    stat.setAttribute('data-animated', 'true');
                    animateStatNumber(stat);
                }
            });
        }
    });
}, { threshold: 0.5 });

const featuresSection = document.querySelector('.how-it-works');
if (featuresSection) {
    statObserver.observe(featuresSection);
}

// =============================================================================
// Terminal Animation Trigger
// =============================================================================

const terminalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && charIndex === 0) {
            setTimeout(() => {
                typePrompt();
            }, 300);
        }
    });
}, { threshold: 0.3 });

const terminalWindow = document.querySelector('.terminal-window');
if (terminalWindow) {
    terminalObserver.observe(terminalWindow);
}


// =============================================================================
// Copy to Clipboard for Code Prompts
// =============================================================================

const casePrompts = document.querySelectorAll('.case-prompt');

casePrompts.forEach(prompt => {
    prompt.style.cursor = 'pointer';
    prompt.title = 'Click to copy';

    prompt.addEventListener('click', async function() {
        const text = this.textContent.trim().replace(/^"|"$/g, '');

        try {
            await navigator.clipboard.writeText(text);

            // Visual feedback
            const originalText = this.textContent;
            this.textContent = '✓ Copied!';
            this.style.color = 'var(--color-accent)';

            setTimeout(() => {
                this.textContent = originalText;
                this.style.color = '';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    });
});



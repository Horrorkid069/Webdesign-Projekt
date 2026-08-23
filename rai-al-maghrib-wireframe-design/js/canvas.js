(() => {
    "use strict";

    const canvas = document.getElementById("rai-pulse");
    const button = document.getElementById("pulse-toggle");

    if (!(canvas instanceof HTMLCanvasElement) || !(button instanceof HTMLButtonElement)) {
        return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
        return;
    }

    const css = getComputedStyle(document.documentElement);
    const colors = {
        background: css.getPropertyValue("--color-ink").trim(),
        sand: css.getPropertyValue("--color-sand").trim(),
        red: css.getPropertyValue("--color-red").trim(),
        teal: css.getPropertyValue("--color-teal").trim(),
        paper: css.getPropertyValue("--color-paper").trim()
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let running = false;
    let animationFrame = 0;
    let startTime = 0;

    function draw(time = 0) {
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const elapsed = (time - startTime) / 1000;

        context.fillStyle = colors.background;
        context.fillRect(0, 0, width, height);

        const waves = [
            { speed: 54, offset: 0, color: colors.sand, width: 8 },
            { speed: 54, offset: 48, color: colors.teal, width: 6 },
            { speed: 54, offset: 96, color: colors.red, width: 4 }
        ];

        waves.forEach((wave) => {
            const radius = 44 + ((elapsed * wave.speed + wave.offset) % 165);
            const opacity = 1 - ((radius - 44) / 165);

            context.beginPath();
            context.arc(centerX, centerY, radius, 0, Math.PI * 2);
            context.strokeStyle = wave.color;
            context.globalAlpha = Math.max(0.14, opacity);
            context.lineWidth = wave.width;
            context.stroke();
        });

        context.globalAlpha = 1;
        context.beginPath();
        context.arc(centerX, centerY, 32, 0, Math.PI * 2);
        context.fillStyle = colors.paper;
        context.fill();

        context.fillStyle = colors.background;
        context.font = "700 23px Arial, sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText("RAÏ", centerX, centerY + 1);

        context.fillStyle = colors.paper;
        context.font = "16px Arial, sans-serif";
        context.fillText("Rhythmus · Stimme · Bewegung", centerX, height - 34);

        if (running) {
            animationFrame = window.requestAnimationFrame(draw);
        }
    }

    function updateButton() {
        button.textContent = running ? "Animation anhalten" : "Animation starten";
        button.setAttribute("aria-pressed", String(running));
    }

    button.addEventListener("click", () => {
        running = !running;
        updateButton();

        if (running) {
            startTime = performance.now();
            animationFrame = window.requestAnimationFrame(draw);
        } else {
            window.cancelAnimationFrame(animationFrame);
        }
    });

    if (reduceMotion) {
        button.disabled = true;
        button.textContent = "Animation wegen Bewegungseinstellung deaktiviert";
    }

    draw(0);
})();

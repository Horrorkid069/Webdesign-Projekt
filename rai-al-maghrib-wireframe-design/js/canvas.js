document.addEventListener("DOMContentLoaded", function () {

    const audio = document.getElementById("raiAudio");
    const canvas = document.getElementById("audioCanvas");
    const ctx = canvas.getContext("2d");

    let animationId = null;


    /*
     * Vorbereitete Wellenform.
     *
     * Jeder Wert steht für die Lautstärke
     * eines Abschnitts des Songs.
     *
     * Wertebereich: 0 bis 1
     */
    const waveformData = [
        0.22, 0.31, 0.28, 0.43, 0.51, 0.39, 0.58, 0.64,
        0.47, 0.53, 0.71, 0.62, 0.44, 0.57, 0.76, 0.68,
        0.49, 0.61, 0.82, 0.73, 0.55, 0.69, 0.86, 0.78,
        0.62, 0.72, 0.91, 0.83, 0.67, 0.79, 0.94, 0.87,
        0.71, 0.81, 0.96, 0.88, 0.74, 0.84, 0.92, 0.80,
        0.65, 0.77, 0.89, 0.84, 0.69, 0.75, 0.93, 0.86,
        0.73, 0.82, 0.95, 0.89, 0.76, 0.85, 0.91, 0.79,
        0.66, 0.74, 0.88, 0.83, 0.70, 0.81, 0.94, 0.87,
        0.72, 0.78, 0.90, 0.82, 0.68, 0.76, 0.89, 0.85,
        0.71, 0.80, 0.92, 0.84, 0.69, 0.77, 0.88, 0.81,
        0.65, 0.73, 0.86, 0.79, 0.63, 0.71, 0.84, 0.76,
        0.61, 0.69, 0.81, 0.74, 0.58, 0.66, 0.78, 0.72,
        0.55, 0.63, 0.75, 0.69, 0.52, 0.60, 0.71, 0.64
    ];


    /*
     * Canvas zeichnen
     */
    function zeichneCanvas() {

        const breite = canvas.width;
        const hoehe = canvas.height;

        ctx.clearRect(0, 0, breite, hoehe);


        /*
         * Hintergrund
         */
        ctx.fillStyle = "#f3f0e8";
        ctx.fillRect(0, 0, breite, hoehe);


        /*
         * Aktuellen Fortschritt berechnen
         *
         * Beispiel:
         * currentTime = 100 Sekunden
         * duration    = 200 Sekunden
         *
         * Fortschritt = 0.5 = 50 %
         */
        let fortschritt = 0;

        if (
            Number.isFinite(audio.duration) &&
            audio.duration > 0
        ) {
            fortschritt =
                audio.currentTime / audio.duration;
        }


        /*
         * Anzahl der bereits abgespielten
         * Balken berechnen
         */
        const abgespielteBalken =
            Math.floor(
                fortschritt *
                waveformData.length
            );


        /*
         * Abstände und Größen
         */
        const abstand = 3;

        const barWidth =
            (breite -
                ((waveformData.length - 1) * abstand))
            / waveformData.length;

        const maxHeight =
            hoehe * 0.75;


        /*
         * Mittellinie
         */
        const mitte =
            hoehe / 2;


        /*
         * Balken zeichnen
         */
        for (
            let i = 0;
            i < waveformData.length;
            i++
        ) {

            const wert =
                waveformData[i];


            const barHeight =
                wert * maxHeight;


            const x =
                i * (barWidth + abstand);


            const y =
                mitte - (barHeight / 2);


            /*
             * Bereits abgespielter Teil = Rot
             *
             * Noch nicht abgespielt = Grau
             */
            if (i <= abgespielteBalken) {

                ctx.fillStyle = "#9d2d2d";

            } else {

                ctx.fillStyle = "#c8c3ba";
            }


            /*
             * Balken
             */
            ctx.fillRect(
                x,
                y,
                barWidth,
                barHeight
            );
        }


        /*
         * Aktuelle Wiedergabeposition
         * als dünne Linie darstellen
         */
        if (fortschritt > 0) {

            const positionX =
                fortschritt * breite;

            ctx.fillStyle = "#1f6653";

            ctx.fillRect(
                positionX,
                0,
                2,
                hoehe
            );
        }
    }


    /*
     * Animation während der Wiedergabe
     */
    function animation() {

        zeichneCanvas();

        if (
            !audio.paused &&
            !audio.ended
        ) {

            animationId =
                requestAnimationFrame(animation);
        }
    }


    /*
     * PLAY
     */
    audio.addEventListener(
        "play",
        function () {

            if (animationId !== null) {

                cancelAnimationFrame(animationId);
            }

            animation();
        }
    );


    /*
     * PAUSE
     */
    audio.addEventListener(
        "pause",
        function () {

            if (animationId !== null) {

                cancelAnimationFrame(animationId);
                animationId = null;
            }

            zeichneCanvas();
        }
    );


    /*
     * Benutzer springt im Lied
     */
    audio.addEventListener(
        "seeked",
        function () {

            zeichneCanvas();
        }
    );


    /*
     * Wird auch während des Verschiebens
     * im Audio-Player aktualisiert
     */
    audio.addEventListener(
        "timeupdate",
        function () {

            if (audio.paused) {

                zeichneCanvas();
            }
        }
    );


    /*
     * Audio-Metadaten wurden geladen
     */
    audio.addEventListener(
        "loadedmetadata",
        function () {

            zeichneCanvas();
        }
    );


    /*
     * Lied ist zu Ende
     */
    audio.addEventListener(
        "ended",
        function () {

            if (animationId !== null) {

                cancelAnimationFrame(animationId);
                animationId = null;
            }

            zeichneCanvas();
        }
    );


    /*
     * Canvas direkt beim Laden anzeigen
     */
    zeichneCanvas();

});
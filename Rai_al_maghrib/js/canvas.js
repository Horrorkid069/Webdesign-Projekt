document.addEventListener("DOMContentLoaded", function () {

    const audio = document.getElementById("raiAudio");
    const canvas = document.getElementById("audioCanvas");

    if (!audio || !canvas) {
        return;
    }

    const ctx = canvas.getContext("2d");

    /*
     * ECHTE RMS-AMPLITUDENWERTE
     * aus cest_toi_que_jaime.wav
     *
     * 180 Zeitabschnitte
     */
    const waveformData = [
        0.414, 0.569, 0.575, 0.550, 0.585, 0.525, 0.573, 0.665, 0.742, 0.709, 0.783, 0.738,
        0.662, 0.686, 0.607, 0.696, 0.647, 0.720, 0.694, 0.631, 0.649, 0.765, 0.689, 0.824,
        0.744, 0.815, 0.747, 0.788, 0.851, 0.857, 0.935, 0.900, 0.910, 0.785, 0.782, 0.637,
        0.669, 0.727, 0.781, 0.667, 0.708, 0.749, 0.558, 0.459, 0.558, 0.575, 0.584, 0.570,
        0.550, 0.691, 0.670, 0.790, 0.799, 0.679, 0.762, 0.821, 0.887, 0.802, 0.838, 0.796,
        0.807, 0.779, 0.762, 0.622, 0.687, 0.638, 0.767, 0.716, 0.779, 0.826, 0.660, 0.560,
        0.560, 0.683, 0.599, 0.633, 0.633, 0.695, 0.674, 0.754, 0.757, 0.820, 0.715, 0.816,
        0.782, 0.836, 0.838, 0.831, 0.945, 0.811, 0.832, 0.638, 0.731, 0.668, 0.808, 0.732,
        0.766, 0.689, 0.658, 0.353, 0.341, 0.430, 0.465, 0.428, 0.455, 0.670, 0.602, 0.634,
        0.695, 0.725, 0.710, 0.846, 0.729, 0.619, 0.636, 0.655, 0.633, 0.658, 0.670, 0.826,
        0.833, 0.869, 0.849, 1.000, 0.886, 0.754, 0.754, 0.684, 0.623, 0.684, 0.729, 0.757,
        0.665, 0.693, 0.594, 0.607, 0.618, 0.662, 0.690, 0.613, 0.693, 0.871, 0.730, 0.831,
        0.694, 0.796, 0.777, 0.869, 0.942, 0.765, 0.881, 0.876, 0.817, 0.777, 0.770, 0.668,
        0.669, 0.799, 0.713, 0.727, 0.685, 0.714, 0.605, 0.642, 0.668, 0.613, 0.653, 0.618,
        0.753, 0.695, 0.693, 0.859, 0.861, 0.869, 0.668, 0.232, 0.043, 0.004, 0.000, 0.000
    ];

    let animationId = null;


    function zeichneWaveform() {

        const breite = canvas.width;
        const hoehe = canvas.height;

        ctx.clearRect(0, 0, breite, hoehe);


        /*
         * Hintergrund
         */
        ctx.fillStyle = "#f3f0e8";

        ctx.fillRect(
            0,
            0,
            breite,
            hoehe
        );


        /*
         * Wiedergabefortschritt bestimmen
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
         * Der aktuelle Balken
         */
        const aktuellerBalken =
            Math.floor(
                fortschritt *
                waveformData.length
            );


        /*
         * Zeichenbereich
         */
        const rand = 10;
        const abstand = 2;

        const nutzbareBreite =
            breite - (rand * 2);


        const barWidth =
            (
                nutzbareBreite -
                (
                    waveformData.length - 1
                ) * abstand
            )
            / waveformData.length;


        const maximaleHoehe =
            hoehe * 0.78;


        const mitte =
            hoehe / 2;


        /*
         * Alle echten Amplituden
         * zeichnen
         */
        for (
            let i = 0;
            i < waveformData.length;
            i++
        ) {

            const amplitude =
                waveformData[i];


            /*
             * Minimale Höhe von 2 Pixeln,
             * damit auch sehr leise Stellen
             * sichtbar bleiben.
             */
            const barHeight =
                Math.max(
                    2,
                    amplitude * maximaleHoehe
                );


            const x =
                rand +
                i *
                (
                    barWidth +
                    abstand
                );


            const y =
                mitte -
                barHeight / 2;


            /*
             * Bereits abgespielt
             */
            if (i < aktuellerBalken) {

                ctx.fillStyle = "#9d2d2d";

            }

            /*
             * Aktueller Abschnitt
             */
            else if (i === aktuellerBalken) {

                ctx.fillStyle = "#1f6653";

            }

            /*
             * Noch nicht abgespielt
             */
            else {

                ctx.fillStyle = "#c8c3ba";
            }


            ctx.fillRect(
                x,
                y,
                Math.max(1, barWidth),
                barHeight
            );
        }


        /*
         * Bewegliche Linie für die
         * aktuelle Wiedergabeposition
         */
        if (fortschritt > 0) {

            const positionX =
                rand +
                fortschritt *
                nutzbareBreite;


            ctx.fillStyle =
                "#1f6653";


            ctx.fillRect(
                positionX,
                5,
                2,
                hoehe - 10
            );
        }
    }


    /*
     * Animation während der Song läuft
     */
    function animation() {

        zeichneWaveform();


        if (
            !audio.paused &&
            !audio.ended
        ) {

            animationId =
                requestAnimationFrame(
                    animation
                );
        }
    }


    /*
     * PLAY
     */
    audio.addEventListener(
        "play",
        function () {

            if (animationId !== null) {

                cancelAnimationFrame(
                    animationId
                );
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

                cancelAnimationFrame(
                    animationId
                );

                animationId = null;
            }

            zeichneWaveform();
        }
    );


    /*
     * Wenn der Benutzer im Song springt
     */
    audio.addEventListener(
        "seeked",
        zeichneWaveform
    );


    /*
     * Metadaten wurden geladen
     */
    audio.addEventListener(
        "loadedmetadata",
        zeichneWaveform
    );


    /*
     * Song beendet
     */
    audio.addEventListener(
        "ended",
        function () {

            if (animationId !== null) {

                cancelAnimationFrame(
                    animationId
                );

                animationId = null;
            }

            zeichneWaveform();
        }
    );


    /*
     * Canvas beim Öffnen der Website
     * direkt anzeigen
     */
    zeichneWaveform();

});
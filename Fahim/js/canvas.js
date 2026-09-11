document.addEventListener("DOMContentLoaded", function () {

    const audio =
        document.getElementById("raiAudio");

    const canvas =
        document.getElementById("audioCanvas");

    if (!audio || !canvas) {
        return;
    }

    const ctx =
        canvas.getContext("2d");


    /*
     * Echte Amplitudenwerte der
     * 20-Sekunden-Audiodatei.
     *
     * 80 Werte = ca. 0,25 Sekunden
     * pro Balken.
     */
    const waveformData = [
        0.000, 0.624, 0.617, 0.326, 0.316, 0.211, 0.263, 0.219,
        0.683, 0.640, 0.433, 0.549, 0.442, 0.226, 0.250, 0.737,
        0.662, 0.436, 0.444, 0.371, 0.275, 0.346, 0.732, 0.734,
        0.421, 0.469, 0.456, 0.404, 0.507, 0.526, 0.692, 0.500,
        0.498, 0.381, 0.372, 0.594, 0.688, 0.586, 0.615, 0.483,
        0.400, 0.313, 0.556, 0.680, 0.502, 0.405, 0.417, 0.324,
        0.303, 0.718, 0.692, 0.446, 0.576, 0.494, 0.468, 0.512,
        0.722, 0.683, 0.630, 0.854, 0.408, 0.242, 0.556, 0.795,
        0.718, 0.675, 0.882, 0.608, 0.414, 0.498, 0.814, 0.721,
        0.675, 0.659, 0.342, 0.261, 0.529, 1.000, 0.892, 0.711
    ];


    let animationId = null;


    function zeichneWaveform() {

        const breite =
            canvas.width;

        const hoehe =
            canvas.height;


        ctx.clearRect(
            0,
            0,
            breite,
            hoehe
        );


        /*
         * Hintergrund
         */
        ctx.fillStyle =
            "#f3f0e8";

        ctx.fillRect(
            0,
            0,
            breite,
            hoehe
        );


        /*
         * Fortschritt zwischen 0 und 1
         */
        let fortschritt = 0;

        if (
            Number.isFinite(audio.duration) &&
            audio.duration > 0
        ) {
            fortschritt =
                audio.currentTime /
                audio.duration;
        }


        const aktuellerBalken =
            Math.floor(
                fortschritt *
                waveformData.length
            );


        const rand = 10;
        const abstand = 4;

        const nutzbareBreite =
            breite -
            rand * 2;


        const barWidth =
            (
                nutzbareBreite -
                (
                    waveformData.length - 1
                ) * abstand
            )
            / waveformData.length;


        const maximaleHoehe =
            hoehe * 0.75;


        const mitte =
            hoehe / 2;


        /*
         * Amplituden zeichnen
         */
        for (
            let i = 0;
            i < waveformData.length;
            i++
        ) {

            const amplitude =
                waveformData[i];


            const barHeight =
                Math.max(
                    2,
                    amplitude *
                    maximaleHoehe
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
            if (
                i < aktuellerBalken
            ) {

                ctx.fillStyle =
                    "#9d2d2d";

            }

            /*
             * Aktuelle Position
             */
            else if (
                i === aktuellerBalken
            ) {

                ctx.fillStyle =
                    "#1f6653";

            }

            /*
             * Noch nicht abgespielt
             */
            else {

                ctx.fillStyle =
                    "#c8c3ba";
            }


            ctx.fillRect(
                x,
                y,
                Math.max(
                    1,
                    barWidth
                ),
                barHeight
            );
        }


        /*
         * Bewegliche Positionslinie
         */
        if (
            fortschritt > 0
        ) {

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


    audio.addEventListener(
        "play",
        function () {

            if (
                animationId !== null
            ) {

                cancelAnimationFrame(
                    animationId
                );
            }


            animation();
        }
    );


    audio.addEventListener(
        "pause",
        function () {

            if (
                animationId !== null
            ) {

                cancelAnimationFrame(
                    animationId
                );

                animationId = null;
            }


            zeichneWaveform();
        }
    );


    audio.addEventListener(
        "seeked",
        zeichneWaveform
    );


    audio.addEventListener(
        "loadedmetadata",
        zeichneWaveform
    );


    audio.addEventListener(
        "ended",
        function () {

            animationId = null;

            zeichneWaveform();
        }
    );


    zeichneWaveform();

});
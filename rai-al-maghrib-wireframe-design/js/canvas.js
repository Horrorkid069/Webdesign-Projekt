const audio = document.getElementById("raiAudio");
const canvas = document.getElementById("audioCanvas");
const ctx = canvas.getContext("2d");

let audioContext;
let analyser;
let source;
let dataArray;
let visualizerGestartet = false;


// Canvas schon vor dem Start sichtbar machen
ctx.fillStyle = "#f3f0e8";
ctx.fillRect(0, 0, canvas.width, canvas.height);


audio.addEventListener("play", async function () {

    if (!audioContext) {

        audioContext = new AudioContext();

        // Audio-Player als Audioquelle
        source = audioContext.createMediaElementSource(audio);

        // Analyser erstellen
        analyser = audioContext.createAnalyser();

        analyser.fftSize = 256;

        const bufferLength = analyser.frequencyBinCount;

        dataArray = new Uint8Array(bufferLength);


        /*
         * WICHTIG:
         *
         * Audio direkt an Lautsprecher senden
         */
        source.connect(audioContext.destination);


        /*
         * Gleichzeitig Audio an den Analyser senden
         */
        source.connect(analyser);
    }


    // AudioContext aktivieren
    if (audioContext.state === "suspended") {
        await audioContext.resume();
    }


    if (!visualizerGestartet) {
        visualizerGestartet = true;
        zeichneVisualizer();
    }

});


function zeichneVisualizer() {

    requestAnimationFrame(zeichneVisualizer);

    analyser.getByteFrequencyData(dataArray);


    // Canvas löschen
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Hintergrund
    ctx.fillStyle = "#f3f0e8";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    const barWidth =
        (canvas.width / dataArray.length) * 1.7;

    let x = 0;


    for (let i = 0; i < dataArray.length; i++) {

        const barHeight = dataArray[i] * 0.4;

        ctx.fillStyle = "#9d2d2d";

        ctx.fillRect(
            x,
            canvas.height - barHeight,
            barWidth,
            barHeight
        );

        x += barWidth + 2;
    }
}
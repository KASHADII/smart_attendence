async function loadModels() {
    try {
        console.log("Loading models...");
        await faceapi.nets.tinyFaceDetector.loadFromUri("https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.2/model/");
        await faceapi.nets.faceLandmark68Net.loadFromUri("https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.2/model/");
        await faceapi.nets.ssdMobilenetv1.loadFromUri("https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.2/model/");
        console.log("Models loaded successfully!");
    } catch (error) {
        console.error("Error loading models:", error);
    }
}

async function startFaceDetection() {
    console.log("Starting face detection...");

    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => {
        video.srcObject = stream;
        console.log("Camera started!");
    }).catch(err => console.error("Camera access error:", err));

    video.addEventListener("play", () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        console.log("Canvas size set to:", canvas.width, canvas.height);

        setInterval(async () => {
            console.log("Detecting faces...");
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptors();

            console.log("Detections:", detections.length);

            const resizedDetections = faceapi.resizeResults(detections, { width: video.videoWidth, height: video.videoHeight });

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        }, 100);
    });
}

document.getElementById("startVideo").addEventListener("click", startFaceDetection);
loadModels();

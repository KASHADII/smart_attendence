
function generateQRCode() {
    let userId = "student123"; 
    let qrCodeDiv = document.getElementById("qrcode");
    qrCodeDiv.innerHTML = "";
    let qr = new QRCode(qrCodeDiv, { text: userId, width: 128, height: 128 });
}

document.getElementById("startVideo").addEventListener("click", async () => {
    await startFaceDetection();
});

async function startFaceDetection() {
    await faceapi.nets.tinyFaceDetector.loadFromUri("https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.2/model/");

    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");

    // Get user camera
    navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => {
        video.srcObject = stream;
    });

    video.addEventListener("play", async () => {
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);

        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
            const resizedDetections = faceapi.resizeResults(detections, displaySize);

            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
        }, 100);
    });
}



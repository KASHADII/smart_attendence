
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

    
    navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => {
        video.srcObject = stream;
    });

    video.addEventListener("play", async () => {
        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);

        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
            canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, detections);
        }, 100);
    });
}



document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const faceData = localStorage.getItem("faceData");
    if (!faceData) {
        alert("Please capture face data before registering.");
        return;
    }

    const qrCode = localStorage.getItem("qrCode");
    if (!qrCode) {
        alert("Please generate a QR code before registering.");
        return;
    }

    // ✅ Retrieve stored users and check if the email is already registered
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const emailExists = users.some(user => user.email === email);

    if (emailExists) {
        alert("This email is already registered. Please log in.");
        return;
    }

    // ✅ Store new user
    const newUser = { name, email, password, faceData, qrCode };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("🎉 Registration successful! You can now log in.");
    window.location.href = "login.html"; // Redirect to login page
});


async function captureFace() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");

    // ✅ Load models before running detection
    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.2/model/"),
        faceapi.nets.faceLandmark68Net.loadFromUri("https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.2/model/"),
        faceapi.nets.faceRecognitionNet.loadFromUri("https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.2/model/")
    ]);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;
        console.log("Camera started!");
    } catch (err) {
        alert("Camera access denied. Please allow camera permissions.");
        return;
    }

    video.addEventListener("play", async function detectFace() {
        setTimeout(async () => {
            console.log("Detecting face...");
            const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!detections) {
                alert("No face detected. Please try again.");
                return;
            }

            // ✅ Store Face Data & Prevent Further Captures
            localStorage.setItem("faceData", JSON.stringify(detections.descriptor));
            alert("✅ Face data captured successfully!");

            // ✅ Stop Camera Stream After Successful Capture
            let tracks = video.srcObject.getTracks();
            tracks.forEach(track => track.stop()); // Stop all video tracks
            video.srcObject = null; // Clear video source
            video.style.display = "none"; // Hide video element
        }, 2000);
    }, { once: true }); // ✅ Ensures event runs only ONCE
}



function generateQRCode() {
    const email = document.getElementById("email").value;
    if (!email) {
        alert("Enter email first!");
        return;
    }

    let qrCodeDiv = document.getElementById("qrcode");
    qrCodeDiv.innerHTML = "";
    new QRCode(qrCodeDiv, { text: email, width: 128, height: 128 });

    localStorage.setItem("qrCode", email);
    alert("QR Code Generated & Stored!");
}

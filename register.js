document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const role = document.getElementById("role").value;

    if (password !== confirmPassword) {
        alert("❌ Passwords do not match!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const emailExists = users.some(user => user.email === email);

    if (emailExists) {
        alert("⚠️ This email is already registered. Please log in.");
        return;
    }

    const faceData = localStorage.getItem("faceData");
    if (!faceData) {
        alert("⚠️ Please capture your face data before registering.");
        return;
    }

    const qrCode = localStorage.getItem("qrCode");
    if (!qrCode) {
        alert("⚠️ Please generate a QR code before registering.");
        return;
    }

  
    const newUser = { name, email, password, role, faceData, qrCode };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert(`🎉 Registration successful as ${role.toUpperCase()}! You can now log in.`);
    window.location.href = "login.html";
});


async function captureFace() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");

    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.2/model/"),
        faceapi.nets.faceLandmark68Net.loadFromUri("https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.2/model/"),
        faceapi.nets.faceRecognitionNet.loadFromUri("https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.2/model/")
    ]);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;
        console.log("📸 Camera started!");
    } catch (err) {
        alert("❌ Camera access denied. Please allow permissions.");
        return;
    }

    video.addEventListener("play", async function detectFace() {
        setTimeout(async () => {
            console.log("🔍 Detecting face...");
            const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!detections) {
                alert("⚠️ No face detected. Please try again.");
                return;
            }

           
            localStorage.setItem("faceData", JSON.stringify(detections.descriptor));
            alert("✅ Face data captured successfully!");

            
            let tracks = video.srcObject.getTracks();
            tracks.forEach(track => track.stop()); 
            video.srcObject = null;
            video.style.display = "none"; 
        }, 2000);
    }, { once: true }); 
}


function generateQRCode() {
    const email = document.getElementById("email").value;
    if (!email) {
        alert("⚠️ Enter email first before generating QR code!");
        return;
    }

    let qrCodeDiv = document.getElementById("qrcode");
    qrCodeDiv.innerHTML = "";
    new QRCode(qrCodeDiv, { text: email, width: 128, height: 128 });

    localStorage.setItem("qrCode", email);
    alert("✅ QR Code Generated & Stored!");
}


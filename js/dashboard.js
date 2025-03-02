document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        alert("⚠️ Please log in first!");
        window.location.href = "login.html";
        return;
    }

    const assignedClasses = JSON.parse(localStorage.getItem(`assignedClasses_${loggedInUser.email}`)) || [];
    const attendanceContainer = document.getElementById("attendanceContainer");
    attendanceContainer.innerHTML = "";

    if (assignedClasses.length > 0) {
        assignedClasses.forEach(className => {
            const classDiv = document.createElement("div");
            classDiv.classList.add("class-attendance");
            classDiv.innerHTML = `
                <h3>${className}</h3>
                <p class="present">Present: 0</p>
                <p class="absent">Absent: 0</p>
            `;
            attendanceContainer.appendChild(classDiv);
        });
    } else {
        attendanceContainer.innerHTML = "<p>No assigned classes found.</p>";
    }

    const qrCodeContainer = document.getElementById("qrCodeContainer");
    const qrCodeDiv = document.getElementById("qrcode");
    let qrCodeData = localStorage.getItem(`qrCode_${loggedInUser.email}`);

    console.log("📌 Checking QR Code Data in Dashboard:", qrCodeData);

    if (qrCodeData) {
        qrCodeContainer.style.display = "block";
        qrCodeDiv.innerHTML = "";
        new QRCode(qrCodeDiv, {
            text: qrCodeData,
            width: 128,
            height: 128
        });

        console.log("✅ QR Code Generated Successfully!");

        setTimeout(() => {
            localStorage.removeItem(`qrCode_${loggedInUser.email}`);
            qrCodeContainer.style.display = "none";
            qrCodeDiv.innerHTML = "";
            alert("⚠️ QR Code Expired. Request a new one if needed.");
        }, 300000);
    } else {
        console.log("⚠️ No QR Code found. Waiting for admin approval.");
    }
});

document.getElementById("requestQRCode").addEventListener("click", function () {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        alert("⚠️ Please log in first!");
        window.location.href = "login.html";
        return;
    }

    let qrRequests = JSON.parse(localStorage.getItem("qrRequests")) || [];

    const alreadyRequested = qrRequests.some(request => request.email === loggedInUser.email && request.status === "pending");

    if (alreadyRequested) {
        alert("⚠️ You already have a pending QR code request. Wait for admin approval.");
        return;
    }

    qrRequests.push({ email: loggedInUser.email, name: loggedInUser.name, status: "pending" });
    localStorage.setItem("qrRequests", JSON.stringify(qrRequests));

    alert("📩 QR Code request sent! Wait for admin approval.");
});

document.getElementById("startFaceRecognition").addEventListener("click", startFaceRecognition);

async function startFaceRecognition() {
    console.log("🚀 Starting face recognition...");

    if (typeof faceapi === "undefined") {
        console.error("❌ face-api.js is not loaded.");
        alert("⚠️ Face API not found. Refresh the page.");
        return;
    }

    // ✅ Load face recognition models
    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.2/model/"),
        faceapi.nets.faceLandmark68Net.loadFromUri("https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.2/model/"),
        faceapi.nets.faceRecognitionNet.loadFromUri("https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.2/model/")
    ]);

    const video = document.getElementById("video");

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;
        console.log("✅ Camera started successfully.");
    } catch (err) {
        console.error("❌ Camera access error:", err);
        alert("⚠️ Please allow camera permissions.");
        return;
    }

    video.addEventListener("play", async function verifyFace() {
        console.log("🎥 Video is playing...");

        setTimeout(async () => {
            const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!detections) {
                alert("⚠️ No face detected. Try again.");
                return;
            }

            let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            if (!loggedInUser || !loggedInUser.email) {
                alert("⚠️ Please log in first.");
                return;
            }

            let storedFaceData = localStorage.getItem(`faceData_${loggedInUser.email}`);

            if (!storedFaceData) {
                alert("⚠️ No face data found. Please register your face first.");
                console.error("❌ No face data found in localStorage for:", loggedInUser.email);
                return;
            }

            // ✅ Convert stored data back to Float32Array
            storedFaceData = new Float32Array(JSON.parse(storedFaceData));

            // ✅ Compare Faces
            const faceMatcher = new faceapi.FaceMatcher(
                new faceapi.LabeledFaceDescriptors("User", [storedFaceData])
            );
            const bestMatch = faceMatcher.findBestMatch(detections.descriptor);

            console.log("🔍 Face match result:", bestMatch);

            if (bestMatch.distance < 0.6) { // ✅ 0.6 is a good threshold
                alert("✅ Face Verified! Attendance Marked.");

                // ✅ Mark Attendance in LocalStorage
                let attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords")) || {};
                if (!attendanceRecords[loggedInUser.email]) attendanceRecords[loggedInUser.email] = [];
                
                attendanceRecords[loggedInUser.email].push({ date: new Date().toLocaleString(), status: "Present" });
                localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords));

            } else {
                alert("❌ Face Not Recognized! Use QR Code as Backup.");
            }

            // ✅ Stop Camera After Verification
            let tracks = video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            video.srcObject = null;
            video.style.display = "none";

        }, 2000);
    }, { once: true });
}



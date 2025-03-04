document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const role = document.getElementById("role").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const emailExists = users.some(user => user.email === email);

    if (emailExists) {
        alert("This email is already registered. Please log in.");
        return;
    }

    const domain = email.split("@")[1];

    const classAssignments = {
        "cs.university.edu": ["Data Structures", "Algorithms", "AI"],
        "ee.university.edu": ["Circuits", "Electronics", "Power Systems"],
        "me.university.edu": ["Thermodynamics", "Fluid Mechanics", "Machine Design"],
    };

    const assignedClasses = classAssignments[domain] || ["General Studies"];

    const newUser = { name, email, password, role, classes: assignedClasses };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert(`🎉 Registration successful! Assigned to: ${assignedClasses.join(", ")}`);

    localStorage.setItem(`assignedClasses_${email}`, JSON.stringify(assignedClasses));

    window.location.href = "login.html";
});

async function captureFace() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const captureButton = document.querySelector(".capture-button");

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
        alert("❌ Camera access denied. Please allow permissions.");
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

            localStorage.setItem("faceData", JSON.stringify(detections.descriptor));
            alert("Face data captured successfully!");

            let tracks = video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            video.srcObject = null;

            // Hide video & button after capture
            video.style.display = "none";
            captureButton.style.display = "none"; // Hide button after face capture
        }, 2000);
    }, { once: true });
}







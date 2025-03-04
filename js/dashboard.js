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
    let qrCodeData = localStorage.getItem(`qrCode_${loggedInUser.email}`);

    if (qrCodeData) {
        qrCodeContainer.style.display = "block";
        new QRCode(document.getElementById("qrcode"), {
            text: qrCodeData,
            width: 128,
            height: 128
        });

        
        setTimeout(() => {
            localStorage.removeItem(`qrCode_${loggedInUser.email}`);
            qrCodeContainer.style.display = "none";
            alert("⚠️ QR Code Expired. Request a new one if needed.");
        }, 30000);
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



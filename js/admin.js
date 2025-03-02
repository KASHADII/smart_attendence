document.addEventListener("DOMContentLoaded", function () {
    const qrRequestsList = document.getElementById("qrRequestsList");
    let qrRequests = JSON.parse(localStorage.getItem("qrRequests")) || [];

    qrRequestsList.innerHTML = ""; 

    if (qrRequests.length === 0) {
        qrRequestsList.innerHTML = "<p>No pending requests.</p>";
        return;
    }

    qrRequests.forEach((request, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${request.name} (${request.email})</strong> - Status: ${request.status}  
            <button onclick="approveRequest(${index})">✅ Approve</button>
            <button onclick="rejectRequest(${index})">❌ Reject</button>
        `;
        qrRequestsList.appendChild(li);
    });
});


function approveRequest(index) {
    let qrRequests = JSON.parse(localStorage.getItem("qrRequests")) || [];
    qrRequests[index].status = "approved";

    
    let qrCodeData = qrRequests[index].email + "_QR_" + Date.now();
    localStorage.setItem(`qrCode_${qrRequests[index].email}`, qrCodeData);
    console.log("🚀 QR Code Approved & Stored:", qrCodeData); 

    alert("✅ QR Code Approved & Sent!");
    localStorage.setItem("qrRequests", JSON.stringify(qrRequests));
    location.reload(); 
}


function rejectRequest(index) {
    let qrRequests = JSON.parse(localStorage.getItem("qrRequests")) || [];
    qrRequests.splice(index, 1); 
    alert("❌ QR Code request rejected.");
    localStorage.setItem("qrRequests", JSON.stringify(qrRequests));
    location.reload(); 
}

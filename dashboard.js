document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        alert(" Please log in first!");
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
});

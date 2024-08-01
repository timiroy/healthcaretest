const fullUserDetails = JSON.parse(sessionStorage.getItem("authDetails"));
const token = fullUserDetails?.token.access_token;
const userData = fullUserDetails?.user;

const logout = document.getElementById("logout-link");

logout.addEventListener("click", () => {
  sessionStorage.clear();
});

console.log(token);

if (token === undefined) {
  console.log("Don't bypass");
  window.location.href = "/index.html";
}

document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".tab-link");
  const mainContent = document.querySelector(".main-content");

  async function patientDetails(dashboardContainer) {
    const dashboardAppointment = dashboardContainer.querySelector(
      ".appointments-container"
    );

    const dashboardMedicalActivity =
      dashboardContainer.querySelector(".activities");

    const dashboardLabActivity =
      dashboardContainer.querySelector(".lab-activities");

    const dashboardMedications = dashboardContainer.querySelector(
      ".prescription-container"
    );

    const dashboardBillContainer =
      dashboardContainer.querySelector(".billings-table");

    const url = `http://13.48.48.198/v1/auth/me`;
    // const patientData = JSON.parse(sessionStorage.getItem("patientDetails"));
    // console.log(patientData);
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const patientData = await response.json();
      console.log(patientData);
      if (!patientData) {
        console.error("Dashboard data not found.");
        return;
      }

      const userGreeting = document.getElementById("greetUser");
      userGreeting.textContent = `Hello ${patientData.first_name}! 👋`;

      const userProfilePic = document.getElementById("profile-img");
      userProfilePic.src = patientData.profile_image;

      const appointmentTemplate = document.getElementById(
        "patientAppointmentTemplate"
      ).content;

      const medicalActivityTemplate = document.getElementById(
        "activityCardTemplate"
      ).content;

      const labReportTemplate =
        document.getElementById("labReportTemplate").content;

      const medicationsTemplate = document.getElementById(
        "prescriptionCardTemplate"
      ).content;

      const billingsTemplate =
        document.getElementById("billingsTemplate").content;

      patientData.billings.forEach((bill) => {
        const billRow = document.importNode(billingsTemplate, true);

        // Populate the template with lab result data
        billRow.querySelector(".amount-text").textContent = `$${bill?.amount}`;
        billRow.querySelector(".status").textContent =
          bill?.status.toLowerCase() === "not_paid" ? "NOT PAID" : bill?.status;
        billRow.querySelector(".status").style.backgroundColor =
          bill?.status.toLowerCase() === "not_paid"
            ? "#d893a3"
            : bill?.status.toLowerCase() === "paid"
            ? "#86e49d"
            : "#ebc474";
        billRow.querySelector(".status").style.color =
          bill?.status.toLowerCase() === "not_paid"
            ? "#b30021"
            : bill?.status.toLowerCase() === "paid"
            ? "#006b21"
            : "black";
        billRow.querySelector(".service-title").textContent = bill?.title;

        // Append the populated template to the container
        dashboardBillContainer.appendChild(billRow);
      });

      patientData.medications.forEach((appointment) => {
        const medicationCard = document.importNode(medicationsTemplate, true);

        // Populate the template with appointment data
        medicationCard.querySelector(".prescription-name").textContent =
          appointment?.medication_name;
        medicationCard.querySelector(".usage").textContent =
          appointment?.dosage;

        // Append the populated template to the container
        dashboardMedications.appendChild(medicationCard);
      });

      patientData.lab_reports.forEach((appointment) => {
        const labCard = document.importNode(labReportTemplate, true);

        // Populate the template with lab result data
        labCard.querySelector(".lab-info").textContent = appointment?.notes;
        labCard.querySelector(".lab-test").textContent = appointment?.test_name;
        const dateString = appointment?.test_date;
        const date = new Date(dateString);

        const day = date.getUTCDate();
        const month = date.toLocaleString("en-US", {
          month: "long",
          timeZone: "UTC",
        });
        const year = date.getUTCFullYear();

        const formattedDate = `${month} ${day}, ${year}`;
        labCard.querySelector(".lab-date").textContent = formattedDate;

        // Append the populated template to the container
        dashboardLabActivity.appendChild(labCard);
      });

      patientData.medical_history.forEach((appointment) => {
        const medicalCard = document.importNode(medicalActivityTemplate, true);

        // Populate the template with medical visits data
        medicalCard.querySelector(".history-note").textContent =
          appointment?.notes;
        medicalCard.querySelector(".condition-name").textContent =
          appointment?.condition;
        medicalCard.querySelector(
          ".diagnosis-date"
        ).textContent = `Diagnosed on ${new Date(
          appointment?.diagnosis_date
        ).toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`;

        // Append the populated template to the container
        dashboardMedicalActivity.appendChild(medicalCard);
      });

      patientData.appointments.forEach((appointment) => {
        const appointmentCard = document.importNode(appointmentTemplate, true);

        // Populate the template with appointment data
        appointmentCard.querySelector(".appointment-title").textContent =
          appointment?.reason_for_appointment;
        appointmentCard.querySelector(".doctor-name").textContent =
          "Dr Shaun Murphy";
        appointmentCard.querySelector(".doctor-title").textContent =
          "Cardiologist";
        appointmentCard.querySelector(".appointment-date span").textContent =
          new Date(appointment?.appointment_date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        appointmentCard.querySelector(".appointment-time span").textContent =
          new Date(appointment?.appointment_date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

        const doctorImg = appointmentCard.querySelector(".doctor-img img");
        doctorImg.src = "../../Assets/bearded-doctor-glasses.jpg";
        doctorImg.alt = `Image of ${appointment.doctorName}`;

        // Append the populated template to the container
        dashboardAppointment.appendChild(appointmentCard);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function upcomingAppointment(appointmentContainer) {
    console.log(appointmentContainer);
    const url = `http://13.48.48.198/v1/appointments/?patient_id=${userData.user_id}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const appointmentsData = await response.json();

      if (!appointmentsData || !Array.isArray(appointmentsData.appointments)) {
        console.error("No appointments found.");
        return;
      }

      const template = document.getElementById(
        "appointmentCardTemplate"
      ).content;

      appointmentsData.appointments.forEach((appointment) => {
        const appointmentCard = document.importNode(template, true);

        // Populate the template with appointment data
        appointmentCard.querySelector(".appointment-title").textContent =
          appointment?.reason_for_appointment;
        appointmentCard.querySelector(".doctor-name").textContent =
          "Dr Shaun Murphy";
        appointmentCard.querySelector(".doctor-title").textContent =
          "Cardiologist";
        appointmentCard.querySelector(".appointment-date span").textContent =
          new Date(appointment?.appointment_date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        appointmentCard.querySelector(".appointment-time span").textContent =
          new Date(appointment?.appointment_date).toLocaleTimeString();

        const doctorImg = appointmentCard.querySelector(".doctor-img img");
        doctorImg.src = "../../Assets/bearded-doctor-glasses.jpg";
        doctorImg.alt = `Image of ${appointment.doctorName}`;

        // Append the populated template to the container
        appointmentContainer.appendChild(appointmentCard);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function medications(prescriptionContainer) {
    console.log(prescriptionContainer);
    const url = `http://13.48.48.198/v1/medications/?patient_id=${userData.user_id}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const medicationsData = await response.json();

      if (!medicationsData || !Array.isArray(medicationsData.medications)) {
        console.error("No appointments found.");
        return;
      }

      const template = document.getElementById("medicationTemplate").content;

      medicationsData.medications.forEach((medication) => {
        const medicationCard = document.importNode(template, true);

        // Populate the template with appointment data
        medicationCard.querySelector(".prescription-name").textContent =
          medication?.medication_name;
        medicationCard.querySelector(".usage").textContent = medication?.dosage;

        // Append the populated template to the container
        prescriptionContainer.appendChild(medicationCard);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function billings(billingsContainer) {
    const url = `http://13.48.48.198/v1/billings`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const billingsData = await response.json();
      console.log(billingsData);

      if (!billingsData || !Array.isArray(billingsData.billings)) {
        console.error("No billings found.");
        return;
      }

      const template = document.getElementById(
        "billingsDashboardTemplate"
      ).content;

      console.log(billingsData.billings);

      billingsData.billings.forEach((bill) => {
        const billRow = document.importNode(template, true);

        // Populate the template with lab result data
        billRow.querySelector(".amount-text").textContent = `$${bill?.amount}`;
        billRow.querySelector(".status").textContent =
          bill?.status.toLowerCase() === "not_paid" ? "NOT PAID" : bill?.status;
        billRow.querySelector(".status").style.backgroundColor =
          bill?.status.toLowerCase() === "not_paid"
            ? "#d893a3"
            : bill?.status.toLowerCase() === "paid"
            ? "#86e49d"
            : "#ebc474";
        billRow.querySelector(".status").style.color =
          bill?.status.toLowerCase() === "not_paid"
            ? "#b30021"
            : bill?.status.toLowerCase() === "paid"
            ? "#006b21"
            : "black";
        billRow.querySelector(".service-title").textContent = bill?.title;

        // Append the populated template to the container
        billingsContainer.appendChild(billRow);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function patientProfile(profileContainer) {
    const url = `http://13.48.48.198/v1/auth/me`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const patientData = await response.json();
      console.log(patientData);
      if (!patientData) {
        console.error("Patient data not found.");
        return;
      }

      // const template = document.getElementById("profileTemplate").content;

      const profileDetail = document.querySelector(".profileDetails");

      // Populate the template with lab result data
      profileDetail.querySelector(
        ".patientName"
      ).textContent = `${patientData?.first_name} ${patientData?.last_name}`;
      profileDetail.querySelector(".patientEmail").textContent =
        patientData?.email;
      profileDetail.querySelector(".patientNumber").textContent =
        patientData?.phone_number;
      profileDetail.querySelector(".patientDOB").textContent = new Date(
        patientData?.date_of_birth
      ).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      profileDetail.querySelector(".patientGender").textContent =
        patientData?.gender;
      profileDetail.querySelector(".patientAddress").textContent =
        patientData?.address;
      const profileImg = profileDetail.querySelector(
        ".profileImgConttainer img"
      );
      profileImg.src = patientData?.profile_image;
      profileImg.alt = `Image of ${patientData?.first_name} ${patientData?.last_name}`;

      // Append the populated template to the container
      profileContainer.appendChild(profileDetail);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadContent(url) {
    try {
      const response = await fetch(url);
      const content = await response.text();
      console.log(content);
      mainContent.innerHTML = content;
      const appointmentContainer = mainContent.querySelector(
        ".appointments-container"
      );
      const prescriptionContainer = mainContent.querySelector(
        ".prescription-container"
      );
      const profileContainer = mainContent.querySelector(".profile-container");
      const dashboardContainer = mainContent.querySelector(".dashboard");
      const billingsContainer = mainContent.querySelector(".billings-table");

      patientDetails(dashboardContainer);
      upcomingAppointment(appointmentContainer);
      medications(prescriptionContainer);
      billings(billingsContainer);
      patientProfile(prescriptionContainer);
    } catch (error) {
      mainContent.innerHTML =
        "<p>Failed to load content. Please try again later.</p>";
    }
  }

  function activateLink(link) {
    navLinks.forEach((nav) => nav.classList.remove("active"));
    link.classList.add("active");
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const url = link.getAttribute("href");
      activateLink(this); // Changed 'link' to 'this' to refer to the clicked element
      loadContent(url);
    });
  });

  // Function to check for active link on page load and load its content
  function checkActiveLink() {
    const activeLink = document.querySelector(".tab-link.active");
    if (activeLink) {
      const url = activeLink.getAttribute("href");
      loadContent(url);
    }
  }

  // Call checkActiveLink immediately after defining it to load the dashboard by default
  checkActiveLink();
});

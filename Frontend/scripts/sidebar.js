const fullUserDetails = JSON.parse(sessionStorage.getItem("authDetails"));
const token = fullUserDetails?.token.access_token;
const userData = fullUserDetails?.user;
const logout = document.getElementById("logout-link");

logout.addEventListener("click", () => {
  sessionStorage.clear();
});

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

        // Populate the template with appointment data
        labCard.querySelector(".lab-info").textContent = appointment?.result;
        labCard.querySelector(".lab-test").textContent = appointment?.test_name;
        labCard.querySelector(".lab-date").textContent = new Date(
          appointment?.test_date
        ).toLocaleDateString();

        // Append the populated template to the container
        dashboardLabActivity.appendChild(labCard);
      });

      patientData.visits.forEach((appointment) => {
        const medicalCard = document.importNode(medicalActivityTemplate, true);

        // Populate the template with appointment data
        medicalCard.querySelector(".activity-info").textContent =
          appointment?.reason_for_visit;
        medicalCard.querySelector(".activity-name").textContent =
          appointment?.doctor.first_name;
        medicalCard.querySelector(".activity-date").textContent = new Date(
          appointment?.visit_date
        ).toLocaleDateString();

        const activityDoctorImg =
          medicalCard.querySelector(".activity-img img");
        activityDoctorImg.src = "../../Assets/bearded-doctor-glasses.jpg";
        activityDoctorImg.alt = `Image of ${appointment?.doctor.first_name}`;

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
          new Date(appointment?.appointment_date).toLocaleDateString();
        appointmentCard.querySelector(".appointment-time span").textContent =
          new Date(appointment?.appointment_date).toLocaleTimeString();

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
    const url = `http://13.48.48.198/v1/appointments/?doctor_id=80629581-262d-4426-b703-7d11ad7703dd&patient_id=${userData.user_id}`;

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
          new Date(appointment?.appointment_date).toLocaleDateString();
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

  // async function prescriptions(prescriptionContainer) {
  //   console.log(prescriptionContainer);
  //   const url = `http://13.48.48.198/v1/appointments/?doctor_id=80629581-262d-4426-b703-7d11ad7703dd&patient_id=61ab2924-1fd1-476c-9417-7d06ede789ce`;

  //   try {
  //     const response = await fetch(url, {
  //       headers: {
  //         Authorization:
  //           "Bearer .eJwNyt0OQzAYANB38QBChemlUHw2OoKpmyVrhJZhFvHz9Nu5PkpzRN0r4IKKCIoT9ETAF8bM5C5Y0M9V6UZY_Sedo_Ko0NCDnEQi_Y5JMGOZ7vU73ROPI3b2Wpxzo_YcVD-yITlbk6FC3NxoaEJHUEmMWBJEvfSguY9VNlHjcx3Fsj4lhHcbC6u9rMuIvZkMRWCXbNtsDVsmIcoPMMY2kQ.9UxbMcGljyfJBplD8AQKNcqTxEY",
  //       },
  //     });

  //     const appointmentsData = await response.json();

  //     if (!appointmentsData || !Array.isArray(appointmentsData.appointments)) {
  //       console.error("No appointments found.");
  //       return;
  //     }

  //     const template = document.getElementById(
  //       "appointmentCardTemplate"
  //     ).content;

  //     appointmentsData.appointments.forEach((appointment) => {
  //       const appointmentCard = document.importNode(template, true);

  //       // Populate the template with appointment data
  //       appointmentCard.querySelector(".appointment-title").textContent =
  //         appointment?.reason_for_appointment;
  //       appointmentCard.querySelector(".doctor-name").textContent =
  //         "Dr Shaun Murphy";
  //       appointmentCard.querySelector(".doctor-title").textContent =
  //         "Cardiologist";
  //       appointmentCard.querySelector(".appointment-date span").textContent =
  //         new Date(appointment?.appointment_date).toLocaleDateString();
  //       appointmentCard.querySelector(".appointment-time span").textContent =
  //         new Date(appointment?.appointment_date).toLocaleTimeString();

  //       const doctorImg = appointmentCard.querySelector(".doctor-img img");
  //       doctorImg.src = "../../Assets/bearded-doctor-glasses.jpg";
  //       doctorImg.alt = `Image of ${appointment.doctorName}`;

  //       // Append the populated template to the container
  //       appointmentContainer.appendChild(appointmentCard);
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  async function loadContent(url) {
    try {
      const response = await fetch(url);
      const content = await response.text();
      console.log(content);
      mainContent.innerHTML = content;
      const appointmentContainer = mainContent.querySelector(
        ".appointments-container"
      );
      const dashboardContainer = mainContent.querySelector(".dashboard");

      // console.log(appointmentContainer);
      // console.log(dashboardAppointment);
      // if (appointmentContainer) {

      // }
      patientDetails(dashboardContainer);
      upcomingAppointment(appointmentContainer);
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

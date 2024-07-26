import { baseUrl } from "../../env";

export async function upcomingAppointment() {
  const url = `${baseUrl}/doctors`;
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.log(error);
  }
}

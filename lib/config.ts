// API Configuration for RaphaCure Customer Portal

const getServerConfig = () => {
  // Default to staging
  let SERVER_IP_URL = "https://api.raphacure.com";
  let API_KEY =
    "3G56qgYAvbKTRtmlVF9FGR81OfMdv7mAalwITG8hsweskPcfdchl1x7xfAljbajT";

  // Check if we're in production
  if (typeof window !== "undefined") {
    const hostName = window.location.hostname;

    if (
      hostName === "raphacure.com" ||
      hostName === "www.raphacure.com" ||
      hostName.includes("raphaplus")
    ) {
      SERVER_IP_URL = hostName.includes("raphaplus")
        ? "https://api.raphaplus.in"
        : "https://api.raphacure.com";
      API_KEY =
        "WFBkQeEm2HlxnFAZBiRzDwo3QGTA1obUrr0QjHk6ULPX7zMEvHYyqcN5Q0zAq5oq";
    }
  }

  return { SERVER_IP_URL, API_KEY };
};

const config = getServerConfig();

export const SERVER_IP = config.SERVER_IP_URL;
export const API_KEY = config.API_KEY;
export const GOOGLE_CLIENT_ID =
  "573989854569-lodldcsvju4c1lsco1lp43hp1laq5qi6.apps.googleusercontent.com";

import { NextResponse } from "next/server";

export async function GET() {
  const data = {
    applinks: {
      apps: [],
      details: [
        {
          appID: "RF4X369C9P.com.cognonta.raphacure",
          paths: ["*"],
        },
        {
          appID: "RF4X369C9P.com.rcure.app",
          paths: ["*"],
        },
      ],
    },
  };

  return NextResponse.json(data, {
    headers: {
      "Content-Type": "application/json",
      // Add Cache-Control to ensure fresh content if needed, or rely on defaults
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}

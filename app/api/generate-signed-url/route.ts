import { NextResponse } from "next/server"
import { config } from "@/lib/config"

export async function GET(req: Request) {
  const agentId = req.url.split("agentId=")[1] // Extract agentId from URL

  try {
    // console.log("Fetching signed URL for agent:", agentId)
    const response = await fetch(
      `${config.elevenlabs.apiBaseUrl}/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        headers: {
          "xi-api-key": config.elevenlabs.apiKey || "",
          Origin: req.headers.get("Origin") || "",
        },
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      const errorMessage = `Failed to get signed URL: ${response.statusText}, Details: ${JSON.stringify(errorData)}`
      // console.error(errorMessage)
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const { signed_url: signedUrl } = await response.json()
    // console.log("Signed URL received:", signedUrl)
    return NextResponse.json({ signedUrl })
  } catch (error) {
    // console.error("Failed to generate signed URL:", error)
    return NextResponse.json(
      { error: `Failed to generate signed URL: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}


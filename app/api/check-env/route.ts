import { NextResponse } from "next/server"

export async function GET() {
  const envVariables = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set",
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "Set" : "Not set",
  }

  const allSet = Object.values(envVariables).every((value) => value === "Set")

  return NextResponse.json({
    environmentReady: allSet,
    variables: envVariables,
  })
}


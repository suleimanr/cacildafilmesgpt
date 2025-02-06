import { NextResponse } from "next/server"
import { testSupabaseConnection } from "@/lib/supabase"

export async function GET() {
  try {
    const isConnected = await testSupabaseConnection()
    if (isConnected) {
      return NextResponse.json({ success: true, message: "Conexão com Supabase bem-sucedida" })
    } else {
      throw new Error("Falha na conexão com Supabase")
    }
  } catch (error) {
    console.error("Erro no teste de conexão:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao testar conexão", error: error.message },
      { status: 500 },
    )
  }
}


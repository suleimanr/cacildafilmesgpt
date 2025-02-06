import { OpenAIError } from "openai"
import OpenAI from "openai"
import { type NextRequest, NextResponse } from "next/server"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

let assistant: any = null
let thread: any = null

export async function POST(req: NextRequest) {
  try {
    const { action, message } = await req.json()

    if (action === "initialize") {
      try {
        assistant = await openai.beta.assistants.create({
          name: "Math Tutor",
          instructions: "You are a personal math tutor. Write and run code to answer math questions.",
          tools: [{ type: "code_interpreter" }],
          model: "gpt-4o",
        })

        thread = await openai.beta.threads.create()

        return NextResponse.json({ success: true, assistantId: assistant.id, threadId: thread.id })
      } catch (error) {
        console.error("Error initializing assistant:", error)
        return NextResponse.json(
          {
            success: false,
            error: "Failed to initialize assistant",
            details: error instanceof Error ? error.message : String(error),
          },
          { status: 500 },
        )
      }
    } else if (action === "message") {
      if (!assistant || !thread) {
        return NextResponse.json({ success: false, error: "Assistant not initialized" }, { status: 400 })
      }

      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: message,
      })

      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
      })

      let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)

      while (runStatus.status !== "completed") {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
      }

      const messages = await openai.beta.threads.messages.list(thread.id)

      const assistantMessages = messages.data
        .filter((msg) => msg.role === "assistant")
        .map((msg) => (msg.content[0].type === "text" ? msg.content[0].text.value : null))
        .filter(Boolean)

      return NextResponse.json({ success: true, messages: assistantMessages })
    } else {
      return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    if (error instanceof OpenAIError) {
      return NextResponse.json(
        { success: false, error: "OpenAI API error", details: error.message },
        { status: error.status || 500 },
      )
    }
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}


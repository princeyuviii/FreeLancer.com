import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json()
    
    if (!code) {
      return new NextResponse("Code is required", { status: 400 })
    }

    let errors: string[] = []

    // Basic syntax checking for JavaScript/TypeScript
    if (language === 'javascript' || language === 'typescript') {
      try {
        // We use a simple Function constructor check for basic syntax
        // This only works for pure JS, but it's a start for "real" detection
        new Function(code)
      } catch (e: any) {
        errors.push(e.message)
      }
    }

    // You could expand this with actual linters if needed
    // For now, let's also use some common patterns
    if (code.includes('console.log') && !code.includes('import')) {
       // Just a dummy example of a "lint" rule
    }

    return NextResponse.json({
      valid: errors.length === 0,
      errors: errors
    })
  } catch (error) {
    console.error("[ANALYZE_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

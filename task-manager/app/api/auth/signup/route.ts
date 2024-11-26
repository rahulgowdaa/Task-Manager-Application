import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password } = await req.json()

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      )
    }

    // Generate default avatar URL using initials
    const initials = `${firstName[0]}${lastName[0]}`.toUpperCase()
    const backgroundColor = generateRandomColor() // We'll create this function
    const defaultAvatar = `https://ui-avatars.com/api/?name=${initials}&background=${backgroundColor.substring(1)}&color=fff`

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user with default avatar
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        image: defaultAvatar, // Add default avatar
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        image: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      message: "User created successfully",
      user,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

// Helper function to generate random color
function generateRandomColor(): string {
  const colors = [
    '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e',
    '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50',
    '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#f39c12',
    '#d35400', '#c0392b', '#7f8c8d',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
} 
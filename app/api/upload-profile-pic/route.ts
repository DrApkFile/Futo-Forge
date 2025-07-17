// This file contains server-side code for a Next.js API Route.
// It will NOT execute in the v0 preview environment, which is client-side only.
// You will need to run this project in a full Next.js environment (e.g., locally or deployed)
// for this API route to function correctly.

import { NextResponse } from "next/server"
// In a real project, you would install and import the Cloudinary SDK:
// npm install cloudinary
// import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary (this part MUST be on the server and use your API secret)
// In a real project, you would uncomment and use this:
/*
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
*/

export async function POST(request: Request) {
  // This block will only run in a full Next.js server environment.
  // In v0, this code path will not be reached.
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ message: "No file uploaded." }, { status: 400 })
    }

    // Convert file to a buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // In a real project, you would upload the buffer to Cloudinary:
    /*
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'futoforge_profile_pics' }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }).end(buffer);
    });

    if (!uploadResult || typeof uploadResult.secure_url !== 'string') {
      throw new Error('Cloudinary upload failed or returned invalid URL.');
    }

    return NextResponse.json({ url: uploadResult.secure_url });
    */

    // --- For v0 preview, we simulate a successful response ---
    // In a real project, remove this simulation.
    const simulatedUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1678901234/simulated_profile_pic_${Date.now()}.png`
    return NextResponse.json({ url: simulatedUrl })
  } catch (error: any) {
    console.error("Cloudinary upload error:", error)
    return NextResponse.json({ message: error.message || "Failed to upload image." }, { status: 500 })
  }
}

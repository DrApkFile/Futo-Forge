# FutoForge Project

This project is a platform designed to connect students with real-world tasks and bounties within their university community. It features authentication, user dashboards (participant and organization), bounty posting, and profile management.

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    \`\`\`bash
    git clone <your-repo-url>
    cd futoforge-project
    \`\`\`
2.  **Install dependencies:**
    \`\`\`bash
    npm install
    # or
    yarn install
    \`\`\`
3.  **Set up Firebase:**
    *   Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
    *   Enable **Firestore Database** and **Authentication** (Email/Password and Google providers).
    *   Go to Project settings -> General -> Your apps, and add a new web app. Copy your Firebase configuration.
    *   Create a `.env.local` file in the root of your project and add your Firebase credentials:
        \`\`\`
        NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
        NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
        NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"

        # Cloudinary (for image uploads) - API Key and Secret should be kept private on your server
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="YOUR_CLOUDINARY_CLOUD_NAME"
        CLOUDINARY_API_KEY="YOUR_CLOUDINARY_API_KEY"
        CLOUDINARY_API_SECRET="YOUR_CLOUDINARY_API_SECRET"
        \`\`\`
        **Important:** `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` are sensitive and should only be used on the server-side (e.g., in Next.js API Routes or Server Actions). `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` can be public.

4.  **Run the development server:**
    \`\`\`bash
    npm run dev
    # or
    yarn dev
    \`\`\`
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Firebase Firestore Indexes - Step-by-Step Creation

Your application uses complex Firestore queries that require specific composite indexes to function correctly and efficiently. If you encounter errors like `FirebaseError: [code=failed-precondition]: The query requires an index.`, you need to create these indexes in your Firebase project.

**General Steps to Create an Index:**

1.  Go to your [Firebase Console](https://console.firebase.google.com/).
2.  Navigate to **Firestore Database** from the left-hand menu.
3.  Click on the **Indexes** tab.
4.  Click the **Create new index** button.
5.  Follow the specific instructions for each index below. Ensure the **Collection ID** is exact, and for each **Field**, select the correct field name and its **Order** (Ascending or Descending) or **Type** (Array Contains).

---

### Index 1: For Trending Talents Query

This index is required for the "Trending Talents" section on the organization dashboard, which sorts participants by their earnings.

*   **Collection ID:** `users`
*   **Fields to add (in this exact order):**
    1.  **Field:** `profileSetupComplete`
        *   **Order:** `Ascending`
    2.  **Field:** `userType`
        *   **Order:** `Ascending`
    3.  **Field:** `totalEarnings`
        *   **Order:** `Descending`
    4.  **Field:** `__name__`
        *   **Order:** `Descending`
        *(Firebase often automatically adds `__name__` for `orderBy` queries to ensure uniqueness, but it's good practice to include it if you get an error.)*

---

### Index 2: For Talent Search by Username

This index supports searching for participants by their username.

*   **Collection ID:** `users`
*   **Fields to add (in this exact order):**
    1.  **Field:** `userType`
        *   **Order:** `Ascending`
    2.  **Field:** `username`
        *   **Order:** `Ascending`
    3.  **Field:** `__name__`
        *   **Order:** `Ascending`

---

### Index 3: For Talent Search by Niches

This index is crucial for searching participants based on their selected skills/niches using `array-contains`.

*   **Collection ID:** `users`
*   **Fields to add (in this exact order):**
    1.  **Field:** `userType`
        *   **Order:** `Ascending`
    2.  **Field:** `niches`
        *   **Type:** `Array Contains`
    3.  **Field:** `__name__`
        *   **Order:** `Ascending`

---

**Important Notes:**
*   After creating an index, it might take a few minutes for it to become active.
*   If Firebase provides a direct link in the error message, you can often just click that link to automatically create the required index.

## Project Structure

*   `app/`: Next.js App Router pages and API routes.
    *   `app/layout.tsx`: Root layout.
    *   `app/page.tsx`: Landing page.
    *   `app/dashboard/page.tsx`: Main dashboard, redirects based on user type.
    *   `app/signup/page.tsx`: Participant signup.
    *   `app/organization-signup/page.tsx`: Organization signup.
    *   `app/signin/page.tsx`: Login page.
    *   `app/forgot-password/page.tsx`: Password reset page.
    *   `app/bio-setup/page.tsx`: Multi-step profile setup for participants.
    *   `app/post-bounty/page.tsx`: Form for organizations to post new bounties.
    *   `app/profile/[uid]/page.tsx`: Dynamic page to view user profiles.
    *   `app/edit-profile/page.tsx`: New page for users to edit their profile details.
    *   `app/api/upload-profile-pic/route.ts`: API route for profile picture uploads (server-side).
    *   `app/api/upload-bounty-banner/route.ts`: API route for bounty banner uploads (server-side).
*   `components/`: Reusable React components.
    *   `components/ui/`: Shadcn/ui components.
    *   `components/dashboard-nav.tsx`: Navigation bar for authenticated users.
    *   `components/participant-dashboard.tsx`: UI for participant dashboard.
    *   `components/organization-dashboard.tsx`: UI for organization dashboard.
    *   `components/welcome-card.tsx`: Welcome message card.
    *   `components/bounty-list.tsx`: Displays a list of bounties.
    *   `components/recent-earners-sidebar.tsx`: Sidebar showing recent earners.
*   `lib/`: Utility functions and Firebase initialization.
    *   `lib/firebase.ts`: Firebase app, auth, and Firestore initialization.
    *   `lib/cloudinary.ts`: Cloudinary configuration (client-side placeholder).
    *   `lib/utils.ts`: Utility functions (e.g., `cn` for Tailwind classes).

## Features

*   **User Authentication:** Sign up and sign in with email/password or Google.
*   **User Roles:** Separate experiences for "Participants" and "Organizations".
*   **Multi-step Participant Profile Setup:** Collects bio, GitHub, niches, and profile picture.
*   **Organization Signup:** Dedicated signup for organizations with niche selection.
*   **Dynamic Dashboards:** Tailored dashboards for participants and organizations.
*   **Bounty Posting System:** Organizations can post bounties with details like banner, title, niche, description, budget, and prize splits.
*   **Sparks System:** Simulated currency for platform actions (e.g., posting bounties).
*   **Simulated Payment Gateways:** Placeholder for real payment integrations (Paystack for NGN, Crypto Gateway for others).
*   **Profile Viewing:** Publicly viewable profiles for participants and organizations.
*   **Responsive Design:** Optimized for various screen sizes.
*   **Edit Profile Page:** Users can update their bio, GitHub username, niches, and profile picture.

## Future Enhancements

*   Implement real payment gateway integrations (Paystack, crypto wallets).
*   Develop a real-time messaging system between users.
*   Build out comprehensive bounty management features (edit, close, select winners).
*   Add bounty submission and review processes.
*   Expand talent profiles with portfolios and work history.
*   Implement a full "buy sparks" flow.

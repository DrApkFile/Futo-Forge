# Futoforge: Decentralized Bounties for a Global Workforce

## 🚀 Project Overview

Futoforge is a cutting-edge platform designed to revolutionize how work is done and compensated, particularly within academic and startup ecosystems. It connects individuals seeking to monetize their skills (Participants) with organizations, faculty, and startups needing specific tasks completed (Organizations). Built on the principles of decentralization and transparency, Futoforge aims to provide a secure, efficient, and global marketplace for bounties and projects, with a strong emphasis on cryptocurrency payments.

### Core Philosophy & Vision
Our vision is to empower a global workforce by enabling seamless, trustless transactions for digital work. We believe in a future where talent can be discovered and compensated fairly, regardless of geographical location or traditional financial barriers. Futoforge strives to be the go-to platform for:
*   **Skill Monetization:** Providing a direct path for individuals to earn from their expertise.
*   **Efficient Task Completion:** Offering organizations a streamlined way to find qualified talent for their projects.
*   **Transparency & Security:** Leveraging blockchain principles to ensure all transactions and interactions are verifiable and secure.
*   **Global Accessibility:** Facilitating cross-border payments and collaborations through cryptocurrency.

## ✨ Key Features

Futoforge comes packed with a robust set of features designed for both participants and organizations:

### 🔐 User Authentication & Authorization
*   **Flexible Sign-up:** Users can sign up as either a "Participant" (individual talent) or an "Organization" (task poster) using email/password.
*   **Firebase Authentication:** Secure and scalable user management powered by Google Firebase Auth.
*   **Role-Based Access:** Distinct dashboards and functionalities tailored to `participant`, `organization`, and `admin` user types.

### 👤 User Profiles & Management
*   **Multi-step Participant Profile Setup:** A guided onboarding process for participants to provide:
    *   **Username:** Unique identifier on the platform.
    *   **Profile Picture:** Customizable avatar for personal branding.
    *   **Bio:** A detailed description of skills, experience, and interests.
    *   **GitHub Integration:** Link to GitHub profile for showcasing code contributions.
    *   **Niches/Skills:** Categorization of expertise (e.g., "Web Development", "UI/UX Design", "Content Writing").
*   **Organization Profile Setup:** Dedicated flow for organizations to set up their profile, including organization name and description.
*   **Public Profiles:** Viewable profiles for both participants and organizations, allowing for talent discovery and organizational transparency.
*   **Edit Profile Page:** Users can update their profile details, including bio, GitHub username, niches, and profile picture, at any time.

### 💰 In-App Wallet & Sparks System
*   **In-App Wallet:** Organizations maintain an in-app wallet balance (simulated in USD) to fund bounties.
*   **Sparks System:** A simulated internal currency (`Sparks`) used by organizations to "pay" for posting bounties. This system can be extended for other platform actions or premium features.
*   **Simulated Payment Gateways:** Placeholder integrations for real payment solutions (e.g., Paystack for NGN, generic crypto gateway for other currencies) to demonstrate the payment flow.

### 🎯 Bounty & Project Management
*   **Bounty Posting:** Organizations can easily post new bounties with comprehensive details:
    *   **Bounty Banner:** An optional image to visually represent the task.
    *   **Title & Description:** Clear and concise task definition.
    *   **Budget & Currency:** Specify the reward amount and preferred cryptocurrency (USD, NGN, ETH, BTC).
    *   **Max Submissions:** Define the number of accepted submissions.
    *   **Due Date:** Set a deadline for task completion.
    *   **Required Skills:** Tagging relevant skills to attract the right talent.
    *   **Prize Splits:** Configure how the bounty reward is distributed among multiple winners (e.g., 70% for 1st, 30% for 2nd).
*   **Bounty Categorization:** Bounties are automatically categorized as "Bounty" (short-term) or "Project" (long-term, >2 months due date).
*   **Bounty Listing:** Participants can browse a list of available bounties, filtered by status (open, closed, cancelled).
*   **Bounty Management (Organizations):** Organizations can view, edit (within a limited time/conditions), cancel, and close their posted bounties.
*   **Submission & Review:**
    *   Participants can submit their work (e.g., link to a GitHub repo, live demo).
    *   Organizations can review submissions, approve winners, and reject others.
    *   Approving a submission automatically transfers the bounty budget to the participant's wallet and marks the bounty as closed.

### 📊 Dashboards
*   **Participant Dashboard:**
    *   Personalized welcome message.
    *   Overview of total earnings, bounties participated in, and Sparks balance.
    *   List of available bounties.
    *   Sidebar showing recent earners (simulated "trending talents").
*   **Organization Dashboard:**
    *   Personalized welcome message.
    *   In-app wallet balance display.
    *   List of recently posted bounties.
    *   **Talent Search:** Search for participants by username or niche, with real-time results and "No matching users found" feedback.
    *   "Trending Talents" section to discover top-performing participants.

### 💬 Messaging System
*   **Real-time Chat Interface:** A dedicated messaging page allowing users to communicate with each other.
*   **Conversation List:** Displays ongoing chats with other users.
*   **Message Sending:** Send and receive text messages within the platform.

### 👑 Admin Panel
*   **Secure Login:** Dedicated admin login using Firebase Authentication.
*   **User Management:**
    *   View all users (participants and organizations).
    *   Ban/Unban users: Control platform access for problematic accounts. Banning an organization automatically cancels their open bounties and refunds the budget.
*   **Report Management:**
    *   View all user-submitted reports (e.g., inappropriate content, fraudulent activity).
    *   Mark reports as reviewed.
*   **Bounty Oversight:**
    *   View newly created bounties (last 24 hours).
    *   Admin can cancel any bounty, with budget refund to the organization.
*   **Sidebar Navigation:** Intuitive sidebar for easy navigation between admin sections.

## 🛠️ Technology Stack

*   **Framework:** Next.js 14 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** shadcn/ui
*   **Icons:** Lucide React
*   **Authentication & Database:** Firebase (Authentication, Firestore)
*   **Storage:** Firebase Storage (for profile pictures), Cloudinary (for bounty banners)
*   **Date Handling:** `date-fns`

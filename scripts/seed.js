/* eslint-disable */
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "../.env.local");
if (!fs.existsSync(envPath)) {
  console.error("Error: .env.local file not found in the root directory.");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf-8");
const config = {};
envContent.split("\n").forEach(line => {
  const parts = line.split("=");
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
    config[key] = val;
  }
});

const firebaseConfig = {
  apiKey: config.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: config.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: config.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: config.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: config.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log("Connecting and seeding database...");
  try {
    // 1. Homepage
    await setDoc(doc(db, "homepage", "main"), {
      heroTitle: "SHERLOCK HOLMES CLUB",
      heroTagline: "OBSERVE. ANALYZE. DEDUCT.",
      heroDescription: "The official student club of Kalasalingam Academy of Research and Education.",
      aboutPreview: "We train minds in logical reasoning, analytical analysis, and codebreaking.",
      joinText: "Recruitments are currently open for new members."
    });
    console.log("✔ Homepage collection seeded!");

    // 2. About
    await setDoc(doc(db, "about", "main"), {
      description: "Welcome to the official Sherlock Holmes Club, KARE.",
      vision: "To cultivate analytical thinking and problem solving among students.",
      mission: "To host workshops, mock criminal forensic games, and cyber decrypt tasks.",
      objectives: ["Promote analytical thought", "Host campus events"],
      historyTimeline: []
    });
    console.log("✔ About collection seeded!");

    // 3. Settings
    await setDoc(doc(db, "settings", "general"), {
      clubName: "Sherlock Holmes Club",
      universityName: "Kalasalingam Academy of Research and Education",
      maintenanceMode: false,
      allowRegistrations: true
    });
    console.log("✔ Settings collection seeded!");

    // 4. Contact
    await setDoc(doc(db, "contact", "info"), {
      officeLocation: "KARE Campus, Anand Nagar, Krishnankoil",
      emailAddress: "sherlockholmes@kla.ac.in",
      phoneHelpline: "+91 4563 289012",
      socials: {
        linkedin: "#",
        github: "#"
      }
    });
    console.log("✔ Contact info collection seeded!");

    console.log("All initial collections seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exit(1);
  }
}

seed();

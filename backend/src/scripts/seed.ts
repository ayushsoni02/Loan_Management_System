import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User";
import { ALL_ROLES } from "../constants/roles";
import { connectDB } from "../config/db";

dotenv.config();

const seed = async () => {
  await connectDB();
  console.log("Seeding executives...");

  try {
    for (const role of ALL_ROLES) {
      const email = `${role}@lms.com`;
      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        const passwordHash = await bcrypt.hash("Password@123", 10);
        await User.create({
          fullName: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
          email,
          passwordHash,
          role,
        });
        console.log(`Created ${role} user: ${email} / Password@123`);
      } else {
        console.log(`${role} user already exists.`);
      }
    }
    console.log("Seeding complete.");
  } catch (error) {
    console.error("Error seeding:", error);
  } finally {
    mongoose.connection.close();
  }
};

seed();

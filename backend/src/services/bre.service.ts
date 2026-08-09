import { isValidPAN } from "../utils/pan.util";

interface BreInput {
  age: number;
  monthlySalary: number;
  pan: string;
  employmentMode: "salaried" | "self_employed" | "unemployed";
}

interface BreResult {
  status: "passed" | "failed";
  reasons: string[];
}

export const runBRE = (input: BreInput): BreResult => {
  const reasons: string[] = [];

  if (input.age < 23 || input.age > 50) {
    reasons.push("Age must be between 23 and 50.");
  }

  if (input.monthlySalary < 25000) {
    reasons.push("Monthly salary must be at least ₹25,000.");
  }

  if (!isValidPAN(input.pan)) {
    reasons.push("Invalid PAN format.");
  }

  if (input.employmentMode === "unemployed") {
    reasons.push("Employment mode cannot be unemployed.");
  }

  return {
    status: reasons.length === 0 ? "passed" : "failed",
    reasons,
  };
};

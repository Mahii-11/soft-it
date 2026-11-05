// STATIC MOCK DATA — Reward Points
// TODO: পরে dynamic করার সময় এই ফাইলটা বাদ দিয়ে API থেকে data আনতে হবে।
// Expected shape (backend এর সাথে নিশ্চিত করতে হবে):
//   balance: number
//   transactions: [{ id, type, typeLabel, description, points, balanceAfter, date }]

export const mockPoints = {
  balance: 200,
  transactions: [
    {
      id: 1,
      type: "registration_bonus",
      typeLabel: "Registration Bonus",
      description: "New customer registration bonus",
      points: 200,
      balanceAfter: 200,
      date: "2026-11-04T14:39:00",
    },
  ],
};

export const transactionTypes = [
  { value: "all", label: "All Transaction Types" },
  { value: "registration_bonus", label: "Registration Bonus" },
  { value: "purchase", label: "Purchase" },
  { value: "redeem", label: "Redeem" },
  { value: "referral", label: "Referral" },
];

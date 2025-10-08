import bcrypt from "bcrypt";
const saltRounds = 12;
export async function HashPassword(plainTextPassword) {
  const hash = await bcrypt.hash(plainTextPassword, saltRounds);
  return hash;
}

export async function ComparePasswords(plainTextPassword, hashedPassword) {
  const result = bcrypt.compare(plainTextPassword, hashedPassword);
  return result;
}

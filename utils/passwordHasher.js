import bcrypt from "bcryptjs";

async function passwordHasher(password) {
  const hashPassword = await bcrypt.hash(password, 10);
  return hashPassword;
}

export default passwordHasher;

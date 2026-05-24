import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { User } from "../types/auth.types";

export interface IAuthRepository {
  userExists(email: string): Promise<User | undefined>;
}

class AuthRepository implements IAuthRepository {
  async userExists(email: string) {
    const [result] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result;
  }
}

export const authRepository = new AuthRepository();
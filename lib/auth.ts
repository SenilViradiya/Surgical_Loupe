import {auth} from "@/auth";

export async function curruntUser() {
  const session = await auth();

  return session?.user;
}

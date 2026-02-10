"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Button from "./Button";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="flex p-2 w-4/5 justify-between items-center sticky top-0 text-white h-16">
      <h2 className="font-semibold text-xl">Postly</h2>
      {session ? (
        <Button value="logout" onClick={() => signOut()} />
      ) : (
        <Button value="login" onClick={() => signIn()} />
      )}
    </div>
  );
}

"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Button from "./Button";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="flex p-2 w-4/5 justify-between items-center sticky top-0 text-white h-12">
      <Link href="/">
        <h2 className="font-semibold text-lg">Postly</h2>
      </Link>
      {session ? (
        <Button value="logout" onClick={() => signOut()} />
      ) : (
        <Button value="login" onClick={() => signIn()} />
      )}
    </div>
  );
}

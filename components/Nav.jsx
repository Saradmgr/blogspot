"use client";

import Image from "next/image";
import Link from "next/link";

const Nav = () => {
  return (
    <nav className="flex justify-start items-center w-full mb-16 pt-3">
      <Link href="/" className="flex gap-2 items-center">
        <Image
          src="/images/logo.svg"
          alt="logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <p className="logo_text">BlogSpot</p>
      </Link>
    </nav>
  );
};

export default Nav;

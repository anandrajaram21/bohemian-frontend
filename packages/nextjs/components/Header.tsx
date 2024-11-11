"use client";

import React from "react";
import Link from "next/link";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

export const Header = () => {
  return (
    <div className="sticky top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md px-4 py-2">
      {/* Left Side: Home Button */}
      <div className="navbar-start">
        <Link href="/" passHref className="btn btn-ghost text-lg font-semibold">
          Home
        </Link>
      </div>

      {/* Right Side: Connect Wallet Button */}
      <div className="navbar-end">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};

"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Head from "next/head";
import Surfing from "@/components/Surfing";

const links = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "Contact", href: "#contact" },
];

export default function HomePage() {
  return <Surfing />;
}
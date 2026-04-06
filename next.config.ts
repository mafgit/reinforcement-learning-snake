import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	// reactStrictMode: false
	allowedDevOrigins: process.env.ALLOWED_ORIGIN
		? [process.env.ALLOWED_ORIGIN]
		: undefined,
};

export default nextConfig;

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const description =
	"Snake trained via reinforcement learning to make it avoid collisions and prioritize eating food without wasting time.";

export const metadata: Metadata = {
	title: "RLSnake",
	description,
	authors: {
		name: "Mohammad Abdullah Farooqui",
		url: "https://www.github.com/mafgit",
	},
	keywords: [
		"reinforcement",
		"learning",
		"snake",
		"reward",
		"food",
		"snake game",
		"reinforcement learning",
		"auto",
		"ai snake",
	],
	applicationName: "Reinforcement Learning Snake",
	openGraph: {
		type: "website",
		url: "https://rlsnake.vercel.app",
		title: "RL Snake",
		description,
		siteName: "My Website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${poppins.variable} h-full antialiased`}>
			<body className="">{children}</body>
		</html>
	);
}

import { Sidebar } from "@/components/Sidebar";
import DayOrder from "@/components/Sidebar/Badges/DayOrder";
import ProfileBadge from "@/components/Sidebar/ProfileBadge";
import { fetchUserData } from "@/hooks/fetchUserData";
import type { UserInfo } from "@/types/User";
import { Link } from "next-view-transitions";
import type { ReactNode } from "react";
import { BiLogInCircle } from "react-icons/bi";

export default async function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const json = await fetchUserData();

	return (
		<div className="h-screen shrink-0 w-full flex flex-row bg-light-background-normal lg:p-2 transition-all duration-150 text-light-color dark:bg-dark-background-normal dark:text-dark-color">
			<div id="attendance-predict" className="z-30" />
			<Sidebar
				dayorder={<DayOrder />}
				mini={
					<DayOrder
						mini
						className="fixed hidden right-9 md:flex items-center justify-center"
					/>
				}
			profile={
				json?.error || !json?.user ? (
						<Link
							href="/auth/login"
							className="text-light-success-color dark:text-dark-success-color bg-light-success-background dark:bg-dark-success-background rounded-full font-semibold flex items-center justify-center py-3 lg:w-[82%] gap-2 "
						>
							<BiLogInCircle className="text-xl" /> Login
						</Link>
					) : (
						<ProfileBadge
							user={json.user as UserInfo}
						/>
					)
				}
			/>
			<div
				id="content"
				className={
					"fixed h-full w-full flex-1 transform duration-150 md:relative md:w-full"
				}
				style={{ marginLeft: "var(--sidebar-width)" }}
			>
				<main
					className={
						"m-0.5 p-5 h-full w-full overflow-y-auto overflow-x-hidden scroll-smooth rounded-2xl bg-light-background-light transition-all duration-150  dark:bg-dark-background-dark"
					}
				>
					<div style={{ height: "-webkit-fill-available" }}>{children}</div>
				</main>
			</div>
		</div>
	);
}

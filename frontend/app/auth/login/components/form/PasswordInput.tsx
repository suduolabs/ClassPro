"use client";

import React, {
	useState,
	type Dispatch,
	type SetStateAction,
	type KeyboardEvent,
} from "react";
import { BsEyeSlashFill, BsEyeFill } from "react-icons/bs";

export default function PasswordInput({
	password,
	setPassword,
}: {
	password: string;
	setPassword: Dispatch<SetStateAction<string>>;
}) {
	const [visible, setVisible] = useState(false);

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter") return setVisible(false);
		if (e.altKey) {
			setVisible((prev) => !prev);
		}
	};

	return (
		<>
			<input
				id="academia-password"
				name="password"
				autoComplete="current-password"
				aria-label="Password"
				type={visible ? "text" : "password"}
				value={password}
				onKeyDown={handleKeyDown}
				className={"rounded-2xl rounded-tl-[6px] rounded-tr-[6px] dark:bg-dark-input bg-light-input px-6 py-3 font-sans font-medium text-light-color dark:text-dark-color"}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Passw*rd"
				required
			/>
			{password && (
				<button
					type="button"
					aria-label={visible ? "Hide password" : "Show password"}
					onKeyDown={handleKeyDown}
					className="absolute bottom-[16px] right-0 pr-4 text-right text-light-accent dark:text-dark-accent"
					onClick={() => setVisible((e) => !e)}
				>
					{visible ? <BsEyeSlashFill /> : <BsEyeFill />}
				</button>
			)}
		</>
	);
}

"use client";

import React, { type Dispatch, type SetStateAction } from "react";

export default function UidInput({
	uid,
	setUid,
}: {
	uid: string;
	setUid: Dispatch<SetStateAction<string>>;
}) {
	return (
		<input
			id="registration-id"
			name="registration-id"
			autoComplete="username"
			aria-label="Registration number"
			value={uid}
			maxLength={20}
			className={"rounded-2xl rounded-bl-[6px] rounded-br-[6px] dark:bg-dark-input bg-light-input dark:text-dark-color text-light-color px-6 py-3 font-medium font-sans"}
			onChange={(e) => setUid(e.target.value)}
			placeholder="User ID"
			required
		/>
	);
}

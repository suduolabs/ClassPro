export function setCookie(name:string, value: string, expirationMonths = 3) {
	if (typeof document === "undefined") return null;
	if (!name || !value) return null;

		const exdate = new Date();
		exdate.setMonth(exdate.getMonth() + expirationMonths);

		const encodedValue = encodeURIComponent(value);

		const cookieString = `${name}=${encodedValue}; expires=${exdate.toUTCString()}; path=/; ${
			window.location.hostname === "localhost" ? "" : "Secure; "
		} SameSite=Lax`;

		document.cookie = cookieString;

		return true;
}


export function encode(str: string): string {
	if (!str) return "";

	let hash = 2166136261;
	for (let i = 0; i < str?.length; i++) {
		hash ^= str.charCodeAt(i);
		hash +=
			(hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
	}
	return (
		(hash >>> 0).toString() +
		(hash >>> 1).toString(16) +
		(hash >>> 2).toString(32)
	);
}

export interface ProscrapeError {
	logout: boolean;
	error: boolean;
	ratelimit?: boolean;
	/** Set by the backend's HandleError when Academia rejects the session.
	 * Every endpoint can return it, not just /get. */
	tokenInvalid?: boolean;
	message: string;
	status: number;
}

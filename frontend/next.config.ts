import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";
import path from "path";

const nextConfig: NextConfig = {
	poweredByHeader: false,
	compress: true,
	images: {
		formats: ['image/webp', 'image/avif'],
		minimumCacheTTL: 7200,
	},
	output: 'standalone',
	// Monorepo: ensure file tracing resolves from workspace root.
	outputFileTracingRoot: path.join(__dirname, ".."),
	// viewTransition was dropped from experimental in Next 16; it is reported as
	// an unrecognised key and fails the type check. View transitions come from
	// the next-view-transitions package, so nothing here depends on the flag.
	experimental: {
		nextScriptWorkers: true,
		staticGenerationMaxConcurrency: 8,
	},
	async headers() {
		return [
			// Only the hand-placed files under public/. Next serves those with
			// `public, max-age=0`, so a font or icon is revalidated on every
			// navigation; they change when someone replaces the file, so a day is
			// safe. Pages are deliberately not listed: /academia is per-user HTML
			// and Next already marks it private.
			{
				source: "/:dir(fonts|icons|images|screenshots|library)/:path*",
				headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
			},
		];
	},
};

export default withSerwist(nextConfig);

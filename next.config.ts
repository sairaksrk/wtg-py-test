import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"
import packageJson from "./package.json" with { type: "json" }

const nextConfig: NextConfig = {
	env: {
		NEXT_PUBLIC_APP_VERSION: packageJson.version,
	},
	async rewrites() {
		return [
			{
				source: "/api/plugins/:path*",
				destination: `${process.env.NEXT_PUBLIC_API_URL}/api/plugins/${process.env.NEXT_PUBLIC_API_PREFIX}/:path*`,
			},
			{
				source: "/api/storage/:path*",
				destination: `${process.env.NEXT_PUBLIC_STORAGE_URL}/:path*`,
			},
			{
				source: "/api/:path*",
				destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
			},
		]
	},
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)

"use client" // Error components must be Client Components

import Error from "next/error"

export default function GlobalNotFound() {
	return (
		<html lang="en">
			<body>
				<Error statusCode={404} />
			</body>
		</html>
	)
}

// import ErrorComponent from "@/components/common/error"

// export default function NotFound() {
// 	return (
// 		<div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
// 			<ErrorComponent statusCode={404} message="Page not found" />
// 		</div>
// 	)
// }
import { SDKProvider, useLaunchParams } from "@tma.js/sdk-react"
import { TonConnectUIProvider } from "@tonconnect/ui-react"
import { useEffect, useMemo, type FC } from "react"
import { App } from "@/components/App.tsx"
import { ErrorBoundary } from "@/components/ErrorBoundary.tsx"
import "@fontsource/dela-gothic-one"
import "@fontsource-variable/inter"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

const ErrorBoundaryError: FC<{ error: unknown }> = ({ error }) => (
	<div>
		<p>An unhandled error occurred:</p>
		<blockquote>
			<code>
				{error instanceof Error
					? error.message
					: typeof error === "string"
					? error
					: JSON.stringify(error)}
			</code>
		</blockquote>
	</div>
)

const Inner: FC = () => {
	const debug = useLaunchParams().startParam === "debug"
	const manifestUrl = useMemo(() => {
		return new URL("tonconnect-manifest.json", window.location.href).toString()
	}, [])

	// Enable debug mode to see all the methods sent and events received.
	useEffect(() => {
		if (debug) {
			import("eruda").then((lib) => lib.default.init())
		}
	}, [debug])

	return (
		<TonConnectUIProvider manifestUrl={manifestUrl}>
			<SDKProvider acceptCustomStyles debug={debug}>
				<QueryClientProvider client={queryClient}>
					<App />
				</QueryClientProvider>
			</SDKProvider>
		</TonConnectUIProvider>
	)
}

export const Root: FC = () => (
	<ErrorBoundary fallback={ErrorBoundaryError}>
		<Inner />
	</ErrorBoundary>
)

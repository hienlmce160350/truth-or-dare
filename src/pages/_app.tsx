import "@/styles/globals.css";
import QueryProvider from "@/utils/react-query/query-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      <Component {...pageProps} />
    </QueryProvider>
  );
}

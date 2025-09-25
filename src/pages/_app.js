import "@/styles/globals.css";
import { Comic_Neue } from "next/font/google";

const comic = Comic_Neue({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-comic"
});

export default function App({ Component, pageProps }) {
  return (
    <main className={`${comic.variable}`}>
      <Component {...pageProps} />
    </main>
  );
}

// app/layout.js
import "./globals.css";
import { NavBar, Footer } from "../../components";
import { CrowdFundingProvider } from "../../context/CrowdFunding";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CrowdFundingProvider>
          <NavBar />
          {children}
          <Footer />
        </CrowdFundingProvider>
      </body>
    </html>
  );
}

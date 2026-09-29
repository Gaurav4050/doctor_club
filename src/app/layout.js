import "./globals.css";

export const metadata = {
  title: "All India Doctors Club Association | Stronger Together for a Better Tomorrow",
  description: "Official Association Portal: Created by Doctors, For Doctors, For a Stronger Medical Community. Register for lifetime membership, welfare, safety, and national medical unity.",
  keywords: ["All India Doctors Club", "Doctor Association", "Medical Community India", "Doctor Welfare", "Doctor Safety", "Medical Registration", "Dr. Ankit Jakhar", "Dr. Dinesh Samota"],
  openGraph: {
    title: "All India Doctors Club Association",
    description: "One Community | One Voice | One Goal - Created by Doctors, For Doctors.",
    type: "website",
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

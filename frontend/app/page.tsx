export default function HomePage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return (
    <main>
      <h1>Environment Aware Build</h1>
      <p>API URL: {apiUrl}</p>
    </main>
  );
}

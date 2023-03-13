export default function Home() {
  const update = async () => {
    const response = await fetch("/api/update");
    if (response.ok) {
      console.log("Updated");
    }
  };
  return (
    <div>
      <button onClick={update}>Test Update</button>
    </div>
  );
}

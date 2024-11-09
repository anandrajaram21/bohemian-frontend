export default async function Page({ params }: { params: Promise<{ electionId: string }> }) {
  const electionId = (await params).electionId;
  return <div>My Post: {electionId}</div>;
}

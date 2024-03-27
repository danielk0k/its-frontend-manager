export default async function SubmissionViewFeedback({ feedback }: { feedback: string }) {

  return (
    <div className="border m-4">{feedback}</div>
  )
}

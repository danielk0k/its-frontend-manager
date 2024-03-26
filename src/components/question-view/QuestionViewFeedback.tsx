export type FeedbackType = {
  lineNumber: number;
  oldExpr: string;
  newExpr: string;
  repairStrings: string[];
};

export default function QuestionViewFeedback({
  feedbacks,
}: {
  feedbacks: FeedbackType[];
}) {
  return (
    <div className="border m-4">
      {feedbacks.length > 0 ? (
        feedbacks.map((feedback, index) => (
          <div key={index}>
            <p>Line Number: {feedback.lineNumber}</p>
            <p>Old Expression: {feedback.oldExpr}</p>
            <p>New Expression: {feedback.newExpr}</p>
            <p>
              Possible Repair:{" "}
              {feedback.repairStrings.map((repair, index) => (
                <span key={index}>{repair}</span>
              ))}
            </p>
          </div>
        ))
      ) : (
        <p>No ITS Feedback</p>
      )}
    </div>
  );
}

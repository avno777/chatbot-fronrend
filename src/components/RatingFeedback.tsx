import React, { useState } from "react";
import { Star } from "lucide-react";

interface Props {
  messageId: string;
}

const RatingFeedback: React.FC<Props> = ({ messageId }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleRating = (value: number) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (!rating) return;
    console.log("Feedback submitted:", { messageId, rating, feedback });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="text-green-500 text-xs mt-2">Cảm ơn bạn đã phản hồi!</p>
    );
  }

  return (
    <div className="mt-2 border-t border-gray-600 pt-2">
      <div className="flex items-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            size={18}
            onClick={() => handleRating(value)}
            className={`cursor-pointer transition ${
              value <= rating
                ? "text-yellow-400"
                : "text-gray-500"
            }`}
          >
            <title>{`Đánh giá ${value} sao`}</title>
          </Star>
        ))}
      </div>
      <textarea
        className="w-full text-sm bg-gray-800 text-white border border-gray-700 rounded p-2"
        placeholder="Góp ý thêm..."
        rows={2}
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
        title="Gửi đánh giá"
      >
        Gửi đánh giá
      </button>
    </div>
  );
};

export default RatingFeedback;

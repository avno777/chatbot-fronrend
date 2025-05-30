import React, { useState } from "react";
import { Star } from "lucide-react";

interface Props {
  messageId: string;
}

const RatingFeedback: React.FC<Props> = ({ messageId }) => {
  const [rating, setRating] = useState<number>(0);
  const [hovered, setHovered] = useState<number>(0);
  const [feedback, setFeedback] = useState("");
  const [saved, setSaved] = useState(false);

  const handleRate = (value: number) => {
    setRating(value);
    localStorage.setItem(`rating-${messageId}`, value.toString());
  };

  const handleFeedback = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setFeedback(text);
    localStorage.setItem(`feedback-${messageId}`, text);
    setSaved(true);
  };

  return (
    <div className="mt-2 text-sm text-gray-600">
      <div className="flex gap-1 items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            className={`cursor-pointer ${
              star <= (hovered || rating) ? "text-yellow-400" : "text-gray-300"
            }`}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => handleRate(star)}
          >
            <title>{`Đánh giá ${star} sao`}</title>
          </Star>
        ))}
      </div>
      <textarea
        placeholder="Ý kiến của bạn..."
        className="mt-1 w-full border rounded px-2 py-1 text-xs"
        value={feedback}
        onChange={handleFeedback}
      />
      {saved && <div className="text-green-500 text-xs mt-1">Đã lưu phản hồi</div>}
    </div>
  );
};

export default RatingFeedback;

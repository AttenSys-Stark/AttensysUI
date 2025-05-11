import { AverageRating } from "@/types/review";

interface RatingDisplayProps {
  rating: AverageRating;
  size?: "sm" | "md" | "lg" | "xs";
}

export const RatingDisplay = ({ rating, size = "sm" }: RatingDisplayProps) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xs: "text-[12px]",
  };

  const starSizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
    xs: "text-[12px]",
  };

  return (
    <div className={`flex items-center w-[100%] gap-2 ${sizeClasses[size]}`}>
      <div className={`flex text-yellow-400 ${starSizeClasses[size]}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={
              star <= Math.round(rating?.average)
                ? "text-yellow-400"
                : "text-gray-300"
            }
          >
            ★
          </span>
        ))}
      </div>
      <span className="font-semibold">{rating?.average.toFixed(1)}</span>
      <span className="text-gray-500">({rating?.count} reviews)</span>
    </div>
  );
};

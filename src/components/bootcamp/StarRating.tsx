import React, { useEffect, useState } from "react";

interface starprop {
  totalStars: number;
  starnumber: number;
}

const StarRating: React.FC<starprop> = (prop) => {
  const [rating, setRating] = useState(0); // Current selected rating

  useEffect(() => {
    setRating(prop.starnumber);
  }, [prop.starnumber]);

  return (
    <div className="flex space-x-1">
      {[...Array(prop.totalStars)].map((_, index) => (
        <svg
          key={index}
          xmlns="http://www.w3.org/2000/svg"
          fill={index < rating ? "#FFD700" : "none"} // Filled or outlined based on rating
          stroke="#FFD700"
          strokeWidth="1.5"
          className="w-4 h-4 cursor-pointer"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 17.27l5.18 3.73-1.64-6.21L20 9.24l-6.5-.56L12 3 10.5 8.68 4 9.24l4.46 5.55-1.64 6.21L12 17.27z"
          />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;

// const StarRating = ({ totalStars = 5, onRatingChange }) => {
//     const [rating, setRating] = useState(0); // Current selected rating

//     // Handle star click
//     const handleStarClick = (index) => {
//       setRating(index + 1);
//       if (onRatingChange) {
//         onRatingChange(index + 1);
//       }
//     };

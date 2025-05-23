import { Star } from "lucide-react"; // or any icon library you're using

type RatingStarsProps = {
  rating: number; // e.g. 4.6
};

export const RatingStars = ({ rating }: RatingStarsProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < fullStars) {
          // Full star
          return (
            <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          );
        } else if (i === fullStars && hasHalfStar) {
          // Half star (using CSS mask trick)
          return (
            <div key={i} className="relative h-5 w-5">
              <Star className="absolute h-5 w-5 text-gray-300 fill-gray-300" />
              <Star
                className="absolute h-5 w-5 text-yellow-400 fill-yellow-400"
                style={{ clipPath: "inset(0 50% 0 0)" }}
              />
            </div>
          );
        } else {
          // Empty star
          return (
            <Star key={i} className="h-5 w-5 text-gray-300 fill-gray-300" />
          );
        }
      })}
    </div>
  );
};

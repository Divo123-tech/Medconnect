import { Review } from "@/utils/types";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {
  review: Review;
};

const DoctorReview = ({ review }: Props) => {
  return (
    <div
      key={review.id}
      className="bg-gray-50 rounded-lg p-4 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="flex items-center mr-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= review.rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">
            {review.createdAt.substring(0, 10)}
          </span>
        </div>
      </div>

      <h4 className="text-lg font-medium text-teal-800 mb-2">{review.title}</h4>
      <p className="text-gray-700">{review.body}</p>

      <div className="flex items-center mt-3">
        <Avatar className="h-8 w-8 mr-2 border border-teal-100">
          <AvatarImage
            src={review.patientProfilePicture || "/placeholder.svg"}
            alt={review.patientFirstName}
          />
          <AvatarFallback className="bg-teal-100 text-teal-800">
            {review.patientFirstName
              .split(" ")
              .map((name) => name[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <p className="text-gray-600 text-sm">
          - {review.patientFirstName} {review.patientLastName}
        </p>
      </div>
    </div>
  );
};

export default DoctorReview;

import { Review } from "@/utils/types";
import { CheckCircle2, Pen, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { updateReview } from "@/services/reviewService";

type Props = {
  review: Review;
};

const DoctorReview = ({ review }: Props) => {
  const { user, token } = useAuthStore();
  const [rating, setRating] = useState(review.rating);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState(review.title);
  const [reviewBody, setReviewBody] = useState(review.body);
  const [reviewSuccess, setReviewSuccess] = useState<boolean | null>(null);
  const mapRatingtoText = (rating: number) => {
    switch (rating) {
      case 0:
        return "Select Rating";
      case 1:
        return "Awful not what I expected at all";
      case 2:
        return "Awful/poor";
      case 3:
        return "Average, could be better";
      case 4:
        return "Good, what I expected";
      case 5:
        return "Amazing! Above expectations";
    }
  };
  const handleSubmitReview = async () => {
    console.log({
      rating,
      reviewTitle,
      reviewBody,
    });
    try {
      await updateReview(token, review.id, rating, reviewTitle, reviewBody);
      setReviewSuccess(true);
    } catch (err) {
      setReviewSuccess(false);
      return err;
    }

    // Reset form and close modal
    setRating(0);
    setReviewTitle("");
    setReviewBody("");
  };
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
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium text-teal-800 mb-2">
          {review.title}
        </h4>
        {user?.id == review.patientId && (
          <Dialog>
            <DialogTrigger>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-white border-gray-800 border cursor-pointer hover:bg-gray-100">
                  <Pen />
                  Edit
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
              <DialogHeader>
                <DialogTitle>Leave a Review</DialogTitle>
                <DialogDescription>
                  Share your experience with this doctor. Your feedback helps
                  others make informed decisions.
                </DialogDescription>
              </DialogHeader>
              {reviewSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 mb-4 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-600"
                >
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Thank you for leaving a review!</span>
                  </div>
                </motion.div>
              )}
              {reviewSuccess == false && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 mb-4 bg-red-50 border border-red-300 rounded-lg text-red-600"
                >
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Something went wrong!</span>
                  </div>
                </motion.div>
              )}
              {/* Star Rating */}
              <div className="flex items-center justify-center gap-2 flex-col">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-none"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        className={`h-8 w-8 transition-all cursor-pointer ${
                          (hoverRating || rating) >= star
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p>
                  {hoverRating == 0
                    ? mapRatingtoText(rating)
                    : mapRatingtoText(hoverRating)}
                </p>
              </div>

              {/* Review Form */}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="review-title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="review-title"
                    placeholder="Summarize your experience"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="review-body" className="text-sm font-medium">
                    Review
                  </label>
                  <Textarea
                    id="review-body"
                    placeholder="Share details of your experience"
                    value={reviewBody}
                    onChange={(e) =>
                      setReviewBody(e.target.value.slice(0, 500))
                    }
                    className="min-h-[100px]"
                  />
                  <div className="text-right text-sm text-gray-500">
                    {reviewBody.length}/500 characters
                  </div>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                {/* <DialogClose asChild> */}
                <Button
                  onClick={handleSubmitReview}
                  disabled={!rating || !reviewTitle || !reviewBody}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                >
                  Submit Review
                </Button>
                {/* </DialogClose> */}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
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

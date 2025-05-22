import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import {
  Calendar,
  CheckCircle,
  Clock,
  Star,
  StarIcon,
  Video,
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Appointment } from "@/utils/types";
import { Link } from "react-router";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useState } from "react";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
type Props = {
  appointment: Appointment;
};

const CompletedAppointments = ({ appointment }: Props) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const handleSubmitReview = () => {
    // Here you would typically send the review data to your backend
    console.log({
      rating,
      reviewTitle,
      reviewBody,
    });

    // Reset form and close modal
    setRating(0);
    setReviewTitle("");
    setReviewBody("");
  };
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
  return (
    <motion.div
      key={appointment.id}
      variants={itemVariants}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden border-gray-200 hover:shadow-lg transition-all duration-300 pt-0">
        <CardHeader className="py-4 bg-gradient-to-r from-gray-100 to-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-3 border-2 border-amber-200">
                <AvatarImage
                  src={appointment.doctorProfilePicture || "/placeholder.svg"}
                  alt={`${appointment.doctorFirstName} ${appointment.doctorLastName}`}
                />
                <AvatarFallback>
                  {appointment.doctorFirstName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">
                  {appointment.doctorFirstName} {appointment.doctorLastName}
                </CardTitle>
                <p className="text-gray-500">Cardiology</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Completed
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2 pt-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-1 text-gray-500" />
              {appointment.date}
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-1 text-gray-500" />
              {appointment.time}
            </div>
            <div className="flex items-center text-gray-600">
              <Video className="h-4 w-4 mr-1 text-gray-500" />
              Video Call
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex justify-between w-full">
            {/* Review Modal */}
            <Dialog>
              <DialogTrigger>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    className="text-gray-600 border-gray-300 hover:bg-gray-100 cursor-pointer"
                  >
                    <StarIcon className="mr-2 h-4 w-4" />
                    Leave a Review!
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
                    {rating != 0
                      ? mapRatingtoText(rating)
                      : mapRatingtoText(hoverRating)}
                  </p>
                </div>

                {/* Review Form */}
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label
                      htmlFor="review-title"
                      className="text-sm font-medium"
                    >
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
                    <label
                      htmlFor="review-body"
                      className="text-sm font-medium"
                    >
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
                  <DialogClose asChild>
                    <Button
                      onClick={handleSubmitReview}
                      disabled={!rating || !reviewTitle || !reviewBody}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    >
                      Submit Review
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="flex gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/book-appointment">
                  <Button className="bg-gradient-to-r text-white from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 shadow-md">
                    Book Follow-up
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CompletedAppointments;

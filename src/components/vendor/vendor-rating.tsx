import { RatingStars } from "@/components/shared/rating-stars";

type VendorRatingProps = {
  rating: number | null;
};

export function VendorRating({ rating }: VendorRatingProps) {
  if (typeof rating !== "number") {
    return (
      <p className="text-sm text-slate-600 dark:text-slate-300">No ratings yet</p>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <RatingStars rating={rating} />
      <span className="text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}

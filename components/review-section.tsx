"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createBrowserClient } from "@/lib/supabase/client"
import { Star, MessageCircle } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface Review {
  id: string
  rating: number
  comment: string
  created_at: string
  profiles: { full_name: string }
}

interface ReviewSectionProps {
  productId: string
  reviews: Review[]
}

export function ReviewSection({ productId, reviews: initialReviews }: ReviewSectionProps) {
  const [reviews, setReviews] = useState(initialReviews)
  const [user, setUser] = useState<User | null>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const supabase = createBrowserClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || rating === 0) return

    setSubmitting(true)
    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert([
          {
            product_id: productId,
            user_id: user.id,
            rating,
            comment,
          },
        ])
        .select(`
          id,
          rating,
          comment,
          created_at,
          profiles(full_name)
        `)
        .single()

      if (error) throw error

      setReviews([data, ...reviews])
      setRating(0)
      setComment("")
      setShowReviewForm(false)
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
              <span className="text-gray-600">({reviews.length} reviews)</span>
            </div>
          </div>
        </div>

        {user && (
          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Write Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && user && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <Card>
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <Label>Rating</Label>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setRating(star)} className="p-1">
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            star <= rating ? "text-yellow-400 fill-current" : "text-gray-300 hover:text-yellow-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="comment">Comment</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    className="mt-1"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting || rating === 0}>
                    {submitting ? "Submitting..." : "Submit Review"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold">{review.profiles.full_name}</span>
                      </div>
                      <p className="text-sm text-gray-600">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

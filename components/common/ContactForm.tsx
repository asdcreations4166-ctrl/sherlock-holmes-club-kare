"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContactMessage } from "@/services/clubService";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(3, "Subject must be at least 3 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      await submitContactMessage(data);
      toast.success("Message sent successfully! We will contact you soon.");
      reset();
    } catch (error) {
      console.error("Failed to submit message to Firestore", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Your Name
          </label>
          <Input
            id="name"
            placeholder="John Watson"
            disabled={isSubmitting}
            className="rounded-xl border-border bg-white dark:bg-background text-foreground focus:ring-primary focus:border-primary"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive font-medium">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="watson@kare.edu.in"
            disabled={isSubmitting}
            className="rounded-xl border-border bg-white dark:bg-background text-foreground focus:ring-primary focus:border-primary"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-1.5">
        <label htmlFor="subject" className="text-xs font-semibold text-foreground uppercase tracking-wider">
          Subject
        </label>
        <Input
          id="subject"
          placeholder="Inquiry about upcoming events..."
          disabled={isSubmitting}
          className="rounded-xl border-border bg-white dark:bg-background text-foreground focus:ring-primary focus:border-primary"
          {...register("subject")}
        />
        {errors.subject && (
          <p className="text-xs text-destructive font-medium">{errors.subject.message}</p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <label htmlFor="message" className="text-xs font-semibold text-foreground uppercase tracking-wider">
          Message Details
        </label>
        <Textarea
          id="message"
          placeholder="Please write your query or message in detail..."
          disabled={isSubmitting}
          rows={5}
          className="rounded-xl border-border bg-white dark:bg-background text-foreground focus:ring-primary focus:border-primary resize-none"
          {...register("message")}
        />
        {errors.message && (
          <p className="text-xs text-destructive font-medium">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full justify-center gap-2 py-5 rounded-xl font-medium shadow-sm transition-transform active:scale-[0.98]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Sending Message...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>Send Message</span>
          </>
        )}
      </Button>
    </form>
  );
}

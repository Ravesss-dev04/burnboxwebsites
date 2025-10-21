"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User2Icon, MailIcon, Loader2, ImageIcon, X } from "lucide-react";

function FakeInquiryForm({ product }: { product: { name: string; price: string } }) {
  const [images, setImages] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [imageBase64, setImageBase64] = useState("");
  const [isBlock, setIsBlock] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [message, setMessage] = useState("");

  // Convert file to base64
  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  // Detect blur
  const detectBlur = (file: File) =>
    new Promise<boolean>((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        const gray: number[] = [];
        for (let i = 0; i < pixels.length; i += 4) {
          gray.push(0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2]);
        }

        const laplacian: number[] = [];
        const w = canvas.width;
        for (let y = 1; y < canvas.height - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const i = y * w + x;
            const val = -4 * gray[i] + gray[i - 1] + gray[i + 1] + gray[i - w] + gray[i + w];
            laplacian.push(val);
          }
        }

        const mean = laplacian.reduce((a, b) => a + b, 0) / laplacian.length;
        const variance = laplacian.reduce((a, b) => a + (b - mean) ** 2, 0) / laplacian.length;

        resolve(variance < 450); // threshold
      };
      img.onerror = () => resolve(false);
    });

  const checkModeration = async (file: File) => {
    try {
      setLoading(true);
      const isBlurry = await detectBlur(file);
      if (isBlurry) {
        setIsBlock(true);
        setBlockReason("Image too blurry. Upload a clearer sample layout.");
        return;
      }

      const base64 = await toBase64(file);
      setImageBase64(base64);

      const res = await fetch("/api/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });

      const data = await res.json();
      if (res.status === 403 || data.blocked) {
        setIsBlock(true);
        setBlockReason(data.reason || "Inappropriate content detected.");
      } else {
        setIsBlock(false);
        setBlockReason("");
      }
    } catch (err) {
      console.error(err);
      setIsBlock(true);
      setBlockReason("Failed to check image safety.");
    } finally {
      setLoading(false);
    }
  };

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files);
    setImages(newFiles);
    if (newFiles[0]) checkModeration(newFiles[0]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setIsBlock(false);
    setBlockReason("");
  };

  // Send OTP
  const sendOtp = async () => {
    if (!formEmail) {
      setMessage("Email is required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsOtpSent(true);
        setMessage("OTP sent to email.");
      } else setMessage(data.error || "Failed to send OTP.");
    } catch (err) {
      setMessage("Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!otp) {
      setOtpMessage("Enter OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formEmail, otp }),
      });
      const data = await res.json();
      if (data.success) {
        setIsVerified(true);
        setOtpMessage("✅ OTP verified!");
      } else {
        setOtpMessage("❌ Invalid OTP. Try again.");
      }
    } catch (err) {
      setOtpMessage("Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };




  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isVerified) {
      setMessage("Please verify your email first.");
      return;
    }
    if (images.length === 0) {
      setIsBlock(true);
      setBlockReason("Please upload a sample layout before sending inquiry.");
      return;
    }





    setIsSubmitting(true);
    try {
      // Re-check moderation
      await checkModeration(images[0]);
      if (isBlock) return;

      // Send inquiry
      const res = await fetch("/api/send-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          message: formMessage,
          imageBase64,
          productName: product.name,
          productPrice: product.price
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send inquiry");

      setFormName("");
      setFormEmail("");
      setFormMessage("");
      setImageBase64("");
      setOtp("")
      setIsOtpSent(false);
      
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (err) {
      console.error(err);
      setIsBlock(true);
      setBlockReason("Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-col gap-3 mt-10">
      {/* Loading */}
      <AnimatePresence>
        {(isSubmitting || loading) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 rounded-md flex flex-col items-center justify-center z-10"
          >
            <Loader2 className="w-10 h-10 text-pink animate-spin" />
            <p className="mt-2 text-sm text-gray-300">
              {isSubmitting ? "Sending inquiry..." : "Processing..."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/80 rounded-md flex flex-col items-center justify-center z-20 overflow-hidden"
          >
            <motion.img
              src="/inquiry.gif"
              alt="Inquiry sent"
              initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
              animate={{ y: -350, x: 150, opacity: 0, scale: 1.3 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="w-24 h-24 mb-3"
            />
            <motion.p
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -30 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="text-white font-medium"
            >
              Inquiry Sent!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name */}
      <div className="relative">
        <User2Icon className="text-pink absolute left-3 top-2.5" size={18} />
        <input
          type="text"
          placeholder="Your Name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          className="bg-black/50 border border-pink/40 rounded-md pl-10 pr-3 py-2 w-full text-sm text-gray-200 focus:ring-1 focus:ring-pink/70 outline-none"
          disabled={isSubmitting}
          required
        />
      </div>

      {/* Email */}
      <div className="relative">
        <MailIcon className="text-pink absolute left-3 top-2.5" size={18} />
        <input
          type="email"
          value={formEmail}
          placeholder="Your Email"
          onChange={(e) => setFormEmail(e.target.value)}
          className="bg-black/50 border border-pink/40 rounded-md pl-10 pr-3 py-2 w-full text-sm text-gray-200 focus:ring-1 focus:ring-pink/70 outline-none"
          disabled={isSubmitting}
          required
        />
      </div>

      {/* OTP */}
      {!isVerified && (
        <div className="flex gap-2 items-center mt-2">
          <button
            type="button"
            onClick={sendOtp}
            disabled={loading || isOtpSent}
            className="bg-pink text-white text-sm px-3 py-1 rounded hover:bg-pink/80 transition"
          >
            {isOtpSent ? "OTP Sent" : "Send OTP"}
          </button>
          {isOtpSent && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
              />
              <button
                type="button"
                onClick={verifyOtp}
                className="bg-pink text-white text-sm px-3 py-1 rounded hover:bg-pink/80 transition"
              >
                Verify
              </button>
            </>
          )}
        </div>
      )}
      {otpMessage && <p className="text-xs text-gray-400">{otpMessage}</p>}

      {/* Message */}
      <textarea
        placeholder="Tell us what you like to know or customize..."
        rows={4}
        value={formMessage}
        onChange={(e) => setFormMessage(e.target.value)}
        className="bg-black/50 border border-pink/40 rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-1 focus:ring-pink outline-none resize-none"
        disabled={isSubmitting}
        required
      />

      {/* Image Upload */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-md p-4 text-center transition-all cursor-pointer ${
          isDragging ? "border-pink/10" : "border-pink/40 bg-black/40 hover:bg-black/60"
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
          id="imageUpload"
          disabled={isSubmitting}
          required
        />
        <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center">
          <ImageIcon className="w-6 h-6 text-pink mb-2" />
          <p className="text-sm text-gray-500">Drop your sample layout</p>
        </label>

        {images.length > 0 && (
          <div className="mt-3 flex flex-nowrap justify-center gap-3 max-h-40 overflow-y-hidden">
            {images.map((file, index) => (
              <div
                key={index}
                className="relative group w-20 min-h-20 aspect-square border border-pink/30 rounded-md"
              >
                <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={12} className="text-pink" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isBlock && (
        <div className="bg-red-500/10 border border-red-600 text-red-300 text-sm p-2 rounded-lg">
          {blockReason}
        </div>
      )}

      {/* Submit */}
      <motion.button
        whileHover={{ scale: isSubmitting || isBlock ? 1 : 1.03 }}
        whileTap={{ scale: isSubmitting || isBlock ? 1 : 0.95 }}
        type="submit"
        disabled={isSubmitting || isBlock || !isVerified}
        className={`bg-pink/70 hover:bg-pink transition-all text-white py-2 rounded-md font-medium ${
          (isSubmitting || isBlock) && "cursor-not-allowed opacity-70"
        }`}
      >
        {isSubmitting ? "Submitting..." : !isVerified ? "Verify Email to Send" : "Send Inquiry"}
      </motion.button>

      {message && <p className="text-sm text-gray-500 mt-2">{message}</p>}

      <p className="text-xs text-gray-400 text-center mt-3">
        We'll get back to you within hours via email.
      </p>
    </form>
  );
}

export default FakeInquiryForm;

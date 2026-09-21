import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiRefreshCw,
  FiTruck,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import FeaturedBooks from "../components/books/FeaturedBooks";
import SEO from "../components/SEO";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1600&q=85",
    eyebrow: "Explore. Read. Grow.",
    title: "Stories That Stay With You",
    description:
      "Discover inspiring stories, timeless classics, and new perspectives from our carefully selected collection.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1600&q=85",
    eyebrow: "Discover Your Next Read",
    title: "A World of Books Awaits",
    description:
      "Find books that match your interests, spark your imagination, and make every reading moment meaningful.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=85",
    eyebrow: "Curated For Readers",
    title: "Read More. Discover More.",
    description:
      "Browse our collection of fiction, non-fiction, technology, business, self-development, and more.",
  },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const features = [
    {
      icon: FiBookOpen,
      title: "Curated Collection",
      description: "Hand-picked books across popular categories and interests.",
    },
    {
      icon: FiCheckCircle,
      title: "Secure Checkout",
      description:
        "A simple and secure ordering experience from cart to checkout.",
    },
    {
      icon: FiTruck,
      title: "Fast Delivery",
      description:
        "Get your favorite books delivered conveniently to your door.",
    },
    {
      icon: FiRefreshCw,
      title: "Easy Returns",
      description:
        "A straightforward shopping experience designed for every reader.",
    },
  ];

  // Automatically change slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <main>
      <SEO
        title="BookStore | Online Book Store"
        description="Discover and shop books online at BookStore. Explore fiction, non-fiction, technology, business, self-development, and more."
      />

      {/* =========================
          HERO SLIDER
      ========================== */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        {/* Background Images */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={slide.image}
              src={slide.image}
              alt={slide.title}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="h-full w-full object-cover"
            />
          </AnimatePresence>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-slate-950/75" />

          {/* Left-to-right Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/30" />
        </div>

        {/* Decorative Glow */}
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.16),transparent_35%)]"
          aria-hidden="true"
        />

        {/* Hero Content */}
        <div className="relative mx-auto flex min-h-[600px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              {/* Eyebrow */}
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-400 sm:text-sm">
                {slide.eyebrow}
              </p>

              {/* Heading */}
              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                {slide.title}
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                {slide.description}
              </p>

              {/* Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/books"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/40"
                >
                  Explore Books
                  <FiArrowRight size={18} aria-hidden="true" />
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-500 px-6 py-3.5 font-semibold text-white transition hover:border-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  Create Account
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* =========================
              SLIDER DOTS
          ========================== */}
          <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={currentSlide === index ? "true" : "false"}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "w-8 bg-amber-400"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          FEATURES
      ========================== */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.05,
                }}
                className="bg-white px-5 py-8 sm:px-6"
              >
                {/* Icon */}
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                  <Icon size={20} aria-hidden="true" />
                </div>

                {/* Title */}
                <h2 className="mt-5 font-bold text-slate-950">
                  {feature.title}
                </h2>

                {/* Description */}
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* =========================
          FEATURED BOOKS
      ========================== */}
      <FeaturedBooks />

      {/* =========================
          CALL TO ACTION
      ========================== */}
      <section className="border-t border-slate-200 bg-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
          >
            {/* Eyebrow */}
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600 sm:text-sm">
              Keep exploring
            </p>

            {/* Heading */}
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Find Your Next Favorite Book
            </h2>

            {/* Description */}
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Browse our complete collection and discover stories, ideas, and
              knowledge worth bringing home.
            </p>

            {/* CTA */}
            <Link
              to="/books"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20"
            >
              Browse All Books
              <FiArrowRight size={18} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Home;

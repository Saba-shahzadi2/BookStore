import { motion } from "framer-motion";
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

const Home = () => {
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

  return (
    <main>
      <SEO
        title="BookStore | Online Book Store"
        description="Discover, explore, and shop your favorite books online at BookStore."
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.12),transparent_35%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-400 sm:text-sm"
            >
              Your next great read
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Discover Books That
              <span className="block text-amber-400">Inspire & Transform</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8"
            >
              Explore a carefully selected collection of books from bestselling
              authors, timeless classics, and exciting new voices.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                to="/books"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/40"
              >
                Explore Books
                <FiArrowRight size={18} aria-hidden="true" />
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl border border-slate-600 px-6 py-3.5 font-semibold text-white transition hover:border-slate-400 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                Create Account
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
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
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                  <Icon size={20} aria-hidden="true" />
                </div>

                <h2 className="mt-5 font-bold text-slate-950">
                  {feature.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Featured Books */}
      <FeaturedBooks />

      {/* CTA */}
      <section className="border-t border-slate-200 bg-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600 sm:text-sm">
              Keep exploring
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Find Your Next Favorite Book
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Browse our complete collection and discover stories, ideas, and
              knowledge worth bringing home.
            </p>

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

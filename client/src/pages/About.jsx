import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiHeart,
  FiSearch,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import SEO from "../components/SEO";

const About = () => {
  const features = [
    {
      icon: FiSearch,
      title: "Easy Discovery",
      description:
        "Find books quickly through categories, search, and a simple browsing experience.",
    },
    {
      icon: FiShoppingBag,
      title: "Simple Shopping",
      description:
        "Browse your favorite books, add them to your cart, and enjoy a smooth shopping experience.",
    },
    {
      icon: FiBookOpen,
      title: "Curated Collection",
      description:
        "Explore a growing collection of books across different genres and interests.",
    },
    {
      icon: FiUsers,
      title: "Reader Focused",
      description:
        "Everything is designed around making book discovery simple and enjoyable.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <SEO
        title="About Us | BookStore"
        description="Learn about BookStore, an online bookstore built to make discovering, exploring, and shopping for books simple and enjoyable."
      />

      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm"
            >
              <FiBookOpen size={25} aria-hidden="true" />
            </motion.div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-amber-600 sm:text-sm">
              About BookStore
            </p>

            <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              A better way to discover your next book.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              BookStore is an online bookstore experience built to make
              discovering, exploring, and shopping for books simple and
              enjoyable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600 sm:text-sm">
              Our Story
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
              Built for people who love to read.
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
              <p>
                We believe finding a great book should be an enjoyable
                experience, not a complicated one. BookStore brings books,
                categories, product details, and shopping into one clean
                platform.
              </p>

              <p>
                From discovering a new author to finding an old favorite, our
                goal is to give readers a simple and reliable place to explore
                books that match their interests.
              </p>

              <p>
                The platform is designed with a strong focus on usability,
                responsive design, and a smooth customer experience across
                desktop and mobile devices.
              </p>
            </div>
          </motion.div>

          {/* Visual Card */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-xl sm:p-10"
          >
            <div
              className="absolute -right-16 -top-16 h-40 w-40 rounded-full border border-white/10"
              aria-hidden="true"
            />

            <div
              className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full border border-white/10"
              aria-hidden="true"
            />

            <div
              className="absolute right-10 top-10 h-2 w-2 rounded-full bg-amber-400"
              aria-hidden="true"
            />

            <div className="relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10"
              >
                <FiHeart size={24} aria-hidden="true" />
              </motion.div>

              <h3 className="mt-7 text-2xl font-bold leading-tight sm:text-3xl">
                Every book has a story.
              </h3>

              <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
                And every reader has a different journey. BookStore is built to
                help you discover yours.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
                  <p className="text-2xl font-bold sm:text-3xl">100+</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Books to explore
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
                  <p className="text-2xl font-bold sm:text-3xl">20+</p>
                  <p className="mt-1 text-xs text-slate-400">Categories</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className="max-w-2xl"
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600 sm:text-sm">
              Why BookStore
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Designed around the reader.
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
              A straightforward experience with the features you need to
              discover and shop for books.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.06,
                  }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-shadow duration-300 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
                    <Icon size={19} aria-hidden="true" />
                  </div>

                  <h3 className="mt-5 font-bold text-slate-950">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-center text-white shadow-xl sm:px-10 sm:py-14"
        >
          <div
            className="absolute -right-20 -top-20 h-48 w-48 rounded-full border border-white/10"
            aria-hidden="true"
          />

          <div
            className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full border border-white/10"
            aria-hidden="true"
          />

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400 sm:text-sm">
              Start exploring
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to find your next read?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Explore our collection and discover books that match your
              interests.
            </p>

            <Link
              to="/books"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <FiBookOpen size={17} aria-hidden="true" />
              Explore Books
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default About;

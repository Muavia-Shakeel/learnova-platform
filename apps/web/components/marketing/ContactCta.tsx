import { FadeIn } from "./FadeIn";

export function ContactCta() {
  return (
    <section className="bg-deep-blue py-20">
      <FadeIn className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
        <h2 className="font-display text-3xl font-bold text-off-white sm:text-4xl">
          Still deciding? Talk to a real person.
        </h2>
        <p className="max-w-lg text-off-white/70">
          Drop your WhatsApp number when you book a free trial and our team will reach out directly —
          no ticket queue.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/book-demo"
            className="rounded-full bg-sage-green px-7 py-3.5 font-semibold text-white transition-transform hover:scale-105"
          >
            Book a Free Trial
          </a>
          <a
            href="#"
            className="rounded-full border-2 border-off-white/40 px-7 py-3.5 font-semibold text-off-white transition-colors hover:bg-off-white/10"
          >
            Chat on WhatsApp
          </a>
        </div>
      </FadeIn>
    </section>
  );
}

"use client";
import { t } from "@/utils";

const HeroSearch = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary via-[#1e3a8a] to-slate-900 text-white py-16 md:py-24">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t("searchAd")}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-slate-200">
            {t("connectVastAudience")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;

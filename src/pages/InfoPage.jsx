import { Link, useParams } from "react-router-dom";
import { getPageBySlug } from "../services/api";
import useApiData from "../hooks/useApiData";

// Renders any footer page (About us, Privacy Policy, Delivery Policy...) from page/{slug}
export default function InfoPage() {
  const { slug } = useParams();
  const { data: page, loading } = useApiData(`page-${slug}`, () => getPageBySlug(slug));

  return (
    <section className="container-custom py-6 md:py-10">
      {loading ? (
        <div className="space-y-3">
          <div className="h-7 w-1/3 animate-pulse rounded bg-neutral-200" />
          <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-200" />
        </div>
      ) : !page ? (
        <div className="rounded-lg bg-white px-4 py-10 text-center shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
          <h1 className="text-base font-bold text-neutral-900 md:text-xl">Page not found</h1>
          <p className="mt-1 text-sm text-neutral-500">This page is not available right now.</p>
          <Link to="/" className="mt-4 inline-block text-sm font-semibold text-[#f7931e] hover:underline">
            Back to home
          </Link>
        </div>
      ) : (
        <article className="rounded-lg bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)] md:p-8">
          <h1 className="mb-4 text-xl font-bold text-neutral-900 md:text-2xl">{page.page_name}</h1>
          <div
            className="info-page-content max-w-none text-sm leading-6 text-neutral-700 [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:font-semibold [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-[#f7931e] [&_a]:underline [&_img]:h-auto [&_img]:max-w-full [&_table]:w-full"
            dangerouslySetInnerHTML={{ __html: page.description || "" }}
          />
        </article>
      )}
    </section>
  );
}

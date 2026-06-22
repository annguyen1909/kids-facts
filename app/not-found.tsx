import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
        Page not found
      </p>
      <h1 className="mt-3 text-5xl font-extrabold tracking-tight text-slate-950">
        We couldn&apos;t find that animal page
      </h1>
      <p className="mt-4 text-lg leading-8 text-slate-600">
        Try the main animal library to keep exploring.
      </p>
      <Link
        href="/animals"
        className="mt-8 rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950"
      >
        Visit the animal library
      </Link>
    </div>
  );
}

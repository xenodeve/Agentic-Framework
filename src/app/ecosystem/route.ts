import { NextResponse } from "next/server";

// Spec §9.4: /ecosystem is a URL people guess. It is no longer an index list —
// the "Built on" section on / is the single entry to the deep pages. Rather
// than 404, send the guesser there with a permanent (308) redirect that
// preserves the method and the fragment scroll.
//
// The fragment makes "/#built-on" an invalid *absolute* URL, so Next's
// redirect() (which does new URL(dest)) rejects it. Resolve it against the
// incoming request so the Location is a full URL that still carries the hash.
export async function GET(request: Request) {
  const location = new URL("/#built-on", request.url);
  return NextResponse.redirect(location, 308);
}

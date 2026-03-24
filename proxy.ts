import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/pricing(.*)",
  "/about(.*)",
  "/contact(.*)",
  "/terms(.*)",
  "/privacy(.*)",
  "/ats-resume-builder(.*)",
  "/resume-templates(.*)",
  "/resume-generator(.*)",
  "/cover-letter-generator(.*)",
  "/cover-letter-templates(.*)",
  "/resume-tailoring(.*)",
  "/resume-builder-from-job-description(.*)",
  "/ats-resume-checker(.*)",
  "/resume-builder-for-students(.*)",
  "/resume-optimization(.*)",
  "/api/(.*)",
  "/print/(.*)",
  "/sitemap.xml",
  "/robots.txt",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

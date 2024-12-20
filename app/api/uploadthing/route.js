import { createRouteHandler } from "uploadthing/server";
import { ourFileRouter } from "@/utils/uploadthing";

// Export routes for Next.js App Router
const handler = createRouteHandler({
  router: ourFileRouter,
});

export { handler as GET, handler as POST };

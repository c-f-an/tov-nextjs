import { redirect } from "next/navigation";
import { getContainer } from "@/infrastructure/config/getContainer";

// Force dynamic rendering
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ResourceDetailRedirect({ params }: PageProps) {
  const { id } = await params;

  const container = getContainer();
  const resourceRepo = container.getResourceRepository();

  try {
    const resource = await resourceRepo.findById(parseInt(id));

    if (resource && resource.category && resource.slug) {
      // Redirect to new URL format
      redirect(`/resources/${resource.category.slug}/${resource.slug}`);
    }
  } catch (error) {
    console.error("Error fetching resource for redirect:", error);
  }

  // If resource not found or no slug, redirect to resources page
  redirect("/resources");
}

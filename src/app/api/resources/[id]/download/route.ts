import { NextRequest, NextResponse } from "next/server";
import { getContainer } from "@/infrastructure/config/getContainer";
import { S3Service } from "@/infrastructure/services/S3Service";

// GET /api/resources/[id]/download - Download resource file
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resourceId = parseInt(params.id);

    if (isNaN(resourceId)) {
      return NextResponse.json(
        { error: "Invalid resource ID" },
        { status: 400 }
      );
    }

    const container = getContainer();
    const resourceRepository = container.getResourceRepository();

    const resource = await resourceRepository.findById(resourceId);

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    // If external link, redirect
    // if (resource.externalLink) {
    //   return NextResponse.redirect(resource.externalLink);
    // }

    // Check if file exists
    if (!resource.filePath) {
      return NextResponse.json(
        { error: "No file available for download" },
        { status: 404 }
      );
    }

    // Log download
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || null;

    // TODO: Get userId from authentication
    await resourceRepository.logDownload(
      resourceId,
      null,
      ipAddress,
      userAgent
    );
    await resourceRepository.incrementDownloadCount(resourceId);

    // Initialize S3 service with empty basePath since resource.filePath already includes the full path
    const s3Service = new S3Service("");

    try {
      console.log("Attempting to download file:", resource.filePath);

      // Always stream file directly from S3 to avoid CORS issues
      const fileData = await s3Service.getFile(resource.filePath);

      console.log("File downloaded from S3, size:", fileData.contentLength);

      // Set appropriate headers for file download
      const headers = new Headers();
      headers.set(
        "Content-Type",
        fileData.contentType || resource.fileType || "application/octet-stream"
      );
      headers.set(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(
          resource.originalFilename || "download"
        )}"`
      );
      headers.set(
        "Content-Length",
        fileData.contentLength?.toString() ||
          resource.fileSize?.toString() ||
          "0"
      );
      headers.set("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
      headers.set("Access-Control-Allow-Origin", "*"); // Allow CORS
      headers.set("Access-Control-Allow-Methods", "GET");
      headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );

      return new NextResponse(fileData.body, {
        status: 200,
        headers,
      });
    } catch (error) {
      console.error("Error accessing file from S3:", error);
      console.error("File path:", resource.filePath);
      console.error("Bucket:", process.env.AWS_S3_BUCKET_NAME);
      return NextResponse.json(
        {
          error: "File not found or inaccessible",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error downloading resource:", error);
    return NextResponse.json(
      { error: "Failed to download resource" },
      { status: 500 }
    );
  }
}

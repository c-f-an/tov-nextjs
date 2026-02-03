import { NextRequest, NextResponse } from "next/server";
import { getContainer } from "@/infrastructure/config/getContainer";
import { S3Service } from "@/infrastructure/services/S3Service";

// GET /api/resources/[id]/download - Download resource file
// Query params: ?fileId=123 (optional, downloads specific file from resource_files)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resourceId = parseInt(id);
    const searchParams = request.nextUrl.searchParams;
    const fileIdParam = searchParams.get("fileId");

    if (isNaN(resourceId)) {
      return NextResponse.json(
        { error: "Invalid resource ID" },
        { status: 400 }
      );
    }

    const container = getContainer();
    const resourceRepository = container.getResourceRepository();
    const resourceFileRepository = container.getResourceFileRepository();

    const resource = await resourceRepository.findById(resourceId);

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    // Determine which file to download
    let filePath: string | null = null;
    let originalFilename: string | null = null;
    let fileType: string | null = null;
    let fileSize: number | null = null;
    let fileId: number | null = null;

    if (fileIdParam) {
      // Download specific file by fileId
      const file = await resourceFileRepository.findById(parseInt(fileIdParam));
      if (!file || file.resourceId !== resourceId) {
        return NextResponse.json(
          { error: "File not found" },
          { status: 404 }
        );
      }
      filePath = file.filePath;
      originalFilename = file.originalFilename;
      fileType = file.fileType;
      fileSize = file.fileSize;
      fileId = file.id;
    } else {
      // Try to get from resource_files first, then fallback to resource.filePath
      const files = await resourceFileRepository.findByResourceId(resourceId);
      if (files.length > 0) {
        const firstFile = files[0];
        filePath = firstFile.filePath;
        originalFilename = firstFile.originalFilename;
        fileType = firstFile.fileType;
        fileSize = firstFile.fileSize;
        fileId = firstFile.id;
      } else if (resource.filePath) {
        // Backward compatibility: use old single file fields
        filePath = resource.filePath;
        originalFilename = resource.originalFilename;
        fileType = resource.fileType;
        fileSize = resource.fileSize;
      }
    }

    // Check if file exists
    if (!filePath) {
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

    // Log to resource download logs
    await resourceRepository.logDownload(
      resourceId,
      null,
      ipAddress,
      userAgent
    );

    // Increment download counts
    if (fileId) {
      await resourceFileRepository.incrementDownloadCount(fileId);
    } else {
      await resourceRepository.incrementDownloadCount(resourceId);
    }

    // Initialize S3 service with empty basePath since filePath already includes the full path
    const s3Service = new S3Service("");

    try {
      console.log("Attempting to download file:", filePath);

      // Always stream file directly from S3 to avoid CORS issues
      const fileData = await s3Service.getFile(filePath);

      console.log("File downloaded from S3, size:", fileData.contentLength);

      // Set appropriate headers for file download
      const headers = new Headers();
      headers.set(
        "Content-Type",
        fileData.contentType || fileType || "application/octet-stream"
      );
      headers.set(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(
          originalFilename || "download"
        )}"`
      );
      headers.set(
        "Content-Length",
        fileData.contentLength?.toString() ||
          fileSize?.toString() ||
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
      console.error("File path:", filePath);
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

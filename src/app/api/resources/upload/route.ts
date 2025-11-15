import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { S3Service } from "@/infrastructure/services/S3Service";
import { getContainer } from "@/infrastructure/config/getContainer";

// POST /api/resources/upload - Upload file for a specific resource
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const resourceIdValue = formData.get("resourceId");

    console.log("FormData received:", {
      hasFile: !!file,
      resourceIdValue,
      resourceIdType: typeof resourceIdValue,
    });

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!resourceIdValue) {
      return NextResponse.json(
        { error: "Resource ID is required" },
        { status: 400 }
      );
    }

    const resourceId = resourceIdValue.toString();

    // Validate file type
    const fileExt = path.extname(file.name).toLowerCase();
    const allowedExtensions = [
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".ppt",
      ".pptx",
      ".hwp",
      ".zip",
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
    ];

    if (!allowedExtensions.includes(fileExt)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Initialize S3 service
    const s3Service = new S3Service("resources");

    // Generate file key with resource ID: {timestamp}_{uniqueId}_{resourceId}.{ext}
    const timestamp = Date.now();
    const uniqueId = Math.random().toString(36).substring(2, 8);
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const fileKey = `${timestamp}_${uniqueId}_${resourceId}${fileExt}`;

    console.log("Resource Upload:", {
      resourceId,
      fileKey,
      originalName: file.name,
      fileExt,
    });

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get file type (MIME)
    const fileType = file.type || "application/octet-stream";

    // Upload to S3
    const uploadResult = await s3Service.uploadFile(fileKey, buffer, fileType, {
      originalName: encodeURIComponent(file.name),
      uploadedAt: new Date().toISOString(),
      resourceId: resourceId,
    });

    // Update resource with file information
    const container = getContainer();
    const resourceRepository = container.getResourceRepository();

    const resource = await resourceRepository.findById(parseInt(resourceId));
    if (!resource) {
      // Clean up uploaded file if resource not found
      await s3Service.deleteFile(uploadResult.key);
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    // Update resource with file info
    resource.setFile(
      uploadResult.key,
      file.name,
      fileExt.substring(1).toUpperCase(),
      file.size
    );

    await resourceRepository.update(resource);

    return NextResponse.json({
      path: uploadResult.key,
      url: uploadResult.url,
      originalName: file.name,
      type: fileExt.substring(1).toUpperCase(),
      size: file.size,
      etag: uploadResult.etag,
    });
  } catch (error) {
    console.error("Resource upload error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to upload file",
      },
      { status: 500 }
    );
  }
}

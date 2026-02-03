import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { S3Service } from "@/infrastructure/services/S3Service";
import { getContainer } from "@/infrastructure/config/getContainer";
import { ResourceFile } from "@/core/domain/entities/ResourceFile";

// POST /api/resources/upload - Upload file(s) for a specific resource
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Support both single file (file) and multiple files (files)
    const singleFile = formData.get("file") as File | null;
    const multipleFiles = formData.getAll("files") as File[];
    const resourceIdValue = formData.get("resourceId");

    // Combine files: prefer multiple files, fallback to single file
    const filesToUpload = multipleFiles.length > 0
      ? multipleFiles
      : (singleFile ? [singleFile] : []);

    console.log("FormData received:", {
      filesCount: filesToUpload.length,
      resourceIdValue,
      resourceIdType: typeof resourceIdValue,
    });

    if (filesToUpload.length === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!resourceIdValue) {
      return NextResponse.json(
        { error: "Resource ID is required" },
        { status: 400 }
      );
    }

    const resourceId = resourceIdValue.toString();

    // Validate file types
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

    for (const file of filesToUpload) {
      const fileExt = path.extname(file.name).toLowerCase();
      if (!allowedExtensions.includes(fileExt)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.name}` },
          { status: 400 }
        );
      }
    }

    // Verify resource exists
    const container = getContainer();
    const resourceRepository = container.getResourceRepository();
    const resourceFileRepository = container.getResourceFileRepository();

    const resource = await resourceRepository.findById(parseInt(resourceId));
    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    // Get current file count for sort order
    const existingFiles = await resourceFileRepository.findByResourceId(parseInt(resourceId));
    let sortOrder = existingFiles.length;

    // Initialize S3 service
    const s3Service = new S3Service("resources");
    const uploadedFiles = [];

    // Upload each file
    for (const file of filesToUpload) {
      const fileExt = path.extname(file.name).toLowerCase();

      // Generate file key: {timestamp}_{uniqueId}_{resourceId}.{ext}
      const timestamp = Date.now();
      const uniqueId = Math.random().toString(36).substring(2, 8);
      const fileKey = `${timestamp}_${uniqueId}_${resourceId}${fileExt}`;

      console.log("Resource Upload:", {
        resourceId,
        fileKey,
        originalName: file.name,
        fileExt,
        sortOrder,
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

      // Create ResourceFile entity and save to database
      const resourceFile = ResourceFile.create({
        resourceId: parseInt(resourceId),
        filePath: uploadResult.key,
        originalFilename: file.name,
        fileType: fileExt.substring(1).toUpperCase(),
        fileSize: file.size,
        sortOrder: sortOrder,
      });

      const savedFile = await resourceFileRepository.create(resourceFile);
      sortOrder++;

      uploadedFiles.push({
        id: savedFile.id,
        path: uploadResult.key,
        url: uploadResult.url,
        originalName: file.name,
        type: fileExt.substring(1).toUpperCase(),
        size: file.size,
        etag: uploadResult.etag,
      });
    }

    // Return response based on single or multiple files
    if (uploadedFiles.length === 1) {
      // Backward compatibility: return single file object
      return NextResponse.json(uploadedFiles[0]);
    }

    return NextResponse.json({
      message: "Files uploaded successfully",
      files: uploadedFiles,
      totalFiles: uploadedFiles.length,
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

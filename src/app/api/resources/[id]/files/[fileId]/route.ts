import { NextRequest, NextResponse } from "next/server";
import { getContainer } from "@/infrastructure/config/getContainer";
import { S3Service } from "@/infrastructure/services/S3Service";

// DELETE /api/resources/[id]/files/[fileId] - Delete a specific file from resource
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  try {
    const { id, fileId } = await params;
    const resourceId = parseInt(id);
    const fileIdNum = parseInt(fileId);

    if (isNaN(resourceId) || isNaN(fileIdNum)) {
      return NextResponse.json(
        { error: "Invalid resource ID or file ID" },
        { status: 400 }
      );
    }

    const container = getContainer();
    const resourceRepository = container.getResourceRepository();
    const resourceFileRepository = container.getResourceFileRepository();

    // Verify resource exists
    const resource = await resourceRepository.findById(resourceId);
    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    // Verify file exists and belongs to this resource
    const file = await resourceFileRepository.findById(fileIdNum);
    if (!file || file.resourceId !== resourceId) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Delete file from S3
    const s3Service = new S3Service("");
    try {
      await s3Service.deleteFile(file.filePath);
      console.log("File deleted from S3:", file.filePath);
    } catch (error) {
      console.error("Error deleting file from S3:", error);
      // Continue to delete from DB even if S3 delete fails
    }

    // Delete file record from database
    await resourceFileRepository.delete(fileIdNum);

    return NextResponse.json({
      message: "File deleted successfully",
      deletedFileId: fileIdNum,
    });
  } catch (error) {
    console.error("Error deleting resource file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}

// GET /api/resources/[id]/files/[fileId] - Get specific file info
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  try {
    const { id, fileId } = await params;
    const resourceId = parseInt(id);
    const fileIdNum = parseInt(fileId);

    if (isNaN(resourceId) || isNaN(fileIdNum)) {
      return NextResponse.json(
        { error: "Invalid resource ID or file ID" },
        { status: 400 }
      );
    }

    const container = getContainer();
    const resourceFileRepository = container.getResourceFileRepository();

    const file = await resourceFileRepository.findById(fileIdNum);
    if (!file || file.resourceId !== resourceId) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: file.id,
      resourceId: file.resourceId,
      filePath: file.filePath,
      originalFilename: file.originalFilename,
      fileType: file.fileType,
      fileSize: file.fileSize,
      sortOrder: file.sortOrder,
      downloadCount: file.downloadCount,
      createdAt: file.createdAt,
    });
  } catch (error) {
    console.error("Error getting resource file:", error);
    return NextResponse.json(
      { error: "Failed to get file" },
      { status: 500 }
    );
  }
}

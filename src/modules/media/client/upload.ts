export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

export interface UploadResponse {
  status: string;
  mediaUrl: string;
  uploadId: string;
}

export const uploadFileWithProgress = (
  url: string,
  file: File,
  token: string,
  onProgress?: (progress: UploadProgress) => void
) => {
  return new Promise<UploadResponse>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("x-upload-token", token);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const percent = event.total ? (event.loaded / event.total) * 100 : 0;
      onProgress?.({
        loaded: event.loaded,
        total: event.total,
        percent,
      });
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText) as UploadResponse;
          resolve(response);
        } catch (error) {
          reject(new Error("Unexpected response from upload server."));
        }
      } else {
        try {
          const response = JSON.parse(xhr.responseText) as { error?: string };
          reject(new Error(response.error ?? "Upload failed."));
        } catch (error) {
          reject(new Error("Upload failed."));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Upload failed."));
    };

    xhr.send(file);
  });
};

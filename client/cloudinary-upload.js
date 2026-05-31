const CLOUDINARY_CLOUD_NAME = "dlv240fwh";
const CLOUDINARY_UPLOAD_PRESET = "karthificial_unsigned";

function openCloudinaryUploader(targetInputId) {
    if (!window.cloudinary) {
        alert("Cloudinary upload widget is not loaded.");
        return;
    }

    const targetInput = document.getElementById(targetInputId);

    if (!targetInput) {
        alert("Target image input not found.");
        return;
    }

    const widget = window.cloudinary.createUploadWidget(
        {
            cloudName: CLOUDINARY_CLOUD_NAME,
            uploadPreset: CLOUDINARY_UPLOAD_PRESET,
            folder: "karthificial",
            sources: ["local", "url"],
            multiple: false,
            resourceType: "image",
            clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
            maxFileSize: 3000000
        },
        (error, result) => {
            if (error) {
                console.error("Cloudinary upload error:", error);
                alert("Image upload failed.");
                return;
            }

            if (result.event === "success") {
                targetInput.value = result.info.secure_url;
            }
        }
    );

    widget.open();
}

window.openCloudinaryUploader = openCloudinaryUploader;
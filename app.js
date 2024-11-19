const imagesDataUrls = [];

document.getElementById('uploadForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const files = document.getElementById('fileInput').files;

    if (files.length === 0) {
        showAlert("Vui lòng chọn ít nhất một ảnh.", "error");
        return;
    }

    const imageContainer = document.getElementById('imageContainer');
    imageContainer.innerHTML = '';  // Xóa các ảnh trước khi thêm ảnh mới
    imagesDataUrls.length = 0;  // Reset dữ liệu ảnh

    // Duyệt qua các ảnh được chọn
    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.src = event.target.result;

            img.onload = function () {
                // Chuyển ảnh sang định dạng JPG bằng Canvas
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // Chuyển đổi ảnh sang JPG và lưu vào mảng
                const jpegDataUrl = canvas.toDataURL('image/jpeg');
                const randomFilename = generateRandomString(12); // Tên ngẫu nhiên 12 ký tự
                imagesDataUrls.push({ jpegDataUrl, filename: `${randomFilename}.jpg` });

                // Tạo phần tử hiển thị ảnh đã chuyển đổi
                const imageItem = document.createElement('div');
                imageItem.classList.add('image-item');

                const imageElement = document.createElement('img');
                imageElement.src = jpegDataUrl;
                imageElement.addEventListener('click', function () {
                    showModal(jpegDataUrl);
                });

                // Tạo nút tải ảnh về
                const downloadButton = document.createElement('a');
                downloadButton.classList.add('download-btn');
                downloadButton.href = jpegDataUrl;
                downloadButton.download = `${randomFilename}.jpg`;
                downloadButton.textContent = 'Tải về';

                imageItem.appendChild(imageElement);
                imageItem.appendChild(downloadButton);

                // Thêm ảnh vào giao diện
                imageContainer.appendChild(imageItem);
            };
        };
        reader.readAsDataURL(file);
    });

    // Hiển thị nút "Tải về tất cả"
    document.getElementById('downloadAllBtn').style.display = 'block';
});

// Xử lý tải về tất cả ảnh dưới dạng tệp zip
document.getElementById('downloadAllBtn').addEventListener('click', function () {
    const zip = new JSZip();

    // Thêm tất cả ảnh vào zip
    imagesDataUrls.forEach(function (item) {
        zip.file(item.filename, item.jpegDataUrl.split(',')[1], { base64: true });
    });

    // Tạo tệp zip và tải xuống
    zip.generateAsync({ type: 'blob' }).then(function (content) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'all_images.zip';
        link.click();
    });
});

// Hàm tạo tên ngẫu nhiên 12 ký tự
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Hiển thị cảnh báo
function showAlert(message, type) {
    const alertElement = document.getElementById('alert');
    alertElement.textContent = message;
    alertElement.className = 'alert ' + (type === 'error' ? 'error' : 'success');
    alertElement.style.display = 'block';
}

// Hiển thị modal với ảnh preview
function showModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageSrc;
    modal.style.display = "flex";
}

// Đóng modal
document.getElementById('closeModal').addEventListener('click', function () {
    document.getElementById('imageModal').style.display = "none";
});

// Khi nhấn ra ngoài modal sẽ đóng
window.onclick = function (event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
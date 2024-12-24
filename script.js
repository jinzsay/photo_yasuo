document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('quality');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    // 处理拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#0056b3';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#007AFF';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#007AFF';
        handleFile(e.dataTransfer.files[0]);
    });

    // 处理点击上传
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFile(e.target.files[0]);
    });

    // 处理图片压缩
    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('请上传图片文件！');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage.src = e.target.result;
            originalSize.textContent = `原始大小: ${(file.size / 1024).toFixed(2)} KB`;
            compressImage(e.target.result);
        };
        reader.readAsDataURL(file);

        uploadArea.style.display = 'none';
        previewContainer.style.display = 'block';
    }

    // 压缩图片
    function compressImage(base64) {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = img.width;
            canvas.height = img.height;
            
            ctx.drawImage(img, 0, 0);
            
            const quality = qualitySlider.value / 100;
            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            
            compressedImage.src = compressedBase64;
            updateCompressedSize(compressedBase64);
        };
        img.src = base64;
    }

    // 更新压缩后的大小
    function updateCompressedSize(base64) {
        const size = (base64.length * 3/4) / 1024;
        compressedSize.textContent = `压缩后大小: ${size.toFixed(2)} KB`;
    }

    // 质量滑块变化时重新压缩
    qualitySlider.addEventListener('input', () => {
        if (originalImage.src) {
            compressImage(originalImage.src);
        }
    });

    // 下载压缩后的图片
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'compressed-image.jpg';
        link.href = compressedImage.src;
        link.click();
    });

    // 重置
    resetBtn.addEventListener('click', () => {
        uploadArea.style.display = 'block';
        previewContainer.style.display = 'none';
        fileInput.value = '';
        originalImage.src = '';
        compressedImage.src = '';
    });
}); 
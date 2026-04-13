const seedImages = [
    { src: 'https://picsum.photos/id/10/800/1200', category: 'nature' },
    { src: 'https://picsum.photos/id/1015/800/600', category: 'nature' },
    { src: 'https://picsum.photos/id/1018/800/1000', category: 'nature' },
    { src: 'https://picsum.photos/id/1035/800/800', category: 'nature' },
    { src: 'https://picsum.photos/id/1040/800/1100', category: 'architecture' },
    { src: 'https://picsum.photos/id/1044/800/700', category: 'nature' },
    { src: 'https://picsum.photos/id/1047/800/900', category: 'architecture' },
    { src: 'https://picsum.photos/id/1048/800/1200', category: 'architecture' },
    { src: 'https://picsum.photos/id/1050/800/800', category: 'portrait' },
    { src: 'https://picsum.photos/id/1059/800/1000', category: 'portrait' },
    { src: 'https://picsum.photos/id/1060/800/800', category: 'portrait' },
    { src: 'https://picsum.photos/id/1067/800/1100', category: 'architecture' }
];

let currentImages = [];
let currentLightboxIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('masonry-grid');
    const tabs = document.querySelectorAll('.tab-btn');
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    // Render Grid
    function renderGallery(filter = 'all') {
        grid.innerHTML = '';
        currentImages = filter === 'all' ? seedImages : seedImages.filter(img => img.category === filter);
        
        currentImages.forEach((imgObj, index) => {
            const item = document.createElement('div');
            item.className = 'image-item blur-load';
            
            const img = document.createElement('img');
            // Mock lazy loading / blur up
            img.src = imgObj.src;
            img.loading = 'lazy';
            
            img.onload = () => {
                item.classList.add('loaded');
            };

            img.addEventListener('click', () => openLightbox(index));
            
            item.appendChild(img);
            grid.appendChild(item);
        });
    }

    renderGallery();

    // Tab Filters
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            renderGallery(e.target.dataset.filter);
        });
    });

    // Lightbox Logic
    function openLightbox(index) {
        currentLightboxIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
    }

    function updateLightboxImage() {
        lightboxImg.src = currentImages[currentLightboxIndex].src;
    }

    function prevImage() {
        currentLightboxIndex = (currentLightboxIndex === 0) ? currentImages.length - 1 : currentLightboxIndex - 1;
        updateLightboxImage();
    }

    function nextImage() {
        currentLightboxIndex = (currentLightboxIndex === currentImages.length - 1) ? 0 : currentLightboxIndex + 1;
        updateLightboxImage();
    }

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);

    // Keyboard Lightbox Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });

    // Upload Mockup
    document.getElementById('upload-btn').addEventListener('click', () => {
        alert("Upload functionality simulates: aws s3 cp new-photo.jpg s3://your-bucket-name/");
    });
});

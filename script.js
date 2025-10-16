// script.js - Mobile optimallashtirilgan
const API_BASE_URL = 'https://your-fastapi-server.com/api';

// Global o'zgaruvchilar
let map;
let markers = [];
let photosData = [];
let currentView = 'grid';
let currentPopup = null;
let currentPhotoPhone = '';
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Demo e'lonlar ma'lumotlari
const demoPhotos = [
    {
        id: 1,
        url: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop",
        title: "iPhone 14 Pro Max 256GB",
        price: "12 000 000 so'm",
        description: "Yangi holatda, quti bilan, 1 yil kafolat. Olma kompaniyasining eng so'ngi modeli.",
        category: "electronics",
        location: { lat: 41.311081, lng: 69.240562 },
        phone: "+998901234567"
    },
    {
        id: 2,
        url: "https://images.unsplash.com/photo-1502872364588-894d7d6ddfab?w=400&h=300&fit=crop",
        title: "Samsung Galaxy S23 Ultra",
        price: "9 500 000 so'm",
        description: "128GB, qora rang, barcha aksessuarlar bilan. Kafolat 6 oy.",
        category: "electronics",
        location: { lat: 41.315081, lng: 69.245562 },
        phone: "+998912345678"
    },
    {
        id: 3,
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
        title: "Yangi uy Chilonzor tumanida",
        price: "85 000 $",
        description: "3 xonali, 75 m², 4-qavat, yangi ta'mir. Mehmonxona va oshxona alohida.",
        category: "property",
        location: { lat: 41.308081, lng: 69.235562 },
        phone: "+998933456789"
    },
    {
        id: 4,
        url: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=400&h=300&fit=crop",
        title: "Chevrolet Cobalt 2022",
        price: "165 000 000 so'm",
        description: "Oq rang, 1.5 litr, avtomat karobka, 25 000 km. Bitta egasi.",
        category: "cars",
        location: { lat: 41.321081, lng: 69.250562 },
        phone: "+998944567890"
    },
    {
        id: 5,
        url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
        title: "Yangi divan to'plami",
        price: "3 200 000 so'm",
        description: "Qo'lda tikilgan, yuqori sifatli mato. 3 kishilik + 2 kishilik.",
        category: "furniture",
        location: { lat: 41.305081, lng: 69.230562 },
        phone: "+998955678901"
    }
];

// DOM elementlari
let photosGrid, loadingElement, noResultsElement, errorMessageElement;
let searchInput, sortSelect, categorySelect, gridViewBtn, mapViewBtn;
let modal, modalImage, modalTitle, modalPrice, modalDescription, closeModal;
let notification, notificationText;

// Sahifa yuklanganda
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initMobileFeatures();
    initMap();
    loadPhotos();
    setupEventListeners();
});

// DOM elementlarini ishga tushirish
function initializeElements() {
    photosGrid = document.getElementById('photosGrid');
    loadingElement = document.getElementById('loading');
    noResultsElement = document.getElementById('noResults');
    errorMessageElement = document.getElementById('errorMessage');
    searchInput = document.getElementById('searchInput');
    sortSelect = document.getElementById('sortSelect');
    categorySelect = document.getElementById('categorySelect');
    gridViewBtn = document.getElementById('gridViewBtn');
    mapViewBtn = document.getElementById('mapViewBtn');
    
    // Modal elementlari
    modal = document.getElementById('imageModal');
    modalImage = document.getElementById('modalImage');
    modalTitle = document.getElementById('modalTitle');
    modalPrice = document.getElementById('modalPrice');
    modalDescription = document.getElementById('modalDescription');
    closeModal = document.querySelector('.close');
    
    // Notification elementlari
    notification = document.getElementById('notification');
    notificationText = document.getElementById('notificationText');
}

// Mobile xususiyatlarni ishga tushirish
function initMobileFeatures() {
    // Touch harakatlari
    document.addEventListener('touchstart', function() {}, { passive: true });
    document.addEventListener('touchmove', function() {}, { passive: true });
}

// Xaritani ishga tushirish
function initMap() {
    console.log('Xarita ishga tushmoqda...');
    
    try {
        // O'zbekiston markazi (Toshkent)
        const center = [41.311081, 69.240562];
        
        // Mobile uchun optimallashtirilgan xarita sozlamalari
        map = L.map('map', {
            zoomControl: false,
            scrollWheelZoom: false,
            touchZoom: true,
            dragging: true,
            boxZoom: false,
            keyboard: false,
            doubleClickZoom: true,
            tap: false
        }).setView(center, 12);

        // Zoom kontroli
        L.control.zoom({
            position: 'bottomright'
        }).addTo(map);

        // Xarita layer qo'shish
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
            minZoom: 10
        }).addTo(map);

        // Xarita o'lchamini yangilash
        setTimeout(() => {
            if (map) {
                map.invalidateSize();
            }
        }, 100);

        console.log('Xarita muvaffaqiyatli ishga tushdi');

    } catch (error) {
        console.error('Xaritani ishga tushirishda xatolik:', error);
        showError('Xaritani yuklab bo\'lmadi');
    }
}

// Suratlarni yuklash
async function loadPhotos() {
    console.log('Suratlar yuklanmoqda...');
    showLoading();
    hideError();
    
    try {
        // Demo ma'lumotlarni ishlatamiz
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        photosData = demoPhotos;
        displayPhotosOnMap(photosData);
        displayPhotosGrid(photosData);
        showNotification(`✅ ${photosData.length} ta e'lon yuklandi`);
        
    } catch (error) {
        console.error('Yuklash xatosi:', error);
        // Agar xatolik bo'lsa, demo ma'lumotlarni ko'rsatamiz
        photosData = demoPhotos;
        displayPhotosOnMap(photosData);
        displayPhotosGrid(photosData);
        showNotification(`⚠️ Demo ma'lumotlar ko'rsatilmoqda`);
    }
}

// Xaritada suratlarni ko'rsatish
function displayPhotosOnMap(photos) {
    console.log('Xaritada markerlar qo\'shilmoqda...');
    
    // Oldingi markerlarni tozalash
    clearMarkers();
    
    photos.forEach(photo => {
        try {
            // Marker yaratish
            const marker = L.marker([photo.location.lat, photo.location.lng], {
                title: photo.title
            }).addTo(map);
            
            // Popup yaratish
            const popupContent = `
                <div class="map-popup">
                    <div class="popup-image">
                        <img src="${photo.url}" alt="${photo.title}" 
                             onerror="this.src='https://via.placeholder.com/300x180?text=Rasim'">
                    </div>
                    <div class="popup-info">
                        <h4>${escapeHtml(photo.title)}</h4>
                        <p class="popup-price">${escapeHtml(photo.price)}</p>
                        <div class="popup-actions">
                            <button onclick="showPhotoDetails(${photo.id})" class="btn-view">
                                <i class="bi bi-eye"></i> Ko'rish
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Popup ni marker ga biriktirish
            marker.bindPopup(popupContent, {
                className: 'custom-popup mobile-popup',
                maxWidth: 300,
                minWidth: 280
            });
            
            // Marker ma'lumotlarini saqlash
            marker.photoId = photo.id;
            marker.photoData = photo;
            markers.push(marker);
            
            // Marker bosilganda
            marker.on('click', function() {
                showPhotoDetails(photo.id);
            });

        } catch (error) {
            console.error('Marker yaratishda xatolik:', error);
        }
    });
}

// Gridda suratlarni ko'rsatish
function displayPhotosGrid(photos) {
    hideLoading();
    
    if (!photos || photos.length === 0) {
        showNoResults();
        return;
    }
    
    hideNoResults();
    hideError();
    
    let html = '';
    photos.forEach(photo => {
        html += `
            <div class="photo-card" onclick="showPhotoDetails(${photo.id})">
                <div class="photo-badge">${getCategoryIcon(photo.category)}</div>
                <img src="${photo.url}" alt="${escapeHtml(photo.title)}" class="photo-image" 
                     onerror="this.src='https://via.placeholder.com/400x250?text=Rasim'">
                <div class="photo-info">
                    <h3 class="photo-title">${escapeHtml(photo.title)}</h3>
                    <p class="photo-price">${escapeHtml(photo.price)}</p>
                    <p class="photo-description">${escapeHtml(photo.description)}</p>
                    <div class="photo-actions">
                        <button class="btn-call-mobile" onclick="event.stopPropagation(); callNumber('${photo.phone}')">
                            <i class="bi bi-telephone-fill"></i>
                            Qo'ng'iroq
                        </button>
                        <button class="btn-location-mobile" onclick="event.stopPropagation(); focusOnPhoto(${photo.id})">
                            <i class="bi bi-geo-alt-fill"></i>
                            Xarita
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    photosGrid.innerHTML = html;
}

// Kategoriya ikonlari
function getCategoryIcon(category) {
    const icons = {
        electronics: '📱',
        property: '🏠',
        cars: '🚗',
        furniture: '🪑'
    };
    return icons[category] || '📦';
}

// Telefon qo'ng'iroq qilish
function callNumber(phone) {
    if (isMobile) {
        // Haqiqiy qo'ng'iroq
        window.location.href = `tel:${phone}`;
    } else {
        showNotification(`📞 Qo'ng'iroq: ${phone}`);
    }
}

// SMS yuborish
function sendSMS(phone) {
    if (isMobile) {
        window.location.href = `sms:${phone}`;
    } else {
        showNotification(`💬 SMS: ${phone}`);
    }
}

// Bitta surat tafsilotlarini ko'rsatish
function showPhotoDetails(photoId) {
    const photo = photosData.find(p => p.id === photoId);
    if (!photo) {
        showNotification('❌ E\'lon topilmadi');
        return;
    }
    
    openPhotoModal(photo);
}

// Modal ochish
function openPhotoModal(photo) {
    modalImage.src = photo.url;
    modalImage.alt = photo.title;
    modalTitle.textContent = photo.title;
    modalTitle.setAttribute('data-id', photo.id);
    modalPrice.textContent = photo.price;
    modalDescription.textContent = photo.description;
    currentPhotoPhone = photo.phone;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Modal yopish
function closeModalFunc() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Xaritada ko'rsatish
function showOnMap() {
    const photoId = parseInt(modalTitle.getAttribute('data-id'));
    closeModalFunc();
    showMapView();
    focusOnPhoto(photoId);
}

// Suratni xaritada mark qilish
function focusOnPhoto(photoId) {
    showMapView();
    
    const marker = markers.find(m => m.photoId === photoId);
    if (marker && map) {
        map.setView(marker.getLatLng(), 15);
        marker.openPopup();
        showNotification(`📍 E'lon xaritada ko'rsatilmoqda`);
    }
}

// Qidirish funksiyasi
function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        displayPhotosGrid(photosData);
        return;
    }
    
    const filteredPhotos = photosData.filter(photo => 
        photo.title.toLowerCase().includes(searchTerm) ||
        (photo.description && photo.description.toLowerCase().includes(searchTerm)) ||
        photo.price.toLowerCase().includes(searchTerm) ||
        photo.category.toLowerCase().includes(searchTerm)
    );
    
    displayPhotosGrid(filteredPhotos);
    
    if (filteredPhotos.length === 0) {
        showNotification(`❌ "${searchTerm}" bo'yicha hech narsa topilmadi`);
    } else {
        showNotification(`🔍 "${searchTerm}" bo'yicha ${filteredPhotos.length} ta natija topildi`);
    }
}

// Saralash
function sortPhotos() {
    const sortBy = sortSelect.value;
    const sortedPhotos = [...photosData];
    
    switch (sortBy) {
        case 'newest':
            // Yangilari birinchi
            break;
        case 'oldest':
            sortedPhotos.reverse();
            break;
        case 'price_low':
            sortedPhotos.sort((a, b) => extractPrice(a.price) - extractPrice(b.price));
            break;
        case 'price_high':
            sortedPhotos.sort((a, b) => extractPrice(b.price) - extractPrice(a.price));
            break;
    }
    
    displayPhotosGrid(sortedPhotos);
    showNotification(`📊 Saralandi`);
}

// Kategoriya bo'yicha filtrlash
function filterByCategory() {
    const category = categorySelect.value;
    
    if (category === 'all') {
        displayPhotosGrid(photosData);
    } else {
        const filtered = photosData.filter(photo => 
            photo.category === category
        );
        displayPhotosGrid(filtered);
        
        if (filtered.length === 0) {
            showNotification(`📁 ${categorySelect.options[categorySelect.selectedIndex].text} kategoriyasida e'lon topilmadi`);
        } else {
            showNotification(`📁 ${categorySelect.options[categorySelect.selectedIndex].text}: ${filtered.length} ta e'lon`);
        }
    }
}

// Ko'rinishni o'zgartirish
function showGridView() {
    currentView = 'grid';
    if (gridViewBtn) gridViewBtn.classList.add('active');
    if (mapViewBtn) mapViewBtn.classList.remove('active');
    document.querySelector('.map-section').style.display = 'none';
    photosGrid.style.display = 'grid';
    showNotification(`📱 Ro'yxat ko'rinishi`);
}

function showMapView() {
    currentView = 'map';
    if (mapViewBtn) mapViewBtn.classList.add('active');
    if (gridViewBtn) gridViewBtn.classList.remove('active');
    document.querySelector('.map-section').style.display = 'block';
    photosGrid.style.display = 'none';
    
    // Xarita o'lchamini yangilash
    setTimeout(() => {
        if (map) {
            map.invalidateSize();
        }
    }, 300);
    
    showNotification(`🗺️ Xarita ko'rinishi`);
}

// Xarita kontrollari
function zoomIn() {
    if (map) {
        map.zoomIn();
        showNotification(`🔍 Yaqinlashtirildi`);
    }
}

function zoomOut() {
    if (map) {
        map.zoomOut();
        showNotification(`🔍 Uzoqlashtirildi`);
    }
}

function resetView() {
    if (map) {
        map.setView([41.311081, 69.240562], 12);
        showNotification(`🗺️ Markazlashtirildi`);
    }
}

// Markerlarni tozalash
function clearMarkers() {
    markers.forEach(marker => {
        if (map) {
            map.removeLayer(marker);
        }
    });
    markers = [];
}

// Narxni raqamga aylantirish
function extractPrice(priceString) {
    const price = priceString.replace(/[^\d]/g, '');
    return parseInt(price) || 0;
}

// Notification ko'rsatish
function showNotification(message) {
    if (!notification || !notificationText) return;
    
    notificationText.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Loading funksiyalari
function showLoading() {
    if (loadingElement) loadingElement.style.display = 'block';
    if (photosGrid) photosGrid.style.display = 'none';
    if (noResultsElement) noResultsElement.style.display = 'none';
    if (errorMessageElement) errorMessageElement.style.display = 'none';
}

function hideLoading() {
    if (loadingElement) loadingElement.style.display = 'none';
    if (photosGrid) photosGrid.style.display = 'grid';
}

function showNoResults() {
    if (noResultsElement) noResultsElement.style.display = 'block';
    if (photosGrid) photosGrid.style.display = 'none';
    if (loadingElement) loadingElement.style.display = 'none';
    if (errorMessageElement) errorMessageElement.style.display = 'none';
}

function hideNoResults() {
    if (noResultsElement) noResultsElement.style.display = 'none';
}

function showError(message) {
    if (errorMessageElement) {
        errorMessageElement.style.display = 'block';
        const errorText = errorMessageElement.querySelector('p');
        if (errorText) errorText.textContent = message;
    }
    if (loadingElement) loadingElement.style.display = 'none';
    if (photosGrid) photosGrid.style.display = 'none';
    if (noResultsElement) noResultsElement.style.display = 'none';
}

function hideError() {
    if (errorMessageElement) errorMessageElement.style.display = 'none';
}

// HTML escape qilish
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Event listenerlarni sozlash
function setupEventListeners() {
    console.log('Event listenerlar sozlanmoqda...');
    
    // Modal yopish
    if (closeModal) {
        closeModal.addEventListener('click', closeModalFunc);
    }
    
    // Modal tashqarisiga bosganda yopish
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModalFunc();
        }
    });
    
    // Enter bosganda qidirish
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }
    
    // Real-time qidirish
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            if (this.value.length === 0) {
                displayPhotosGrid(photosData);
            }
        });
    }
    
    console.log('Event listenerlar muvaffaqiyatli sozlandi');
}

// Global funksiyalarni window object ga biriktirish
window.searchProducts = searchProducts;
window.sortPhotos = sortPhotos;
window.filterByCategory = filterByCategory;
window.showGridView = showGridView;
window.showMapView = showMapView;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.resetView = resetView;
window.showPhotoDetails = showPhotoDetails;
window.focusOnPhoto = focusOnPhoto;
window.showOnMap = showOnMap;
window.loadPhotos = loadPhotos;
window.callNumber = callNumber;
window.sendSMS = sendSMS;
window.closeModalFunc = closeModalFunc;

console.log('Script.js muvaffaqiyatli yuklandi');
// Elemen HTML
const prevButton = document.getElementById('prevPage');
const nextButton = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');

// Konfigurasi pagination
let paginationConfig = {};

// Inisialisasi pagination
function setupPagination(config) {
    paginationConfig = config;

    // Tombol sebelumnya
    prevButton.addEventListener('click', function () {
        const currentPage = paginationConfig.getCurrentPage();

        if (currentPage > 1) {
            paginationConfig.onPageChange(currentPage - 1);
        }
    });

    // Tombol berikutnya
    nextButton.addEventListener('click', function () {
        const currentPage = paginationConfig.getCurrentPage();
        const totalPages = paginationConfig.getTotalPages();

        if (currentPage < totalPages) {
            paginationConfig.onPageChange(currentPage + 1);
        }
    });
}

// Memperbarui tampilan pagination
function renderPagination(currentPage, totalPages) {
    pageInfo.textContent =
        `Halaman ${totalPages === 0 ? 0 : currentPage} / ${totalPages}`;

    prevButton.disabled = currentPage <= 1;

    nextButton.disabled =
        totalPages === 0 || currentPage >= totalPages;
}
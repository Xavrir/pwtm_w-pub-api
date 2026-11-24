// Elemen HTML
const prevButton = document.getElementById('prevPage');
const nextButton = document.getElementById('nextPage');
const pageInput = document.getElementById('pageInput');
const totalPagesElement = document.getElementById('totalPages');

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

    // Input nomor halaman
    pageInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            applyPageInput();
            pageInput.blur();
        }
    });

    // Terapkan nomor halaman ketika input kehilangan fokus
    pageInput.addEventListener('blur', applyPageInput);
}

// Menerapkan nomor halaman dari input
function applyPageInput() {
    const totalPages = paginationConfig.getTotalPages();
    const inputPage = Number(pageInput.value);

    if (totalPages === 0) {
        return;
    }

    if (
        pageInput.value.trim() === '' ||
        !Number.isInteger(inputPage)
    ) {
        pageInput.value = paginationConfig.getCurrentPage();
        return;
    }

    const targetPage = Math.min(
        Math.max(inputPage, 1),
        totalPages
    );

    pageInput.value = targetPage;

    if (targetPage !== paginationConfig.getCurrentPage()) {
        paginationConfig.onPageChange(targetPage);
    }
}

// Memperbarui tampilan pagination
function renderPagination(currentPage, totalPages) {
    pageInput.value = totalPages === 0 ? 0 : currentPage;
    pageInput.min = 1;
    pageInput.max = totalPages;
    pageInput.disabled = totalPages === 0;

    totalPagesElement.textContent = `/ ${totalPages}`;

    prevButton.disabled = totalPages === 0 || currentPage <= 1;
    nextButton.disabled = totalPages === 0 || currentPage >= totalPages;
}
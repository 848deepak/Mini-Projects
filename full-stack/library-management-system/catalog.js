// FS-23: Catalog module — search, filter, render

function populateGenreFilter() {
  const books = getBooks();
  const genres = [...new Set(books.map(b => b.genre))];
  const select = document.getElementById('genreFilter');
  genres.forEach(g => {
    select.innerHTML += `<option value="${g}">${g}</option>`;
  });
}

function renderCatalog() {
  const books = getBooks();
  const search = document.getElementById('searchInput').value.toLowerCase();
  const genre = document.getElementById('genreFilter').value;
  const status = document.getElementById('statusFilter').value;

  let filtered = books.filter(b => {
    if (search && !b.title.toLowerCase().includes(search) && !b.author.toLowerCase().includes(search) && !b.isbn.includes(search)) return false;
    if (genre !== 'all' && b.genre !== genre) return false;
    if (status === 'available' && b.copies_available <= 0) return false;
    if (status === 'issued' && b.copies_available >= b.copies_total) return false;
    return true;
  });

  const container = document.getElementById('booksCatalog');
  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state">No books match your search</div>';
    return;
  }

  container.innerHTML = filtered.map(b => {
    const isAvailable = b.copies_available > 0;
    return `
      <div class="book-card">
        <div class="book-spine" style="background:${b.spine_color}"></div>
        <div class="book-body">
          <div class="book-title">${b.title}</div>
          <div class="book-author">${b.author}</div>
          <div class="book-meta">
            <span class="book-tag">${b.genre}</span>
          </div>
          <div class="book-isbn">ISBN: ${b.isbn}</div>
          <div class="book-avail">
            <span class="badge ${isAvailable ? 'badge-available' : 'badge-issued'}">${isAvailable ? 'Available' : 'All Issued'}</span>
            <span class="copies">${b.copies_available}/${b.copies_total}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

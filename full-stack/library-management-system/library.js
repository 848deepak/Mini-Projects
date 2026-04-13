// FS-23: Library module — issue/return/fine logic

function issueBook(isbn, memberId) {
  const books = getBooks();
  const book = books.find(b => b.isbn === isbn);
  if (!book || book.copies_available <= 0) { showToast('Book not available!'); return false; }

  const members = getMembers();
  if (!members.find(m => m.id === memberId)) { showToast('Member not found!'); return false; }

  // Check if member already has this book
  const txs = getTransactions_();
  if (txs.some(t => t.book_isbn === isbn && t.member_id === memberId && !t.returned_at)) {
    showToast('Member already has this book!'); return false;
  }

  book.copies_available--;
  setBooks(books);

  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + 14);

  txs.push({
    id: Date.now(),
    book_isbn: isbn,
    member_id: memberId,
    issued_at: today.toISOString().split('T')[0],
    due_date: dueDate.toISOString().split('T')[0],
    returned_at: null
  });
  setTransactions_(txs);
  showToast('Book issued successfully!');
  return true;
}

function returnBook(transactionId) {
  const txs = getTransactions_();
  const tx = txs.find(t => t.id === transactionId);
  if (!tx || tx.returned_at) { showToast('Invalid transaction!'); return null; }

  const today = new Date().toISOString().split('T')[0];
  tx.returned_at = today;

  const books = getBooks();
  const book = books.find(b => b.isbn === tx.book_isbn);
  if (book) { book.copies_available++; setBooks(books); }

  setTransactions_(txs);

  // Calculate fine
  const fine = calculateFine(tx.due_date, today);
  return fine;
}

function calculateFine(dueDate, returnDate) {
  const due = new Date(dueDate);
  const ret = new Date(returnDate);
  const diffDays = Math.ceil((ret - due) / 86400000);
  return diffDays > 0 ? diffDays * 2 : 0; // ₹2 per day after due date
}

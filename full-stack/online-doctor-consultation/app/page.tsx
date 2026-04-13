"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Mock Sanity Client Implementation ---
// Simulates fetching content from Sanity CMS / Contentlayer
const mockSanityFetch = async (query: string) => {
  return [
    {
      _id: "doc-1",
      name: "Dr. Aisha Sharma",
      specialty: "Cardiologist",
      experience: "15 Years",
      rating: 4.9,
      reviews: 124,
      fee: 800,
      image: "👩‍⚕️",
      available: true,
    },
    {
      _id: "doc-2",
      name: "Dr. Vikram Singh",
      specialty: "Dermatologist",
      experience: "8 Years",
      rating: 4.7,
      reviews: 89,
      fee: 600,
      image: "👨‍⚕️",
      available: true,
    },
    {
      _id: "doc-3",
      name: "Dr. Rohan Patel",
      specialty: "Pediatrician",
      experience: "12 Years",
      rating: 4.8,
      reviews: 210,
      fee: 700,
      image: "👨‍⚕️",
      available: false,
    },
    {
      _id: "doc-4",
      name: "Dr. Meera Iyer",
      specialty: "Neurologist",
      experience: "20 Years",
      rating: 5.0,
      reviews: 340,
      fee: 1500,
      image: "👩‍⚕️",
      available: true,
    },
    {
      _id: "doc-5",
      name: "Dr. Kabir Das",
      specialty: "Orthopedic",
      experience: "10 Years",
      rating: 4.6,
      reviews: 56,
      fee: 900,
      image: "👨‍⚕️",
      available: true,
    },
    {
      _id: "doc-6",
      name: "Dr. Sneha Reddy",
      specialty: "Dentist",
      experience: "6 Years",
      rating: 4.5,
      reviews: 112,
      fee: 500,
      image: "👩‍⚕️",
      available: true,
    },
  ];
};

type Doctor = {
  _id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviews: number;
  fee: number;
  image: string;
  available: boolean;
};

type Appointment = {
  id: string;
  doctorName: string;
  date: string;
  time: string;
};

export default function DoctorConsultationApp() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedDoc, setSelectedDoc] = useState<Doctor | null>(null);
  const [bookingForm, setBookingForm] = useState({ date: "", time: "" });
  const [toast, setToast] = useState("");

  const specialties = [
    "All",
    "Cardiologist",
    "Dermatologist",
    "Pediatrician",
    "Neurologist",
    "Orthopedic",
    "Dentist",
  ];

  useEffect(() => {
    // Simulate fetching from Sanity CMS
    mockSanityFetch('*[_type == "doctor"]').then((data) => setDoctors(data));

    const saved = localStorage.getItem("doc_appointments");
    if (saved) setAppointments(JSON.parse(saved));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc || !bookingForm.date || !bookingForm.time) return;

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      doctorName: selectedDoc.name,
      date: bookingForm.date,
      time: bookingForm.time,
    };

    const updated = [...appointments, newAppointment];
    setAppointments(updated);
    localStorage.setItem("doc_appointments", JSON.stringify(updated));

    showToast(`Appointment booked with ${selectedDoc.name}!`);
    setSelectedDoc(null);
    setBookingForm({ date: "", time: "" });
  };

  const filteredDoctors = doctors.filter((doc) => {
    if (selectedSpecialty !== "All" && doc.specialty !== selectedSpecialty)
      return false;
    if (
      search &&
      !doc.name.toLowerCase().includes(search.toLowerCase()) &&
      !doc.specialty.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-4 shadow-sm flex items-center justify-between">
        <div className="text-xl font-bold tracking-tight">
          Doc<span className="text-blue-600">Connect</span>
        </div>
        <div className="flex gap-4 text-sm font-medium">
          <a href="#" className="text-blue-600">
            Find Doctors
          </a>
          <a
            href="#appointments"
            className="text-slate-600 hover:text-blue-600 transition-colors"
          >
            My Appointments
          </a>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-600 text-white rounded-2xl p-10 mb-10 shadow-lg"
        >
          <h1 className="text-4xl font-extrabold mb-4">
            Consult Top Doctors Online
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl">
            Book appointments, consult via video call, and get digital
            prescriptions from verified specialists instantly.
          </p>
          <div className="flex gap-4 max-w-xl bg-white p-2 rounded-xl shadow-md">
            <input
              type="text"
              placeholder="Search doctors, specialties..."
              className="flex-1 bg-transparent px-4 py-2 text-slate-800 outline-none placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
              Search
            </button>
          </div>
        </motion.div>

        {/* Specialties Filter */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                selectedSpecialty === spec
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Doctor Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {filteredDoctors.map((doc) => (
            <motion.div
              layoutId={`card-${doc._id}`}
              variants={itemVariants}
              key={doc._id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-shadow cursor-pointer flex flex-col"
              onClick={() => setSelectedDoc(doc)}
            >
              <div className="flex gap-4 items-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl shadow-inner">
                  {doc.image}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {doc.name}
                  </h3>
                  <p className="text-blue-600 font-medium text-sm">
                    {doc.specialty}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                <span>{doc.experience} exp.</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span className="flex items-center gap-1 font-medium text-amber-500">
                  ★ {doc.rating}{" "}
                  <span className="text-slate-400">({doc.reviews})</span>
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="font-bold text-slate-800 text-lg">
                  ₹{doc.fee}
                  <span className="text-xs font-normal text-slate-500">
                    /visit
                  </span>
                </span>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    doc.available
                      ? "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (doc.available) setSelectedDoc(doc);
                  }}
                >
                  {doc.available ? "Book Now" : "Unavailable"}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Appointments Section */}
        <div id="appointments" className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">My Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-slate-500 italic text-center py-8">
              No appointments scheduled yet.
            </p>
          ) : (
            <div className="space-y-4">
              {appointments.map((apt) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={apt.id}
                  className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50"
                >
                  <div>
                    <h4 className="font-bold text-slate-800">
                      {apt.doctorName}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {apt.date} • {apt.time}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                    Confirmed
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ bg: "rgba(0,0,0,0)" }}
              animate={{ backgroundColor: "rgba(15,23,42,0.4)" }}
              exit={{ backgroundColor: "rgba(0,0,0,0)" }}
              className="absolute inset-0"
              onClick={() => setSelectedDoc(null)}
            />
            <motion.div
              layoutId={`card-${selectedDoc._id}`}
              className="bg-white rounded-2xl p-8 shadow-2xl relative w-full max-w-md z-10"
            >
              <button
                onClick={() => setSelectedDoc(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500"
              >
                ✕
              </button>
              <div className="flex gap-4 items-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
                  {selectedDoc.image}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedDoc.name}</h3>
                  <p className="text-blue-600">{selectedDoc.specialty}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">Consultation Fee</span>
                  <span className="font-bold">₹{selectedDoc.fee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Rating</span>
                  <span className="font-bold text-amber-500">
                    ★ {selectedDoc.rating}
                  </span>
                </div>
              </div>

              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    value={bookingForm.date}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Select Time
                  </label>
                  <input
                    type="time"
                    required
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    value={bookingForm.time}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, time: e.target.value })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                >
                  Confirm Booking (₹{selectedDoc.fee})
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl font-medium"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

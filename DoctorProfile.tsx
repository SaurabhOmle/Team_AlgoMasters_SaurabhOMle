import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { Star, Award, Clock, Globe, MapPin, Phone, Mail, Shield } from 'lucide-react';

export default function DoctorProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const doctor = {
    name: 'Dr. Priya Sharma',
    specialization: 'General Medicine',
    experience: 12,
    rating: 4.8,
    totalRatings: 342,
    totalPatients: 1240,
    avatar: '👩‍⚕️',
    qualification: 'MBBS, MD (General Medicine)',
    hospital: 'Rural Health Center, Sundarpur',
    phone: '+91 98765 43210',
    email: 'dr.priya@swasthyalink.in',
    languages: ['Hindi', 'English'],
    location: 'Sundarpur, Uttar Pradesh',
    about: 'Dedicated to providing quality healthcare to rural communities. Specialized in general medicine with a focus on preventive care and telemedicine solutions.',
    achievements: [
      'Best Rural Doctor Award 2024',
      '1000+ Telemedicine Consultations',
      'WHO Rural Health Certification',
      'State Health Department Recognition',
    ],
    availability: {
      'Mon-Fri': '9:00 AM - 5:00 PM',
      'Saturday': '9:00 AM - 1:00 PM',
      'Sunday': 'Emergency Only',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar title="My Profile" role="doctor" />
      <div className="max-w-lg mx-auto px-4 py-5">

        {/* Profile Header */}
        <div className="animate-fade-in bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white text-center mb-5 shadow-lg shadow-blue-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="text-6xl mb-3">{doctor.avatar}</div>
          <h2 className="text-2xl font-extrabold">{doctor.name}</h2>
          <p className="text-blue-200 text-sm mt-1">{doctor.specialization}</p>
          <p className="text-blue-200 text-xs mt-1">{doctor.qualification}</p>

          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star size={14} fill="currentColor" className="text-amber-300" />
                <span className="font-bold">{doctor.rating}</span>
              </div>
              <p className="text-[10px] text-blue-200">{doctor.totalRatings} ratings</p>
            </div>
            <div className="w-px h-8 bg-white/30" />
            <div className="text-center">
              <p className="font-bold">{doctor.totalPatients}</p>
              <p className="text-[10px] text-blue-200">Patients</p>
            </div>
            <div className="w-px h-8 bg-white/30" />
            <div className="text-center">
              <p className="font-bold">{doctor.experience} yrs</p>
              <p className="text-[10px] text-blue-200">Experience</p>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="animate-fade-in bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
          <h3 className="font-bold text-gray-800 mb-2">About</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{doctor.about}</p>
        </div>

        {/* Contact Info */}
        <div className="animate-fade-in bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
          <h3 className="font-bold text-gray-800 mb-3">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <MapPin size={16} className="text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Location</p>
                <p className="text-sm text-gray-700">{doctor.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Phone size={16} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm text-gray-700">{doctor.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
                <Mail size={16} className="text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm text-gray-700">{doctor.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
                <Globe size={16} className="text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Languages</p>
                <p className="text-sm text-gray-700">{doctor.languages.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="animate-fade-in bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Clock size={16} className="text-blue-500" /> Availability
          </h3>
          <div className="space-y-2">
            {Object.entries(doctor.availability).map(([day, time]) => (
              <div key={day} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-sm font-medium text-gray-700">{day}</span>
                <span className="text-sm text-gray-500">{time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="animate-fade-in bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Award size={16} className="text-amber-500" /> Achievements
          </h3>
          <div className="space-y-2">
            {doctor.achievements.map((ach, i) => (
              <div key={i} className="flex items-center gap-3 bg-amber-50 rounded-lg px-3 py-2.5">
                <Shield size={14} className="text-amber-500 shrink-0" />
                <span className="text-sm text-gray-700">{ach}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Edit button */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all mb-4"
        >
          {isEditing ? '✅ Save Changes' : '✏️ Edit Profile'}
        </button>
      </div>
    </div>
  );
}

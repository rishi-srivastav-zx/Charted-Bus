import { 
  Users, 
  Bus, 
  BookOpen, 
  BarChart3 
} from 'lucide-react';
import React from 'react';

// --- Mock Data ---

/** @type {Booking[]} */
export const BOOKINGS_DATA = [
  { id: '#BK-7829', customer: { name: 'James Carter', avatar: 'https://i.pravatar.cc/150?u=james' }, route: 'NYC → BOS', date: 'Oct 24, 2023', status: 'Confirmed', price: '$45.00' },
  { id: '#BK-7830', customer: { name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?u=sarah' }, route: 'LAX → SFO', date: 'Oct 24, 2023', status: 'Pending', price: '$62.50' },
  { id: '#BK-7831', customer: { name: 'Michael Ross', avatar: 'https://i.pravatar.cc/150?u=michael' }, route: 'MIA → ORL', date: 'Oct 23, 2023', status: 'Cancelled', price: '$38.00' },
];

/** @type {Operator[]} */
export const OPERATORS_DATA = [
  { id: '1', name: 'Express Travel Co.', email: 'contact@express.com', phone: '+1 555-0199', status: 'Active' },
  { id: '2', name: 'City Shuttle Services', email: 'admin@cityshuttle.net', phone: '+1 555-2342', status: 'Inactive' },
  { id: '3', name: 'Blue Horizon Bus', email: 'hello@bluehorizon.com', phone: '+1 555-8821', status: 'Active' },
  { id: '4', name: 'Rapid Transit', email: 'info@rapidtransit.com', phone: '+1 555-1234', status: 'Active' },
  { id: '5', name: 'Skyline Charters', email: 'support@skyline.com', phone: '+1 555-5678', status: 'Inactive' },
];

/** @type {BusItem[]} */
export const BUSES_DATA = [
  { id: '1', name: 'Volvo 9600 Multi-axle', license: 'KA-01-AB-1234', seats: 45, type: 'AC Sleeper', operator: 'BlueLine Travels', status: 'Active', image: 'https://picsum.photos/seed/bus1/400/250' },
  { id: '2', name: 'Scania Metrolink', license: 'MH-12-CD-5678', seats: 53, type: 'Semi-Sleeper', operator: 'Red Eagle Express', status: 'Maintenance', image: 'https://picsum.photos/seed/bus2/400/250' },
  { id: '3', name: 'Mercedes-Benz Tourismo', license: 'DL-03-EF-9012', seats: 36, type: 'Super Luxury', operator: 'City Connect', status: 'Active', image: 'https://picsum.photos/seed/bus3/400/250' },
  { id: '4', name: 'Tata Magna', license: 'TN-04-GH-3456', seats: 50, type: 'Standard AC', operator: 'BlueLine Travels', status: 'Inactive', image: 'https://picsum.photos/seed/bus4/400/250' },
  { id: '5', name: 'Ashok Leyland Viking', license: 'AP-05-IJ-7890', seats: 55, type: 'Non-AC Seater', operator: 'Red Eagle Express', status: 'Active', image: 'https://picsum.photos/seed/bus5/400/250' },
  { id: '6', name: 'BharatBenz 1623', license: 'KL-06-KL-1234', seats: 32, type: 'AC Sleeper', operator: 'BlueLine Travels', status: 'Active', image: 'https://picsum.photos/seed/bus6/400/250' },
];

/** @type {ApprovalRequest[]} */
export const APPROVALS_DATA = [
  { id: '1', company: 'Blue Sky Charters L...', contact: 'David Miller', location: 'Austin, TX', date: 'Oct 24', status: 'Pending Review', initials: 'BS' },
  { id: '2', company: 'Rapid City Transit', contact: 'Sarah Jenkins', location: 'Denver, CO', date: 'Oct 23', status: 'Pending Review', initials: 'RC' },
  { id: '3', company: 'Green Line Log...', contact: 'Michael Ross', location: 'Portland, OR', date: 'Oct 22', status: 'Pending Review', initials: 'GL' },
  { id: '4', company: 'City Hopper Inc.', contact: 'Emily White', location: 'Seattle, WA', date: 'Oct 20', status: 'Incomplete', initials: 'CH' },
];

export const CHART_DATA_BOOKINGS = [
  { name: 'Jan', value: 400 }, { name: 'Feb', value: 300 }, { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 }, { name: 'May', value: 500 }, { name: 'Jun', value: 900 },
  { name: 'Jul', value: 700 }, { name: 'Aug', value: 1100 }, { name: 'Sep', value: 850 },
  { name: 'Oct', value: 1200 }, { name: 'Nov', value: 1000 }, { name: 'Dec', value: 1300 },
];

export const CHART_DATA_REVENUE = [
  { name: 'Jan', value: 150000 }, { name: 'Feb', value: 180000 }, { name: 'Mar', value: 250000 },
  { name: 'Apr', value: 320000 }, { name: 'May', value: 380000 }, { name: 'Jun', value: 450000 },
];
// Simple SVG Icon Wrapper
const Icon = ({ d, className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

export const ICONS = {
  wifi: <Icon d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />,
  ac: <Icon d="M13 10V3L4 14h7v7l9-11h-7z" />,
  restroom: <Icon d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
  seat: <Icon d="M7 21v-2a2 2 0 012-2h6a2 2 0 012 2v2M8 11V5a2 2 0 012-2h4a2 2 0 012 2v6M5 11h14" />,
  power: <Icon d="M13 10V3L4 14h7v7l9-11h-7z" />,
  audio: <Icon d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />,
  storage: <Icon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
  tv: <Icon d="M9.75 17L9 20l-2.25 3h10.5l-2.25-3-.75-3m4.5-13.5H5.25A2.25 2.25 0 003 5.25v10.5A2.25 2.25 0 005.25 18h13.5A2.25 2.25 0 0021 15.75V5.25A2.25 2.25 0 0018.75 3z" />,
  bed: <Icon d="M3 10v11M21 10v11M3 10a2 2 0 012-2h14a2 2 0 012 2M3 10v4a2 2 0 002 2h14a2 2 0 002-2v-4M5 8V6a3 3 0 013-3h8a3 3 0 013 3v2" />,
  coffee: <Icon d="M3 3h18v18H3V3z" />, // Fallback
  user: <Icon d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
};

export const FLEET_DATA = [
  {
    id: 'motorcoach-56',
    title: 'Full-Size Motorcoach',
    description: 'The standard for long-distance group travel across America, offering maximum comfort and reliability.',
    capacityRange: '50–56 Passengers',
    imageUrl: 'https://picsum.photos/seed/coach1/800/500',
    category: 'Full-Size',
    amenities: [
      { id: '1', label: 'Wi-Fi', iconName: 'wifi' },
      { id: '2', label: 'Restroom', iconName: 'restroom' },
      { id: '3', label: 'AC', iconName: 'ac' },
      { id: '4', label: 'Reclining Seats', iconName: 'seat' },
      { id: '5', label: 'PA System', iconName: 'audio' },
      { id: '6', label: 'Overhead Storage', iconName: 'storage' },
    ]
  },
  {
    id: 'mini-bus-35',
    title: 'Premium Mini Bus',
    description: 'Perfect for corporate shuttles and local group outings with modern amenities in a compact size.',
    capacityRange: '24–35 Passengers',
    imageUrl: 'https://picsum.photos/seed/mini/800/500',
    category: 'Mini',
    amenities: [
      { id: '1', label: 'Wi-Fi', iconName: 'wifi' },
      { id: '3', label: 'AC', iconName: 'ac' },
      { id: '4', label: 'Leather Seats', iconName: 'seat' },
      { id: '7', label: 'Power Outlets', iconName: 'power' },
      { id: '8', label: 'TV Screens', iconName: 'tv' },
    ]
  },
  {
    id: 'executive-sleeper',
    title: 'Executive Sleeper',
    description: 'Ultimate luxury for touring artists and corporate VIPs. Your home away from home on wheels.',
    capacityRange: '12–18 Passengers',
    imageUrl: 'https://picsum.photos/seed/luxury/800/500',
    category: 'Executive',
    amenities: [
      { id: '1', label: 'High-Speed Wi-Fi', iconName: 'wifi' },
      { id: '9', label: 'Sleeper Berths', iconName: 'bed' },
      { id: '2', label: 'Full Galley', iconName: 'restroom' },
      { id: '8', label: 'Smart TVs', iconName: 'tv' },
      { id: '7', label: 'Power Outlets', iconName: 'power' },
    ]
  },
  {
    id: 'shuttle-van',
    title: 'Executive Sprinter Van',
    description: 'The preferred choice for smaller groups looking for premium airport transfers and site visits.',
    capacityRange: '8–14 Passengers',
    imageUrl: 'https://picsum.photos/seed/van/800/500',
    category: 'Specialty',
    amenities: [
      { id: '1', label: 'Wi-Fi', iconName: 'wifi' },
      { id: '3', label: 'Dual AC', iconName: 'ac' },
      { id: '4', label: 'Capt Seats', iconName: 'seat' },
      { id: '7', label: 'USB Ports', iconName: 'power' },
    ]
  },
  {
    id: 'party-bus-40',
    title: 'Entertainment Bus',
    description: 'Elevate your celebration with premium sound, lighting, and spacious perimeter seating.',
    capacityRange: '20–40 Passengers',
    imageUrl: 'https://picsum.photos/seed/party/800/500',
    category: 'Specialty',
    amenities: [
      { id: '8', label: '4K TVs', iconName: 'tv' },
      { id: '5', label: 'Surround Sound', iconName: 'audio' },
      { id: '4', label: 'Lounge Seating', iconName: 'seat' },
      { id: '1', label: 'Wi-Fi', iconName: 'wifi' },
    ]
  },
  {
    id: 'school-bus-72',
    title: 'Standard School Bus',
    description: 'An economical solution for short-distance field trips and large group events on a budget.',
    capacityRange: '44–72 Passengers',
    imageUrl: 'https://picsum.photos/seed/school/800/500',
    category: 'Full-Size',
    amenities: [
      { id: '3', label: 'Heater/Fans', iconName: 'ac' },
      { id: '6', label: 'Large Storage', iconName: 'storage' },
      { id: '5', label: 'PA System', iconName: 'audio' },
    ]
  }
];
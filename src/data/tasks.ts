import type { Task } from '../types';

export const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Move 2-bedroom apartment across town',
    description: 'Need help moving from a 2-bedroom apartment in Mitte to Prenzlauer Berg. Furniture includes a king bed, sofa, dining table, 4 chairs, and about 30 boxes. I have a freight elevator available. Need 2-3 strong people and possibly a van.',
    category: 'Moving',
    location: 'Berlin',
    address: 'Mitte → Prenzlauer Berg',
    date: '2025-06-15',
    time: '09:00',
    budgetType: 'fixed',
    budget: 450,
    images: ['https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=600'],
    mustHaves: [
      'Must bring a large van or small truck',
      'Must bring heavy-duty moving straps',
      'Must have protective transit blankets'
    ],
    clientId: 'user-1',
    assignedCoTaskerId: undefined,
    status: 'receiving_offers',
    createdAt: '2025-06-01T08:00:00Z',
    offersCount: 1,
    moderationStatus: 'approved'
  },
  {
    id: 'task-2',
    title: 'Deep clean 3-room apartment before tenant handover',
    description: 'End-of-tenancy deep clean required for a 3-room apartment (65sqm). Includes kitchen (oven, fridge, cabinets), two bathrooms, all floors, windows, and walls. Must meet landlord inspection standard.',
    category: 'Cleaning',
    location: 'Berlin',
    address: 'Charlottenburg, Berlin',
    date: '2025-06-10',
    time: '10:00',
    budgetType: 'open_to_offers',
    images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600'],
    mustHaves: [
      'Must bring own professional cleaning chemicals',
      'Must have high-powered wet-dry vacuum',
      'Must guarantee passing landlord handover inspection'
    ],
    clientId: 'user-1',
    assignedCoTaskerId: 'user-3',
    status: 'in_progress',
    createdAt: '2025-05-28T14:00:00Z',
    offersCount: 1,
    moderationStatus: 'approved'
  },
  {
    id: 'task-3',
    title: 'Assemble IKEA PAX wardrobe system (3 units)',
    description: 'Need someone to assemble 3x PAX wardrobes with interior fittings (drawers, rails, shelves). All items are already delivered and in boxes. Takes roughly 3-4 hours for an experienced person.',
    category: 'Furniture Assembly',
    location: 'Berlin',
    address: 'Friedrichshain, Berlin',
    date: '2025-06-12',
    time: '14:00',
    budgetType: 'fixed',
    budget: 120,
    images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600'],
    mustHaves: [
      'Must bring own power tools (drill, level, rubber mallet)',
      'Must have previous experience assembling PAX wardrobes',
      'Must attach units securely to the plasterboard wall'
    ],
    clientId: 'user-1',
    assignedCoTaskerId: 'user-3',
    status: 'completed',
    createdAt: '2025-05-20T09:00:00Z',
    offersCount: 1,
    moderationStatus: 'approved'
  },
  {
    id: 'task-4',
    title: 'Paint living room and hallway (white) [PENDING MODERATION]',
    description: 'Two rooms need painting — living room approx 25sqm walls, hallway approx 10sqm. Existing colour is light grey. One coat of white primer + 2 coats of white required. Paint and supplies included.',
    category: 'Painting',
    location: 'Hamburg',
    address: 'Altona, Hamburg',
    date: '2025-06-20',
    time: '08:00',
    budgetType: 'fixed',
    budget: 300,
    images: ['https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600'],
    mustHaves: [
      'Must bring own high-quality rollers and edging brushes',
      'Must cover all floors and baseboards with tape/covers',
      'Must clean up all paint residues after job is finished'
    ],
    clientId: 'user-1',
    assignedCoTaskerId: undefined,
    status: 'open',
    createdAt: '2025-06-02T11:00:00Z',
    offersCount: 0,
    moderationStatus: 'pending'
  },
  {
    id: 'task-5',
    title: 'Fix leaking bathroom tap and replace shower head [PENDING MODERATION]',
    description: 'The main tap in the bathroom is dripping constantly. Also need the old shower head replaced with a new rainfall model (I have the new head already). Experience with plumbing required.',
    category: 'Repairs',
    location: 'Berlin',
    address: 'Neukölln, Berlin',
    date: '2025-06-08',
    budgetType: 'open_to_offers',
    images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600'],
    mustHaves: [
      'Must bring own pipe wrench and plumbers tape',
      'Must check and clean drainage pipes while working'
    ],
    clientId: 'user-1',
    assignedCoTaskerId: undefined,
    status: 'open',
    createdAt: '2025-06-03T16:00:00Z',
    offersCount: 0,
    moderationStatus: 'pending'
  },
  {
    id: 'task-6',
    title: 'Assemble backyard garden shed [REJECTED LISTING]',
    description: 'Need help assembling a brand new metal garden shed in the backyard. The instructions say it takes two people about 6 hours. Need to bring basic hand tools.',
    category: 'Furniture Assembly',
    location: 'Berlin',
    address: 'Zehlendorf, Berlin',
    date: '2025-06-22',
    budgetType: 'fixed',
    budget: 150,
    images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600'],
    mustHaves: [
      'Must bring a step ladder',
      'Must bring cordless electric screwdriver'
    ],
    clientId: 'user-1',
    assignedCoTaskerId: undefined,
    status: 'open',
    createdAt: '2025-06-04T10:00:00Z',
    offersCount: 0,
    moderationStatus: 'rejected'
  }
];

// mockData.js

export const MOCK_USERS = [
    {
      id: 'u1',
      name: 'Kolohe Smith',
      handle: '@kolohe_surf',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      isPro: false,
      isInstructor: false,
      isPhotographer: false,
      bio: 'Local surfer based in San Clemente. Always looking for a dawn patrol buddy.',
      stats: { sessions: 142, wavesCaught: 1240, followers: 450, following: 320 },
      currentStatus: 'looking_for_buddy', // 'looking_for_buddy', 'surfing', 'offline'
      location: { lat: 33.427, lng: -117.612 } // San Clemente
    },
    {
      id: 'u2',
      name: 'Sarah Fin',
      handle: '@fin_shots',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      isPro: false,
      isInstructor: false,
      isPhotographer: true,
      bio: 'Surf photographer capturing the morning light. DM for session rates.',
      stats: { sessions: 89, wavesCaught: 0, followers: 2100, following: 150 },
      currentStatus: 'offline'
    }
  ];
  
  export const MOCK_SESSIONS = [
    {
      id: 's1',
      userId: 'u1',
      userName: 'Kolohe Smith',
      userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      timestamp: '2026-01-20T07:30:00Z',
      
      // PRIVACY LOGIC: 
      // Public only sees 'region'. Only 'crew' (followers) see 'spotName'
      region: 'South Orange County', 
      spotName: 'Lowers - Trestles', 
      isSecretSpot: false,
      isVisibleTo: 'crew_only', // 'public', 'crew_only', 'private'
      
      stats: {
        wavesCaught: 14,
        topSpeed: '24.5 km/h',
        duration: '1h 45m',
        waveHeight: '4-6 ft',
        crowdFactor: 'Heavy' // 'Low', 'Medium', 'Heavy'
      },
      boardUsed: { id: 'b1', name: 'Pyzel Ghost 6\'0' },
      media: ['https://images.unsplash.com/photo-1502680390469-be75c86b636f'],
      likes: 24,
      comments: 5
    }
  ];
  
  export const MOCK_MARKETPLACE = [
    {
      id: 'b1',
      sellerId: 'u1',
      title: 'Channel Islands Al Merrick - Happy Everyday',
      price: 550,
      currency: 'USD',
      dimensions: '5\'10 x 19 3/4 x 2 1/2',
      volume: '30.9L',
      condition: 'Excellent', // 'New', 'Excellent', 'Good', 'Beater'
      description: 'Only ridden a few times. No dings, just standard pressure dents on deck.',
      images: ['https://images.unsplash.com/photo-1531722569936-825d3dd91b15'],
      category: 'shortboard'
    }
  ];
  
  export const MOCK_FOLLOWERS = [
    { id: 'f1', followerId: 'u2', followingId: 'u1', status: 'crew' }, // 'crew' means they see secret spots
    { id: 'f2', followerId: 'u3', followingId: 'u1', status: 'follower' } // 'follower' means they only see public data
  ];